package com.rm.repositories;

import java.util.List;

import com.rm.models.prices.Note;
import com.rm.models.prices.NoteType;
import com.rm.models.prices.ProductType;
import com.rm.util.db.Database;
import org.springframework.stereotype.Repository;

@Repository
public class NotesRepository {
    private final Database database;

    public NotesRepository(Database database) {
        this.database = database;
        this.database.registerSerializer(ProductType.class,
            (statement, index, value) -> statement.setString(index, value.name()),
            (resultSet, columnName) -> ProductType.valueOf(resultSet.getString(columnName)));
        this.database.registerSerializer(NoteType.class,
            (statement, index, value) -> statement.setString(index, value.name()),
            (resultSet, columnName) -> NoteType.valueOf(resultSet.getString(columnName)));
    }

    public List<Note> findNotesForProduct(ProductType productType) {
        return database.findAllIntoRecord(Note.class, "SELECT * FROM Notes WHERE product = ?", productType);
    }
}
