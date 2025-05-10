package com.dawillygene.ConfideHub.Storage;

import java.security.SecureRandom;
import java.util.Base64;

public class SecretGenerator {
    public static String generateBase64Secret() {
        SecureRandom random = new SecureRandom();
        byte[] keyBytes = new byte[64]; // Generate a 512-bit key (64 bytes)
        random.nextBytes(keyBytes);
        return Base64.getEncoder().encodeToString(keyBytes);
    }
}