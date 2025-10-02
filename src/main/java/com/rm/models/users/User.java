package com.rm.models.users;

public record User(long id, String email, String surname, String name, String password, String phone, Role role,
        String delivery_address, String delivery_phone, Boolean email_verified, String cart_id) {
    public User withPassword(String password) {
        return new User(id, email, surname, name, password, phone, role, delivery_address, delivery_phone, email_verified, cart_id);
    }

    public User withRole(Role role) {
        return new User(id, email, surname, name, password, phone, role, delivery_address, delivery_phone, email_verified, cart_id);
    }

    public User withEmailVerified(boolean emailVerified) {
        return new User(id, email, surname, name, password, phone, role, delivery_address, delivery_phone, emailVerified, cart_id);
    }

    public User withCartId(String cartId) {
        return new User(id, email, surname, name, password, phone, role, delivery_address, delivery_phone, email_verified, cartId);
    }
}
