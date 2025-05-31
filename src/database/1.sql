-- Phase 1: Database Reconstruction
-- Step 1: Add missing foreign key constraints and improve schema
-- Add foreign key constraints for better data integrity
ALTER TABLE public.services
ADD CONSTRAINT fk_services_category FOREIGN KEY (category_id) REFERENCES public.service_categories(id) ON DELETE
SET NULL;
ALTER TABLE public.services
ADD CONSTRAINT fk_services_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE public.products
ADD CONSTRAINT fk_products_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE public.staff
ADD CONSTRAINT fk_staff_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE public.appointments
ADD CONSTRAINT fk_appointments_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE
SET NULL;
ALTER TABLE public.appointments
ADD CONSTRAINT fk_appointments_customer FOREIGN KEY (customer_user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE public.appointment_services
ADD CONSTRAINT fk_appointment_services_appointment FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON DELETE CASCADE;
ALTER TABLE public.appointment_services
ADD CONSTRAINT fk_appointment_services_service FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;
ALTER TABLE public.appointment_services
ADD CONSTRAINT fk_appointment_services_staff FOREIGN KEY (staff_user_id) REFERENCES public.users(id) ON DELETE
SET NULL;
ALTER TABLE public.appointment_products
ADD CONSTRAINT fk_appointment_products_appointment FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON DELETE CASCADE;
ALTER TABLE public.appointment_products
ADD CONSTRAINT fk_appointment_products_product FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
ALTER TABLE public.appointment_products
ADD CONSTRAINT fk_appointment_products_staff FOREIGN KEY (staff_user_id) REFERENCES public.users(id) ON DELETE
SET NULL;
ALTER TABLE public.payments
ADD CONSTRAINT fk_payments_appointment FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON DELETE CASCADE;
ALTER TABLE public.invoices
ADD CONSTRAINT fk_invoices_appointment FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON DELETE CASCADE;
ALTER TABLE public.transactions
ADD CONSTRAINT fk_transactions_appointment FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON DELETE
SET NULL;
ALTER TABLE public.service_categories
ADD CONSTRAINT fk_service_categories_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE public.service_products
ADD CONSTRAINT fk_service_products_service FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;
ALTER TABLE public.service_products
ADD CONSTRAINT fk_service_products_product FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
ALTER TABLE public.product_categories
ADD CONSTRAINT fk_product_categories_product FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
ALTER TABLE public.product_categories
ADD CONSTRAINT fk_product_categories_category FOREIGN KEY (category_id) REFERENCES public.service_categories(id) ON DELETE CASCADE;
ALTER TABLE public.staff_availability
ADD CONSTRAINT fk_staff_availability_user FOREIGN KEY (staff_user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE public.promo_codes
ADD CONSTRAINT fk_promo_codes_user FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE
SET NULL;
-- Step 2: Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
-- Step 3: Create security definer functions to avoid infinite recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role() RETURNS role_enum AS $$
SELECT role
FROM public.users
WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;
CREATE OR REPLACE FUNCTION public.is_admin_or_staff() RETURNS BOOLEAN AS $$
SELECT role IN ('super_admin', 'admin', 'staff')
FROM public.users
WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;
CREATE OR REPLACE FUNCTION public.is_super_admin() RETURNS BOOLEAN AS $$
SELECT role = 'super_admin'
FROM public.users
WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;
-- Step 4: Create comprehensive RLS policies
-- Users table policies
CREATE POLICY "Users can view their own profile" ON public.users FOR
SELECT USING (
        id = auth.uid()
        OR public.is_admin_or_staff()
    );
CREATE POLICY "Users can update their own profile" ON public.users FOR
UPDATE USING (
        id = auth.uid()
        OR public.is_admin_or_staff()
    );
CREATE POLICY "Admins can insert users" ON public.users FOR
INSERT WITH CHECK (public.is_admin_or_staff());
CREATE POLICY "Super admins can delete users" ON public.users FOR DELETE USING (public.is_super_admin());
-- Services table policies
CREATE POLICY "Anyone can view services" ON public.services FOR
SELECT USING (true);
CREATE POLICY "Staff can manage services" ON public.services FOR ALL USING (public.is_admin_or_staff());
-- Products table policies
CREATE POLICY "Anyone can view products" ON public.products FOR
SELECT USING (true);
CREATE POLICY "Staff can manage products" ON public.products FOR ALL USING (public.is_admin_or_staff());
-- Staff table policies
CREATE POLICY "Anyone can view staff" ON public.staff FOR
SELECT USING (true);
CREATE POLICY "Admins can manage staff" ON public.staff FOR ALL USING (public.is_admin_or_staff());
-- Appointments table policies
CREATE POLICY "Users can view their appointments" ON public.appointments FOR
SELECT USING (
        customer_user_id = auth.uid()
        OR public.is_admin_or_staff()
    );
CREATE POLICY "Users can create appointments" ON public.appointments FOR
INSERT WITH CHECK (
        customer_user_id = auth.uid()
        OR public.is_admin_or_staff()
    );
CREATE POLICY "Users can update their appointments" ON public.appointments FOR
UPDATE USING (
        customer_user_id = auth.uid()
        OR public.is_admin_or_staff()
    );
CREATE POLICY "Staff can manage all appointments" ON public.appointments FOR DELETE USING (public.is_admin_or_staff());
-- Appointment services policies
CREATE POLICY "View appointment services" ON public.appointment_services FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.appointments a
            WHERE a.id = appointment_id
                AND (
                    a.customer_user_id = auth.uid()
                    OR public.is_admin_or_staff()
                )
        )
    );
CREATE POLICY "Manage appointment services" ON public.appointment_services FOR ALL USING (public.is_admin_or_staff());
-- Appointment products policies
CREATE POLICY "View appointment products" ON public.appointment_products FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.appointments a
            WHERE a.id = appointment_id
                AND (
                    a.customer_user_id = auth.uid()
                    OR public.is_admin_or_staff()
                )
        )
    );
CREATE POLICY "Manage appointment products" ON public.appointment_products FOR ALL USING (public.is_admin_or_staff());
-- Payments policies
CREATE POLICY "View payments" ON public.payments FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.appointments a
            WHERE a.id = appointment_id
                AND (
                    a.customer_user_id = auth.uid()
                    OR public.is_admin_or_staff()
                )
        )
    );
CREATE POLICY "Manage payments" ON public.payments FOR ALL USING (public.is_admin_or_staff());
-- Invoices policies
CREATE POLICY "View invoices" ON public.invoices FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.appointments a
            WHERE a.id = appointment_id
                AND (
                    a.customer_user_id = auth.uid()
                    OR public.is_admin_or_staff()
                )
        )
    );
CREATE POLICY "Manage invoices" ON public.invoices FOR ALL USING (public.is_admin_or_staff());
-- Transactions policies
CREATE POLICY "Staff can view all transactions" ON public.transactions FOR
SELECT USING (public.is_admin_or_staff());
CREATE POLICY "Staff can manage transactions" ON public.transactions FOR ALL USING (public.is_admin_or_staff());
-- Service categories policies
CREATE POLICY "Anyone can view service categories" ON public.service_categories FOR
SELECT USING (true);
CREATE POLICY "Staff can manage service categories" ON public.service_categories FOR ALL USING (public.is_admin_or_staff());
-- Contact messages policies
CREATE POLICY "Staff can view contact messages" ON public.contact_messages FOR
SELECT USING (public.is_admin_or_staff());
CREATE POLICY "Anyone can create contact messages" ON public.contact_messages FOR
INSERT WITH CHECK (true);
CREATE POLICY "Staff can manage contact messages" ON public.contact_messages FOR
UPDATE USING (public.is_admin_or_staff());
CREATE POLICY "Staff can delete contact messages" ON public.contact_messages FOR DELETE USING (public.is_admin_or_staff());
-- Promo codes policies
CREATE POLICY "Staff can view promo codes" ON public.promo_codes FOR
SELECT USING (public.is_admin_or_staff());
CREATE POLICY "Staff can manage promo codes" ON public.promo_codes FOR ALL USING (public.is_admin_or_staff());
-- Settings policies
CREATE POLICY "Anyone can view settings" ON public.settings FOR
SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON public.settings FOR ALL USING (public.is_admin_or_staff());
-- Step 5: Create performance indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_phone ON public.users(email, phone);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_role_active ON public.users(role)
WHERE role != 'customer';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_date_status ON public.appointments(appointment_date, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_customer_date ON public.appointments(customer_user_id, appointment_date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_services_category_active ON public.services(category_id)
WHERE category_id IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_stock ON public.products(stock)
WHERE stock > 0;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_staff_specializations ON public.staff USING GIN(specializations);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointment_services_composite ON public.appointment_services(appointment_id, service_id, staff_user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointment_products_composite ON public.appointment_products(appointment_id, product_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_appointment_method ON public.payments(appointment_id, method);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_date_type ON public.transactions(created_at, type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_settings_key_lang_active ON public.settings(key, lang)
WHERE status = true;
-- Step 6: Create advanced database functions
CREATE OR REPLACE FUNCTION public.get_staff_availability(staff_id UUID, check_date DATE) RETURNS TABLE(
        available BOOLEAN,
        start_time TIME,
        end_time TIME
    ) AS $$ BEGIN RETURN QUERY
SELECT CASE
        WHEN sa.staff_user_id IS NOT NULL THEN true
        ELSE false
    END as available,
    sa.start_time,
    sa.end_time
FROM public.staff_availability sa
WHERE sa.staff_user_id = staff_id
    AND sa.weekday = EXTRACT(
        dow
        FROM check_date
    )::integer;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE FUNCTION public.check_staff_booking_conflict(
        staff_id UUID,
        appointment_date DATE,
        start_time TIME,
        end_time TIME,
        exclude_appointment_id INTEGER DEFAULT NULL
    ) RETURNS BOOLEAN AS $$
DECLARE conflict_count INTEGER;
BEGIN
SELECT COUNT(*) INTO conflict_count
FROM public.appointments a
    JOIN public.appointment_services as_table ON a.id = as_table.appointment_id
WHERE as_table.staff_user_id = staff_id
    AND a.appointment_date = appointment_date
    AND a.status NOT IN ('cancelled', 'no_show')
    AND (
        (
            a.start_time <= start_time
            AND a.end_time > start_time
        )
        OR (
            a.start_time < end_time
            AND a.end_time >= end_time
        )
        OR (
            start_time <= a.start_time
            AND end_time >= a.end_time
        )
    )
    AND (
        exclude_appointment_id IS NULL
        OR a.id != exclude_appointment_id
    );
RETURN conflict_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE FUNCTION public.get_appointment_summary(appointment_id INTEGER) RETURNS TABLE(
        appointment_info JSONB,
        services_info JSONB,
        products_info JSONB,
        payment_info JSONB
    ) AS $$ BEGIN RETURN QUERY
SELECT to_jsonb(a.*) as appointment_info,
    COALESCE(
        (
            SELECT jsonb_agg(
                    jsonb_build_object(
                        'service',
                        to_jsonb(s.*),
                        'staff',
                        to_jsonb(u.*),
                        'quantity',
                        aps.quantity,
                        'price',
                        aps.price,
                        'duration',
                        aps.duration
                    )
                )
            FROM public.appointment_services aps
                JOIN public.services s ON s.id = aps.service_id
                LEFT JOIN public.users u ON u.id = aps.staff_user_id
            WHERE aps.appointment_id = get_appointment_summary.appointment_id
        ),
        '[]'::jsonb
    ) as services_info,
    COALESCE(
        (
            SELECT jsonb_agg(
                    jsonb_build_object(
                        'product',
                        to_jsonb(p.*),
                        'quantity',
                        app.quantity,
                        'price',
                        app.price,
                        'amount',
                        app.amount
                    )
                )
            FROM public.appointment_products app
                JOIN public.products p ON p.id = app.product_id
            WHERE app.appointment_id = get_appointment_summary.appointment_id
        ),
        '[]'::jsonb
    ) as products_info,
    COALESCE(
        (
            SELECT jsonb_agg(to_jsonb(pay.*))
            FROM public.payments pay
            WHERE pay.appointment_id = get_appointment_summary.appointment_id
        ),
        '[]'::jsonb
    ) as payment_info
FROM public.appointments a
WHERE a.id = get_appointment_summary.appointment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Step 7: Create real-time subscriptions setup
ALTER TABLE public.appointments REPLICA IDENTITY FULL;
ALTER TABLE public.appointment_services REPLICA IDENTITY FULL;
ALTER TABLE public.appointment_products REPLICA IDENTITY FULL;
ALTER TABLE public.payments REPLICA IDENTITY FULL;
ALTER TABLE public.transactions REPLICA IDENTITY FULL;
-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime
ADD TABLE public.appointments;
ALTER PUBLICATION supabase_realtime
ADD TABLE public.appointment_services;
ALTER PUBLICATION supabase_realtime
ADD TABLE public.appointment_products;
ALTER PUBLICATION supabase_realtime
ADD TABLE public.payments;
ALTER PUBLICATION supabase_realtime
ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime
ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime
ADD TABLE public.services;
ALTER PUBLICATION supabase_realtime
ADD TABLE public.products;
-- Step 8: Create data validation triggers
CREATE OR REPLACE FUNCTION public.validate_appointment_time() RETURNS TRIGGER AS $$ BEGIN -- Check if start_time is before end_time
    IF NEW.start_time >= NEW.end_time THEN RAISE EXCEPTION 'Start time must be before end time';
END IF;
-- Check if appointment is not in the past
IF NEW.appointment_date < CURRENT_DATE
OR (
    NEW.appointment_date = CURRENT_DATE
    AND NEW.start_time < CURRENT_TIME
) THEN RAISE EXCEPTION 'Cannot create appointments in the past';
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER validate_appointment_time_trigger BEFORE
INSERT
    OR
UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.validate_appointment_time();
CREATE OR REPLACE FUNCTION public.validate_product_stock() RETURNS TRIGGER AS $$ BEGIN IF NEW.stock < 0 THEN RAISE EXCEPTION 'Product stock cannot be negative';
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER validate_product_stock_trigger BEFORE
INSERT
    OR
UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.validate_product_stock();