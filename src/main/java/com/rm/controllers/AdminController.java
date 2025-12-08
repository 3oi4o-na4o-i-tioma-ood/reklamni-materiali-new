package com.rm.controllers;

import java.awt.color.ColorSpace;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.DirectoryNotEmptyException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.imageio.ImageIO;

import com.rm.apis.AdminApi;
import com.rm.exceptions.BadRequestException;
import com.rm.exceptions.NotFoundException;
import com.rm.models.TextPiece;
import com.rm.models.categories.Category;
import com.rm.models.categories.Model;
import com.rm.models.prices.Note;
import com.rm.models.prices.PriceUpdateInfo;
import com.rm.models.prices.ProductType;
import com.rm.repositories.PricesRepository;
import com.rm.repositories.ProductModelRepository;
import com.rm.repositories.TextPieceRepository;
import com.rm.repositories.ModelColorRepository;
import com.rm.repositories.NotesRepository;
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
    private final NotesRepository notesRepository;
    private final TextPieceRepository textPiecesRepository;
    private final ProductModelRepository productModelRepository;
    private final ModelColorRepository modelColorRepository;

    @Autowired
    public AdminController(PricesRepository pricesRepository, NotesRepository notesRepository, TextPieceRepository textPiecesRepository, ProductModelRepository productModelRepository, ModelColorRepository modelColorRepository) {
        this.pricesRepository = pricesRepository;
        this.notesRepository = notesRepository;
        this.textPiecesRepository = textPiecesRepository;
        this.productModelRepository = productModelRepository;
        this.modelColorRepository = modelColorRepository;
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
    public void addCategoryImage(ProductType productType, String fileName, MultipartFile image, String pathName) throws IOException {
        Path categoryPath = Path.of(categoriesDirectory, productType.name(), pathName);
        System.out.println("categoryPath: " + categoryPath);
        if (!Files.exists(categoryPath)) {
            System.out.println("Category path not found");
            throw new NotFoundException();
        }

        BufferedImage rawImage = ImageIO.read(image.getInputStream());

        BufferedImage imageToSave = rawImage;
        if (rawImage.getColorModel().getColorSpace().getType() == ColorSpace.TYPE_CMYK) {
            imageToSave = ColorUtils.cmykToRgb(rawImage);
        }
        ImageIO.write(imageToSave, "png", Path.of(categoriesDirectory, productType.name().toLowerCase(), pathName, fileName).toFile());
    }

    @Override
    public void deleteCategoryImage(ProductType product, String path) throws IOException {
        Path imagePath = Path.of(categoriesDirectory, product.name().toLowerCase(), path);
        if (!Files.exists(imagePath)) {
            throw new NotFoundException();
        }

        Files.delete(imagePath);
    }

    @Override
    public void updateNotePrice(Note note) {
        notesRepository.updateNotePrice(note.productType(), note.noteType(), note.price());
    }

    @Override
    public void updateTextPiece(TextPiece textPiece) {
        textPiecesRepository.updateTextPiece(textPiece);
    }

    @Override
    public void createModel(Model model, ProductType product) {
        productModelRepository.createModel(model, product);
    }

    @Override
    public void createModelColor(String primaryColor, String secondaryColor, long modelId, String name, ProductType product, MultipartFile image) throws IOException {
        Path categoryPath = Path.of(categoriesDirectory, product.name().toLowerCase() + "_models");
        System.out.println("categoryPath: " + categoryPath);
        if (!Files.exists(categoryPath)) {
            System.out.println("Models path not found");
            throw new NotFoundException();
        }

        BufferedImage rawImage = ImageIO.read(image.getInputStream());

        BufferedImage imageToSave = ColorUtils.cmykToRgb(rawImage);

        String fileName = UUID.randomUUID().toString() + ".png";

        ImageIO.write(imageToSave, "png", Path.of(categoriesDirectory, product.name().toLowerCase() + "_models", fileName).toFile());

        productModelRepository.createModelColor(new Model.Color(0, "#" + primaryColor, "#" + secondaryColor, modelId, name, fileName));
    }

    @Override
    public void deleteModelColor(long modelColorId) {
        modelColorRepository.deleteModelColor(modelColorId);
    }

    @Override
    public void deleteModel(long modelId) {
        productModelRepository.deleteModel(modelId);
    }
}
