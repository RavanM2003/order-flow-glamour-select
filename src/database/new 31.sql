
-- Drop all dependent tables safely
DROP TABLE IF EXISTS appointment_services, appointment_products, staff_availability, product_usage, payments, appointments, service_products, products, services, service_categories, promo_codes, customers, users, roles, invoices, histories CASCADE;

-- Enums
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'bank', 'pos', 'discount', 'promo_code');
CREATE TYPE payment_type AS ENUM ('income', 'expense');
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other');
CREATE TYPE action_enum AS ENUM ('INSERT', 'UPDATE', 'DELETE');

-- Roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Users (staff, admins, reception)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    number TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    role TEXT CHECK (role IN ('customer', 'super_admin','admin', 'staff', 'reception')) DEFAULT 'staff',
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Customers
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    gender gender_enum,
    birth_date DATE,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Service categories
CREATE TABLE service_categories (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Services
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    category_id INTEGER REFERENCES service_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    benefits TEXT[],
    price NUMERIC NOT NULL DEFAULT 0,
    duration INTEGER NOT NULL DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Products
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    stock INTEGER NOT NULL,
    price NUMERIC NOT NULL,
    description TEXT,
    details TEXT,
    how_to_use TEXT,
    ingredients TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Product-Category link (M:N)
CREATE TABLE product_categories (
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES service_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- Product-Service relation (M:N)
CREATE TABLE service_products (
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY (service_id, product_id)
);

-- Appointments
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    customer_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total NUMERIC,
    status appointment_status DEFAULT 'scheduled',
    cancel_reason TEXT,
    is_no_show BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Appointment Services
CREATE TABLE appointment_services (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
    staff_id UUID REFERENCES users(id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 1,
    duration INTEGER,
    price NUMERIC
);

-- Appointment Products
CREATE TABLE appointment_products (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    staff_id UUID REFERENCES users(id) ON DELETE SET NULL,
    quantity INTEGER,
    price NUMERIC,
    amount NUMERIC
);

-- Payments
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
    type payment_type NOT NULL,
    method payment_method NOT NULL,
    amount NUMERIC NOT NULL,
    source TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Promo Codes
CREATE TABLE promo_codes (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_percent INTEGER CHECK (discount_percent BETWEEN 0 AND 100),
    valid_from DATE,
    valid_to DATE,
    max_usage INTEGER,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Invoices
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
    invoice_number TEXT UNIQUE NOT NULL,
    total_amount NUMERIC NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Staff availability
CREATE TABLE staff_availability (
    staff_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    weekday INTEGER CHECK (weekday BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    PRIMARY KEY (staff_user_id, weekday)
);

-- Histories
CREATE TABLE histories (
    id SERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,
    source_id TEXT NOT NULL,
    action action_enum DEFAULT 'UPDATE',
    history JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Update trigger function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- History insert trigger function
CREATE OR REPLACE FUNCTION log_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO histories(table_name, source_id, action, history)
  VALUES (TG_TABLE_NAME, OLD.id::TEXT, TG_OP::action_enum, to_jsonb(OLD));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to users
CREATE TRIGGER set_updated_at BEFORE UPDATE ON users 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON users 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON users 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- Apply triggers to customers
CREATE TRIGGER set_updated_at BEFORE UPDATE ON customers 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON customers 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON customers 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- Apply triggers to services
CREATE TRIGGER set_updated_at BEFORE UPDATE ON services 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON services 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON services 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- Apply triggers to products
CREATE TRIGGER set_updated_at BEFORE UPDATE ON products 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON products 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON products 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- Apply triggers to appointments
CREATE TRIGGER set_updated_at BEFORE UPDATE ON appointments 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON appointments 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON appointments 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- Apply triggers to payments
CREATE TRIGGER set_updated_at BEFORE UPDATE ON payments 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON payments 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON payments 
FOR EACH ROW EXECUTE FUNCTION log_history();
