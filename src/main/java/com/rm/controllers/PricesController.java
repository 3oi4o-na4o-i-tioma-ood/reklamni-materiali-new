package com.rm.controllers;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rm.apis.PricesApi;
import com.rm.models.carts.CartItem;
import com.rm.models.prices.ModelPriceInfo;
import com.rm.models.prices.Note;
import com.rm.models.prices.NoteType;
import com.rm.models.prices.PriceForAmount;
import com.rm.models.prices.PrintType;
import com.rm.models.prices.PrintTypePriceInfo;
import com.rm.models.prices.ProductPrice;
import com.rm.models.prices.ProductType;
import com.rm.repositories.NotesRepository;
import com.rm.repositories.PricesRepository;

import com.rm.models.EffectCarton;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PricesController implements PricesApi {
    private final NotesRepository notesRepository;
    private final PricesRepository pricesRepository;

    @Autowired
    public PricesController(NotesRepository notesRepository, PricesRepository pricesRepository) {
        this.notesRepository = notesRepository;
        this.pricesRepository = pricesRepository;
    }

    @Override
    public ModelPriceInfo getPricesForAmounts(ProductType productType, Long modelColorId) {
        return switch (productType) {
            case BUSINESS_CARD, POCKET_CALENDAR, FLIER_10x15, FLIER_10x20 -> new ModelPriceInfo(
                    null,
                    pricesRepository
                            .findPricesForProduct(productType)
                            .stream()
                            .collect(Collectors.collectingAndThen(
                                    Collectors.groupingBy(ProductPrice::printType),
                                    map -> map
                                            .entrySet()
                                            .stream()
                                            .map(entry -> new PrintTypePriceInfo(
                                                    entry.getKey(),
                                                    entry.getValue()
                                                            .stream()
                                                            .map(priceInfo -> new PriceForAmount(priceInfo.amount(),
                                                                    priceInfo.price()))
                                                            .sorted(Comparator.comparingInt(PriceForAmount::amount))
                                                            .toList()))
                                            .toList())));
            case WORK_CALENDAR -> {
                PrintType size = pricesRepository.findModelSize(modelColorId).get();
                yield new ModelPriceInfo(
                        null,
                        pricesRepository.findPricesForProduct(productType)
                                .stream()
                                .filter(productPrice -> productPrice.printType() == size)
                                .collect(Collectors.collectingAndThen(
                                        Collectors.groupingBy(ProductPrice::printType),
                                        map -> map
                                                .entrySet()
                                                .stream()
                                                .map(entry -> new PrintTypePriceInfo(
                                                        entry.getKey(),
                                                        entry.getValue()
                                                                .stream()
                                                                .map(priceInfo -> new PriceForAmount(priceInfo.amount(),
                                                                        priceInfo.price()))
                                                                .sorted(Comparator.comparingInt(PriceForAmount::amount))
                                                                .toList()))
                                                .toList())));
            }
            case PEN, LIGHTER -> {
                double price = pricesRepository.findModelPrice(modelColorId).get();
                yield new ModelPriceInfo(
                        price,
                        pricesRepository.findPricesForProduct(productType)
                                .stream()
                                .collect(Collectors.collectingAndThen(
                                        Collectors.groupingBy(ProductPrice::printType),
                                        map -> map
                                                .entrySet()
                                                .stream()
                                                .map(entry -> new PrintTypePriceInfo(
                                                        entry.getKey(),
                                                        entry.getValue()
                                                                .stream()
                                                                .map(priceInfo -> new PriceForAmount(
                                                                        priceInfo.amount(),
                                                                        switch (entry.getKey()) {
                                                                            case PAD_ONE_COLOR -> priceInfo.price()
                                                                                    + pricesRepository.findClicheColor(
                                                                                            productType,
                                                                                            PrintType.CLICHE_ONE_COLOR)
                                                                                            .get() / priceInfo.amount();
                                                                            case PAD_TWO_COLORS -> priceInfo.price()
                                                                                    + pricesRepository.findClicheColor(
                                                                                            productType,
                                                                                            PrintType.CLICHE_TWO_COLORS)
                                                                                            .get() / priceInfo.amount();
                                                                            case PAD_THREE_COLORS -> priceInfo.price()
                                                                                    + pricesRepository.findClicheColor(
                                                                                            productType,
                                                                                            PrintType.CLICHE_THREE_COLORS)
                                                                                            .get() / priceInfo.amount();
                                                                            default -> priceInfo.price();
                                                                        }))
                                                                .sorted(Comparator.comparingInt(PriceForAmount::amount))
                                                                .toList()))
                                                .toList())));
            }
        };
    }

    @Override
    public List<Note> getEffectPrices(ProductType product) {
        return notesRepository.findNotesForProduct(product);
    }

    public double calculatePrice(List<CartItem> items) {
        return items.stream().mapToDouble(this::calculatePrice).sum();
    }

    private double calculatePrice(CartItem item) {
        ModelPriceInfo modelPriceInfo = getPricesForAmounts(item.design.productType, item.design.modelColorId);
        try {
            System.out.println(new ObjectMapper().writer().writeValueAsString(modelPriceInfo));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        System.out.println(item.design.printType);
        System.out.println("modelPriceInfo: " + modelPriceInfo.modelPrice());
        double modelPrice = (modelPriceInfo.modelPrice() == null ? 0 : modelPriceInfo.modelPrice()) * item.amount;
        double printPrice = modelPriceInfo
                        .printPrices()
                        .stream()
                        .filter(info -> info.printType() == item.design.printType)
                        .mapToDouble(info -> info.amounts().stream().filter(a -> a.amount() == item.amount)
                                .mapToDouble(PriceForAmount::price).findFirst().getAsDouble())
                        .findFirst()
                        .orElse(0);
        double price = modelPrice + printPrice * (item.design.productType == ProductType.PEN || item.design.productType == ProductType.LIGHTER ? item.amount : 1);

        System.out.println("price before effects: " + price);

        for (Map.Entry<NoteType, Long> effect : item.design.effects.entrySet()) {
            NoteType type = effect.getKey();
            Long value = effect.getValue();
            switch (type) {
                case EFFECT_CARTON -> price += pricesRepository.findEffectCartonPrice(value).get() * item.amount / 100;
                case FAST_PRODUCTION, EXPRESS_PRODUCTION -> {
                }
                default -> price += getEffectPrices(item.design.productType)
                        .stream()
                        .filter(note -> note.noteType() == type && value == 1)
                        .mapToDouble(note -> note.price() * item.amount / 100)
                        .findFirst()
                        .orElse(0);
            }
        }

        price *= item.productionTime.markup;

        return price * 1.2;
    }

    public List<EffectCarton> getEffectCartons() {
        return pricesRepository.findEffectCartons();
    }
}
