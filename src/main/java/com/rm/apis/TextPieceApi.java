package com.rm.apis;

import com.rm.models.TextPiece;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Tag(name = "Text pieces")
public interface TextPieceApi {
    @Operation(summary = "Get text piece")
    @GetMapping("/api/text-pieces/{name}")
    @ResponseBody
    TextPiece getTextPiece(@PathVariable String name);
}
