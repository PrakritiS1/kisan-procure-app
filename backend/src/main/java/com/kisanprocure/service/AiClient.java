package com.kisanprocure.service;

import com.kisanprocure.dto.ai.AiDtos.RecommendCentresRequest;
import com.kisanprocure.dto.ai.AiDtos.RecommendCentresResponse;
import com.kisanprocure.dto.ai.AiDtos.WaitPredictionRequest;
import com.kisanprocure.dto.ai.AiDtos.WaitPredictionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
@RequiredArgsConstructor
public class AiClient {

    private final RestClient aiRestClient;

    /**
     * Calls the Python/FastAPI AI service to recommend
     * suitable procurement centres.
     */
    public RecommendCentresResponse recommend(
            RecommendCentresRequest request
    ) {

        return aiRestClient.post()
                .uri("/ai/recommend-centres")
                .body(request)
                .retrieve()
                .body(RecommendCentresResponse.class);
    }

    /**
     * Calls the Python/FastAPI AI service to predict
     * the estimated waiting time.
     */
    public WaitPredictionResponse predictWaitTime(
            WaitPredictionRequest request
    ) {

        return aiRestClient.post()
                .uri("/ai/predict-wait-time")
                .body(request)
                .retrieve()
                .body(WaitPredictionResponse.class);
    }
}