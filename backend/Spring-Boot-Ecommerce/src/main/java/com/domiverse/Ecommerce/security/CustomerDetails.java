package com.domiverse.Ecommerce.security;

import com.domiverse.Ecommerce.entity.Customer;
import com.domiverse.Ecommerce.entity.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.stream.Collectors;

public class CustomerDetails implements UserDetails {

    private final Customer customer;

    // --- Constructor để inject đối tượng Customer ---
    public CustomerDetails(Customer customer) {
        this.customer = customer;
    }

    // --- CÁC PHƯƠNG THỨC BẮT BUỘC TỪ UserDetails ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Lấy danh sách quyền từ customer và chuyển đổi thành GrantedAuthority
        return customer.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        // Trả về mật khẩu của customer
        return customer.getPassword();
    }

    @Override
    public String getUsername() {
        // Trả về email của customer, dùng làm username để đăng nhập
        return customer.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        // Tài khoản không bao giờ hết hạn
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // Tài khoản không bị khóa
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        // Thông tin đăng nhập (mật khẩu) không bao giờ hết hạn
        return true;
    }

    @Override
    public boolean isEnabled() {
        // Tài khoản được kích hoạt
        return true;
    }
}