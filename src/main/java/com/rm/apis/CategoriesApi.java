package com.rm.apis;

import java.io.IOException;
import java.util.List;

import com.rm.models.categories.Category;
import com.rm.models.categories.Model;
import com.rm.models.categories.PaginatedCategoryImages;
import com.rm.models.categories.PaginatedModels;
import com.rm.models.prices.ProductType;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpSession;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.PathVariable;

@Tag(name = "Categories")
public interface CategoriesApi {
    @Operation(summary = "Get categories for product")
    @GetMapping("/api/categories")
    @ResponseBody
    List<Category> getCategories(@RequestParam("product") ProductType product) throws IOException;

    @Operation(summary = "Get paginated category images")
    @GetMapping("/api/category-images")
    @ResponseBody
    PaginatedCategoryImages getCategoryImages(HttpSession session,
                                              @RequestParam("productType") ProductType product,
                                              @RequestParam("categoryPath") String categoryPath,
                                              @RequestParam("page") int page,
                                              @RequestParam("pageSize") int pageSize) throws IOException;

    @Operation(summary = "Get category image")
    @GetMapping("/api/category-image")
    @ResponseBody
    Resource getImage(@RequestParam("productType") ProductType product,
                      @RequestParam("path") String path) throws IOException;

    @Operation(summary = "Get paginated models")
    @GetMapping("/api/models")
    @ResponseBody
    PaginatedModels getModels(@RequestParam("productType") ProductType product,
                              @RequestParam("page") int page,
                              @RequestParam("pageSize") int pageSize);

    @Operation(summary = "Get model by modelColorId")
    @GetMapping("/api/models/{modelColorId}")
    @ResponseBody
    Model getModelById(@PathVariable("modelColorId") long modelColorId);

    @Operation(summary = "Get model image")
    @GetMapping("/api/model-image")
    @ResponseBody
    Resource getModelImage(@RequestParam long modelColorId);
}
