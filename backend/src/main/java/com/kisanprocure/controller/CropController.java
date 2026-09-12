package com.kisanprocure.controller;
import com.kisanprocure.dto.crop.CropDtos.CropResponse; import com.kisanprocure.repository.CropRepository; import lombok.RequiredArgsConstructor; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/crops") @RequiredArgsConstructor public class CropController { private final CropRepository crops; @GetMapping public Map<String,Object> all(){return Map.of("success",true,"crops",crops.findAll().stream().map(c->new CropResponse(c.getId(),c.getName(),c.getUnit())).toList());} }
