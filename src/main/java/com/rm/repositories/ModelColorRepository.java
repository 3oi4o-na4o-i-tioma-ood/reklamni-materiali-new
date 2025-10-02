package com.rm.repositories;

import java.util.List;
import java.util.Optional;

import com.rm.models.categories.Model;
import com.rm.models.prices.ProductType;
import com.rm.util.db.Database;
import org.springframework.stereotype.Repository;

@Repository
public class ModelColorRepository {
    private final Database database;

    public ModelColorRepository(Database database) {
        this.database = database;
        this.database.registerSerializer(ProductType.class,
            (statement, index, value) -> statement.setString(index, value.name()),
            (resultSet, columnName) -> ProductType.valueOf(resultSet.getString(columnName)));
    }

    public List<Model.Color> findColorsForModel(long modelId) {
        return database.findAllIntoRecord(Model.Color.class, "SELECT * FROM Model_Colors WHERE model_id = ?", modelId);
    }

    public Optional<ColorPath> findColorPath(long modelColorId) {
        return database.findFirstIntoRecord(ColorPath.class, "SELECT Model_Colors.path, Product_Models.product FROM Model_Colors JOIN Product_Models ON Product_Models.id = Model_Colors.model_id WHERE Model_Colors.id = ?", modelColorId);
    }

    public record ColorPath(String path, ProductType product) {
        public String getPath() {
            return product.name().toLowerCase() + "_models/" + path;
        }
    }
}
