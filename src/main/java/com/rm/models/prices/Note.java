package com.rm.models.prices;

import com.rm.util.db.ColumnName;

// 'price' doesn't have @ColumnName annotation, because its name already matches the column name in the database
public record Note(@ColumnName("product") ProductType productType, @ColumnName("note_type") NoteType noteType, double price) {}
