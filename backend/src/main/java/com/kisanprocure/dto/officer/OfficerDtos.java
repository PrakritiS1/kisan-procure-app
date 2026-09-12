package com.kisanprocure.dto.officer;
import jakarta.validation.constraints.*; import java.time.*; import java.util.*;
public final class OfficerDtos {
 private OfficerDtos(){}
 public record QualityCheckRequest(@NotNull double moisture,@NotNull double foreignMatter,@NotBlank String qualityGrade,@NotBlank String status,String remarks){}
 public record WeighmentRequest(@NotNull double expectedQuantity,@NotNull @Positive double actualQuantity,@NotBlank String unit){}
 public record ProcurementRequest(@NotNull @Positive double quantity,@NotNull @Positive double rate){}
 public record StatusRequest(@NotBlank String status){}
 public record Dashboard(int totalBookings,int checkedIn,int waiting,int processing,int completed,double remainingCapacity){}
 public record NextRequest(@NotNull Long centreId){}
 public record TodayQueue(int totalBookings,int waiting,int checkedIn,int qualityCheck,int completed,List<TodayQueueItem> queue){}
 public record TodayQueueItem(Long id,int position,int tokenNumber,String bookingId,String farmerName,String crop,double quantity,String status){}
}
