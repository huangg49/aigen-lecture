package com.example.demo.service;

import lombok.RequiredArgsConstructor;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Autowired
private JavaMailSender mailSender;

public void sendPasswordResetEmail(String toEmail, String token) {
    try {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(toEmail);
        helper.setSubject("Yêu cầu khôi phục mật khẩu - EduMind");

        String resetLink = "http://localhost:5173/reset-password?token=" + token;

        String htmlContent = "<div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>"
                + "<h2>Chào bạn,</h2>"
                + "<p>Bạn vừa yêu cầu khôi phục mật khẩu. Vui lòng click vào nút bên dưới để đặt lại mật khẩu mới:</p>"
                + "<a href='" + resetLink + "' style='display: inline-block; padding: 12px 24px; margin: 20px 0; font-size: 16px; color: #ffffff; background-color: #6366f1; text-decoration: none; border-radius: 8px; font-weight: bold;'>Đặt lại mật khẩu</a>"
                + "<p>Mã này có hiệu lực trong vòng 15 phút.</p>"
                + "<p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>"
                + "<br><p>Trân trọng,<br>Đội ngũ EduMind</p>"
                + "</div>";

        helper.setText(htmlContent, true);

        mailSender.send(message);
        
    } catch (Exception e) {
        System.out.println("Lỗi khi gửi email HTML: " + e.getMessage());
    }
}
}