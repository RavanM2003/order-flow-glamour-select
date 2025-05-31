
-- First, let's convert all serial IDs to UUIDs and create a comprehensive database structure

-- Drop existing foreign key constraints that reference integer IDs
ALTER TABLE appointment_services DROP CONSTRAINT IF EXISTS appointment_services_appointment_id_fkey;
ALTER TABLE appointment_services DROP CONSTRAINT IF EXISTS appointment_services_service_id_fkey;
ALTER TABLE appointment_products DROP CONSTRAINT IF EXISTS appointment_products_appointment_id_fkey;
ALTER TABLE appointment_products DROP CONSTRAINT IF EXISTS appointment_products_product_id_fkey;
ALTER TABLE service_products DROP CONSTRAINT IF EXISTS service_products_service_id_fkey;
ALTER TABLE service_products DROP CONSTRAINT IF EXISTS service_products_product_id_fkey;
ALTER TABLE product_categories DROP CONSTRAINT IF EXISTS product_categories_product_id_fkey;
ALTER TABLE product_categories DROP CONSTRAINT IF EXISTS product_categories_category_id_fkey;
ALTER TABLE services DROP CONSTRAINT IF EXISTS services_category_id_fkey;
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_appointment_id_fkey;
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_appointment_id_fkey;
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_appointment_id_fkey;

-- Convert appointments table ID to UUID
ALTER TABLE appointments ADD COLUMN new_uuid_id UUID DEFAULT gen_random_uuid();
UPDATE appointments SET new_uuid_id = gen_random_uuid() WHERE new_uuid_id IS NULL;
ALTER TABLE appointments DROP CONSTRAINT appointments_pkey;
ALTER TABLE appointments DROP COLUMN id;
ALTER TABLE appointments RENAME COLUMN new_uuid_id TO id;
ALTER TABLE appointments ADD PRIMARY KEY (id);

-- Convert services table ID to UUID
ALTER TABLE services ADD COLUMN new_uuid_id UUID DEFAULT gen_random_uuid();
UPDATE services SET new_uuid_id = gen_random_uuid() WHERE new_uuid_id IS NULL;
ALTER TABLE services DROP CONSTRAINT services_pkey;
ALTER TABLE services DROP COLUMN id;
ALTER TABLE services RENAME COLUMN new_uuid_id TO id;
ALTER TABLE services ADD PRIMARY KEY (id);

-- Convert products table ID to UUID
ALTER TABLE products ADD COLUMN new_uuid_id UUID DEFAULT gen_random_uuid();
UPDATE products SET new_uuid_id = gen_random_uuid() WHERE new_uuid_id IS NULL;
ALTER TABLE products DROP CONSTRAINT products_pkey;
ALTER TABLE products DROP COLUMN id;
ALTER TABLE products RENAME COLUMN new_uuid_id TO id;
ALTER TABLE products ADD PRIMARY KEY (id);

-- Convert service_categories table ID to UUID
ALTER TABLE service_categories ADD COLUMN new_uuid_id UUID DEFAULT gen_random_uuid();
UPDATE service_categories SET new_uuid_id = gen_random_uuid() WHERE new_uuid_id IS NULL;
ALTER TABLE service_categories DROP CONSTRAINT service_categories_pkey;
ALTER TABLE service_categories DROP COLUMN id;
ALTER TABLE service_categories RENAME COLUMN new_uuid_id TO id;
ALTER TABLE service_categories ADD PRIMARY KEY (id);

-- Convert staff table ID to UUID
ALTER TABLE staff ADD COLUMN new_uuid_id UUID DEFAULT gen_random_uuid();
UPDATE staff SET new_uuid_id = gen_random_uuid() WHERE new_uuid_id IS NULL;
ALTER TABLE staff DROP CONSTRAINT staff_pkey;
ALTER TABLE staff DROP COLUMN id;
ALTER TABLE staff RENAME COLUMN new_uuid_id TO id;
ALTER TABLE staff ADD PRIMARY KEY (id);

-- Convert promo_codes table ID to UUID
ALTER TABLE promo_codes ADD COLUMN new_uuid_id UUID DEFAULT gen_random_uuid();
UPDATE promo_codes SET new_uuid_id = gen_random_uuid() WHERE new_uuid_id IS NULL;
ALTER TABLE promo_codes DROP CONSTRAINT promo_codes_pkey;
ALTER TABLE promo_codes DROP COLUMN id;
ALTER TABLE promo_codes RENAME COLUMN new_uuid_id TO id;
ALTER TABLE promo_codes ADD PRIMARY KEY (id);

-- Convert payments table ID to UUID
ALTER TABLE payments ADD COLUMN new_uuid_id UUID DEFAULT gen_random_uuid();
UPDATE payments SET new_uuid_id = gen_random_uuid() WHERE new_uuid_id IS NULL;
ALTER TABLE payments DROP CONSTRAINT payments_pkey;
ALTER TABLE payments DROP COLUMN id;
ALTER TABLE payments RENAME COLUMN new_uuid_id TO id;
ALTER TABLE payments ADD PRIMARY KEY (id);

-- Convert invoices table ID to UUID
ALTER TABLE invoices ADD COLUMN new_uuid_id UUID DEFAULT gen_random_uuid();
UPDATE invoices SET new_uuid_id = gen_random_uuid() WHERE new_uuid_id IS NULL;
ALTER TABLE invoices DROP CONSTRAINT invoices_pkey;
ALTER TABLE invoices DROP COLUMN id;
ALTER TABLE invoices RENAME COLUMN new_uuid_id TO id;
ALTER TABLE invoices ADD PRIMARY KEY (id);

-- Convert histories table ID to UUID
ALTER TABLE histories ADD COLUMN new_uuid_id UUID DEFAULT gen_random_uuid();
UPDATE histories SET new_uuid_id = gen_random_uuid() WHERE new_uuid_id IS NULL;
ALTER TABLE histories DROP CONSTRAINT histories_pkey;
ALTER TABLE histories DROP COLUMN id;
ALTER TABLE histories RENAME COLUMN new_uuid_id TO id;
ALTER TABLE histories ADD PRIMARY KEY (id);

-- Update foreign key columns to UUID type
ALTER TABLE appointment_services ALTER COLUMN appointment_id TYPE UUID USING gen_random_uuid();
ALTER TABLE appointment_services ALTER COLUMN service_id TYPE UUID USING gen_random_uuid();
ALTER TABLE appointment_products ALTER COLUMN appointment_id TYPE UUID USING gen_random_uuid();
ALTER TABLE appointment_products ALTER COLUMN product_id TYPE UUID USING gen_random_uuid();
ALTER TABLE service_products ALTER COLUMN service_id TYPE UUID USING gen_random_uuid();
ALTER TABLE service_products ALTER COLUMN product_id TYPE UUID USING gen_random_uuid();
ALTER TABLE product_categories ALTER COLUMN product_id TYPE UUID USING gen_random_uuid();
ALTER TABLE product_categories ALTER COLUMN category_id TYPE UUID USING gen_random_uuid();
ALTER TABLE services ALTER COLUMN category_id TYPE UUID USING gen_random_uuid();
ALTER TABLE payments ALTER COLUMN appointment_id TYPE UUID USING gen_random_uuid();
ALTER TABLE invoices ALTER COLUMN appointment_id TYPE UUID USING gen_random_uuid();
ALTER TABLE transactions ALTER COLUMN appointment_id TYPE UUID USING gen_random_uuid();

-- Update appointment_services and appointment_products ID columns to UUID
ALTER TABLE appointment_services ADD COLUMN new_uuid_id UUID DEFAULT gen_random_uuid();
UPDATE appointment_services SET new_uuid_id = gen_random_uuid() WHERE new_uuid_id IS NULL;
ALTER TABLE appointment_services DROP CONSTRAINT appointment_services_pkey;
ALTER TABLE appointment_services DROP COLUMN id;
ALTER TABLE appointment_services RENAME COLUMN new_uuid_id TO id;
ALTER TABLE appointment_services ADD PRIMARY KEY (id);

ALTER TABLE appointment_products ADD COLUMN new_uuid_id UUID DEFAULT gen_random_uuid();
UPDATE appointment_products SET new_uuid_id = gen_random_uuid() WHERE new_uuid_id IS NULL;
ALTER TABLE appointment_products DROP CONSTRAINT appointment_products_pkey;
ALTER TABLE appointment_products DROP COLUMN id;
ALTER TABLE appointment_products RENAME COLUMN new_uuid_id TO id;
ALTER TABLE appointment_products ADD PRIMARY KEY (id);

-- Re-create foreign key constraints
ALTER TABLE appointment_services ADD CONSTRAINT appointment_services_appointment_id_fkey 
    FOREIGN KEY (appointment_id) REFERENCES appointments(id);
ALTER TABLE appointment_services ADD CONSTRAINT appointment_services_service_id_fkey 
    FOREIGN KEY (service_id) REFERENCES services(id);
ALTER TABLE appointment_products ADD CONSTRAINT appointment_products_appointment_id_fkey 
    FOREIGN KEY (appointment_id) REFERENCES appointments(id);
ALTER TABLE appointment_products ADD CONSTRAINT appointment_products_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES products(id);
ALTER TABLE service_products ADD CONSTRAINT service_products_service_id_fkey 
    FOREIGN KEY (service_id) REFERENCES services(id);
ALTER TABLE service_products ADD CONSTRAINT service_products_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES products(id);
ALTER TABLE product_categories ADD CONSTRAINT product_categories_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES products(id);
ALTER TABLE product_categories ADD CONSTRAINT product_categories_category_id_fkey 
    FOREIGN KEY (category_id) REFERENCES service_categories(id);
ALTER TABLE services ADD CONSTRAINT services_category_id_fkey 
    FOREIGN KEY (category_id) REFERENCES service_categories(id);
ALTER TABLE payments ADD CONSTRAINT payments_appointment_id_fkey 
    FOREIGN KEY (appointment_id) REFERENCES appointments(id);
ALTER TABLE invoices ADD CONSTRAINT invoices_appointment_id_fkey 
    FOREIGN KEY (appointment_id) REFERENCES appointments(id);
ALTER TABLE transactions ADD CONSTRAINT transactions_appointment_id_fkey 
    FOREIGN KEY (appointment_id) REFERENCES appointments(id);

-- Insert comprehensive mock data
-- Users (customers, staff, admin)
INSERT INTO users (id, email, full_name, role, gender, phone, hashed_password, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@salon.com', 'Salon Administrator', 'admin', 'male', '+994501234567', 'admin123', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'staff1@salon.com', 'Aysel Məmmədova', 'staff', 'female', '+994502345678', 'staff123', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'staff2@salon.com', 'Nigar Əliyeva', 'staff', 'female', '+994503456789', 'staff123', NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'customer1@mail.com', 'Günay Həsənova', 'customer', 'female', '+994504567890', 'customer123', NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'customer2@mail.com', 'Zeynəb Quliyeva', 'customer', 'female', '+994505678901', 'customer123', NOW(), NOW()),
('66666666-6666-6666-6666-666666666666', 'customer3@mail.com', 'Leyla Rəhimova', 'customer', 'female', '+994506789012', 'customer123', NOW(), NOW());

-- Service categories
INSERT INTO service_categories (id, name, user_id, created_at, updated_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Saç Xidmətləri', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Dırnaq Xidmətləri', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Üz Baxımı', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Bədən Baxımı', '11111111-1111-1111-1111-111111111111', NOW(), NOW());

-- Services
INSERT INTO services (id, name, description, duration, price, category_id, user_id, benefits, discount, created_at, updated_at) VALUES
('77777777-7777-7777-7777-777777777777', 'Saç Kəsilməsi', 'Peşəkar saç kəsilməsi xidməti', 45, 25.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', ARRAY['Təmiz görünüş', 'Peşəkar stil'], 0, NOW(), NOW()),
('88888888-8888-8888-8888-888888888888', 'Saç Boyası', 'Saç boyama və renk dəyişdirmə', 120, 80.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', ARRAY['Yeni görünüş', 'Rəng dəyişikliyi'], 10, NOW(), NOW()),
('99999999-9999-9999-9999-999999999999', 'Manikür', 'Əl və dırnaq baxımı', 60, 30.00, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', ARRAY['Gözəl dırnaqlar', 'Uzun davamlı'], 0, NOW(), NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Pedikür', 'Ayaq və dırnaq baxımı', 75, 40.00, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', ARRAY['Təmiz ayaqlar', 'Rahat hiss'], 5, NOW(), NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Üz Maskası', 'Dərinə təmizləmə və nəmləndirmə', 90, 50.00, 'cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', ARRAY['Təmiz dəri', 'Gənclik'], 0, NOW(), NOW());

-- Products
INSERT INTO products (id, name, description, price, stock, user_id, discount, details, ingredients, how_to_use, created_at, updated_at) VALUES
('10101010-1010-1010-1010-101010101010', 'Saç Şampunu', 'Təbii tərkibli şampun', 25.00, 50, '11111111-1111-1111-1111-111111111111', 0, 'Bütün saç tipləri üçün', 'Argan yağı, Keratin', 'Yaş saça tətbiq edin və masaj edin', NOW(), NOW()),
('20202020-2020-2020-2020-202020202020', 'Saç Kremi', 'Nəmləndirici saç kremi', 30.00, 40, '11111111-1111-1111-1111-111111111111', 5, 'Quru saçlar üçün', 'Shea yağı, Vitamin E', 'Şampundan sonra saça tətbiq edin', NOW(), NOW()),
('30303030-3030-3030-3030-303030303030', 'Dırnaq Lakı', 'Uzun davamlı dırnaq lakı', 15.00, 60, '11111111-1111-1111-1111-111111111111', 0, '20+ rəng seçimi', 'Təbii rənglər', 'Təmiz dırnağa 2 qat çəkin', NOW(), NOW()),
('40404040-4040-4040-4040-404040404040', 'Üz Kremi', 'Anti-aging üz kremi', 45.00, 30, '11111111-1111-1111-1111-111111111111', 10, 'Qırışları azaldır', 'Retinol, Hyaluronic acid', 'Təmiz üzə gecə tətbiq edin', NOW(), NOW());

-- Staff
INSERT INTO staff (id, user_id, position, specializations, created_at, updated_at) VALUES
('50505050-5050-5050-5050-505050505050', '22222222-2222-2222-2222-222222222222', 'Baş Stilist', ARRAY['77777777-7777-7777-7777-777777777777'::text, '88888888-8888-8888-8888-888888888888'::text, 'ffffffff-ffff-ffff-ffff-ffffffffffff'::text], NOW(), NOW()),
('60606060-6060-6060-6060-606060606060', '33333333-3333-3333-3333-333333333333', 'Manikür Ustası', ARRAY['99999999-9999-9999-9999-999999999999'::text, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'::text], NOW(), NOW());

-- Staff availability
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('22222222-2222-2222-2222-222222222222', 1, '09:00', '18:00'),
('22222222-2222-2222-2222-222222222222', 2, '09:00', '18:00'),
('22222222-2222-2222-2222-222222222222', 3, '09:00', '18:00'),
('22222222-2222-2222-2222-222222222222', 4, '09:00', '18:00'),
('22222222-2222-2222-2222-222222222222', 5, '09:00', '18:00'),
('33333333-3333-3333-3333-333333333333', 1, '10:00', '19:00'),
('33333333-3333-3333-3333-333333333333', 2, '10:00', '19:00'),
('33333333-3333-3333-3333-333333333333', 3, '10:00', '19:00'),
('33333333-3333-3333-3333-333333333333', 4, '10:00', '19:00'),
('33333333-3333-3333-3333-333333333333', 6, '10:00', '17:00');

-- Service products relationships
INSERT INTO service_products (service_id, product_id) VALUES
('77777777-7777-7777-7777-777777777777', '10101010-1010-1010-1010-101010101010'),
('77777777-7777-7777-7777-777777777777', '20202020-2020-2020-2020-202020202020'),
('88888888-8888-8888-8888-888888888888', '10101010-1010-1010-1010-101010101010'),
('88888888-8888-8888-8888-888888888888', '20202020-2020-2020-2020-202020202020'),
('99999999-9999-9999-9999-999999999999', '30303030-3030-3030-3030-303030303030'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '30303030-3030-3030-3030-303030303030'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', '40404040-4040-4040-4040-404040404040');

-- Appointments
INSERT INTO appointments (id, customer_user_id, appointment_date, start_time, end_time, status, total, user_id, created_at, updated_at) VALUES
('70707070-7070-7070-7070-707070707070', '44444444-4444-4444-4444-444444444444', '2024-06-15', '10:00', '11:15', 'completed', 105.00, '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('80808080-8080-8080-8080-808080808080', '55555555-5555-5555-5555-555555555555', '2024-06-20', '14:00', '15:00', 'scheduled', 30.00, '33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('90909090-9090-9090-9090-909090909090', '66666666-6666-6666-6666-666666666666', '2024-06-25', '11:00', '12:30', 'confirmed', 90.00, '22222222-2222-2222-2222-222222222222', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days');

-- Appointment services
INSERT INTO appointment_services (id, appointment_id, service_id, staff_user_id, quantity, duration, price) VALUES
('a0a0a0a0-a0a0-a0a0-a0a0-a0a0a0a0a0a0', '70707070-7070-7070-7070-707070707070', '77777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', 1, 45, 25.00),
('b0b0b0b0-b0b0-b0b0-b0b0-b0b0b0b0b0b0', '70707070-7070-7070-7070-707070707070', '88888888-8888-8888-8888-888888888888', '22222222-2222-2222-2222-222222222222', 1, 120, 72.00),
('c0c0c0c0-c0c0-c0c0-c0c0-c0c0c0c0c0c0', '80808080-8080-8080-8080-808080808080', '99999999-9999-9999-9999-999999999999', '33333333-3333-3333-3333-333333333333', 1, 60, 30.00),
('d0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d0d0', '90909090-9090-9090-9090-909090909090', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', 1, 90, 50.00),
('e0e0e0e0-e0e0-e0e0-e0e0-e0e0e0e0e0e0', '90909090-9090-9090-9090-909090909090', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 1, 75, 38.00);

-- Appointment products
INSERT INTO appointment_products (id, appointment_id, product_id, staff_user_id, quantity, price, amount) VALUES
('f0f0f0f0-f0f0-f0f0-f0f0-f0f0f0f0f0f0', '70707070-7070-7070-7070-707070707070', '10101010-1010-1010-1010-101010101010', '22222222-2222-2222-2222-222222222222', 1, 25.00, 25.00),
('00000001-0000-0000-0000-000000000001', '80808080-8080-8080-8080-808080808080', '30303030-3030-3030-3030-303030303030', '33333333-3333-3333-3333-333333333333', 1, 15.00, 15.00),
('00000002-0000-0000-0000-000000000002', '90909090-9090-9090-9090-909090909090', '40404040-4040-4040-4040-404040404040', '22222222-2222-2222-2222-222222222222', 1, 40.50, 40.50);

-- Payments
INSERT INTO payments (id, appointment_id, type, method, amount, source, created_at, updated_at) VALUES
('00000003-0000-0000-0000-000000000003', '70707070-7070-7070-7070-707070707070', 'income', 'card', 105.00, 'appointment', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('00000004-0000-0000-0000-000000000004', '80808080-8080-8080-8080-808080808080', 'income', 'cash', 30.00, 'appointment', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- Transactions
INSERT INTO transactions (id, type, amount, appointment_id, customer_name, source, payment_type, status, created_at) VALUES
('00000005-0000-0000-0000-000000000005', 'income', 105.00, '70707070-7070-7070-7070-707070707070', 'Günay Həsənova', 'appointment', 'card', 'approved', NOW() - INTERVAL '5 days'),
('00000006-0000-0000-0000-000000000006', 'income', 30.00, '80808080-8080-8080-8080-808080808080', 'Zeynəb Quliyeva', 'appointment', 'cash', 'approved', NOW() - INTERVAL '1 day'),
('00000007-0000-0000-0000-000000000007', 'expense', 150.00, NULL, NULL, 'supplier', 'bank', 'approved', NOW() - INTERVAL '3 days'),
('00000008-0000-0000-0000-000000000008', 'expense', 75.00, NULL, NULL, 'utilities', 'cash', 'approved', NOW() - INTERVAL '2 days');

-- Contact messages
INSERT INTO contact_messages (id, name, email, phone, subject, message, status, created_at, updated_at) VALUES
('00000009-0000-0000-0000-000000000009', 'Aydan Məmmədova', 'aydan@mail.com', '+994507890123', 'Randevu haqqında', 'Sabah üçün randevu almaq istəyirəm', 'unread', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
('00000010-0000-0000-0000-000000000010', 'Rəna İsmayılova', 'rena@mail.com', '+994508901234', 'Qiymətlər', 'Saç boyama qiymətləri haqqında məlumat almaq istəyirəm', 'read', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- Promo codes
INSERT INTO promo_codes (id, code, discount_percent, valid_from, valid_to, max_usage, created_by, created_at) VALUES
('00000011-0000-0000-0000-000000000011', 'WELCOME10', 10, '2024-06-01', '2024-12-31', 100, '11111111-1111-1111-1111-111111111111', NOW()),
('00000012-0000-0000-0000-000000000012', 'SUMMER20', 20, '2024-06-01', '2024-08-31', 50, '11111111-1111-1111-1111-111111111111', NOW());

-- Settings
INSERT INTO settings (id, key, value, lang, status, created_at, updated_at) VALUES
('00000013-0000-0000-0000-000000000013', 'salon_name', 'Gözəllik Salonu', 'az', true, NOW(), NOW()),
('00000014-0000-0000-0000-000000000014', 'salon_address', 'Bakı şəhəri, Nizami küçəsi 123', 'az', true, NOW(), NOW()),
('00000015-0000-0000-0000-000000000015', 'salon_phone', '+994501234567', 'az', true, NOW(), NOW()),
('00000016-0000-0000-0000-000000000016', 'working_hours', '09:00-19:00', 'az', true, NOW(), NOW()),
('00000017-0000-0000-0000-000000000017', 'booking_advance_days', '30', 'az', true, NOW(), NOW());
