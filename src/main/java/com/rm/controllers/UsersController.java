package com.rm.controllers;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;

import com.rm.models.EmailWrapper;
import com.rm.models.users.UserUpdateInfo;
import com.rm.repositories.UsersRepository;
import com.rm.util.JWTManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.thymeleaf.context.Context;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.rm.apis.UsersApi;
import com.rm.exceptions.BadRequestException;
import com.rm.exceptions.InternalServerErrorException;
import com.rm.exceptions.UnauthorizedException;
import com.rm.models.users.LoginBody;
import com.rm.models.users.LoginReponse;
import com.rm.models.users.Role;
import com.rm.models.users.User;
import com.rm.models.users.VerifyEmailBody;
import com.rm.util.EmailSender;

import jakarta.mail.MessagingException;

@Controller
public class UsersController implements UsersApi {
    @Value("${paths.categories}")
    private String categoriesDirectory;

    private final EmailSender emailSender;
    private final ShoppingCartController cartController;
    private final UsersRepository usersRepository;

    @Autowired
    public UsersController(EmailSender emailSender, ShoppingCartController cartController, UsersRepository usersRepository) {
        this.emailSender = emailSender;
        this.cartController = cartController;
        this.usersRepository = usersRepository;
    }

    private String getEncrypted(String string) throws InternalServerErrorException {
        try {
            byte[] hash = MessageDigest.getInstance("SHA-256").digest(string.getBytes(StandardCharsets.US_ASCII));

            StringBuilder hexString = new StringBuilder(2 * hash.length);
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }

            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new InternalServerErrorException();
        }
    }

    private void sendVerificationEmail(String email) throws MessagingException, JsonProcessingException {
        // MimeMessage message = mailSender.createMimeMessage();
        // MimeMessageHelper helper = new MimeMessageHelper(message, false);
        // helper.setFrom("arttema9@gmail.com");
        // helper.setTo(email);
        // helper.setSubject("Mail Subject");
        // helper.setText("This is my first email using JavaMailer");

        EmailWrapper emailWrapper = new EmailWrapper(email);

        String code = JWTManager.encode(emailWrapper);

        String websiteUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
        String link = websiteUrl + "/потвърждение-на-имейл?code=" + code;

        Context context = new Context();
        context.setVariable("link", link);

        emailSender.sendTemplate(email, "Verify email", "emails/verification_email", context);
    }

    @Override
    public LoginReponse login(LoginBody body) throws RuntimeException {
        String encryptedPwd = this.getEncrypted(body.password());
        User user = usersRepository.getOne(body.username(), encryptedPwd).orElseThrow(UnauthorizedException::new);

        try {
            String token = JWTManager.encode(user.withPassword(null));
            return new LoginReponse(token);
        } catch (JsonProcessingException e) {
            throw new InternalServerErrorException();
        }
    }

    @Override
    public void signup(User body) throws RuntimeException {
        if(body.email() == null || body.password() == null || body.name() == null) {
            throw new BadRequestException("MISSING_DATA");
        }

        Optional<User> userSameEmail = usersRepository.getOne(body.email());

        if(userSameEmail.isPresent()) {
            throw new BadRequestException("EMAIL_IN_USE");
        }

        User entry = body
            .withRole(Role.USER)
            .withEmailVerified(false)
            .withCartId(cartController.createShoppingCart())
            .withPassword(getEncrypted(body.password()));

        usersRepository.save(entry);

        try {
            this.sendVerificationEmail(body.email());
        }
        catch(Exception e) {
            System.out.println("Failed to send email: " + e);
        }
    }

    @Override
    public LoginReponse verifyEmail(VerifyEmailBody body) throws RuntimeException {
        String email;
        try {
            email = JWTManager.decodeClaim(body.code(), "email", String.class);
        }
        catch(RuntimeException e) {
            throw new BadRequestException("INVALID_JWT");
        }
        
        usersRepository.setEmailVerified(email, true);
        User user = usersRepository.getOne(email).orElseThrow(() -> new BadRequestException("USER_NOT_FOUND"));

        if(!user.email_verified()) {
            throw new BadRequestException("EMAIL_NOT_VERIFIED");
        }

        String newJWT;

        try {
            newJWT = JWTManager.encode(user.withPassword(null));
        }
        catch(JsonProcessingException e) {
            throw new InternalServerErrorException();
        }

        return new LoginReponse(newJWT);
    }

    @Override
    public void updateUserInfo(UserUpdateInfo userInfo, String authorization) throws IOException {
        try {
            User user = JWTManager.decodePayload(authorization.substring(7), User.class);
            usersRepository.updateUserInfo(user, userInfo);
        } catch (NoSuchMethodException | InvocationTargetException | InstantiationException | IllegalAccessException e) {
            // Not possible
        }
    }

    @Override
    public String refreshToken(String authorization) throws JsonProcessingException {
        Long userId = JWTManager.decodeClaim(authorization.substring(7), "id", Long.class);
        Optional<User> user = usersRepository.getOne(userId);
        return JWTManager.encode(user.get());
    }
}
