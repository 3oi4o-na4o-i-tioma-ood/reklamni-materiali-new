package com.rm.apis;

import java.io.IOException;
import java.util.List;

import com.rm.models.prices.PriceUpdateInfo;
import com.rm.models.prices.ProductType;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Admin")
@RequestMapping("/api/admin")
public interface AdminApi {
    @Operation(summary = "Update prices")
    @PostMapping("/prices")
    @ResponseBody
    void updatePrices(@RequestBody PriceUpdateInfo updateInfo);

    @Operation(summary = "Update model price")
    @PostMapping("/prices/model")
    @ResponseBody
    void updateModelPrice(@RequestParam long modelId,
                          @RequestParam double newPrice);

    @Operation(summary = "Create category")
    @PostMapping("/categories")
    @ResponseBody
    void createCategory(@RequestParam String pathName,
                        @RequestParam String name,
                        @RequestParam ProductType product,
                        @RequestParam String path) throws IOException;

    @Operation(summary = "Change category name")
    @PutMapping("/categories")
    @ResponseBody
    void changeCategoryName(@RequestParam String pathName,
                            @RequestParam String newPathName,
                            @RequestParam String newName,
                            @RequestParam ProductType product,
                            @RequestParam String parentPath) throws IOException;

    @Operation(summary = "Change category priority")
    @PutMapping("/categories/priority")
    @ResponseBody
    void changeCategoriesPriorities(@RequestBody CategoryPriorityRequest request) throws IOException;

    @Operation(summary = "Delete category")
    @DeleteMapping("/categories")
    @ResponseBody
    void deleteCategory(@RequestParam ProductType product,
                        @RequestParam String path,
                        @RequestParam(defaultValue = "false") boolean force) throws IOException;

    @Operation(summary = "Add category image")
    @PostMapping("/categories/images")
    @ResponseBody
    void addCategoryImage(@RequestParam ProductType product,
                          @RequestParam String path,
                          @RequestParam MultipartFile image,
                          @RequestParam String pathName) throws IOException;

    @Operation(summary = "Delete category image")
    @DeleteMapping("/categories/images")
    @ResponseBody
    void deleteCategoryImage(@RequestParam ProductType product,
                             @RequestParam String path) throws IOException;

    record CategoryPriorityRequest(ProductType productType, String parentPath, List<Integer> newPriorities) {}
}
