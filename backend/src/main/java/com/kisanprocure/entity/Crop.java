package com.kisanprocure.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="crops") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Crop {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false, unique=true) private String name;
    @Column(nullable=false) private String unit;
}
