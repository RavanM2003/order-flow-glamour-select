
-- ================================
-- COMPLETE DATABASE SCHEMA EXPORT
-- ================================

-- ENUMS
-- ================================

-- Create gender enum
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other');

-- Create role enum  
CREATE TYPE role_enum AS ENUM (
    'cash',
    'customer', 
    'super_admin',
    'admin',
    'staff',
    'appointment',
    'reception',
    'service',
    'product'
);

-- Create appointment status enum
CREATE TYPE appointment_status AS ENUM (
    'pending',
    'confirmed', 
    'cancelled',
    'rescheduled',
    'in_progress',
    'completed',
    'no_show',
    'awaiting_payment',
    'paid'
);

-- Create payment method enum
CREATE TYPE payment_method AS ENUM (
    'cash',
    'card', 
    'bank',
    'pos',
    'discount',
    'promo_code'
);

-- Create payment type enum
CREATE TYPE payment_type AS ENUM ('income', 'expense');

-- Create action enum for history tracking
CREATE TYPE action_enum AS ENUM ('INSERT', 'UPDATE', 'DELETE');

-- TABLES
-- ================================

-- Users table
CREATE TABLE public.users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    photo_url TEXT,
    birth_date DATE,
    phone TEXT NOT NULL,
    hashed_password TEXT NOT NULL,
    note TEXT,
    gender gender_enum,
    role role_enum DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Service categories table
CREATE TABLE public.service_categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    user_id UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Services table
CREATE TABLE public.services (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL DEFAULT 30,
    price NUMERIC NOT NULL DEFAULT 0,
    discount NUMERIC DEFAULT 0,
    benefits TEXT[],
    category_id UUID REFERENCES public.service_categories(id),
    user_id UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Products table
CREATE TABLE public.products (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    stock INTEGER NOT NULL,
    discount NUMERIC DEFAULT 0,
    details TEXT,
    ingredients TEXT,
    how_to_use TEXT,
    user_id UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Staff table
CREATE TABLE public.staff (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    position TEXT,
    specializations TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Staff availability table
CREATE TABLE public.staff_availability (
    staff_user_id UUID NOT NULL REFERENCES public.users(id),
    weekday INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    PRIMARY KEY (staff_user_id, weekday)
);

-- Appointments table
CREATE TABLE public.appointments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    customer_user_id UUID REFERENCES public.users(id),
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total NUMERIC,
    status appointment_status DEFAULT 'pending',
    is_no_show BOOLEAN DEFAULT false,
    notes TEXT,
    cancel_reason TEXT,
    new_id UUID DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Appointment services table
CREATE TABLE public.appointment_services (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    appointment_id UUID REFERENCES public.appointments(id),
    service_id UUID REFERENCES public.services(id),
    staff_user_id UUID REFERENCES public.users(id),
    quantity INTEGER DEFAULT 1,
    duration INTEGER,
    price NUMERIC
);

-- Appointment products table
CREATE TABLE public.appointment_products (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    appointment_id UUID REFERENCES public.appointments(id),
    product_id UUID REFERENCES public.products(id),
    staff_user_id UUID REFERENCES public.users(id),
    quantity INTEGER,
    price NUMERIC,
    amount NUMERIC
);

-- Service products relationship table
CREATE TABLE public.service_products (
    service_id UUID NOT NULL REFERENCES public.services(id),
    product_id UUID NOT NULL REFERENCES public.products(id),
    PRIMARY KEY (service_id, product_id)
);

-- Product categories relationship table
CREATE TABLE public.product_categories (
    product_id UUID NOT NULL REFERENCES public.products(id),
    category_id UUID NOT NULL REFERENCES public.service_categories(id),
    PRIMARY KEY (product_id, category_id)
);

-- Payments table
CREATE TABLE public.payments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    appointment_id UUID REFERENCES public.appointments(id),
    type payment_type NOT NULL,
    method payment_method NOT NULL,
    amount NUMERIC NOT NULL,
    source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Invoices table
CREATE TABLE public.invoices (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    appointment_id UUID REFERENCES public.appointments(id),
    invoice_number TEXT NOT NULL,
    total_amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'waiting',
    appointment_json JSONB,
    appointment_status CHARACTER VARYING,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Transactions table
CREATE TABLE public.transactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    appointment_id UUID REFERENCES public.appointments(id),
    customer_name TEXT,
    source TEXT,
    payment_type TEXT,
    status TEXT,
    category TEXT,
    description TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Contact messages table
CREATE TABLE public.contact_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Promo codes table
CREATE TABLE public.promo_codes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL,
    discount_percent INTEGER,
    valid_from DATE,
    valid_to DATE,
    max_usage INTEGER,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Settings table
CREATE TABLE public.settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    lang TEXT NOT NULL DEFAULT 'az',
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Settings backup table
CREATE TABLE public.settings_backup (
    id UUID,
    key TEXT,
    value JSONB,
    status BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Histories table
CREATE TABLE public.histories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name TEXT NOT NULL,
    source_id TEXT NOT NULL,
    action action_enum DEFAULT 'UPDATE',
    history JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- VIEWS
-- ================================

-- Staff with services JSON view
CREATE VIEW public.staff_with_services_json AS
SELECT 
    s.user_id,
    json_build_object(
        'id', u.id,
        'full_name', u.full_name,
        'email', u.email,
        'phone', u.phone,
        'avatar_url', u.avatar_url,
        'role', u.role
    ) as user,
    json_agg(
        json_build_object(
            'id', s.id,
            'position', s.position,
            'specializations', s.specializations
        )
    ) as positions
FROM public.staff s
JOIN public.users u ON u.id = s.user_id
GROUP BY s.user_id, u.id, u.full_name, u.email, u.phone, u.avatar_url, u.role;

-- FUNCTIONS
-- ================================

-- Function to log history changes
CREATE OR REPLACE FUNCTION public.log_history()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.histories(table_name, source_id, action, history)
  VALUES (TG_TABLE_NAME, OLD.id::TEXT, TG_OP::action_enum, to_jsonb(OLD));
  RETURN NEW;
END;
$$;

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN 
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$;

-- Function to get staff by service
CREATE OR REPLACE FUNCTION public.get_staff_by_service(service_id UUID)
RETURNS TABLE(user_id UUID, full_name TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.full_name
  FROM public.staff s
  JOIN public.users u ON u.id = s.user_id
  WHERE service_id::TEXT = ANY(s.specializations);
END;
$$;

-- Function to update timestamp
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$;

-- Function to create invoice with appointment
CREATE OR REPLACE FUNCTION public.create_invoice_with_appointment(
    p_invoice_number TEXT, 
    p_total_amount NUMERIC, 
    p_status TEXT, 
    p_appointment_json JSONB
)
RETURNS TABLE(
    id UUID, 
    invoice_number TEXT, 
    total_amount NUMERIC, 
    status TEXT, 
    appointment_json JSONB, 
    appointment_id UUID, 
    issued_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO public.invoices (invoice_number, total_amount, status, appointment_json)
  VALUES (p_invoice_number, p_total_amount, p_status, p_appointment_json)
  RETURNING invoices.id, invoices.invoice_number, invoices.total_amount, 
            invoices.status, invoices.appointment_json, invoices.appointment_id, invoices.issued_at;
END;
$$;

-- Function to get available staff by service and date
CREATE OR REPLACE FUNCTION public.get_available_staff_by_service_and_date(
    service_id UUID, 
    reservation_date DATE
)
RETURNS TABLE(user_id UUID, full_name TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.full_name
  FROM public.staff s
  JOIN public.users u ON u.id = s.user_id
  LEFT JOIN public.staff_availability sa ON sa.staff_user_id = s.user_id
  WHERE service_id::TEXT = ANY(s.specializations)
    AND (
      sa.weekday IS NULL 
      OR sa.weekday = EXTRACT(dow FROM reservation_date)::INT
    )
    AND u.role = 'staff'
  GROUP BY u.id, u.full_name;
END;
$$;

-- Function to update transactions updated_at
CREATE OR REPLACE FUNCTION public.update_transactions_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.created_at = NOW();
    RETURN NEW;
END;
$$;

-- Function to update modified column
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
   NEW.updated_at = NOW(); 
   RETURN NEW;
END;
$$;

-- Function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at)
  VALUES (new.id, new.email, new.created_at);
  RETURN new;
END;
$$;

-- Function to process invoice appointment JSON
CREATE OR REPLACE FUNCTION public.process_invoice_appointment_json()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    customer_data JSONB;
    service_data JSONB;
    product_data JSONB;
    payment_data JSONB;
    customer_id UUID;
    app_id UUID;
    total_duration INT := 0;
BEGIN
    -- 1. JSON sahələrini çıxar
    customer_data := NEW.appointment_json->'customer_info';
    service_data := NEW.appointment_json->'services';
    product_data := NEW.appointment_json->'products';
    payment_data := NEW.appointment_json->'payment_details';
	
    -- 2. Yeni istifadəçi insert et və ya mövcudsa id-sini al
    INSERT INTO public.users (email, phone, full_name, gender, note, role, hashed_password, created_at, updated_at)
    VALUES (
        customer_data->>'email',
        customer_data->>'number',
        customer_data->>'full_name',
        (customer_data->>'gender')::gender_enum,
        customer_data->>'note',
        'customer',
        'autogenerated',
        now(), 
        now()
    )
    ON CONFLICT (email, phone) DO UPDATE SET updated_at = now()
    RETURNING id INTO customer_id;
    
    -- 3. Yeni appointment insert et
    FOR i IN 0..jsonb_array_length(service_data) - 1 LOOP
        total_duration := total_duration + (service_data->i->>'duration')::int;
    END LOOP;
    
    INSERT INTO public.appointments (
        customer_user_id, appointment_date, start_time, end_time, total, status, created_at, updated_at
    )
    VALUES (
        customer_id,
        (customer_data->>'date')::date,
        (customer_data->>'time')::time,
        (customer_data->>'time')::time + make_interval(mins => total_duration),
        (payment_data->>'paid_amount')::numeric,
        'awaiting_payment'::appointment_status,
        now(), 
        now()
    )
    RETURNING id INTO app_id;
    
    -- 4. appointment_services
    FOR i IN 0..jsonb_array_length(service_data) - 1 LOOP
        INSERT INTO public.appointment_services (
            appointment_id, service_id, staff_user_id, quantity, duration, price
        ) VALUES (
            app_id,
            (service_data->i->>'id')::UUID,
            (service_data->i->>'user_id')::UUID,
            1,
            (service_data->i->>'duration')::int,
            (service_data->i->>'discounted_price')::numeric
        );
    END LOOP;
    
    -- 5. appointment_products
    FOR i IN 0..jsonb_array_length(product_data) - 1 LOOP
        INSERT INTO public.appointment_products (
            appointment_id, product_id, quantity, price, amount
        ) VALUES (
            app_id,
            (product_data->i->>'id')::UUID,
            (product_data->i->>'quantity')::int,
            (product_data->i->>'discounted_price')::numeric,
            ((product_data->i->>'quantity')::int * (product_data->i->>'discounted_price')::numeric)
        );
    END LOOP;
    
    -- 6. payments
    INSERT INTO public.payments (
        appointment_id, type, method, amount, source, created_at, updated_at
    ) VALUES (
        app_id,
        'income',
        (payment_data->>'method')::payment_method,
        (payment_data->>'paid_amount')::numeric,
        COALESCE(payment_data->>'promo_code', ''),
        now(), 
        now()
    );
    
    RETURN NEW;
END;
$$;

-- TRIGGERS
-- ================================

-- Trigger for updating timestamps
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_staff_updated_at
    BEFORE UPDATE ON public.staff
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON public.settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at
    BEFORE UPDATE ON public.contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_categories_updated_at
    BEFORE UPDATE ON public.service_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for processing invoice appointment JSON
CREATE TRIGGER process_invoice_appointment_json_trigger
    AFTER INSERT ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION public.process_invoice_appointment_json();

-- INDEXES
-- ================================

-- Indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_phone ON public.users(phone);

CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX idx_appointments_customer ON public.appointments(customer_user_id);
CREATE INDEX idx_appointments_status ON public.appointments(status);

CREATE INDEX idx_services_category ON public.services(category_id);
CREATE INDEX idx_services_user ON public.services(user_id);

CREATE INDEX idx_products_user ON public.products(user_id);

CREATE INDEX idx_staff_user ON public.staff(user_id);
CREATE INDEX idx_staff_availability_user ON public.staff_availability(staff_user_id);

CREATE INDEX idx_appointment_services_appointment ON public.appointment_services(appointment_id);
CREATE INDEX idx_appointment_services_service ON public.appointment_services(service_id);
CREATE INDEX idx_appointment_services_staff ON public.appointment_services(staff_user_id);

CREATE INDEX idx_appointment_products_appointment ON public.appointment_products(appointment_id);
CREATE INDEX idx_appointment_products_product ON public.appointment_products(product_id);

CREATE INDEX idx_payments_appointment ON public.payments(appointment_id);
CREATE INDEX idx_transactions_appointment ON public.transactions(appointment_id);

CREATE INDEX idx_settings_key ON public.settings(key);
CREATE INDEX idx_settings_lang ON public.settings(lang);

CREATE INDEX idx_contact_messages_status ON public.contact_messages(status);

-- CONSTRAINTS
-- ================================

-- Unique constraints
ALTER TABLE public.users ADD CONSTRAINT unique_email_phone UNIQUE (email, phone);
ALTER TABLE public.promo_codes ADD CONSTRAINT unique_promo_code UNIQUE (code);
ALTER TABLE public.settings ADD CONSTRAINT unique_key_lang UNIQUE (key, lang);

-- Check constraints
ALTER TABLE public.staff_availability ADD CONSTRAINT check_weekday 
    CHECK (weekday >= 0 AND weekday <= 6);
ALTER TABLE public.promo_codes ADD CONSTRAINT check_discount_percent 
    CHECK (discount_percent >= 0 AND discount_percent <= 100);
ALTER TABLE public.services ADD CONSTRAINT check_positive_price 
    CHECK (price >= 0);
ALTER TABLE public.products ADD CONSTRAINT check_positive_price_stock 
    CHECK (price >= 0 AND stock >= 0);
