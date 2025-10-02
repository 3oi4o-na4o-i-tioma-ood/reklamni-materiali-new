package com.rm.controllers;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.DirectoryNotEmptyException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.imageio.ImageIO;

import com.rm.apis.AdminApi;
import com.rm.exceptions.BadRequestException;
import com.rm.exceptions.NotFoundException;
import com.rm.models.categories.Category;
import com.rm.models.prices.PriceUpdateInfo;
import com.rm.models.prices.ProductType;
import com.rm.repositories.PricesRepository;
import com.rm.util.ColorUtils;
import com.rm.util.MetadataManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class AdminController implements AdminApi {
    @Value("${paths.categories}")
    private String categoriesDirectory;

    private final PricesRepository pricesRepository;

    @Autowired
    public AdminController(PricesRepository pricesRepository) {
        this.pricesRepository = pricesRepository;
    }

    @Override
    public void updatePrices(PriceUpdateInfo updateInfo) {
        updateInfo.prices().forEach(newPrice -> pricesRepository.updatePrice(updateInfo.productType(), updateInfo.amount(), newPrice.printType(), newPrice.value()));
    }

    @Override
    public void updateModelPrice(long modelId, double newPrice) {
        pricesRepository.updateModelPrice(modelId, newPrice);
    }

    @Override
    public void createCategory(String pathName, String name, ProductType productType, String path) throws IOException {
        Path parentPath = Path.of(categoriesDirectory, productType.name(), path);
        if (!Files.exists(parentPath)) {
            throw new NotFoundException();
        }

        try (Stream<Path> siblings = Files.list(parentPath)) {
            boolean hasImages = siblings
                .filter(MetadataManager::isMetadataFile)
                .anyMatch(Files::isRegularFile);
            if (hasImages) {
                throw new BadRequestException();
            }
        }

        Path categoryFolder = Files.createDirectory(parentPath.resolve(pathName));
        MetadataManager.writeMetadata(categoryFolder, Map.of("name", name, "priority", "0"));
    }

    @Override
    public void changeCategoryName(String pathName, String newPathName, String newName, ProductType productType, String parentPath) throws IOException {
        Path categoryPath = Path.of(categoriesDirectory, productType.name(), parentPath, pathName);
        if (!Files.exists(categoryPath)) {
            throw new NotFoundException();
        }

        Files.writeString(categoryPath, newName);
        Files.move(categoryPath, Path.of(categoriesDirectory, productType.name(), parentPath, newPathName));
    }

    @Override
    public void changeCategoriesPriorities(CategoryPriorityRequest request) throws IOException {
        Path parentFolderPath = Path.of(categoriesDirectory, request.productType().name(), request.parentPath());
        if (!Files.exists(parentFolderPath)) {
            throw new NotFoundException();
        }

        List<Path> categories = Files.list(parentFolderPath)
            .filter(Files::isDirectory)
            .sorted(Comparator.comparingInt(
                p -> {
                    try {
                        Map<String, String> metadata = MetadataManager.readMetadata((Path)p);
                        return Integer.parseInt(metadata.get("priority"));
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }
            ).reversed())
            .collect(Collectors.toList());

        for (int i = 0; i < categories.size(); i++) {
            Path categoryPath = categories.get(i);
            MetadataManager.writeMetadata(categoryPath, Map.of("name", MetadataManager.readMetadata(categoryPath).get("name"), "priority", request.newPriorities().get(i).toString()));
        }
    }

    @Override
    public void deleteCategory(ProductType productType, String path, boolean force) throws IOException {
        Path categoryPath = Path.of(categoriesDirectory, productType.name(), path);
        if (!Files.exists(categoryPath)) {
            throw new NotFoundException();
        }

        if (!force) {
            try (Stream<Path> items = Files.list(categoryPath)) {
                boolean isEmpty = items.allMatch(MetadataManager::isMetadataFile);
                if (!isEmpty) {
                    throw new DirectoryNotEmptyException(null);
                }
            }
        }

        Files.delete(categoryPath);
    }

    @Override
    public void addCategoryImage(ProductType productType, String path, MultipartFile image, String pathName) throws IOException {
        Path categoryPath = Path.of(categoriesDirectory, productType.name(), path);
        if (!Files.exists(categoryPath)) {
            throw new NotFoundException();
        }

        BufferedImage rawImage = ImageIO.read(image.getInputStream());
        BufferedImage imageToSave = ColorUtils.cmykToRgb(rawImage);
        ImageIO.write(imageToSave, "png", Path.of(categoriesDirectory, productType.name().toLowerCase(), path, pathName).toFile());
    }

    @Override
    public void deleteCategoryImage(ProductType product, String path) throws IOException {
        Path imagePath = Path.of(categoriesDirectory, product.name().toLowerCase(), path);
        if (!Files.exists(imagePath)) {
            throw new NotFoundException();
        }

        Files.delete(imagePath);
    }
}
