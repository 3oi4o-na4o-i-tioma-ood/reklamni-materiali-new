package com.rm.controllers;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.rm.apis.PagesApi;
import com.rm.models.categories.PaginatedModels;
import com.rm.models.prices.PrintType;
import com.rm.models.prices.ProductPrice;
import com.rm.models.prices.ProductType;
import com.rm.repositories.PricesRepository;
import com.rm.util.Formatter;

import com.rm.models.prices.ProductPriceTemplateDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

@Controller
public class PagesController implements PagesApi {
    private final CategoriesController categoriesController;
    private final PricesRepository pricesRepository;

    @Autowired
    public PagesController(CategoriesController categoriesController, PricesRepository pricesRepository) {
        this.categoriesController = categoriesController;
        this.pricesRepository = pricesRepository;
    }

    @Override
    public String main() {
        return "pages/home/home";
    }

    @Override
    public String promos() {
        return "pages/promo";
    }

    @Override
    public String help() {
        return "pages/pomosht";
    }

    @Override
    public String contacts() {
        return "pages/contacts/contacts";
    }

    @Override
    public String profile(Model model) {
        return "pages/profile/orders_page";
    }

    @Override
    public String profileOrders(Model model) {
        return "pages/profile/orders_page";
    }

    @Override
    public String profileDeliveryInfo(Model model) {
        return "pages/profile/delivery_info_page";
    }

    @Override
    public String profileSavedDesigns(Model model) {
        return "pages/profile/saved_designs_page";
    }

    @Override
    public String profileAndSecurity(Model model) {
        return "pages/profile/profile_and_security_page";
    }
    

    @Override
    public String admin(Model model) {
        return "pages/admin/dashboard";
    }

    @Override
    public String adminBusinessCards(Model model) {
        addPriceInfo(model, ProductType.BUSINESS_CARD);
        return "pages/admin/business_cards/business_cards";
    }

    @Override
    public String adminWorkCalendars(Model model) {
        addPriceInfo(model, ProductType.WORK_CALENDAR);
        return "pages/admin/work_calendars/work_calendars";
    }

    @Override
    public String adminPocketCalendars(Model model) {
        addPriceInfo(model, ProductType.POCKET_CALENDAR);
        return "pages/admin/pocket_calendars/pocket_calendars";
    }

    @Override
    public String adminFlyers(Model model){
        addPriceInfo(model, ProductType.FLIER_10x20);
        return "pages/admin/flyers/flyers";
    }

    @Override
    public String adminPens(Model model){
        return "pages/admin/pens/pens";
    }

    @Override
    public String adminLighters(Model model){
        return "pages/admin/lighters/lighters";
    }

    @Override
    public String adminBusinessCardsEditCategory(Model model) {
        return "pages/admin/edit_category/business_cards";
    }



    @Override
    public String login(Model model) {
        return "pages/auth/login";
    }

    @Override
    public String verifyEmail(Model model) {
        return "pages/auth/verify_email";
    }

    @Override
    public String finishSignup(Model model) {
        return "pages/auth/finish_signup";
    }


    @Override
    public String businessCards(Model model) {
        addPriceInfo(model, ProductType.BUSINESS_CARD);
        return "pages/products/vizitki/vizitki";
    }

    @Override
    public String workCalendars(Model model) {
        addPriceInfo(model, ProductType.WORK_CALENDAR);
        return "pages/products/rabotni_kalendari/rabotni_kalendari";
    }

    @Override
    public String pocketCalendars(Model model) {
        addPriceInfo(model, ProductType.POCKET_CALENDAR);
        return "pages/products/dzobni_kalendari/dzobni_kalendari";
    }

    @Override
    public String fliers(Model model) {
        addPriceInfo(model, ProductType.FLIER_10x15, "price_info_flyer_10x15");
        addPriceInfo(model, ProductType.FLIER_10x20, "price_info_flyer_10x20");
        return "pages/products/flaeri/flaeri";
    }

    @Override
    public String pens(Model model) {
        addPriceInfoPensAndLighters(model, ProductType.PEN);
        return "pages/products/himikalki/himikalki";
    }

    @Override
    public String lighters(Model model) {
        addPriceInfoPensAndLighters(model, ProductType.LIGHTER);
        return "pages/products/zapalki/zapalki";
    }


    @Override
    public String workCalendarsModels(Model model) {

        PaginatedModels models = categoriesController.getModels(ProductType.WORK_CALENDAR, 0, 100000);

        model.addAttribute("models", models.items());
        return "pages/products/rabotni_kalendari/models_page";
    }

    @Override
    public String lightersModels(Model model) {
        PaginatedModels models = categoriesController.getModels(ProductType.LIGHTER, 0, 100000);
        model.addAttribute("models", models.items());
        return "pages/products/zapalki/models_page";
    }


    @Override
    public String pensModels(Model model) {

        PaginatedModels models = categoriesController.getModels(ProductType.PEN, 0, 100000);

        model.addAttribute("models", models.items());
        return "pages/products/himikalki/models_page";
    }


    @Override
    public String businessCardCategories(Model model) {
        return "pages/categories/vizitki/vizitki_categories";
    }

    @Override
    public String fliersCategories(Model model) {
        return "pages/categories/flayers/flayers";
    }

    @Override
    public String penCategories(Model model) {
        return "pages/categories/pens";
    }

    @Override
    public String lighterCategories(Model model) {
        return "pages/categories/lighter";
    }

    @Override
    public String pocketCalendarsCategories(Model model) {
        return "pages/categories/pocket_calendars/pocket_calendars";
    }

    @Override
    public String workCalendarsCategories(Model model) {
        return "pages/categories/work_calendars/work_calendars";
    }

    @Override
    public String businessCardEditor(Model model) {
        return "pages/editor/editor_page_visitki";
    }

    @Override
    public String pocketCalendarEditor(Model model) {
        return "pages/editor/editor_page_pocket_calendar";
    }

    @Override
    public String workCalendarEditor(Model model) {
        return "pages/editor/editor_page_work_calendar";
    }

    @Override
    public String penEditor(Model model) {
        return "pages/editor/editor_page_pen";
    }

    @Override
    public String flier10x15Editor(Model model) {
        return "pages/editor/editor_page_flyer_10x15";
    }

    @Override
    public String flier10x20Editor(Model model) {
        return "pages/editor/editor_page_flyer_10x20";
    }

    @Override
    public String lightersEditor(Model model) {
        return "pages/editor/editor_page_lighter";
    }

    @Override
    public String shoppingCart(Model model) {
        return "pages/cart/cart";
    }

    @Override
    public String checkout(Model model) {
        return "pages/checkout/checkout";
    }

    @Override
    public String orderComplete(Model model) {
        return "pages/order_complete";
    }


    private void addPriceInfo(Model model, ProductType type) {
        addPriceInfo(model, pricesRepository.findPricesForProduct(type));
    }

    private void addPriceInfo(Model model, ProductType type, String attributeName) {
        addPriceInfo(model, pricesRepository.findPricesForProduct(type), attributeName);
    }

    private void addPriceInfo(Model model, List<ProductPrice> prices, String attributeName) {
        List<Map<String, String>> priceInfo = prices
                .stream()
                .collect(Collectors.groupingBy(ProductPrice::amount))
                .entrySet()
                .stream()
                .sorted(Comparator.comparingInt(Map.Entry::getKey))
                .map(entry -> {
                    Map<String, String> object = entry.getValue().stream()
                            .collect(Collectors.toMap(price -> price.printType().name(), price -> Formatter.PRICE_FORMAT.format(price.price())));
                    object.put("amount", Integer.toString(entry.getKey()));
                    return object;
                })
                .toList();

        System.out.println(priceInfo);
        model.addAttribute(attributeName, priceInfo);
    }

    private void addPriceInfo(Model model, List<ProductPrice> prices) {
        addPriceInfo(model, prices, "price_info");
    }

    private List<ProductPrice> filterPricesByType(List<ProductPrice> prices, List<PrintType> types) {
        return prices.stream()
                .filter(entry -> types.contains(entry.printType()))
                .toList();
    }

    // private List<ProductPriceTemplateDTO> getPricesFormatted(List<ProductPrice> prices) {
    //     return prices.stream()
    //             .map(price -> new ProductPriceTemplateDTO(price.printType(), price.amount(), Formatter.PRICE_FORMAT.format(price.price())))
    //             .toList();
    // }

    private void addPriceInfoPensAndLighters(Model model, ProductType productType) {
        List<ProductPrice> prices = pricesRepository.findPricesForProduct(productType);
        List<ProductPrice> cliches = prices.stream().filter(price -> price.amount() == 0).toList();
        List<ProductPrice> actualPrices = prices.stream().filter(price -> price.amount() != 0).toList();

        addPriceInfo(model, actualPrices);
        cliches.forEach(price -> model.addAttribute(price.printType().name(), price.price()));

        List<PrintType> screenPrintTypes = List.of(PrintType.SCREEN_ONE_COLOR, PrintType.SCREEN_TWO_COLORS,
                PrintType.SCREEN_THREE_COLORS);
        List<ProductPrice> screenPrices = filterPricesByType(actualPrices, screenPrintTypes);

        List<PrintType> padPrintTypes = List.of(PrintType.PAD_ONE_COLOR, PrintType.PAD_TWO_COLORS,
                PrintType.PAD_THREE_COLORS);
        List<ProductPrice> padPrices = filterPricesByType(actualPrices, padPrintTypes);

        List<PrintType> fullColorPrintTypes = List.of(PrintType.FULL_COLOR);
        List<ProductPrice> fullColorPrices = filterPricesByType(actualPrices, fullColorPrintTypes);

        addPriceInfo(model, screenPrices, "price_info_screen");
        addPriceInfo(model, padPrices, "price_info_pad");
        addPriceInfo(model, fullColorPrices, "price_info_full_color");
    }
}
