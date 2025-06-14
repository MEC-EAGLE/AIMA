package com.example.aicommunity.model;

public class User {
    private Long id;
    private String email;
    private String phone;
    private String password;
    private boolean verified;
    private String verificationCode;

    public User(Long id, String email, String phone, String password, String code) {
        this.id = id;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.verified = false;
        this.verificationCode = code;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getPassword() { return password; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
    public String getVerificationCode() { return verificationCode; }
}
