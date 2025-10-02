package com.rm.apis;

import java.io.IOException;
import java.util.List;

import com.rm.models.prices.ProductType;
import com.rm.models.design.Design;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Editor")
public interface EditorApi {
//     @PostMapping("/api/editor/background")
//     @ResponseBody
//     String uploadBackground(MultipartFile file,
//             @RequestBody BackgroundSelection selection) throws IOException;

     /**
      * Use either {@code filename} (for uploaded backgrounds) or
      * {@code product} and {@code path} (for predefined background).
      */
     @Operation(summary = "Get background image")
     @GetMapping("/api/editor/background")
     @ResponseBody
     Resource getBackground(@RequestParam(required = false) String filename,
             @RequestParam(required = false) ProductType product,
             @RequestParam(required = false) String path);

    @Operation(summary = "Upload image")
    @PostMapping("/api/editor/image")
    @ResponseBody
    String uploadImage(@RequestParam("file") MultipartFile file,
                       @RequestParam(value = "selection", required = false) String selectionJSON) throws IOException;

    @Operation(summary = "Update image")
    @PutMapping("/api/editor/image")
    @ResponseBody
    void updateImage(@RequestParam("imageId") String imageId,
                     @RequestParam(value = "selection", required = false) String selectionJSON) throws IOException;

    @Operation(summary = "Get image")
    @GetMapping("/api/editor/image")
    @ResponseBody
    Resource getImage(@RequestParam("name") String name);

    @Operation(summary = "Get preview image")
    @GetMapping(value = "/api/editor/preview", produces = "image/*")
    @ResponseBody
    Resource getPreviewImage(@RequestParam("name") String name,
                             @RequestParam("side") String side);

    @Operation(summary = "Create design")
    @PostMapping("/api/editor/design")
    @ResponseBody
    String createDesign(@RequestBody Design design,
                        @RequestHeader(name = "Authorization", required = false) String authorization) throws IOException;

    @Operation(summary = "Update design")
    @PutMapping("/api/editor/design")
    @ResponseBody
    void updateDesign(@RequestBody Design design) throws IOException;

    @Operation(summary = "Get design")
    @GetMapping("/api/editor/design/{id}")
    @ResponseBody
    Design.Raw getDesign(@PathVariable String id) throws RuntimeException;

    @Operation(summary = "Get favourite designs")
    @GetMapping("/api/editor/design/favorite")
    @ResponseBody
    List<Design.Raw> getFavoriteDesigns(@RequestHeader("Authorization") String authorization);

    @Operation(summary = "Get design pdf")
    @GetMapping(value = "/api/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    @ResponseBody
    Resource getDesignPdf(@RequestParam("productType") ProductType product,
                          @RequestParam("designId") String designId,
                          @RequestParam("front") boolean isFront) throws IOException;
}
