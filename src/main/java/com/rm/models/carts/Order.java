package com.rm.models.carts;

import com.rm.models.users.OrderDetails;
import com.rm.util.db.ColumnName;

public record Order(long id,
                    @ColumnName("cart_id") String cartId,
                    OrderDetails details) {}
