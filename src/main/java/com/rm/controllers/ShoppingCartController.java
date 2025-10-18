package com.rm.controllers;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.rm.models.carts.CartInfo;
import com.rm.models.carts.CartItemCreationInfo;
import com.rm.models.carts.Order;
import com.rm.models.carts.OrderWithPrice;
import com.rm.models.users.OrderDetails;
import com.rm.repositories.CartRepository2;
import com.rm.repositories.UsersRepository;
import com.rm.util.EmailSender;
import com.rm.util.Formatter;
import com.rm.util.JWTManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.rm.apis.ShoppingCartApi;
import com.rm.exceptions.NotFoundException;
import com.rm.models.design.Design;
import com.rm.models.carts.Cart;
import com.rm.models.carts.CartItem;
import com.rm.repositories.CartItemRepository;
import com.rm.repositories.CartRepository;
import com.rm.repositories.EditorRepository;

import org.thymeleaf.context.Context;

@Controller
public class ShoppingCartController implements ShoppingCartApi {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final EditorRepository editorRepository;
    private final UsersRepository usersRepository;
    private final PricesController pricesController;
    private final EmailSender emailSender;
    private final CartRepository2 cartRepository2;

    @Autowired
    public ShoppingCartController(CartRepository cartRepository, EditorRepository editorRepository,
                                  CartItemRepository cartItemRepository, PricesController pricesController, EmailSender emailSender,
                                  UsersRepository usersRepository, CartRepository2 cartRepository2) {
        this.cartRepository = cartRepository;
        this.editorRepository = editorRepository;
        this.cartItemRepository = cartItemRepository;
        this.pricesController = pricesController;
        this.emailSender = emailSender;
        this.usersRepository = usersRepository;
        this.cartRepository2 = cartRepository2;
    }

    public Cart findCartOrThrow(String cartId) throws NotFoundException {
        Cart cart = cartRepository.findByIdNoJakarta(cartId, editorRepository);

        if (cart == null) {
            throw new NotFoundException("CART_NOT_FOUND");
        }

        return cart;
    }

    public CartItem findCartItemOrThrow(long cartItemId) throws NotFoundException {
        Optional<CartItem> cartOptional = cartItemRepository.findById(cartItemId);

        if (!cartOptional.isPresent()) {
            throw new NotFoundException("CART_ITEM_NOT_FOUND");
        }

        return cartOptional.get();
    }

    public Design.Raw findDesignOrThrow(String designId) throws NotFoundException {
        Optional<Design.Raw> designOptional = editorRepository.findById(designId);

        if (!designOptional.isPresent()) {
            throw new NotFoundException("DESIGN_NOT_FOUND");
        }

        return designOptional.get();
    }

    @Override
    public void createShoppingCartItem(String cartId, CartItemCreationInfo itemInfo) {
        Cart cart = findCartOrThrow(cartId);

        // Check if the design exists
        findDesignOrThrow(itemInfo.designId());

        CartItem item = new CartItem();
        item.amount = itemInfo.amount();
        item.productionTime = itemInfo.productionTime();
        item.design = findDesignOrThrow(itemInfo.designId());
        item.cart = cart;
        cart.items.add(item);
        cart.updated = new Date();

        cartRepository.save(cart);
    }

    @Override
    public String createShoppingCart() {
        Cart cart = new Cart();
        Cart createdCart = cartRepository.save(cart);
        return createdCart.id;
    }

    @Override
    public CartInfo getShoppingCart(String cartId) {
        Cart cart = findCartOrThrow(cartId);
        return new CartInfo(cart, pricesController.calculatePrice(cart.items));
    }

    @Override
    public void deleteCartItem(long itemId) {
        CartItem item = findCartItemOrThrow(itemId);

        Cart cart = item.cart;
        cart.updated = new Date();
        cartRepository.save(cart);

        cartItemRepository.deleteById(itemId);
    }

    private String getOrderCode(long orderId) {
        // 452930477 is hard-coded on front- and back-end. See
        // Java/src/main/resources/static/js/components/order_code.js
        return Long.toString(orderId * 452930477, 36).toUpperCase();
    }

    private void sendVendorEmail(Cart cart, OrderDetails orderDetails) {
        Context vendorOrderContext = new Context();
        vendorOrderContext.setVariable("cart", cart);
        vendorOrderContext.setVariable("cartPrice", Formatter.PRICE_FORMAT.format(pricesController.calculatePrice(cart.items)));
        vendorOrderContext.setVariable("orderDetails", orderDetails);

        String websiteUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
        vendorOrderContext.setVariable("websiteUrl", websiteUrl);

        // String pdfLink = websiteUrl + "/api/pdf?designName="

        emailSender.sendTemplate("arttema9@gmail.com", "Успешна поръчка", "emails/vendor_order",
                        vendorOrderContext);// troyankru@gmail.com

    }

    @Override
    public long makeOrder(String cartId, OrderDetails orderDetails, String authorization) {
        Cart cart = findCartOrThrow(cartId);

        Long userId = authorization == null ? null
                : JWTManager.decodeClaim(authorization.substring(7), "id", Long.class);

        long orderId = cartRepository2.saveOrder(cartId, userId, orderDetails).get();

        sendVendorEmail(cart, orderDetails);

        Context userOrderContext = new Context();
        userOrderContext.setVariable("cart", cart);
        userOrderContext.setVariable("cartPrice", Formatter.PRICE_FORMAT.format(pricesController.calculatePrice(cart.items)));
        userOrderContext.setVariable("orderNumber", getOrderCode(orderId));
        userOrderContext.setVariable("orderDetails", orderDetails);
        userOrderContext.setVariable("authorized", userId != null);
        String websiteUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
        userOrderContext.setVariable("websiteUrl", websiteUrl);
        emailSender.sendTemplate(orderDetails.userDetails().email(), "Успешна поръчка", "emails/user_order",
                userOrderContext);

        if (userId != null) {
            String newCartId = createShoppingCart();
            usersRepository.setCartId(userId, newCartId);
        }

        return orderId;
    }

    @Override
    public OrderWithPrice getOrder(long orderId) {
        Order order = cartRepository2.findOrder(orderId).get();
        Cart cart = cartRepository.findByIdNoJakarta(order.cartId(), editorRepository);
        if (cart == null) {
            throw new NotFoundException("CART_NOT_FOUND");
        }

        return new OrderWithPrice(order.id(), order.cartId(), order.details(), pricesController.calculatePrice(cart.items));
    }

    @Override
    public List<Order> getMyOrders(String authorization) {
        try {
            return cartRepository2.findUserOrders(JWTManager.decodeClaim(authorization.substring(7), "id", Long.class));
        } catch (Exception e) {
            System.out.println(e);
            return null;
        }
    }
}
