package com.rm.repositories;

import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rm.models.carts.Order;
import com.rm.models.users.OrderDetails;
import com.rm.util.db.Database;
import org.springframework.stereotype.Repository;

@Repository
public class CartRepository2 {
    private final Database database;

    public CartRepository2(Database database) {
        this.database = database;
        this.database.registerSerializer(OrderDetails.class,
            (statement, index, value) -> {
                try {
                    statement.setString(index, new ObjectMapper().writer().writeValueAsString(value));
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
            },
            (resultSet, columnIndex) -> {
                try {
                    return new ObjectMapper().reader().readValue(resultSet.getString(columnIndex));
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    public Optional<Long> saveOrder(String cartId, Long userId, OrderDetails orderDetails) {
        return database.findFirstFromColumn(long.class, "INSERT INTO Orders (cart_id, user_id, order_details) VALUES (?, ?, ?) RETURNING id", cartId, userId, orderDetails);
    }

    public Optional<Order> findOrder(long orderId) {
        return database.findFirstIntoRecord(Order.class, "SELECT * FROM Orders WHERE id = ?", orderId);
    }

    public List<Order> findUserOrders(long userId) {
        return database.findAllIntoRecord(Order.class, "SELECT * FROM Orders WHERE user_id = ?", userId);
    }
}
