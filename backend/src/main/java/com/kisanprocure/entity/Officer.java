package com.kisanprocure.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="officers") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Officer {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @OneToOne(optional=false) @JoinColumn(name="user_id", nullable=false, unique=true) private User user;
    @Column(nullable=false, unique=true) private String employeeId;
    @ManyToOne(optional=false) @JoinColumn(name="centre_id", nullable=false) private Centre centre;
}
