package com.rm.models.design;

import java.util.Map;

import com.rm.models.prices.NoteType;
import com.rm.models.prices.PrintType;
import com.rm.models.prices.ProductType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.MapKeyJoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

public record Design(String id, ProductType productType, DesignSide front, DesignSide back, PrintType printType, Long modelColorId, 
Map<NoteType, Long> effects, boolean isFavorite, Long userId, String name) {
    @Entity(name = "Designs")
    @Table(name = "Designs")
    public static class Raw {
        @Id
        public String id;
        public ProductType productType;

        @OneToOne(cascade = CascadeType.ALL)
        @JoinColumn(name = "front_side_id")
        public DesignSide.Raw front;

        @OneToOne(cascade = CascadeType.ALL)
        @JoinColumn(name = "back_side_id")
        public DesignSide.Raw back;

        @Column(name = "print_type")
        public PrintType printType;

        @Column(name = "model_color_id")
        public Long modelColorId;

        @ElementCollection
        @JoinTable(
            name = "Design_Effects",
            joinColumns = @JoinColumn(name = "design_id", referencedColumnName = "id")
        )
        @MapKeyColumn(name = "effect")
        public Map<NoteType, Long> effects;

        public boolean isFavorite;
        public Long userId;
        public String name;

        public Raw() {}

        public Raw(Design design) {
            id = design.id();
            productType = design.productType();
            front = new DesignSide.Raw(design.front());
            if (design.back() != null) {
                back = new DesignSide.Raw(design.back());
            }
            printType = design.printType;
            modelColorId = design.modelColorId;
            effects = design.effects == null ? null : Map.copyOf(design.effects);
            isFavorite = design.isFavorite;
            userId = design.userId();
            name = design.name();
        }
    }
}
