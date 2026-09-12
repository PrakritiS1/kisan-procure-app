package com.kisanprocure.controller;
import com.kisanprocure.dto.centre.CentreDtos.*; import com.kisanprocure.service.CentreService; import org.springframework.web.bind.annotation.*; import java.time.LocalDate; import java.util.*;
@RestController @RequestMapping("/api/centres") public class CentreController {
 private final CentreService s; public CentreController(CentreService s){this.s=s;}
 @GetMapping("/nearby") public Map<String,Object> nearby(@RequestParam double latitude,@RequestParam double longitude,@RequestParam(defaultValue="10") double radius,@RequestParam(required=false) Long cropId){return Map.of("success",true,"centres",s.nearby(latitude,longitude,radius,cropId));}
 @GetMapping("/{id}") public Map<String,Object> details(@PathVariable Long id,@RequestParam(defaultValue="0") double latitude,@RequestParam(defaultValue="0") double longitude){return Map.of("success",true,"data",Map.of("centre",s.details(id,latitude,longitude)));}
 @GetMapping("/{id}/capacity") public CapacityResponse capacity(@PathVariable Long id){return s.capacity(id);}
 @GetMapping("/{centreId}/slots") public SlotsResponse slots(@PathVariable Long centreId,@RequestParam LocalDate date,@RequestParam Long cropId,@RequestParam double quantity){return s.slots(centreId,date,cropId,quantity);}
}
