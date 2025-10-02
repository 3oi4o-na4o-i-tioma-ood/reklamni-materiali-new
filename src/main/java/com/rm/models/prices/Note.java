package com.rm.models.prices;

import com.rm.util.db.ColumnName;

public record Note(@ColumnName("product") ProductType productType, @ColumnName("note_type") NoteType noteType, double price) {}
