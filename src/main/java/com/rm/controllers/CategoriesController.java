package com.rm.controllers;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.imageio.ImageIO;

import com.rm.apis.CategoriesApi;
import com.rm.models.categories.Category;
import com.rm.models.categories.Model;
import com.rm.models.categories.PaginatedCategoryImages;
import com.rm.models.categories.PaginatedModels;
import com.rm.models.prices.ProductType;
import com.rm.repositories.ModelColorRepository;
import com.rm.repositories.ProductModelRepository;
import com.rm.util.MetadataManager;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class CategoriesController implements CategoriesApi {
    private static final Logger LOGGER = LoggerFactory.getLogger(CategoriesController.class);

    @Value("${paths.categories}")
    private String categoriesDirectory;

    private final ProductModelRepository productModelRepository;
    private final ModelColorRepository modelColorRepository;

    @Autowired
    public CategoriesController(ProductModelRepository productModelRepository,
            ModelColorRepository modelColorRepository) {
        this.productModelRepository = productModelRepository;
        this.modelColorRepository = modelColorRepository;
    }

    @Override
    public List<Category> getCategories(ProductType product) throws IOException {
        return findCategoriesRecursive(Path.of(categoriesDirectory, product.name().toLowerCase()))
                .stream()
                .sorted(Comparator.comparingInt(Category::priority).reversed().thenComparing(Category::name))
                .toList();
    }

    @Override
    public PaginatedCategoryImages getCategoryImages(HttpSession session, ProductType product, String categoryPath,
            int page, int pageSize) throws IOException {
        if (product.equals(session.getAttribute("prev_product"))
                && categoryPath.equals(session.getAttribute("prev_path"))) {
            List<String> paths = (List<String>) session.getAttribute("paths");
            return new PaginatedCategoryImages(paths, page, pageSize);
        }

        Path productPath = Path.of(categoriesDirectory, product.name().toLowerCase());
        Path path = productPath.resolve(categoryPath);
        List<String> newPaths;
        try (Stream<Path> subpaths = Files.list(path)) {
            List<Path> subpathList = subpaths.toList();
            if (subpathList.stream().anyMatch(Files::isDirectory)) {
                newPaths = subpathList
                        .stream()
                        .filter(Files::isDirectory)
                        .flatMap(p -> findRepresentatives(p).stream())
                        .map(p -> productPath.relativize(p).toString())
                        .collect(Collectors.collectingAndThen(
                                Collectors.toCollection(ArrayList::new),
                                list -> {
                                    Collections.shuffle(list);
                                    return list;
                                }));
            } else {
                newPaths = subpathList
                        .stream()
                        .filter(p -> Files.isRegularFile(p) && !MetadataManager.isMetadataFile(p))
                        .sorted(Comparator.comparing(p -> p.getFileName().toString()))
                        .map(p -> productPath.relativize(p).toString())
                        .toList();
            }
        }

        session.setAttribute("prev_product", product);
        session.setAttribute("prev_path", categoryPath);
        session.setAttribute("paths", newPaths);

        return new PaginatedCategoryImages(newPaths, page, pageSize);
    }

    private List<Path> findRepresentatives(Path parent) {
        try (Stream<Path> subpaths = Files.list(parent)) {
            List<Path> subpathList = subpaths.toList();
            if (subpathList.stream().anyMatch(Files::isDirectory)) {
                return subpathList
                        .stream()
                        .filter(Files::isDirectory)
                        .flatMap(p -> findRepresentatives(p).stream())
                        .toList();
            } else {
                return subpathList
                        .stream()
                        .filter(p -> Files.isRegularFile(p) && !MetadataManager.isMetadataFile(p))
                        .sorted(Comparator.comparing(p -> p.getFileName().toString()))
                        .toList();
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Resource getImage(ProductType product, String path) throws IOException {
        BufferedImage image = ImageIO.read(Path.of(categoriesDirectory, product.name().toLowerCase(), path).toFile());
        Image scaled = image.getScaledInstance(300, -1, BufferedImage.SCALE_SMOOTH);

        BufferedImage scaledBuffer = new BufferedImage(scaled.getWidth(null), scaled.getHeight(null),
                BufferedImage.TYPE_INT_RGB);
        scaledBuffer.createGraphics().drawImage(scaled, 0, 0, null);

        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        ImageIO.write(scaledBuffer, "png", bytes);
        Resource resource = new ByteArrayResource(bytes.toByteArray());
        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            return null;
        }
    }

    @Override
    public PaginatedModels getModels(ProductType product, int page, int pageSize) {
        List<Model.FullInfo> models = productModelRepository
                .findRawModelsForProduct(product)
                .stream()
                .map(model -> new Model.FullInfo(model, modelColorRepository.findColorsForModel(model.id())))
                .toList();
        return new PaginatedModels(models, page, pageSize);
    }

    @Override
    public Resource getModelImage(long modelColorId) {
        String path = modelColorRepository.findColorPath(modelColorId).get().getPath();
        Resource resource = new FileSystemResource(Path.of(categoriesDirectory, path));
        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            return null;
        }
    }

    @Override
    public Model getModelById(long modelId) {
        return productModelRepository.findOne(modelId);
    }


    @Override
    public Model.Color getModelColorById(long modelColorId) {
        return modelColorRepository.findColorById(modelColorId).get();
    }


    private List<Category> findCategoriesRecursive(Path path) throws IOException {
        try (Stream<Path> paths = Files.list(path)) {
            return paths
                    .filter(Files::isDirectory)
                    .map(p -> {
                        try {
                            Map<String, String> metadata = MetadataManager.readMetadata(p);
                            return new Category(metadata.get("name"), p.getFileName().toString(),
                                    findCategoriesRecursive(p), Integer.parseInt(metadata.get("priority")));
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    })
                    .toList();
        }
    }
}
