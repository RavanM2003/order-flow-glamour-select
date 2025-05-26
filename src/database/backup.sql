
-- ================================
-- DATABASE BACKUP AND RESTORE SCRIPT
-- ================================

-- Bu fayl məlumat bazasının backup və restore əməliyyatları üçündür

-- BACKUP COMMANDS
-- ================================

-- Bütün məlumat bazasının backup-ı
-- pg_dump -h localhost -U postgres -d salon_db > backup_full.sql

-- Yalnız schema backup-ı
-- pg_dump -h localhost -U postgres -d salon_db --schema-only > backup_schema.sql

-- Yalnız data backup-ı
-- pg_dump -h localhost -U postgres -d salon_db --data-only > backup_data.sql

-- Müəyyən cədvəllərin backup-ı
-- pg_dump -h localhost -U postgres -d salon_db -t users -t appointments > backup_specific.sql

-- RESTORE COMMANDS
-- ================================

-- Backup-dan restore etmək
-- psql -h localhost -U postgres -d salon_db < backup_full.sql

-- CLEANUP COMMANDS (təhlükəli!)
-- ================================

-- Bütün cədvəlləri təmizləmək (test üçün)
/*
TRUNCATE TABLE public.appointment_products CASCADE;
TRUNCATE TABLE public.appointment_services CASCADE;
TRUNCATE TABLE public.appointments CASCADE;
TRUNCATE TABLE public.service_products CASCADE;
TRUNCATE TABLE public.product_categories CASCADE;
TRUNCATE TABLE public.payments CASCADE;
TRUNCATE TABLE public.transactions CASCADE;
TRUNCATE TABLE public.invoices CASCADE;
TRUNCATE TABLE public.contact_messages CASCADE;
TRUNCATE TABLE public.promo_codes CASCADE;
TRUNCATE TABLE public.staff_availability CASCADE;
TRUNCATE TABLE public.staff CASCADE;
TRUNCATE TABLE public.products CASCADE;
TRUNCATE TABLE public.services CASCADE;
TRUNCATE TABLE public.service_categories CASCADE;
TRUNCATE TABLE public.users CASCADE;
TRUNCATE TABLE public.histories CASCADE;
TRUNCATE TABLE public.settings CASCADE;
TRUNCATE TABLE public.settings_backup CASCADE;
*/

-- DATABASE MAINTENANCE
-- ================================

-- İndeksləri yenidən yaratmaq
REINDEX DATABASE salon_db;

-- Statistikları yeniləmək
ANALYZE;

-- Vakuum əməliyyatı (performans üçün)
VACUUM FULL;

-- PERFORMANCE MONITORING QUERIES
-- ================================

-- Ən çox istifadə olunan cədvəllər
SELECT schemaname, tablename, seq_scan, seq_tup_read, idx_scan, idx_tup_fetch
FROM pg_stat_user_tables
ORDER BY seq_tup_read DESC;

-- Slow query-ləri tapmaq
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Database ölçüsü
SELECT pg_size_pretty(pg_database_size('salon_db')) as database_size;

-- Hər cədvəlin ölçüsü
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
