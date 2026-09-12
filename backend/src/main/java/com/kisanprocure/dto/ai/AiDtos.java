package com.kisanprocure.dto.ai;
import jakarta.validation.constraints.*; import java.util.*;
public final class AiDtos {
 private AiDtos(){}
 public record WaitPredictionRequest(@Min(0) int queueSize,@NotBlank String currentTime,@Positive double averageProcessingTime,@Positive int activeCounters,@NotBlank String crop){}
 public record WaitPredictionResponse(int estimatedWaitMinutes,double confidence){}
 public record RecommendCentresRequest(double latitude,double longitude,@NotBlank String crop,@Positive double quantity,@NotBlank String preferredTime){}
 public record Recommendation(Long centreId,String centre,double distanceKm,double availableCapacity,int estimatedWaitMinutes,double score){}
 public record RecommendCentresResponse(List<Recommendation> recommendations){}
}
