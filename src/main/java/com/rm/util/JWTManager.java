package com.rm.util;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.RecordComponent;
import java.util.Arrays;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JWTManager {
    private JWTManager() {}

    private static final String ISSUER = "reklamni_materiali";
    private static final Algorithm SIGNATURE_ALGORITHM = Algorithm.HMAC256("mycooljwtsecret");
    private static final ObjectMapper JSON = new ObjectMapper();

    public static <T extends Record> T decodePayload(String jwt, Class<T> payloadType) throws NoSuchMethodException, InvocationTargetException, InstantiationException, IllegalAccessException {
        DecodedJWT decodedJWT = JWT.require(SIGNATURE_ALGORITHM).withIssuer(ISSUER).build().verify(jwt);
        RecordComponent[] components = payloadType.getRecordComponents();
        Constructor<T> constructor = payloadType.getConstructor(Arrays.stream(components).map(RecordComponent::getType).toArray(Class<?>[]::new));
        return constructor.newInstance(Arrays.stream(components).map(component -> decodedJWT.getClaim(component.getName()).as(component.getType())).toArray());
    }

    public static <T> T decodeClaim(String jwt, String claim, Class<T> claimType) {
        DecodedJWT decodedJWT = JWT.require(SIGNATURE_ALGORITHM).withIssuer(ISSUER).build().verify(jwt);
        return decodedJWT.getClaim(claim).as(claimType);
    }

    public static <T> String encode(T payload) throws JsonProcessingException {
        String json = JSON.writer().writeValueAsString(payload);

        return JWT.create()
            .withPayload(json)
            .withIssuer(ISSUER)
            .sign(SIGNATURE_ALGORITHM);
    }
}
