package com.rm.controllers;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.rm.exceptions.NotFoundException;
import com.rm.repositories.TextPieceRepository;
import com.rm.apis.TextPieceApi;
import com.rm.models.TextPiece;

@Controller
public class TextPieceController implements TextPieceApi {
    private final TextPieceRepository textPiecesRepository;

    @Autowired
    public TextPieceController(TextPieceRepository textPiecesRepository) {
        this.textPiecesRepository = textPiecesRepository;
    }

    @Override
    public TextPiece getTextPiece(String name) {
        return textPiecesRepository.findTextPiece(name).orElseThrow(() -> new NotFoundException());
    }

    @Override
    public Map<String, String> getAllTextPieces() {
        return textPiecesRepository.findAll().stream().collect(Collectors.toMap(TextPiece::name, TextPiece::text));
    }
}
