package com.rm.repositories;

import java.util.List;
import java.util.Optional;

import com.rm.models.prices.PrintType;
import com.rm.models.prices.ProductPrice;
import com.rm.models.prices.ProductType;
import com.rm.util.db.Database;

import com.rm.models.EffectCarton;

import org.springframework.stereotype.Repository;

@Repository
public class PricesRepository {
    private final Database database;

    public PricesRepository(Database database) {
        this.database = database;
        this.database.registerSerializer(ProductType.class,
            (statement, index, value) -> statement.setString(index, value.name()),
            (resultSet, columnName) -> ProductType.valueOf(resultSet.getString(columnName)));
        this.database.registerSerializer(PrintType.class,
            (statement, index, value) -> statement.setString(index, value.name()),
            (resultSet, columnName) -> PrintType.valueOf(resultSet.getString(columnName)));
    }

    public List<ProductPrice> findPricesForProduct(ProductType product) {
        return database.findAllIntoRecord(ProductPrice.class, "SELECT * FROM Prices WHERE product = ?", product);
    }

    public Optional<Double> findModelPrice(long modelColorId) {
        return database.findFirstFromColumn(double.class, "SELECT price FROM Product_Models WHERE id = (SELECT model_id FROM Model_Colors WHERE id = ?)", modelColorId);
    }

    public Optional<PrintType> findModelSize(long modelColorId) {
        return database.findFirstFromColumn(PrintType.class, "SELECT size FROM Product_Models WHERE id = (SELECT model_id FROM Model_Colors WHERE id = ?)", modelColorId);
    }

    public Optional<Double> findClicheColor(ProductType product, PrintType clicheType) {
        return database.findFirstFromColumn(double.class, "SELECT price FROM Prices WHERE product = ? AND print_type = ?", product, clicheType);
    }

    public void updatePrice(ProductType product, int amount, PrintType printType, double price) {
        database.update("UPDATE Prices SET price = ? WHERE product = ? AND print_type = ? AND amount = ?", price, product, printType, amount);
    }

    public void updateModelPrice(long modelId, double newPrice) {
        database.update("UPDATE Models SET price = ? WHERE id = ?", newPrice, modelId);
    }

    public Optional<Double> findEffectCartonPrice(long effectCartonId) {
        return database.findFirstFromColumn(double.class, "SELECT price FROM Effect_Cartons WHERE id = ?", effectCartonId);
    }

    public List<EffectCarton> findEffectCartons() {
        return database.findAllIntoRecord(EffectCarton.class, "SELECT * FROM Effect_Cartons");
    }
}
