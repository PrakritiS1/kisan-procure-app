package com.kisanprocure.exception;
import org.springframework.http.*; import org.springframework.web.bind.MethodArgumentNotValidException; import org.springframework.web.bind.annotation.*; import java.time.Instant; import java.util.*;
@RestControllerAdvice public class GlobalExceptionHandler {
 @ExceptionHandler(ApiException.class) ResponseEntity<?> api(ApiException e){return ResponseEntity.status(e.getStatus()).body(Map.of("success",false,"message",e.getMessage(),"timestamp",Instant.now()));}
 @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<?> validation(MethodArgumentNotValidException e){Map<String,String> m=new LinkedHashMap<>(); e.getBindingResult().getFieldErrors().forEach(x->m.put(x.getField(),x.getDefaultMessage())); return ResponseEntity.badRequest().body(Map.of("success",false,"message","Validation failed","errors",m));}
 @ExceptionHandler(Exception.class) ResponseEntity<?> other(Exception e){return ResponseEntity.status(500).body(Map.of("success",false,"message","Internal server error"));}
}
