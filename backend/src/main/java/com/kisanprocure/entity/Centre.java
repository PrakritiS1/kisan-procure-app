package com.kisanprocure.entity;

import jakarta.persistence.*;
import lombok.*;
import static com.kisanprocure.entity.enums.CentreStatus;

@Entity @Table(name="centres") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Centre {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String name;
    @Column(nullable=false, unique=true) private String code;
    private String address;
    @Column(nullable=false) private Double latitude;
    @Column(nullable=false) private Double longitude;
    @Column(nullable=false) private Double dailyCapacity;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private CentreStatus status;
}
