package com.kisanprocure.dto.centre;
import java.util.*;
public final class CentreDtos {
 private CentreDtos(){}
 public record NearbyCentreResponse(Long id,String name,double distanceKm,double availableCapacity,int estimatedWaitMinutes,double latitude,double longitude,String status){}
 public record CapacityResponse(Long centreId,double totalCapacity,double reservedCapacity,double remainingCapacity){}
 public record CropInfo(Long id,String name,String unit,double rate,boolean isAvailable){}
 public record CentreDetailsResponse(Long id,String name,String code,String address,double latitude,double longitude,double dailyCapacity,String status,double distanceKm,List<CropInfo> crops,List<String> facilities){}
 public record SlotResponse(Long id,String startTime,String endTime,double capacity,double bookedCapacity,double availableCapacity,String status){}
 public record SlotsResponse(Long centreId,String date,List<SlotResponse> slots){}
}
