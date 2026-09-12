package com.kisanprocure.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="notifications") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional=false) @JoinColumn(name="user_id") private User user;
    @ManyToOne @JoinColumn(name="booking_id") private Booking booking;
    private String title;
    @Column(length=1000) private String message;
    private Boolean isRead;
}
