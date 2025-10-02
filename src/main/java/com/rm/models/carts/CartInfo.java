package com.rm.models.carts;

import java.util.Date;
import java.util.List;

public record CartInfo(String id, List<CartItem> items, Date updated, double price) {
    public CartInfo(Cart cart, double price) {
        this(cart.id, cart.items, cart.updated, price);
    }
}
