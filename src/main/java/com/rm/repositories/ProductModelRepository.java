package com.rm.repositories;

import java.util.List;

import com.rm.models.categories.Model;
import com.rm.models.prices.PrintType;
import com.rm.models.prices.ProductType;
import com.rm.util.db.Database;
import org.springframework.stereotype.Repository;

@Repository
public class ProductModelRepository {
    private final Database database;

    public ProductModelRepository(Database database) {
        this.database = database;
        this.database.registerSerializer(ProductType.class,
            (statement, index, value) -> statement.setString(index, value.name()),
            (resultSet, columnName) -> ProductType.valueOf(resultSet.getString(columnName)));
        this.database.registerSerializer(PrintType.class,
            (statement, index, value) -> statement.setString(index, value.name()),
            (resultSet, columnName) -> PrintType.valueOf(resultSet.getString(columnName)));
    }

    public List<Model> findRawModelsForProduct(ProductType product) {
        return database.findAllIntoRecord(Model.class, "SELECT * FROM Product_Models WHERE product = ?", product);
    }

    public Model findOne(long modelColorId) {
        return database.findFirstIntoRecord(Model.class, "SELECT * FROM Product_Models WHERE id = ?", modelColorId).get();
    }
}
