package com.kisanprocure.controller;
import com.kisanprocure.dto.officer.OfficerDtos.*; import com.kisanprocure.dto.booking.BookingDtos.*; import com.kisanprocure.entity.*; import com.kisanprocure.entity.enums.*; import com.kisanprocure.exception.ApiException; import com.kisanprocure.repository.*; import com.kisanprocure.service.*; import jakarta.validation.Valid; import lombok.RequiredArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.web.bind.annotation.*; import java.time.*; import java.util.*;
@RestController @RequestMapping("/api/officer") @RequiredArgsConstructor @PreAuthorize("hasRole('OFFICER')") public class OfficerController {
 private final OfficerRepository officers; private final BookingRepository bookings; private final QueueService queue; private final ProcurementService procurement;
 @GetMapping("/dashboard") public Dashboard dashboard(){long total=bookings.count(); long checked=bookings.findAll().stream().filter(b->b.getStatus()==BookingStatus.CHECKED_IN).count(); long waiting=bookings.findAll().stream().filter(b->b.getStatus()==BookingStatus.WAITING).count(); long processing=bookings.findAll().stream().filter(b->b.getStatus()==BookingStatus.PROCUREMENT||b.getStatus()==BookingStatus.QUALITY_CHECK||b.getStatus()==BookingStatus.WEIGHMENT).count(); long completed=bookings.findAll().stream().filter(b->b.getStatus()==BookingStatus.COMPLETED).count(); return new Dashboard((int)total,(int)checked,(int)waiting,(int)processing,(int)completed,0); }
 @GetMapping("/queue/today")
public TodayQueue today(
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate date,

        @RequestParam(defaultValue = "active")
        String status
) {

    LocalDate selectedDate =
            date != null ? date : LocalDate.now();

    List<Booking> todaysBookings = bookings.findAll()
            .stream()
            .filter(booking ->
                    booking.getSlot() != null
                            && booking.getSlot()
                            .getSlotDate()
                            .equals(selectedDate)
            )
            .toList();

    List<TodayQueueItem> items = new ArrayList<>();

    int position = 1;

    for (Booking booking : todaysBookings) {

        items.add(
        new TodayQueueItem(
                booking.getId(),
                position++,
                        booking.getTokenNumber(),
                        booking.getBookingId(),
                        booking.getFarmer().getUser().getName(),
                        booking.getCrop().getName(),
                        booking.getExpectedQuantity(),
                        booking.getStatus().name()
                )
        );
    }

    int totalBookings = todaysBookings.size();

    int waiting = (int) todaysBookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.WAITING)
            .count();

    int checkedIn = (int) todaysBookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.CHECKED_IN)
            .count();

    int qualityCheck = (int) todaysBookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.QUALITY_CHECK)
            .count();

    int completed = (int) todaysBookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
            .count();

    return new TodayQueue(
            totalBookings,
            waiting,
            checkedIn,
            qualityCheck,
            completed,
            items
    );
}
 @PostMapping("/queue/next") public Map<String,Object> next(@Valid @RequestBody NextRequest r){QueueEntry e=queue.next(r.centreId(),LocalDate.now()); e.setStatus(QueueStatus.SERVING); e.getBooking().setStatus(BookingStatus.PROCUREMENT); return Map.of("success",true,"tokenNumber",e.getBooking().getTokenNumber(),"message","Next farmer called");}
 @PostMapping("/bookings/{id}/quality-check") public Map<String,Object> quality(@PathVariable Long id,@Valid @RequestBody QualityCheckRequest r){procurement.quality(id,r);return Map.of("success",true,"quality",Map.of("grade",r.qualityGrade(),"moisture",r.moisture(),"result",r.status()));}
 @PostMapping("/bookings/{id}/weighment") public Map<String,Object> weigh(@PathVariable Long id,@Valid @RequestBody WeighmentRequest r){procurement.weighment(id,r);return Map.of("success",true,"weighment",Map.of("expectedQuantity",r.expectedQuantity(),"actualQuantity",r.actualQuantity(),"unit",r.unit()));}
 @PostMapping("/bookings/{id}/procurement") public Map<String,Object> proc(@PathVariable Long id,@Valid @RequestBody ProcurementRequest r){Procurement p=procurement.procurement(id,r);return Map.of("success",true,"procurement",Map.of("quantity",p.getQuantity(),"rate",p.getRate(),"totalAmount",p.getTotalAmount(),"status",p.getStatus().name()));}
 @PatchMapping("/bookings/{id}/status") public Map<String,Object> status(@PathVariable Long id,@Valid @RequestBody StatusRequest r){procurement.updateStatus(id,r.status());return Map.of("success",true,"bookingId",id,"status",r.status());}
 @GetMapping("/reports") public Map<String,Object> reports(@RequestParam LocalDate from,@RequestParam LocalDate to,@RequestParam(required=false,name="centre_id") Long centreId){return Map.of("success",true,"data",Map.of("period",Map.of("from",from,"to",to),"summary",Map.of("total_bookings",bookings.count())));}
}
