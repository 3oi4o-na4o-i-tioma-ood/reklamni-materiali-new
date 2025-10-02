package com.rm.models.carts;

import com.fasterxml.jackson.annotation.JsonBackReference;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.rm.models.design.Design;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity(name = "Cart_Items")
@Table(name = "Cart_Items")
public class CartItem {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    public long id;
    
    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "cart_id")
    @JsonBackReference
    public Cart cart;

    @OneToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "design_id")
    @JsonManagedReference
    public Design.Raw design;

    public int amount;

    public ProductionTime productionTime;
}
