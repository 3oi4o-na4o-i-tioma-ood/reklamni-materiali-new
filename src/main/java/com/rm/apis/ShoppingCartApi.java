package com.rm.apis;

import com.rm.models.carts.CartInfo;
import com.rm.models.carts.CartItemCreationInfo;
import com.rm.models.carts.Order;
import com.rm.models.carts.ProductionTime;
import com.rm.models.design.Design;
import com.rm.models.users.OrderDetails;

import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.rm.models.carts.Cart;
import com.rm.models.carts.CartItem;

@Tag(name = "Shopping carts")
public interface ShoppingCartApi {
    @Operation(summary = "Create shopping cart")
    @PostMapping("/api/cart")
    @ResponseBody
    String createShoppingCart();

    @Operation(summary = "Add new item to shopping cart")
    @PostMapping("/api/cart/{cartId}/item")
    @ResponseBody
    void createShoppingCartItem(@PathVariable String cartId,
                                @RequestBody CartItemCreationInfo itemInfo);

    @Operation(summary = "Get shopping cart")
    @GetMapping("/api/cart/{cartId}")
    @ResponseBody
    CartInfo getShoppingCart(@PathVariable String cartId);

    @Operation(summary = "Remove item from shopping cart")
    @DeleteMapping("/api/cart/item/{itemId}")
    @ResponseBody
    void deleteCartItem(@PathVariable long itemId);

    @Operation(summary = "Make order")
    @PostMapping("/api/cart/{cartId}/order")
    @ResponseBody
    long makeOrder(@PathVariable("cartId") String cartId,
                   @RequestBody OrderDetails orderDetails,
                   @RequestHeader(name = "Authorization", required = false) String authorization);

    @Operation(summary = "Get order details")
    @GetMapping("/api/orders/{orderId}")
    @ResponseBody
    Order getOrder(@PathVariable("orderId") long orderId);

    @Operation(summary = "Get user orders")
    @GetMapping("/api/orders/user")
    @ResponseBody
    List<Order> getMyOrders(@RequestHeader("Authorization") String authorization);
}
