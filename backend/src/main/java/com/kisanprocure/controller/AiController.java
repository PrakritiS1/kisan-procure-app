package com.kisanprocure.controller;

import com.kisanprocure.dto.ai.AiDtos.*;
import com.kisanprocure.service.AiClient;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiClient s;

    @PostMapping("/predict-wait-time")
    public WaitPredictionResponse wait(
            @Valid @RequestBody WaitPredictionRequest r) {

        return  s.predictWaitTime(r);
    }

    @PostMapping("/recommend-centres")
    public RecommendCentresResponse recommend(
            @Valid @RequestBody RecommendCentresRequest r) {

        return s.recommend(r);
    }
}