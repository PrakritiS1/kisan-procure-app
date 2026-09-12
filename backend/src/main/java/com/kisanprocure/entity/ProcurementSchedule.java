package com.kisanprocure.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name="procurement_schedules") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProcurementSchedule {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional=false) @JoinColumn(name="centre_id") private Centre centre;
    @ManyToOne(optional=false) @JoinColumn(name="crop_id") private Crop crop;
    @Column(nullable=false) private LocalDate startDate;
    @Column(nullable=false) private LocalDate endDate;
    @Column(nullable=false) private Boolean active;
}
