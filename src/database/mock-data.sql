
-- ================================
-- MOCK DATA FOR SALON MANAGEMENT SYSTEM
-- ================================

-- Clear existing data
TRUNCATE TABLE public.users CASCADE;

-- Insert users with UUIDs
INSERT INTO public.users (id, email, full_name, role, gender, phone, hashed_password, first_name, last_name, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@salon.com', 'Salon Administrator', 'admin', 'male', '+994501234567', 'admin123', 'Salon', 'Administrator', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'staff1@salon.com', 'Aysel Məmmədova', 'staff', 'female', '+994502345678', 'staff123', 'Aysel', 'Məmmədova', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'staff2@salon.com', 'Nigar Əliyeva', 'staff', 'female', '+994503456789', 'staff123', 'Nigar', 'Əliyeva', NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'customer1@mail.com', 'Günay Həsənova', 'customer', 'female', '+994504567890', 'customer123', 'Günay', 'Həsənova', NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'customer2@mail.com', 'Zeynəb Quliyeva', 'customer', 'female', '+994505678901', 'customer123', 'Zeynəb', 'Quliyeva', NOW(), NOW()),
('66666666-6666-6666-6666-666666666666', 'customer3@mail.com', 'Leyla Rəhimova', 'customer', 'female', '+994506789012', 'customer123', 'Leyla', 'Rəhimova', NOW(), NOW()),
('77777777-7777-7777-7777-777777777777', 'customer4@mail.com', 'Səbinə Nəzərova', 'customer', 'female', '+994507890123', 'customer123', 'Səbinə', 'Nəzərova', NOW(), NOW()),
('88888888-8888-8888-8888-888888888888', 'customer5@mail.com', 'Arzu Həsənli', 'customer', 'female', '+994508901234', 'customer123', 'Arzu', 'Həsənli', NOW(), NOW());

-- Service categories
INSERT INTO public.service_categories (id, name, user_id, created_at, updated_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Saç Xidmətləri', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Dırnaq Xidmətləri', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Üz Baxımı', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Bədən Baxımı', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Masaj Xidmətləri', '11111111-1111-1111-1111-111111111111', NOW(), NOW());

-- Services with UUID
INSERT INTO public.services (id, name, description, duration, price, category_id, user_id, benefits, discount, created_at, updated_at) VALUES
('11110000-1111-1111-1111-111111111111', 'Saç Kəsilməsi', 'Peşəkar saç kəsilməsi xidməti', 45, 25.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', ARRAY['Təmiz görünüş', 'Peşəkar stil'], 0, NOW(), NOW()),
('22220000-2222-2222-2222-222222222222', 'Saç Boyası', 'Saç boyama və renk dəyişdirmə', 120, 80.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', ARRAY['Yeni görünüş', 'Rəng dəyişikliyi'], 10, NOW(), NOW()),
('33330000-3333-3333-3333-333333333333', 'Manikür', 'Əl və dırnaq baxımı', 60, 30.00, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', ARRAY['Gözəl dırnaqlar', 'Uzun davamlı'], 0, NOW(), NOW()),
('44440000-4444-4444-4444-444444444444', 'Pedikür', 'Ayaq və dırnaq baxımı', 75, 40.00, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', ARRAY['Təmiz ayaqlar', 'Rahat hiss'], 5, NOW(), NOW()),
('55550000-5555-5555-5555-555555555555', 'Üz Maskası', 'Dərinə təmizləmə və nəmləndirmə', 90, 50.00, 'cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', ARRAY['Təmiz dəri', 'Gənclik'], 0, NOW(), NOW()),
('66660000-6666-6666-6666-666666666666', 'Saç Yuyulması', 'Professional saç yuyulması', 30, 15.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', ARRAY['Təmiz saç', 'Fresh görünüş'], 0, NOW(), NOW()),
('77770000-7777-7777-7777-777777777777', 'Qaş Düzəldilməsi', 'Qaş forması və dizaynı', 30, 20.00, 'cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', ARRAY['Gözəl forma', 'Düzgün dizayn'], 0, NOW(), NOW()),
('88880000-8888-8888-8888-888888888888', 'Aromaterapi Masajı', 'Relaksasiya və dinclik masajı', 90, 70.00, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', ARRAY['Relaksasiya', 'Stress azaldır'], 15, NOW(), NOW());

-- Products with UUID
INSERT INTO public.products (id, name, description, price, stock, user_id, discount, details, ingredients, how_to_use, created_at, updated_at) VALUES
('10101010-1010-1010-1010-101010101010', 'Saç Şampunu', 'Təbii tərkibli şampun', 25.00, 50, '11111111-1111-1111-1111-111111111111', 0, 'Bütün saç tipləri üçün', 'Argan yağı, Keratin', 'Yaş saça tətbiq edin və masaj edin', NOW(), NOW()),
('20202020-2020-2020-2020-202020202020', 'Saç Kremi', 'Nəmləndirici saç kremi', 30.00, 40, '11111111-1111-1111-1111-111111111111', 5, 'Quru saçlar üçün', 'Shea yağı, Vitamin E', 'Şampundan sonra saça tətbiq edin', NOW(), NOW()),
('30303030-3030-3030-3030-303030303030', 'Dırnaq Lakı', 'Uzun davamlı dırnaq lakı', 15.00, 60, '11111111-1111-1111-1111-111111111111', 0, '20+ rəng seçimi', 'Təbii rənglər', 'Təmiz dırnağa 2 qat çəkin', NOW(), NOW()),
('40404040-4040-4040-4040-404040404040', 'Üz Kremi', 'Anti-aging üz kremi', 45.00, 30, '11111111-1111-1111-1111-111111111111', 10, 'Qırışları azaldır', 'Retinol, Hyaluronic acid', 'Təmiz üzə gecə tətbiq edin', NOW(), NOW()),
('50505050-5050-5050-5050-505050505050', 'Saç Yağı', 'Təbii argan yağı', 35.00, 25, '11111111-1111-1111-1111-111111111111', 0, 'Saç uçları üçün', '100% argan yağı', 'Saç uclarına az miqdarda çəkin', NOW(), NOW()),
('60606060-6060-6060-6060-606606060606', 'Qaş Qələmi', 'Uzun davamlı qaş qələmi', 20.00, 45, '11111111-1111-1111-1111-111111111111', 0, 'Su keçirməz', 'Mineral pigmentlər', 'Qaş xəttini çəkin', NOW(), NOW()),
('70707070-7070-7070-7070-707070707070', 'Masaj Yağı', 'Aromaterapi masaj yağı', 40.00, 20, '11111111-1111-1111-1111-111111111111', 5, 'Lavanda ətri', 'Lavanda, jojoba yağı', 'Dəriyə masaj edərkən istifadə edin', NOW(), NOW());

-- Staff with UUID
INSERT INTO public.staff (id, user_id, position, specializations, created_at, updated_at) VALUES
('aaaa0000-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Baş Stilist', ARRAY['11110000-1111-1111-1111-111111111111', '22220000-2222-2222-2222-222222222222', '55550000-5555-5555-5555-555555555555', '66660000-6666-6666-6666-666666666666', '88880000-8888-8888-8888-888888888888'], NOW(), NOW()),
('bbbb0000-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'Manikür Ustası', ARRAY['33330000-3333-3333-3333-333333333333', '44440000-4444-4444-4444-444444444444', '77770000-7777-7777-7777-777777777777'], NOW(), NOW());

-- Staff availability
INSERT INTO public.staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
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
INSERT INTO public.service_products (service_id, product_id) VALUES
('11110000-1111-1111-1111-111111111111', '10101010-1010-1010-1010-101010101010'),
('11110000-1111-1111-1111-111111111111', '20202020-2020-2020-2020-202020202020'),
('22220000-2222-2222-2222-222222222222', '10101010-1010-1010-1010-101010101010'),
('22220000-2222-2222-2222-222222222222', '20202020-2020-2020-2020-202020202020'),
('22220000-2222-2222-2222-222222222222', '50505050-5050-5050-5050-505050505050'),
('33330000-3333-3333-3333-333333333333', '30303030-3030-3030-3030-303030303030'),
('44440000-4444-4444-4444-444444444444', '30303030-3030-3030-3030-303030303030'),
('55550000-5555-5555-5555-555555555555', '40404040-4040-4040-4040-404040404040'),
('66660000-6666-6666-6666-666666666666', '10101010-1010-1010-1010-101010101010'),
('77770000-7777-7777-7777-777777777777', '60606060-6060-6060-6060-606606060606'),
('88880000-8888-8888-8888-888888888888', '70707070-7070-7070-7070-707070707070');

-- Appointments with UUID
INSERT INTO public.appointments (id, customer_user_id, appointment_date, start_time, end_time, status, total, user_id, notes, created_at, updated_at) VALUES
('a1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', '2024-01-15', '10:00', '11:15', 'completed', 97.00, '22222222-2222-2222-2222-222222222222', 'Müştəri saç rəngi ilə çox razı qaldı', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
('a2222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', '2024-01-20', '14:00', '15:00', 'completed', 30.00, '33333333-3333-3333-3333-333333333333', 'Gözəl manikür edildi', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
('a3333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', '2024-02-05', '11:00', '12:30', 'completed', 88.00, '22222222-2222-2222-2222-222222222222', 'Üz maskası çox faydalı oldu', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
('a4444444-4444-4444-4444-444444444444', '77777777-7777-7777-7777-777777777777', '2024-02-10', '15:00', '16:15', 'completed', 38.00, '33333333-3333-3333-3333-333333333333', 'Pedikür çox rahatladıcı idi', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
('a5555555-5555-5555-5555-555555555555', '88888888-8888-8888-8888-888888888888', '2024-02-15', '16:00', '17:30', 'confirmed', 59.50, '22222222-2222-2222-2222-222222222222', NULL, NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days'),
('a6666666-6666-6666-6666-666666666666', '44444444-4444-4444-4444-444444444444', '2024-02-20', '12:00', '13:00', 'pending', 25.00, '22222222-2222-2222-2222-222222222222', NULL, NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days');

-- Appointment services with UUID
INSERT INTO public.appointment_services (id, appointment_id, service_id, staff_user_id, quantity, duration, price) VALUES
('s1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', '11110000-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 1, 45, 25.00),
('s2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', '22220000-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 1, 120, 72.00),
('s3333333-3333-3333-3333-333333333333', 'a2222222-2222-2222-2222-222222222222', '33330000-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 1, 60, 30.00),
('s4444444-4444-4444-4444-444444444444', 'a3333333-3333-3333-3333-333333333333', '55550000-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 1, 90, 50.00),
('s5555555-5555-5555-5555-555555555555', 'a4444444-4444-4444-4444-444444444444', '44440000-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 1, 75, 38.00),
('s6666666-6666-6666-6666-666666666666', 'a5555555-5555-5555-5555-555555555555', '88880000-8888-8888-8888-888888888888', '22222222-2222-2222-2222-222222222222', 1, 90, 59.50),
('s7777777-7777-7777-7777-777777777777', 'a6666666-6666-6666-6666-666666666666', '11110000-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 1, 45, 25.00);

-- Appointment products with UUID
INSERT INTO public.appointment_products (id, appointment_id, product_id, staff_user_id, quantity, price, amount) VALUES
('p1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', '10101010-1010-1010-1010-101010101010', '22222222-2222-2222-2222-222222222222', 1, 25.00, 25.00),
('p2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', '30303030-3030-3030-3030-303030303030', '33333333-3333-3333-3333-333333333333', 1, 15.00, 15.00),
('p3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', '40404040-4040-4040-4040-404040404040', '22222222-2222-2222-2222-222222222222', 1, 40.50, 40.50),
('p4444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444444', '30303030-3030-3030-3030-303030303030', '33333333-3333-3333-3333-333333333333', 1, 15.00, 15.00);

-- Payments with UUID
INSERT INTO public.payments (id, appointment_id, type, method, amount, source, created_at, updated_at) VALUES
('pay11111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'income', 'card', 97.00, 'appointment', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
('pay22222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'income', 'cash', 30.00, 'appointment', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
('pay33333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 'income', 'card', 88.00, 'appointment', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
('pay44444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444444', 'income', 'cash', 38.00, 'appointment', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days');

-- Transactions with UUID
INSERT INTO public.transactions (id, type, amount, appointment_id, customer_name, source, payment_type, status, category, description, created_at) VALUES
('tr111111-1111-1111-1111-111111111111', 'income', 97.00, 'a1111111-1111-1111-1111-111111111111', 'Günay Həsənova', 'appointment', 'card', 'approved', 'service', 'Saç kəsilməsi və boyama', NOW() - INTERVAL '30 days'),
('tr222222-2222-2222-2222-222222222222', 'income', 30.00, 'a2222222-2222-2222-2222-222222222222', 'Zeynəb Quliyeva', 'appointment', 'cash', 'approved', 'service', 'Manikür xidməti', NOW() - INTERVAL '25 days'),
('tr333333-3333-3333-3333-333333333333', 'income', 88.00, 'a3333333-3333-3333-3333-333333333333', 'Leyla Rəhimova', 'appointment', 'card', 'approved', 'service', 'Üz maskası və üz kremi', NOW() - INTERVAL '15 days'),
('tr444444-4444-4444-4444-444444444444', 'income', 38.00, 'a4444444-4444-4444-4444-444444444444', 'Səbinə Nəzərova', 'appointment', 'cash', 'approved', 'service', 'Pedikür xidməti', NOW() - INTERVAL '10 days'),
('tr555555-5555-5555-5555-555555555555', 'expense', 150.00, NULL, NULL, 'supplier', 'bank', 'approved', 'product', 'Məhsul alışı', NOW() - INTERVAL '7 days'),
('tr666666-6666-6666-6666-666666666666', 'expense', 75.00, NULL, NULL, 'utilities', 'cash', 'approved', 'operational', 'Kommunal xərclər', NOW() - INTERVAL '5 days'),
('tr777777-7777-7777-7777-777777777777', 'expense', 200.00, NULL, NULL, 'rent', 'bank', 'approved', 'operational', 'İcarə haqqı', NOW() - INTERVAL '3 days');

-- Contact messages with UUID
INSERT INTO public.contact_messages (id, name, email, phone, subject, message, status, created_at, updated_at) VALUES
('msg11111-1111-1111-1111-111111111111', 'Aydan Məmmədova', 'aydan@mail.com', '+994507890123', 'Randevu haqqında', 'Sabah üçün randevu almaq istəyirəm. Manikür xidməti lazımdır.', 'unread', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
('msg22222-2222-2222-2222-222222222222', 'Rəna İsmayılova', 'rena@mail.com', '+994508901234', 'Qiymətlər', 'Saç boyama qiymətləri haqqında məlumat almaq istəyirəm', 'read', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('msg33333-3333-3333-3333-333333333333', 'Mələk Əliyeva', 'melek@mail.com', '+994509012345', 'Xidmət vaxtları', 'Həftə sonları açıqsınızmı?', 'read', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days');

-- Promo codes with UUID
INSERT INTO public.promo_codes (id, code, discount_percent, valid_from, valid_to, max_usage, created_by, created_at) VALUES
('promo111-1111-1111-1111-111111111111', 'WELCOME10', 10, '2024-01-01', '2024-12-31', 100, '11111111-1111-1111-1111-111111111111', NOW()),
('promo222-2222-2222-2222-222222222222', 'SUMMER20', 20, '2024-06-01', '2024-08-31', 50, '11111111-1111-1111-1111-111111111111', NOW()),
('promo333-3333-3333-3333-333333333333', 'NEWCLIENT15', 15, '2024-01-01', '2024-12-31', 200, '11111111-1111-1111-1111-111111111111', NOW()),
('promo444-4444-4444-4444-444444444444', 'BIRTHDAY25', 25, '2024-01-01', '2024-12-31', 30, '11111111-1111-1111-1111-111111111111', NOW());

-- Settings with UUID
INSERT INTO public.settings (id, key, value, lang, status, created_at, updated_at) VALUES
('set11111-1111-1111-1111-111111111111', 'salon_name', 'Gözəllik Salonu', 'az', true, NOW(), NOW()),
('set22222-2222-2222-2222-222222222222', 'salon_address', 'Bakı şəhəri, Nizami küçəsi 123', 'az', true, NOW(), NOW()),
('set33333-3333-3333-3333-333333333333', 'salon_phone', '+994501234567', 'az', true, NOW(), NOW()),
('set44444-4444-4444-4444-444444444444', 'working_hours', '09:00-19:00', 'az', true, NOW(), NOW()),
('set55555-5555-5555-5555-555555555555', 'booking_advance_days', '30', 'az', true, NOW(), NOW()),
('set66666-6666-6666-6666-666666666666', 'salon_description', 'Professional gözəllik və sağlamlıq xidmətləri', 'az', true, NOW(), NOW()),
('set77777-7777-7777-7777-777777777777', 'social_instagram', '@gozellliksalonu', 'az', true, NOW(), NOW()),
('set88888-8888-8888-8888-888888888888', 'social_facebook', 'Gözəllik Salonu Bakı', 'az', true, NOW(), NOW()),
('set99999-9999-9999-9999-999999999999', 'email', 'info@gozellliksalonu.az', 'az', true, NOW(), NOW()),
('set10101-1010-1010-1010-101010101010', 'currency', 'AZN', 'az', true, NOW(), NOW()),
('set11011-1101-1101-1101-110110110110', 'salon_name', 'Beauty Salon', 'en', true, NOW(), NOW()),
('set12121-1212-1212-1212-121212121212', 'salon_address', 'Baku city, Nizami street 123', 'en', true, NOW(), NOW()),
('set13131-1313-1313-1313-131313131313', 'salon_description', 'Professional beauty and wellness services', 'en', true, NOW(), NOW());

-- Sample invoices
INSERT INTO public.invoices (id, appointment_id, invoice_number, total_amount, status, appointment_status, issued_at) VALUES
('inv11111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'INV-2024-001', 97.00, 'paid', 'completed', NOW() - INTERVAL '30 days'),
('inv22222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'INV-2024-002', 30.00, 'paid', 'completed', NOW() - INTERVAL '25 days'),
('inv33333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 'INV-2024-003', 88.00, 'paid', 'completed', NOW() - INTERVAL '15 days');
