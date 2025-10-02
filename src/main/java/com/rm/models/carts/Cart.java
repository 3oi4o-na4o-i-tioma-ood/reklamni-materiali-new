package com.rm.models.carts;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity(name = "Carts")
@Table(name = "Carts")
public class Cart {
    @Id
    public String id;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "cart", cascade = CascadeType.ALL)
    @JsonManagedReference
    public List<CartItem> items;

    public Date updated;

    public Cart() {
        this.id = UUID.randomUUID().toString();
        this.updated = new Date();
    }
}
