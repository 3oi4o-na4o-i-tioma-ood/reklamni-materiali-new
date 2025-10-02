package com.rm.models.users;

public record OrderDetails(UserDetails userDetails, InvoiceDetails invoiceDetails, PaymentMethod paymentMethod) {
    public record UserDetails(String email, String name, String surname, String phone, String deliveryType, String address, String econtAddress, String deliveryPhone) {}
    public record InvoiceDetails(String companyName, String companyAddress, String uic, String taxId, String receiver) {}
    public enum PaymentMethod {
        ON_DELIVERY,
        BANK_TRANSFER,
    }
}
