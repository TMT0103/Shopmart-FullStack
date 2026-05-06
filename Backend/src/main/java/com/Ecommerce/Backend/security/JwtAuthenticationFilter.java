package com.Ecommerce.Backend.security;

import java.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtProvider;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        System.out.println("=== FILTER CHẠY RỒI ==="); // thêm dòng này đầu tiên
        String path = request.getServletPath();
        System.out.println(">>> PATH: " + path);
        // 🔥 BỎ QUA AUTH ENDPOINT
        if (path.contains("/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");
        System.out.println("=== JWT FILTER ===");
        System.out.println("Path: " + path);

        System.out.println("Header: " + header);

        if (header != null && header.startsWith("Bearer ")) {

            String token = header.substring(7);

            System.out.println("TOKEN: " + token);

            try {
                if (jwtProvider.validateToken(token)) {

                    String username = jwtProvider.getUsernameFromToken(token);
                    System.out.println("USERNAME: " + username);
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    System.out.println("=== AUTH INFO ===");
                    System.out.println("Path: " + path);
                    System.out.println("Method: " + request.getMethod());
                    System.out.println("Authorities: " + userDetails.getAuthorities());
                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    System.out.println("AUTH: " + SecurityContextHolder.getContext().getAuthentication());
                } else {
                    System.out.println("TOKEN INVALID");
                }
            } catch (Exception e) {
                System.out.println("JWT ERROR: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
        System.out.println(">>> RESPONSE STATUS: " + response.getStatus());
    }
}
