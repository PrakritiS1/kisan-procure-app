package com.kisanprocure.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="weighments") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Weighment {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @OneToOne(optional=false) @JoinColumn(name="booking_id", unique=true) private Booking booking;
    private Double expectedQuantity;
    private Double actualQuantity;
}
