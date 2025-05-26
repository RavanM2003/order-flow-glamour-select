
-- ================================
-- ADDITIONAL INDEXES FOR PERFORMANCE
-- ================================

-- Bu fayl performansı artırmaq üçün əlavə indekslər təqdim edir

-- Composite indexes for common queries
-- ================================

-- Users cədvəli üçün
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_role ON public.users(email, role);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_phone_role ON public.users(phone, role);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_full_name_gin ON public.users USING gin(to_tsvector('english', full_name));

-- Appointments cədvəli üçün
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_date_status ON public.appointments(appointment_date, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_customer_date ON public.appointments(customer_user_id, appointment_date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_staff_date ON public.appointments(user_id, appointment_date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_date_range ON public.appointments(appointment_date, start_time, end_time);

-- Services və Products üçün
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_services_category_price ON public.services(category_id, price);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_services_name_gin ON public.services USING gin(to_tsvector('english', name));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_price_stock ON public.products(price, stock);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_name_gin ON public.products USING gin(to_tsvector('english', name));

-- Financial tables üçün
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_method_date ON public.payments(method, created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_type_date ON public.transactions(type, created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_amount_date ON public.transactions(amount, created_at);

-- Staff availability üçün
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_staff_availability_weekday_time ON public.staff_availability(weekday, start_time, end_time);

-- Appointment services və products üçün
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointment_services_multi ON public.appointment_services(appointment_id, service_id, staff_user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointment_products_multi ON public.appointment_products(appointment_id, product_id, staff_user_id);

-- Search indexes
-- ================================

-- Full-text search üçün
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_search ON public.users USING gin(
    to_tsvector('english', coalesce(full_name, '') || ' ' || coalesce(email, '') || ' ' || coalesce(phone, ''))
);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_services_search ON public.services USING gin(
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_search ON public.products USING gin(
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(details, ''))
);

-- Partial indexes for specific conditions
-- ================================

-- Yalnız aktiv appointment-lər üçün
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_active ON public.appointments(appointment_date, start_time) 
WHERE status IN ('pending', 'confirmed', 'in_progress');

-- Yalnız stokda olan məhsullar üçün
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_in_stock ON public.products(name, price) 
WHERE stock > 0;

-- Yalnız aktiv promo code-lar üçün
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_promo_codes_active ON public.promo_codes(code, discount_percent) 
WHERE valid_to >= CURRENT_DATE;

-- Yalnız oxunmamış mesajlar üçün
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_contact_messages_unread ON public.contact_messages(created_at) 
WHERE status = 'unread';

-- BRIN indexes for large tables with time-based data
-- ================================

-- Tarixi məlumatlar üçün BRIN index (daha az yer tutur)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_histories_created_at_brin ON public.histories USING brin(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_created_at_brin ON public.transactions USING brin(created_at);

-- Performance monitoring
-- ================================

-- Index istifadəsini yoxlamaq üçün query
/*
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
*/

-- Istifadə olunmayan indeksləri tapmaq
/*
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan
FROM pg_stat_user_indexes 
WHERE schemaname = 'public' AND idx_scan = 0
ORDER BY tablename, indexname;
*/
