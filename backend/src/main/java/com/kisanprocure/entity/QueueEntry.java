package com.kisanprocure.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import static com.kisanprocure.entity.enums.QueueStatus;

@Entity @Table(name="queue_entries", indexes=@Index(name="idx_queue_centre_date", columnList="centre_id")) @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class QueueEntry {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @OneToOne(optional=false) @JoinColumn(name="booking_id", unique=true) private Booking booking;
    @ManyToOne(optional=false) @JoinColumn(name="centre_id") private Centre centre;
    @Column(nullable=false) private Integer queuePosition;
    private Integer estimatedWait;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private QueueStatus status;
    private OffsetDateTime checkedInAt;
}
