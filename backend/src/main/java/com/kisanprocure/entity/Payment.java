package com.kisanprocure.entity;

import jakarta.persistence.*;
import lombok.*;
import static com.kisanprocure.entity.enums.PaymentStatus;

@Entity @Table(name="payments") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Payment {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional=false) @JoinColumn(name="procurement_id") private Procurement procurement;
    private Double amount;
    @Column(unique=true) private String transactionRef;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private PaymentStatus status;
}
