package com.kisanprocure.controller;
import com.kisanprocure.dto.booking.BookingDtos.*; import com.kisanprocure.entity.Booking; import com.kisanprocure.service.BookingService; import com.kisanprocure.service.QueueService; import jakarta.validation.Valid; import lombok.RequiredArgsConstructor; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/bookings") @RequiredArgsConstructor public class BookingController {
 private final BookingService b; private final QueueService q;
 @PostMapping public CreateBookingResponse create(Authentication a,@Valid @RequestBody CreateBookingRequest r){return b.create(Long.valueOf(a.getName()),r);}
 @GetMapping("/{id}") public Map<String,Object> get(@PathVariable Long id){Booking x=b.get(id); return Map.of("success",true,"data",Map.of("booking",x.getBookingId(),"tokenNumber",x.getTokenNumber(),"centreId",x.getCentre().getId(),"crop",x.getCrop().getName(),"quantity",x.getExpectedQuantity(),"status",x.getStatus().name()));}
 @GetMapping("/{id}/queue") public QueueResponse queue(@PathVariable Long id){return q.bookingQueue(id);}
 @PatchMapping("/{id}/cancel") public Map<String,Object> cancel(@PathVariable Long id,@Valid @RequestBody CancelRequest r){b.cancel(id,r.reason());return Map.of("success",true,"message","Booking cancelled","status","CANCELLED");}
 @PostMapping("/{id}/check-in") public Map<String,Object> checkIn(@PathVariable Long id,@RequestBody CheckInRequest r){b.checkIn(id);return Map.of("success",true,"status","CHECKED_IN","message","Farmer checked in successfully");}
}
