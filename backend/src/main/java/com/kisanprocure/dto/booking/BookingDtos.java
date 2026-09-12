package com.kisanprocure.dto.booking;
import jakarta.validation.constraints.*; import java.util.*;
public final class BookingDtos {
 private BookingDtos(){}
 public record CreateBookingRequest(@NotNull Long cropId,@NotNull @Positive double quantity,@NotNull Long centreId,@NotNull Long slotId){}
 public record BookingSummary(Long id,String bookingId,String tokenNumber,Long centreId,String crop,double quantity,String slot,String status){}
 public record CreateBookingResponse(boolean success,String message,BookingSummary booking){}
 public record CancelRequest(@NotBlank String reason){}
 public record CheckInRequest(@NotBlank String checkInMethod,double latitude,double longitude){}
 public record QueueItem(int position,Integer tokenNumber,String bookingId,double quantity,String status,Integer estimatedWait){}
 public record QueueResponse(String bookingId,String tokenNumber,int queuePosition,int peopleAhead,int estimatedWaitMinutes,String currentToken,String status){}
 public record QueueListSummary(int totalWaiting,int currentlyServing,int completed,int estimatedWaitMinutes){}
 public record CentreQueueResponse(Long centreId,String centreName,QueueListSummary summary,List<QueueItem> queue){}
 public record BookingDetailResponse(Object booking,Object centre,Object crop,Object slot,Object queue,Object qualityCheck,Object weighment,Object procurement,Object payment){}
}
