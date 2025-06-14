package com.example.aicommunity.controller;

import com.example.aicommunity.model.User;
import com.example.aicommunity.repo.DataStore;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;

import javax.servlet.http.HttpSession;
import java.util.Random;

@Controller
@SessionAttributes("user")
public class AuthController {

    @GetMapping("/register")
    public String register() {
        return "register";
    }

    @PostMapping("/register")
    public String doRegister(@RequestParam String email,
                             @RequestParam String phone,
                             @RequestParam String password,
                             Model model) {
        if (DataStore.findUserByEmail(email) != null) {
            model.addAttribute("message", "Email already registered");
            return "register";
        }
        String code = String.format("%04d", new Random().nextInt(10000));
        User user = DataStore.addUser(email, phone, password, code);
        System.out.println("Verification code for " + email + ": " + code);
        model.addAttribute("message", "Check console for verification code");
        model.addAttribute("pendingEmail", email);
        return "verify";
    }

    @GetMapping("/verify")
    public String verify(@RequestParam(required = false) String pendingEmail, Model model) {
        model.addAttribute("pendingEmail", pendingEmail);
        return "verify";
    }

    @PostMapping("/verify")
    public String doVerify(@RequestParam String email,
                           @RequestParam String code,
                           Model model) {
        User user = DataStore.findUserByEmail(email);
        if (user != null && user.getVerificationCode().equals(code)) {
            user.setVerified(true);
            model.addAttribute("message", "Account verified");
            return "login";
        }
        model.addAttribute("message", "Invalid code");
        model.addAttribute("pendingEmail", email);
        return "verify";
    }

    @GetMapping("/login")
    public String login() { return "login"; }

    @PostMapping("/login")
    public String doLogin(@RequestParam String email,
                          @RequestParam String password,
                          HttpSession session,
                          Model model) {
        User user = DataStore.findUserByEmail(email);
        if (user != null && user.isVerified() && user.getPassword().equals(password)) {
            session.setAttribute("user", user);
            return "redirect:/dashboard";
        }
        model.addAttribute("message", "Invalid credentials or not verified");
        return "login";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}
