package com.kisanprocure.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import static com.kisanprocure.entity.enums.BookingStatus;

@Entity @Table(name="bookings", indexes={@Index(name="idx_booking_centre_slot", columnList="centre_id,slot_id"), @Index(name="idx_booking_farmer", columnList="farmer_id")}) @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Booking {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false, unique=true) private String bookingId;
    @ManyToOne(optional=false) @JoinColumn(name="farmer_id") private Farmer farmer;
    @ManyToOne(optional=false) @JoinColumn(name="centre_id") private Centre centre;
    @ManyToOne(optional=false) @JoinColumn(name="crop_id") private Crop crop;
    @ManyToOne(optional=false) @JoinColumn(name="slot_id") private Slot slot;
    @Column(nullable=false) private Double expectedQuantity;
    @Column(nullable=false) private Integer tokenNumber;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private BookingStatus status;
    private OffsetDateTime createdAt;
}
