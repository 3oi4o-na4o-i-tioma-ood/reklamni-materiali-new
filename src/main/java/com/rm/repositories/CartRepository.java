package com.rm.repositories;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rm.models.carts.CartItem;
import com.rm.models.carts.Order;
import com.rm.models.carts.ProductionTime;
import com.rm.models.users.OrderDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import com.rm.models.carts.Cart;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<Cart, String> {
//    private final Database database;
//
//    public CartRepository(Database database) {
//        this.database = database;
//    }

    default Cart findByIdNoJakarta(String cartId, EditorRepository editorRepository) {
        try (Connection connection = DriverManager
                .getConnection("jdbc:postgresql://localhost:5432/reklamni_materiali_db", "postgres", "1111")) {
            PreparedStatement statement = connection.prepareStatement("SELECT * FROM Carts WHERE id = ?");
            statement.setString(1, cartId);
            ResultSet resultSet = statement.executeQuery();
            if (!resultSet.next()) {
                return null;
            }

            Cart cart = new Cart();
            cart.id = cartId;
            cart.updated = resultSet.getDate("updated");
            cart.items = findItems(cartId, editorRepository);
            return cart;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    default List<CartItem> findItems(String cartId, EditorRepository editorRepository) {
        try (Connection connection = DriverManager
                .getConnection("jdbc:postgresql://localhost:5432/reklamni_materiali_db", "postgres", "1111")) {
            PreparedStatement statement = connection.prepareStatement("SELECT * FROM Cart_Items WHERE cart_id = ?");
            statement.setString(1, cartId);
            ResultSet resultSet = statement.executeQuery();
            List<CartItem> result = new ArrayList<>();
            while (resultSet.next()) {
                CartItem item = new CartItem();
                item.id = resultSet.getLong("id");
                item.cart = new Cart();
                item.cart.id = cartId;
                item.amount = resultSet.getInt("amount");
                item.productionTime = ProductionTime.valueOf(resultSet.getString("production_time"));
                item.design = editorRepository.findDesignById(resultSet.getString("design_id"));
                result.add(item);
            }
            return result;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
