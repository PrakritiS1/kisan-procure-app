package com.kisanprocure.entity;

public final class enums {
    private enums() {}
    public enum Role { FARMER, OFFICER, ADMIN }
    public enum BookingStatus { BOOKED, CHECKED_IN, WAITING, QUALITY_CHECK, WEIGHMENT, PROCUREMENT, COMPLETED, CANCELLED }
    public enum QueueStatus { WAITING, SERVING, COMPLETED, CANCELLED }
    public enum QualityStatus { PENDING, PASSED, FAILED }
    public enum ProcurementStatus { COMPLETED, CANCELLED }
    public enum PaymentStatus { INITIATED, PROCESSING, COMPLETED, FAILED }
    public enum CentreStatus { ACTIVE, INACTIVE, PAUSED }
}
