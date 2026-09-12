package com.kisanprocure.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    public JwtAuthFilter(JwtService jwtService){this.jwtService=jwtService;}
    @Override protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain filterChain) throws ServletException,IOException {
        String h=request.getHeader(HttpHeaders.AUTHORIZATION);
        if(h!=null && h.startsWith("Bearer ") && SecurityContextHolder.getContext().getAuthentication()==null){
            try{
                Claims c=jwtService.parse(h.substring(7));
                String role=String.valueOf(c.get("role"));
                var auth=new UsernamePasswordAuthenticationToken(c.getSubject(),null,List.of(new SimpleGrantedAuthority("ROLE_"+role)));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }catch(Exception ignored){}
        }
        filterChain.doFilter(request,response);
    }
}
