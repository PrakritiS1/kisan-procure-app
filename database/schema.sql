CREATE DATABASE IF NOT EXISTS kisanprocure;
USE kisanprocure;

-- =========================================================
-- users
-- =========================================================
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL -- FARMER | OFFICER | ADMIN
);

-- =========================================================
-- farmers
-- =========================================================
CREATE TABLE farmers (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE,
  farmer_code VARCHAR(50) NOT NULL UNIQUE,
  village VARCHAR(255),
  district VARCHAR(255),
  state VARCHAR(255),
  CONSTRAINT fk_farmers_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =========================================================
-- centres
-- =========================================================
CREATE TABLE centres (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  address VARCHAR(500),
  latitude DOUBLE NOT NULL,
  longitude DOUBLE NOT NULL,
  daily_capacity DOUBLE NOT NULL,
  status VARCHAR(20) NOT NULL -- ACTIVE | INACTIVE | PAUSED
);

-- =========================================================
-- officers
-- =========================================================
CREATE TABLE officers (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE,
  employee_id VARCHAR(50) NOT NULL UNIQUE,
  centre_id BIGINT NOT NULL,
  CONSTRAINT fk_officers_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_officers_centre FOREIGN KEY (centre_id) REFERENCES centres(id)
);

-- =========================================================
-- crops
-- =========================================================
CREATE TABLE crops (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  unit VARCHAR(50) NOT NULL
);

-- =========================================================
-- centre_crops
-- =========================================================
CREATE TABLE centre_crops (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  centre_id BIGINT NOT NULL,
  crop_id BIGINT NOT NULL,
  rate DOUBLE NOT NULL,
  is_available BOOLEAN NOT NULL,
  CONSTRAINT fk_cc_centre FOREIGN KEY (centre_id) REFERENCES centres(id),
  CONSTRAINT fk_cc_crop FOREIGN KEY (crop_id) REFERENCES crops(id),
  CONSTRAINT uq_centre_crop UNIQUE (centre_id, crop_id)
);

-- =========================================================
-- slots
-- =========================================================
CREATE TABLE slots (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  centre_id BIGINT NOT NULL,
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  capacity DOUBLE NOT NULL,
  booked_capacity DOUBLE NOT NULL,
  CONSTRAINT fk_slots_centre FOREIGN KEY (centre_id) REFERENCES centres(id)
);
CREATE INDEX idx_slot_centre_date ON slots (centre_id, slot_date);

-- =========================================================
-- procurement_schedules
-- =========================================================
CREATE TABLE procurement_schedules (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  centre_id BIGINT NOT NULL,
  crop_id BIGINT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  active BOOLEAN NOT NULL,
  CONSTRAINT fk_ps_centre FOREIGN KEY (centre_id) REFERENCES centres(id),
  CONSTRAINT fk_ps_crop FOREIGN KEY (crop_id) REFERENCES crops(id)
);

-- =========================================================
-- bookings
-- =========================================================
CREATE TABLE bookings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  booking_id VARCHAR(50) NOT NULL UNIQUE,
  farmer_id BIGINT NOT NULL,
  centre_id BIGINT NOT NULL,
  crop_id BIGINT NOT NULL,
  slot_id BIGINT NOT NULL,
  expected_quantity DOUBLE NOT NULL,
  token_number INT NOT NULL,
  status VARCHAR(20) NOT NULL, -- BOOKED|CHECKED_IN|WAITING|QUALITY_CHECK|WEIGHMENT|PROCUREMENT|COMPLETED|CANCELLED
  created_at TIMESTAMP NULL,
  CONSTRAINT fk_bookings_farmer FOREIGN KEY (farmer_id) REFERENCES farmers(id),
  CONSTRAINT fk_bookings_centre FOREIGN KEY (centre_id) REFERENCES centres(id),
  CONSTRAINT fk_bookings_crop FOREIGN KEY (crop_id) REFERENCES crops(id),
  CONSTRAINT fk_bookings_slot FOREIGN KEY (slot_id) REFERENCES slots(id)
);
CREATE INDEX idx_booking_centre_slot ON bookings (centre_id, slot_id);
CREATE INDEX idx_booking_farmer ON bookings (farmer_id);

-- =========================================================
-- queue_entries
-- =========================================================
CREATE TABLE queue_entries (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  booking_id BIGINT NOT NULL UNIQUE,
  centre_id BIGINT NOT NULL,
  queue_position INT NOT NULL,
  estimated_wait INT,
  status VARCHAR(20) NOT NULL, -- WAITING|SERVING|COMPLETED|CANCELLED
  checked_in_at TIMESTAMP NULL,
  CONSTRAINT fk_queue_booking FOREIGN KEY (booking_id) REFERENCES bookings(id),
  CONSTRAINT fk_queue_centre FOREIGN KEY (centre_id) REFERENCES centres(id)
);
CREATE INDEX idx_queue_centre_date ON queue_entries (centre_id);

-- =========================================================
-- quality_checks
-- =========================================================
CREATE TABLE quality_checks (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  booking_id BIGINT NOT NULL UNIQUE,
  moisture DOUBLE,
  foreign_matter DOUBLE,
  quality_grade VARCHAR(10),
  status VARCHAR(20) NOT NULL, -- PENDING|PASSED|FAILED
  remarks VARCHAR(500),
  CONSTRAINT fk_qc_booking FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- =========================================================
-- weighments
-- =========================================================
CREATE TABLE weighments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  booking_id BIGINT NOT NULL UNIQUE,
  expected_quantity DOUBLE,
  actual_quantity DOUBLE,
  CONSTRAINT fk_weighment_booking FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- =========================================================
-- procurements
-- =========================================================
CREATE TABLE procurements (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  booking_id BIGINT NOT NULL UNIQUE,
  quantity DOUBLE,
  rate DOUBLE,
  total_amount DOUBLE,
  status VARCHAR(20) NOT NULL, -- COMPLETED|CANCELLED
  CONSTRAINT fk_procurement_booking FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- =========================================================
-- payments
-- =========================================================
CREATE TABLE payments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  procurement_id BIGINT NOT NULL,
  amount DOUBLE,
  transaction_ref VARCHAR(100) UNIQUE,
  status VARCHAR(20) NOT NULL, -- INITIATED|PROCESSING|COMPLETED|FAILED
  CONSTRAINT fk_payment_procurement FOREIGN KEY (procurement_id) REFERENCES procurements(id)
);

-- =========================================================
-- notifications
-- =========================================================
CREATE TABLE notifications (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  booking_id BIGINT NULL,
  title VARCHAR(255),
  message VARCHAR(1000),
  is_read BOOLEAN,
  CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_notif_booking FOREIGN KEY (booking_id) REFERENCES bookings(id)
);