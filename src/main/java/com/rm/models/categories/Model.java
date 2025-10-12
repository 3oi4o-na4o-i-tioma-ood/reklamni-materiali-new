package com.rm.models.categories;

import java.util.List;

import com.rm.models.prices.PrintType;
import com.rm.util.db.ColumnName;
import com.rm.util.db.Nullable;

public record Model(long id,
                    String model,
                    @ColumnName("catalogue_number") String catalogueNumber,
                    Double price,
                    @Nullable PrintType size) {
    public record Color(long id,
                        @ColumnName("primary_color") String primaryColor,
                        @ColumnName("secondary_color") String secondaryColor,
                        @ColumnName("model_id") long modelId,
                        String name,
                        String path) {}

    public record FullInfo(long id, String model, String catalogueNumber, Double price, PrintType size, List<Color> colors) {
        public FullInfo(Model model, List<Color> colors) {
            this(model.id, model.model, model.catalogueNumber, model.price, model.size, colors);
        }
    }
}
