package com.kisanprocure.entity;

import jakarta.persistence.*;
import lombok.*;
import static com.kisanprocure.entity.enums.ProcurementStatus;

@Entity @Table(name="procurements") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Procurement {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @OneToOne(optional=false) @JoinColumn(name="booking_id", unique=true) private Booking booking;
    private Double quantity;
    private Double rate;
    private Double totalAmount;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private ProcurementStatus status;
}
