package com.kisanprocure.dto.payment;
import jakarta.validation.constraints.*;
public final class PaymentDtos {
 private PaymentDtos(){}
 public record CreatePaymentRequest(@NotNull Long procurementId,@NotNull @Positive double amount,@NotBlank String paymentMethod){}
 public record CreatePaymentResponse(boolean success,Long paymentId,String transactionReference,String status){}
 public record PaymentDetails(Long id,Long procurementId,double amount,String transactionReference,String status,double quantity,double rate,double totalAmount,String procurementStatus){}
}
