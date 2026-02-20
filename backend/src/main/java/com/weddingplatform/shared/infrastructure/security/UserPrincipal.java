package com.weddingplatform.shared.infrastructure.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

public class UserPrincipal implements UserDetails {

    private final Long id;
    private final String uuid;
    private final String email;
    private final String password;
    private final boolean active;
    private final Collection<? extends GrantedAuthority> authorities;

    private UserPrincipal(Long id, String uuid, String email, String password,
                          boolean active, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.uuid = uuid;
        this.email = email;
        this.password = password;
        this.active = active;
        this.authorities = authorities;
    }

    public static UserPrincipal of(Long id, String uuid, String email, String password,
                                   boolean active, List<String> roleNames) {
        List<SimpleGrantedAuthority> auths = roleNames.stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
            .toList();
        return new UserPrincipal(id, uuid, email, password, active, auths);
    }

    public Long getId() { return id; }
    public String getUuid() { return uuid; }
    public String getEmail() { return email; }

    @Override public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
    @Override public String getPassword() { return password; }
    @Override public String getUsername() { return email; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return active; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return active; }
}
