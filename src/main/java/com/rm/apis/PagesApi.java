package com.rm.apis;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

public interface PagesApi {
    @GetMapping("/")
    String main();

    // Profile

    @GetMapping("/профил")
    String profile(Model model);

    @GetMapping("/профил/поръчки")
    String profileOrders(Model model);

    @GetMapping("/профил/данни-за-доставка")
    String profileDeliveryInfo(Model model);

    @GetMapping("/профил/запазени-дизайни")
    String profileSavedDesigns(Model model);

    @GetMapping("/профил/профил-и-сигурност")
    String profileAndSecurity(Model model);

    // Admin

    @GetMapping("/админ")
    String admin(Model model);

    @GetMapping("/админ/визитки")
    String adminBusinessCards(Model model);

    @GetMapping("/админ/работни-календари")
    String adminWorkCalendars(Model model);

    @GetMapping("/админ/джобни-календарчета")
    String adminPocketCalendars(Model model);

    @GetMapping("/админ/флаери")
    String adminFlyers(Model model);

    @GetMapping("/админ/химикалки")
    String adminPens(Model model);

    @GetMapping("/админ/запалки")
    String adminLighters(Model model);

    @GetMapping("/админ/визитки/редактиране-на-категория")
    String adminBusinessCardsEditCategory(Model model);

    // Auth

    @GetMapping("/влизане")
    String login(Model model);

    @GetMapping("/потвърждение-на-имейл")
    String verifyEmail(Model model);

    @GetMapping("/приключване-на-регистрацията")
    String finishSignup(Model model);

    @GetMapping("/промоции")
    String promos();

    @GetMapping("/помощен-център")
    String help();

    @GetMapping("/контакти")
    String contacts();

    // Product info pages

    @GetMapping("/визитки")
    String businessCards(Model model);

    @GetMapping("/работни-календари")
    String workCalendars(Model model);

    @GetMapping("/джобни-календарчета")
    String pocketCalendars(Model model);

    @GetMapping("/флаери")
    String fliers(Model model);

    @GetMapping("/химикалки")
    String pens(Model model);

    @GetMapping("/запалки")
    String lighters(Model model);

    // Models

    @GetMapping("/модели/работни-календари")
    String workCalendarsModels(Model model);

    @GetMapping("/модели/химикалки")
    String pensModels(Model model);

    // @GetMapping("/модели/запалки")
    // String lightersModels(Model model);

    @GetMapping("/модели/запалки")
    String lightersModels(Model model);

    // Product categories pages

    @GetMapping("/категории/визитки")
    String businessCardCategories(Model model);

    @GetMapping("/категории/флаери")
    String fliersCategories(Model model);

    @GetMapping("/категории/химикалки")
    String penCategories(Model model);

    @GetMapping("/категории/запалки")
    String lighterCategories(Model model);

    @GetMapping("/категории/работни-календари")
    String workCalendarsCategories(Model model);

    @GetMapping("/категории/джобни-календарчета")
    String pocketCalendarsCategories(Model model);

    // Editor pages

    @GetMapping("/визитки/дизайн")
    String businessCardEditor(Model model);

    @GetMapping("/джобни-календарчета/дизайн")
    String pocketCalendarEditor(Model model);

    @GetMapping("/работни-календари/дизайн")
    String workCalendarEditor(Model model);

    @GetMapping("/химикалки/дизайн")
    String penEditor(Model model);

    @GetMapping("/флаери-10x15/дизайн")
    String flier10x15Editor(Model model);

    @GetMapping("/флаери-10x20/дизайн")
    String flier10x20Editor(Model model);

    @GetMapping("/запалки/дизайн")
    String lightersEditor(Model model);

    // -----

    @GetMapping("/количка")
    String shoppingCart(Model model);

    @GetMapping("/приключване-на-поръчката")
    String checkout(Model model);

    @GetMapping("/приключена-поръчка")
    String orderComplete(Model model);
}
