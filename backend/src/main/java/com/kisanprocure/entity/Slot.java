package com.kisanprocure.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;

@Entity @Table(name="slots", indexes=@Index(name="idx_slot_centre_date", columnList="centre_id,slot_date")) @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Slot {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional=false) @JoinColumn(name="centre_id") private Centre centre;
    @Column(name="slot_date", nullable=false) private LocalDate slotDate;
    @Column(name="start_time", nullable=false) private LocalTime startTime;
    @Column(name="end_time", nullable=false) private LocalTime endTime;
    @Column(nullable=false) private Double capacity;
    @Column(nullable=false) private Double bookedCapacity;
}
