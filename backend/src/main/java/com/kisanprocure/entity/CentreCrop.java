package com.kisanprocure.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="centre_crops", uniqueConstraints=@UniqueConstraint(columnNames={"centre_id","crop_id"})) @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CentreCrop {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional=false) @JoinColumn(name="centre_id") private Centre centre;
    @ManyToOne(optional=false) @JoinColumn(name="crop_id") private Crop crop;
    @Column(nullable=false) private Double rate;
    @Column(nullable=false) private Boolean isAvailable;
}
