-- Demo/seed data placeholder.
USE kisanprocure;

-- password for both demo users is: 123456
INSERT INTO users (name, phone, email, password_hash, role) VALUES
('Demo Farmer', '9876543210', 'farmer@demo.com', '$2b$10$cZLMwHntRpYMwlUzW8G2JeGZv5IjcIki/N2LrymOCUeE.HV.2jR32', 'FARMER'),
('Demo Officer', '9999999999', 'officer@demo.com', '$2b$10$cZLMwHntRpYMwlUzW8G2JeGZv5IjcIki/N2LrymOCUeE.HV.2jR32', 'OFFICER');

INSERT INTO farmers (user_id, farmer_code, village, district, state) VALUES
((SELECT id FROM users WHERE phone = '9876543210'), 'FARM-1001', 'Rampur', 'Munger', 'Bihar');

INSERT INTO centres (name, code, address, latitude, longitude, daily_capacity, status) VALUES
('Shivpur Procurement Centre', 'SPC-001', 'Shivpur Block, Near Main Road', 25.3701, 86.4702, 500, 'ACTIVE'),
('Rampur Kharid Kendra',       'RKK-002', 'Rampur Main Chowk',            25.3910, 86.4550, 400, 'ACTIVE'),
('Lalpur Centre',              'LPC-003', 'Lalpur Village Road',          25.4200, 86.5100, 200, 'ACTIVE'),
('Badgaon Centre',             'BGC-004', 'Badgaon Mandi Yard',           25.4600, 86.3900, 350, 'ACTIVE');

INSERT INTO officers (user_id, employee_id, centre_id) VALUES
((SELECT id FROM users WHERE phone = '9999999999'), 'EMP-1001', (SELECT id FROM centres WHERE code = 'SPC-001'));

INSERT INTO crops (name, unit) VALUES
('Paddy', 'quintal'),
('Wheat', 'quintal'),
('Maize', 'quintal'),
('Mustard', 'quintal');

INSERT INTO centre_crops (centre_id, crop_id, rate, is_available) VALUES
((SELECT id FROM centres WHERE code = 'SPC-001'), (SELECT id FROM crops WHERE name = 'Paddy'), 2300, true),
((SELECT id FROM centres WHERE code = 'SPC-001'), (SELECT id FROM crops WHERE name = 'Wheat'), 2200, true),
((SELECT id FROM centres WHERE code = 'RKK-002'), (SELECT id FROM crops WHERE name = 'Paddy'), 2280, true),
((SELECT id FROM centres WHERE code = 'LPC-003'), (SELECT id FROM crops WHERE name = 'Paddy'), 2250, true),
((SELECT id FROM centres WHERE code = 'BGC-004'), (SELECT id FROM crops WHERE name = 'Paddy'), 2260, true);

-- Shivpur Procurement Centre, Paddy, tomorrow's slots
-- (capacities reproduce the 60/50/20/Full/70/100 qtl figures from the mockup)
INSERT INTO slots (centre_id, slot_date, start_time, end_time, capacity, booked_capacity) VALUES
((SELECT id FROM centres WHERE code = 'SPC-001'), CURDATE() + INTERVAL 1 DAY, '06:00:00', '08:00:00', 100, 40),
((SELECT id FROM centres WHERE code = 'SPC-001'), CURDATE() + INTERVAL 1 DAY, '08:00:00', '10:00:00', 100, 50),
((SELECT id FROM centres WHERE code = 'SPC-001'), CURDATE() + INTERVAL 1 DAY, '10:00:00', '12:00:00', 100, 80),
((SELECT id FROM centres WHERE code = 'SPC-001'), CURDATE() + INTERVAL 1 DAY, '12:00:00', '14:00:00', 100, 100),
((SELECT id FROM centres WHERE code = 'SPC-001'), CURDATE() + INTERVAL 1 DAY, '14:00:00', '16:00:00', 100, 30),
((SELECT id FROM centres WHERE code = 'SPC-001'), CURDATE() + INTERVAL 1 DAY, '16:00:00', '18:00:00', 100, 0);