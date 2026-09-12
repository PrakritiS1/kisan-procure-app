package com.kisanprocure.entity;

import jakarta.persistence.*;
import lombok.*;
import static com.kisanprocure.entity.enums.QualityStatus;

@Entity @Table(name="quality_checks") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class QualityCheck {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @OneToOne(optional=false) @JoinColumn(name="booking_id", unique=true) private Booking booking;
    private Double moisture;
    private Double foreignMatter;
    private String qualityGrade;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private QualityStatus status;
    private String remarks;
}
