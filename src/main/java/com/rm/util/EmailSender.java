package com.rm.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Component
public class EmailSender {
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    public void sendHTML(String toEmail, String subject, String html) {
        MimeMessagePreparator preparator = message -> {
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED, "UTF-8");
            helper.setFrom("arttema9@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(html, true);
       };

       mailSender.send(preparator);
    }

    public void sendTemplate(String toEmail, String subject, String templatePath, Context context) {
        String html = templateEngine.process(templatePath, context);

        this.sendHTML(toEmail, subject, html);
    }
}