package com.kisanprocure.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="farmers") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Farmer {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @OneToOne(optional=false) @JoinColumn(name="user_id", nullable=false, unique=true) private User user;
    @Column(nullable=false, unique=true) private String farmerCode;
    private String village;
    private String district;
    private String state;
}
