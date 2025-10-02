package com.rm.models.design;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


public record DesignSide(long id, String bgPath, String bgImageId, List<Element> elements) {
    @Entity(name = "Design_Sides")
    @Table(name = "Design_Sides")
    public static class Raw {
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Id
        public Long id;
        public String bgPath;
        
        public String bgImageId;

        @OneToMany(fetch = FetchType.LAZY, mappedBy = "designSide", cascade = { CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.REMOVE })
        @JsonManagedReference
        public List<Element.Raw> elements;

        public Raw() {
        }

        public Raw(DesignSide side) {
            id = side.id;
            this.bgPath = side.bgPath();
            this.bgImageId = side.bgImageId();
            

            this.elements = side.elements().stream().map(element -> Element.createRaw(element, this)).toList();
        }
    }
}
