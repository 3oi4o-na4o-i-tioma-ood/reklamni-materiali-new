package com.rm.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rm.models.carts.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
}
