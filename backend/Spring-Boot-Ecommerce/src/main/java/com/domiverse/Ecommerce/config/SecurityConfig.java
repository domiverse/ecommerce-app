package com.domiverse.Ecommerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    // ✨ BƯỚC 1: THÊM BEAN CẤU HÌNH CORS TOÀN CỤC ✨
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Cho phép frontend của bạn truy cập
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
        // Cho phép các phương thức HTTP
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Cho phép tất cả các header
        configuration.setAllowedHeaders(Arrays.asList("*"));
        // Quan trọng: Cho phép gửi cookie và thông tin xác thực
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Áp dụng cấu hình này cho tất cả các đường dẫn
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                )
                .authorizeHttpRequests(authz -> authz
                        // ✨ SỬA ĐỔI QUAN TRỌNG Ở ĐÂY ✨

                        // 1. CHO PHÉP MỌI NGƯỜI XEM SẢN PHẨM VÀ DANH MỤC
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/product-category/**").permitAll()

                        // 2. CHO PHÉP TRUY CẬP CÁC API XÁC THỰC
                        .requestMatchers("/api/auth/**").permitAll()

                        // 3. CHO PHÉP KHÁCH VÃNG LAI THANH TOÁN
                        // Chúng ta sẽ xử lý logic tìm hoặc tạo customer trong service
                        .requestMatchers("/api/checkout/purchase").permitAll()

                        // 4. CÁC HÀNH ĐỘNG KHÁC YÊU CẦU ĐĂNG NHẬP
                        // Ví dụ: xem lịch sử đơn hàng (nếu có)
                        .requestMatchers("/api/orders/**").authenticated()

                        // 5. MỌI YÊU CẦU CÒN LẠI ĐỀU BỊ TỪ CHỐI (hoặc yêu cầu xác thực nếu bạn muốn)
                        // Dùng .anyRequest().authenticated() sẽ an toàn hơn
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}