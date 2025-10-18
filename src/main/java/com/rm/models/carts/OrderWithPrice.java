package com.rm.models.carts;

import com.rm.models.users.OrderDetails;

public record OrderWithPrice(long id,
                             String cartId,
                             OrderDetails details,
                             double price) {
}
