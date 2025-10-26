package com.rm.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.rm.models.TextPiece;
import com.rm.util.db.Database;

@Repository
public class TextPieceRepository {
    private final Database database;

    public TextPieceRepository(Database database) {
        this.database = database;
    }

    public void updateTextPiece(TextPiece textPiece) {
        database.update("UPDATE Text_Pieces SET text = ? WHERE name = ?", textPiece.text(), textPiece.name());
    }

    public Optional<TextPiece> findTextPiece(String name) {
        return database.findFirstIntoRecord(TextPiece.class, "SELECT * FROM Text_Pieces WHERE name = ?", name);
    }

    public List<TextPiece> findAll() {
        return database.findAllIntoRecord(TextPiece.class, "SELECT * FROM Text_Pieces");
    }
}
