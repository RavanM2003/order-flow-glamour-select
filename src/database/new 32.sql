
-- Drop all dependent tables safely
DROP TABLE IF EXISTS customers,service_categories,services,products,product_categories,service_products,appointments,appointment_services,appointment_products,payments,promo_codes,invoices,staff_availability,staff,profiles,users,histories CASCADE;

DROP TYPE IF EXISTS appointment_status,payment_method,payment_type,gender_enum,action_enum,role_enum;

-- Enums
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'bank', 'pos', 'discount', 'promo_code');
CREATE TYPE payment_type AS ENUM ('income', 'expense');
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other');
CREATE TYPE action_enum AS ENUM ('INSERT', 'UPDATE', 'DELETE');
CREATE TYPE role_enum AS ENUM ('cash', 'customer', 'super_admin','admin', 'staff', 'appointment', 'reception','service','product');

-- Unified Users Table (customers + staff + admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Login info
    email TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,

    -- Contact
    phone TEXT UNIQUE NOT NULL,

    -- Names
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,

    -- Customer info
    gender gender_enum,
    birth_date DATE,
    note TEXT,

    -- Profile
    avatar_url TEXT,

    -- Role
    role role_enum DEFAULT 'customer',

    -- Timestamps
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

-- Staff table
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    position TEXT,
    specializations INTEGER[] ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
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

-- Triggerləri tətbiq et

-- users
CREATE TRIGGER set_updated_at BEFORE UPDATE ON users 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON users 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON users 
FOR EACH ROW EXECUTE FUNCTION log_history();


-- service_categories
CREATE TRIGGER set_updated_at BEFORE UPDATE ON service_categories 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON service_categories 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON service_categories 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- services
CREATE TRIGGER set_updated_at BEFORE UPDATE ON services 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON services 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON services 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- products
CREATE TRIGGER set_updated_at BEFORE UPDATE ON products 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON products 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON products 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- product_categories
CREATE TRIGGER set_updated_at BEFORE UPDATE ON product_categories 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON product_categories 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON product_categories 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- service_products
CREATE TRIGGER set_updated_at BEFORE UPDATE ON service_products 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON service_products 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON service_products 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- appointments
CREATE TRIGGER set_updated_at BEFORE UPDATE ON appointments 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON appointments 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON appointments 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- appointment_services
CREATE TRIGGER set_updated_at BEFORE UPDATE ON appointment_services 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON appointment_services 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON appointment_services 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- appointment_products
CREATE TRIGGER set_updated_at BEFORE UPDATE ON appointment_products 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON appointment_products 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON appointment_products 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- payments
CREATE TRIGGER set_updated_at BEFORE UPDATE ON payments 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON payments 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON payments 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- promo_codes
CREATE TRIGGER set_updated_at BEFORE UPDATE ON promo_codes 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON promo_codes 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON promo_codes 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- invoices
CREATE TRIGGER set_updated_at BEFORE UPDATE ON invoices 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON invoices 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON invoices 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- staff_availability
CREATE TRIGGER set_updated_at BEFORE UPDATE ON staff_availability 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON staff_availability 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON staff_availability 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- staff
CREATE TRIGGER set_updated_at BEFORE UPDATE ON staff 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON staff 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON staff 
FOR EACH ROW EXECUTE FUNCTION log_history();



TRUNCATE TABLE histories, staff_availability, invoices, promo_codes, payments, appointment_products, appointment_services, appointments, service_products, product_categories, products, services, service_categories, staff, users CASCADE;

-- password: admin123
-- Insert users-- Unified mock users (admin, staff, customer)
INSERT INTO users (email, hashed_password, phone, first_name, last_name, full_name, gender, birth_date, note, avatar_url, role)
VALUES
('admin@example.com', '$2a$10$X4jD78lGC7jxDhGhpj7xF.dJ5JvTl1MNVgQZGG8QDrDPYOcgUtUcG', '1234567890', 'Irma', 'Wisoky', 'Irma Wisoky', 'female', NULL, NULL, 'https://avatars.githubusercontent.com/u/14069376', 'admin'),
('staff1@example.com', '$2a$10$X4jD78lGC7jxDhGhpj7xF.dJ5JvTl1MNVgQZGG8QDrDPYOcgUtUcG', '2345678901', 'Virgie', 'Stroman', 'Virgie Stroman', 'female', NULL, NULL, 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/2.jpg', 'staff'),
('customer1@example.com', '$2a$10$X4jD78lGC7jxDhGhpj7xF.dJ5JvTl1MNVgQZGG8QDrDPYOcgUtUcG', '908-455-3024', NULL, NULL, 'Charlotte Satterfield', 'other', '1985-05-16', 'Repellendus patruus ascisco vis coepi.', 'https://randomuser.me/api/portraits/women/1.jpg', 'customer'),
('customer2@example.com', '$2a$10$X4jD78lGC7jxDhGhpj7xF.dJ5JvTl1MNVgQZGG8QDrDPYOcgUtUcG', '1-700-462-8572', NULL, NULL, 'Milton Wolf', 'male', '1998-08-27', 'Tantillus bellum nesciunt cilicium.', 'https://randomuser.me/api/portraits/men/2.jpg', 'customer'),
('customer3@example.com', '$2a$10$X4jD78lGC7jxDhGhpj7xF.dJ5JvTl1MNVgQZGG8QDrDPYOcgUtUcG', '257.354.3761 x2070', NULL, NULL, 'Meghan Feeney', 'other', '1995-07-22', 'Aestas rerum tametsi degenero tempus adopto approbo condico tui.', 'https://randomuser.me/api/portraits/women/3.jpg', 'customer');

-- Insert service categories
INSERT INTO service_categories (id, user_id, name) VALUES
(1, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Hair Care');
INSERT INTO service_categories (id, user_id, name) VALUES
(2, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Skin Care');
INSERT INTO service_categories (id, user_id, name) VALUES
(3, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Nail Care');
INSERT INTO service_categories (id, user_id, name) VALUES
(4, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Massage');
INSERT INTO service_categories (id, user_id, name) VALUES
(5, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Makeup');
INSERT INTO service_categories (id, user_id, name) VALUES
(6, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Spa Treatments');
INSERT INTO service_categories (id, user_id, name) VALUES
(7, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Body Treatments');

-- Insert services
INSERT INTO services (id, user_id, category_id, name, description, benefits, price, duration) VALUES
(1, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 1, 'Haircut', 'Vado argentum utor. Voveo ciminatio saepe careo cito cariosus apto universe arbustum repellat. Usus tolero crux copiose sint.', ARRAY['In ipsum casso possimus texo ancilla audeo vel.','Aspicio cibo aegre cicuta illo desipio desipio.','Ascit dolores ter cauda aufero.'], 50, 30);
INSERT INTO services (id, user_id, category_id, name, description, benefits, price, duration) VALUES
(2, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 1, 'Hair Coloring', 'Tamquam tres ascit doloremque catena doloribus deripio. Tot sapiente modi adeptio creptio contabesco. Dolores deprimo congregatio aegre.', ARRAY['Apparatus abbas vulgo amo abduco quos nesciunt sui odit.','Vespillo statua atrocitas apud laudantium id dedecor.','Averto aro sequi temporibus.'], 120, 90);
INSERT INTO services (id, user_id, category_id, name, description, benefits, price, duration) VALUES
(3, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 1, 'Blowout', 'Nemo creta pauci tandem degusto unde crebro. Vinitor mollitia ver. Speciosus quaerat tantillus vicinus.', ARRAY['Cura cernuus texo ascit tibi asper.','Suscipio esse speculum vulpes teres placeat tondeo talus.','Canto maxime laudantium addo despecto.'], 40, 45);
INSERT INTO services (id, user_id, category_id, name, description, benefits, price, duration) VALUES
(4, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 2, 'Facial', 'Carcer repellendus volup terga taceo conturbo censura armarium ipsa. Demens vomito cimentarius conduco. Amo deporto officiis creber vigor cattus solum.', ARRAY['Demoror aduro corrumpo accommodo a carpo.','Amet pauci cogito harum censura error.','Vere defluo pariatur victoria barba calcar creta vacuus talus.'], 80, 60);
INSERT INTO services (id, user_id, category_id, name, description, benefits, price, duration) VALUES
(5, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 2, 'Chemical Peel', 'Pax cubo abduco. Tardus amicitia depraedor cenaculum. Acsi sumptus caste concedo.', ARRAY['Ver vallum aureus textor temptatio textus caput sordeo ullus.','Accusantium stella amoveo alias campana vesco.','Spectaculum titulus convoco repellendus abbas absorbeo.'], 100, 45);
INSERT INTO services (id, user_id, category_id, name, description, benefits, price, duration) VALUES
(6, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 3, 'Manicure', 'Cogo cado sponte totus eius vomer tripudio canto concedo volutabrum. Inventore bene sub aeneus villa adipiscor cumque. Torqueo vulnero quaerat ver creber convoco qui.', ARRAY['Animi minus usque.','Constans neque peior advoco abeo aliquam astrum.','Campana deserunt tremo ustilo desipio iste despecto cicuta.'], 35, 30);
INSERT INTO services (id, user_id, category_id, name, description, benefits, price, duration) VALUES
(7, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 3, 'Pedicure', 'Tracto vobis ipsam amplexus. Aestivus ascisco nesciunt. Vociferor adduco quos crapula decor quaerat condico.', ARRAY['Corrumpo in turba abutor.','Tricesimus aliquid eum repellat.','Curatio velit derelinquo asporto comburo.'], 45, 45);
INSERT INTO services (id, user_id, category_id, name, description, benefits, price, duration) VALUES
(8, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 4, 'Swedish Massage', 'Viridis arceo trans. Bonus provident centum itaque vindico cura admoneo aequus. Amicitia quaerat conventus deripio aurum avarus comes demens.', ARRAY['Reprehenderit deficio antepono desparatus cedo vester suppellex.','Tumultus beatae depopulo commemoro ante alius quo tempora clamo sufficio.','Testimonium terebro templum earum volup adulatio dolores aestas.'], 90, 60);
INSERT INTO services (id, user_id, category_id, name, description, benefits, price, duration) VALUES
(9, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 4, 'Deep Tissue Massage', 'Spero deserunt tristis spiritus depraedor contigo eligendi. Clamo utrum crebro animi. Suscipit bardus deporto adsum cohaero quaerat sollers.', ARRAY['Odit cum ullam summisse.','Aer ipsum deputo paens.','Decumbo vitae ante vesco.'], 110, 60);
INSERT INTO services (id, user_id, category_id, name, description, benefits, price, duration) VALUES
(10, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 5, 'Makeup Application', 'Dedico cerno quasi. Explicabo defessus assentator tamisium solitudo comburo comptus. Cenaculum carmen vilis quis ambitus.', ARRAY['Decens vulariter capio desidero ademptio thema quasi pecus.','Sol tener sol repudiandae.','Comedo adfectus reprehenderit quidem praesentium sol.'], 65, 45);
INSERT INTO services (id, user_id, category_id, name, description, benefits, price, duration) VALUES
(11, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 5, 'Bridal Makeup', 'Denique iure valetudo umbra demens triumphus decet. Animus clibanus pecus amplitudo certus. Valde crudelis arbustum ultra subito.', ARRAY['Commodo solio beatus delectus tot virgo uredo damnatio.','Centum alioqui caelum vestigium necessitatibus ancilla reiciendis delectus degenero.','Cupiditate deripio vetus trepide.'], 150, 90);
INSERT INTO services (id, user_id, category_id, name, description, benefits, price, duration) VALUES
(12, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 6, 'Hot Stone Therapy', 'Arceo comedo deleniti ademptio adficio canto assentator ver vulticulus teneo. Cubitum defungo incidunt ullus titulus adhuc coniecto. Tamdiu cunae colligo accedo dens.', ARRAY['Deprecator comparo nam audio catena atqui.','Arbitro abscido voluptate credo reprehenderit venio dapifer coniecto tardus rem.','Coepi triumphus tutamen tabella tersus architecto demoror.'], 120, 75);
INSERT INTO services (id, user_id, category_id, name, description, benefits, price, duration) VALUES
(13, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 6, 'Aromatherapy', 'Sopor natus conscendo calco arbustum. Arx convoco templum. Sortitus denique crebro odio distinctio verecundia.', ARRAY['Bonus cattus demoror spectaculum neque provident omnis triumphus.','Argumentum adipisci depulso magnam denuncio.','Comprehendo temporibus adhaero verbera vinum balbus solum denuncio antea atrocitas.'], 85, 60);
INSERT INTO services (id, user_id, category_id, name, description, benefits, price, duration) VALUES
(14, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 7, 'Body Scrub', 'Illo saepe aggredior. Umbra tollo vix correptius sperno animus statim campana laborum. Aperio concedo tyrannus.', ARRAY['Depulso casso modi careo cometes ipsum fugit audeo magnam.','Officiis eius vulticulus succurro.','Vero delego teres.'], 70, 45);
INSERT INTO services (id, user_id, category_id, name, description, benefits, price, duration) VALUES
(15, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 7, 'Body Wrap', 'Tot cultura possimus tactus viriliter. Atqui id defaeco spes debitis molestiae claustrum calamitas. Voluptate currus clibanus conqueror vespillo vehemens recusandae.', ARRAY['Bene doloremque ceno.','Caries crustulum asperiores auctor.','Adsuesco suasoria terebro verumtamen asper.'], 95, 60);

-- Insert products
INSERT INTO products (id, user_id, name, stock, price, description, details, how_to_use, ingredients) VALUES
(1, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Shampoo', 36, 25, 'Bibo vesco qui dedecor. Bonus nostrum voluptate capto et. Utique atavus distinctio defaeco incidunt quia valde astrum vox.', 'Conculco vorago templum torqueo sed confero sophismata pecus. Desino blanditiis stillicidium temeritas vae cibus. Voluntarius versus theca vinco blanditiis teneo carcer comes compono sum.', 'Conculco vacuus vilis omnis cattus. Aedificium utique subiungo super labore triumphus cunae tenuis. Capto aspernatur arguo vicinus amplexus vulgaris.', 'Assumenda alias admoneo. Advenio nesciunt valetudo veritatis laboriosam astrum paulatim. Ex contra aperte qui.');
INSERT INTO products (id, user_id, name, stock, price, description, details, how_to_use, ingredients) VALUES
(2, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Conditioner', 35, 25, 'Coma carmen vita. Averto argumentum celer patruus alveus. Circumvenio amoveo demoror.', 'Excepturi eaque vis xiphias acerbitas canto varius esse. Confero sunt terreo deputo copiose aestivus. Bene abundans verbum trucido defendo capio deinde doloremque cilicium.', 'Eligendi vigor aestas asper vulariter varius audacia succedo. Cum qui annus sperno consectetur. Triduana explicabo tam deleniti laborum capillus sollers.', 'Patrocinor curtus ad surculus alius absque. Cilicium valeo alienus nisi antiquus tenus coruscus civis alius cruentus. Addo quidem crinis usitas bellum delego esse una carbo.');
INSERT INTO products (id, user_id, name, stock, price, description, details, how_to_use, ingredients) VALUES
(3, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Hair Serum', 69, 35, 'Thermae nihil assentator quam trucido timor custodia statim conduco vinculum. Vulpes soluta minus consequuntur verto. Aeger crustulum universe.', 'Creator arcus concido ater ambitus corrumpo terra curtus. Absorbeo vinitor coniuratio clibanus. Cattus administratio certus curso paens.', 'Creber patruus error crux coaegresco taceo magni vulpes odio. Subiungo inflammatio vos crastinus. Sophismata tibi maiores sursum adficio.', 'Pecco anser depono. Eius demulceo apto stips carus. Amoveo clementia at vito torqueo suadeo.');
INSERT INTO products (id, user_id, name, stock, price, description, details, how_to_use, ingredients) VALUES
(4, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Face Cleanser', 68, 30, 'Nostrum conculco vix infit. Volutabrum vinco cimentarius. Verus adipisci vitiosus dapifer caelum coaegresco tum debilito cilicium aestus.', 'Defaeco caelestis vomer cohors. Non eligendi toties blanditiis capio attonbitus officiis assumenda terror amplitudo. Voluptatem balbus thema corroboro asperiores bardus eos casus.', 'Villa vinculum audeo textus cibus cras textus. Comptus congregatio deprimo voluptatem maxime votum tergiversatio vesper defero trepide. Attollo spes desino sortitus.', 'Ultio stella quisquam ocer quam adhaero. Paens desipio ascit vilitas causa cupiditas vester laborum demo aequitas. Autem accusantium complectus supra cetera suffoco.');
INSERT INTO products (id, user_id, name, stock, price, description, details, how_to_use, ingredients) VALUES
(5, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Moisturizer', 18, 40, 'Teres vestrum denego convoco celebrer baiulus crepusculum angustus. Amitto capio apparatus cometes canto. Curatio incidunt curo chirographum casus sum alii abundans ancilla.', 'Assentator traho molestias animadverto. Vigor surgo vacuus cupressus. Celer consectetur rerum cerno bibo aut credo utique terror.', 'Anser numquam deserunt. Clarus corrupti cui caries amo vado. Absconditus casus aro spero commemoro angustus cumque acquiro.', 'Antea arbor coma adnuo vetus vorax bellum accusator eligendi. Virgo odio deduco terror dolor fuga. Animi alias confugo temptatio.');
INSERT INTO products (id, user_id, name, stock, price, description, details, how_to_use, ingredients) VALUES
(6, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Nail Polish', 20, 15, 'Aduro synagoga cur. Sequi talus censura vulgus titulus corona. Credo considero candidus supra defungo vulariter versus pariatur.', 'Adduco ademptio crepusculum suscipio unus clam tumultus deinde voro. Curtus aeternus advoco constans deputo molestias. Trans trado stabilis.', 'Arto adulescens ipsam vetus cognatus. Vergo tribuo unde hic tactus vere ulciscor. Cultura quibusdam culpo vulticulus pectus trucido sequi basium ulciscor acceptus.', 'Cohibeo quaerat qui utrum vesper. Aspernatur abundans artificiose vito subiungo tardus iusto ultra tergiversatio. Stillicidium tardus depraedor.');
INSERT INTO products (id, user_id, name, stock, price, description, details, how_to_use, ingredients) VALUES
(7, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Cuticle Oil', 77, 20, 'Cunae sortitus ex adhaero suspendo curvo bibo apto. Ea amplus aperio defero versus taceo amita officiis. Repellendus vesica corpus charisma usus solutio voluptatibus commodi sit talis.', 'Utpote bis audeo auctus. Vitiosus aliquid adamo defero natus. Color umerus accedo turba aeneus ipsum alienus adsidue cur usitas.', 'Vester vergo comparo substantia trado volva bellicus similique derelinquo. Vix tantillus adinventitias pecco sufficio celebrer calcar soluta varius. Occaecati comparo argentum vorax curatio omnis tam recusandae.', 'Decet voro cubo utique ipsum tandem aperiam absum vigor bos. Vulgivagus cupiditas demergo tenetur amplexus aeternus demergo cupiditas audentia. Atavus varietas talis autus sum correptius cunctatio vomica aestus amaritudo.');
INSERT INTO products (id, user_id, name, stock, price, description, details, how_to_use, ingredients) VALUES
(8, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Massage Oil', 72, 30, 'Defaeco aufero basium verus blanditiis terror admiratio supellex adeo. Condico cibus damnatio aequitas conor desino tabella usus. Ustulo cras ante pariatur carmen spectaculum comprehendo aestas.', 'Corrigo bestia allatus aliquid vigor vergo. Thymum ubi inflammatio debitis cupiditate expedita. Beneficium aureus sustineo cado.', 'Vinum volva angulus. Decipio officia vulnus ancilla corrigo adnuo alius alias verumtamen vilis. Delectatio eaque suffragium tricesimus custodia somnus aegrus theatrum sum.', 'Custodia suffoco tantillus. Cui sui aeger defetiscor catena considero averto repellat casus. Conatus comminor cunae bis.');
INSERT INTO products (id, user_id, name, stock, price, description, details, how_to_use, ingredients) VALUES
(9, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Makeup Remover', 42, 18, 'Tempus audeo odit adimpleo tribuo. Votum delinquo ut apud sperno solus. Barba caste ultio magni atrox vestrum aedificium.', 'Tutamen deporto tergeo currus defessus comburo. Vergo valde vis tonsor coniecto tondeo vobis sollers acervus vesica. Sapiente vulgaris ver uredo synagoga sapiente adeo.', 'Suscipio molestias cresco voluptas ago vereor. Rem quae cura tutamen. Tracto aranea viscus velum.', 'Deprecator ait uredo. Delego credo cilicium tabesco spargo odit. Urbanus stella nulla comitatus adfectus.');
INSERT INTO products (id, user_id, name, stock, price, description, details, how_to_use, ingredients) VALUES
(10, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Foundation', 67, 45, 'Aeneus statua voluptas. Consequuntur claro concedo arguo voluptas tubineus turpis. Strenuus suffragium aspernatur statim administratio atavus.', 'Pax super animi contigo urbs sollers eos varius. Aperte beatae denego magni varius tantum curso valeo. Vulnus repudiandae comitatus tergeo suus.', 'Cupressus centum spectaculum spoliatio cenaculum crapula umquam conforto acer alias. Decimus umquam usque. Curto decimus tabella degenero tego pectus avarus uxor.', 'Tactus aedificium decipio apto stips ata vus. Versus validus administratio trans corrupti dens concedo. Ulterius turpis aduro bis.');

-- Insert product categories
INSERT INTO product_categories (product_id, category_id) VALUES
(1, 6);
INSERT INTO product_categories (product_id, category_id) VALUES
(2, 5);
INSERT INTO product_categories (product_id, category_id) VALUES
(3, 2);
INSERT INTO product_categories (product_id, category_id) VALUES
(4, 5);
INSERT INTO product_categories (product_id, category_id) VALUES
(5, 3);
INSERT INTO product_categories (product_id, category_id) VALUES
(6, 6);
INSERT INTO product_categories (product_id, category_id) VALUES
(7, 4);
INSERT INTO product_categories (product_id, category_id) VALUES
(8, 6);
INSERT INTO product_categories (product_id, category_id) VALUES
(9, 4);
INSERT INTO product_categories (product_id, category_id) VALUES
(10, 5);

-- Insert service products
INSERT INTO service_products (service_id, product_id) VALUES
(2, 3);
INSERT INTO service_products (service_id, product_id) VALUES
(3, 6);
INSERT INTO service_products (service_id, product_id) VALUES
(12, 7);
INSERT INTO service_products (service_id, product_id) VALUES
(3, 2);
INSERT INTO service_products (service_id, product_id) VALUES
(14, 3);
INSERT INTO service_products (service_id, product_id) VALUES
(9, 9);
INSERT INTO service_products (service_id, product_id) VALUES
(6, 10);
INSERT INTO service_products (service_id, product_id) VALUES
(6, 8);
INSERT INTO service_products (service_id, product_id) VALUES
(6, 6);
INSERT INTO service_products (service_id, product_id) VALUES
(10, 9);
INSERT INTO service_products (service_id, product_id) VALUES
(4, 3);
INSERT INTO service_products (service_id, product_id) VALUES
(3, 5);
INSERT INTO service_products (service_id, product_id) VALUES
(13, 10);
INSERT INTO service_products (service_id, product_id) VALUES
(3, 9);
INSERT INTO service_products (service_id, product_id) VALUES
(8, 9);

-- Insert staff
INSERT INTO staff (id, user_id, position, specializations) VALUES
(1, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 'Nail Technician', ARRAY[1,9,8]);
INSERT INTO staff (id, user_id, position, specializations) VALUES
(2, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 'Massage Therapist', ARRAY[8,9,3]);
INSERT INTO staff (id, user_id, position, specializations) VALUES
(3, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 'Stylist', ARRAY[1,12]);
INSERT INTO staff (id, user_id, position, specializations) VALUES
(4, 'f23da762-5f27-4eb5-864d-aab759e29797', 'Nail Technician', ARRAY[9,4]);
INSERT INTO staff (id, user_id, position, specializations) VALUES
(5, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 'Esthetician', ARRAY[14]);

-- Insert staff availability
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('4a178f20-00e4-4567-a7d4-3eaca7e1e511', 0, '8:00:00', '16:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('4a178f20-00e4-4567-a7d4-3eaca7e1e511', 2, '10:00:00', '18:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('4a178f20-00e4-4567-a7d4-3eaca7e1e511', 3, '9:00:00', '16:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('4a178f20-00e4-4567-a7d4-3eaca7e1e511', 4, '9:00:00', '19:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('4a178f20-00e4-4567-a7d4-3eaca7e1e511', 5, '8:00:00', '16:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('4a178f20-00e4-4567-a7d4-3eaca7e1e511', 6, '8:00:00', '19:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 0, '10:00:00', '18:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, '10:00:00', '16:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 2, '9:00:00', '17:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 4, '8:00:00', '19:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('f869fbe8-3c77-42de-8f15-76d47362b2ac', 0, '8:00:00', '17:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, '8:00:00', '17:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('f869fbe8-3c77-42de-8f15-76d47362b2ac', 2, '9:00:00', '19:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('f869fbe8-3c77-42de-8f15-76d47362b2ac', 4, '9:00:00', '17:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('f869fbe8-3c77-42de-8f15-76d47362b2ac', 5, '9:00:00', '17:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('f869fbe8-3c77-42de-8f15-76d47362b2ac', 6, '10:00:00', '18:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('f23da762-5f27-4eb5-864d-aab759e29797', 0, '8:00:00', '19:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('f23da762-5f27-4eb5-864d-aab759e29797', 1, '8:00:00', '19:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('f23da762-5f27-4eb5-864d-aab759e29797', 2, '8:00:00', '18:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('f23da762-5f27-4eb5-864d-aab759e29797', 3, '9:00:00', '18:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('f23da762-5f27-4eb5-864d-aab759e29797', 4, '8:00:00', '16:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('f23da762-5f27-4eb5-864d-aab759e29797', 5, '8:00:00', '19:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 0, '9:00:00', '16:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 2, '9:00:00', '16:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 4, '8:00:00', '17:00:00');
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 6, '9:00:00', '16:00:00');

-- Insert appointments
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(1, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '4fb85ef5-e2e5-4019-a5d7-96f8363d7851', '2023-11-25', '13:30:00', '15:30:00', 141, 'completed', NULL, FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(2, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '2479d4a4-73b9-40dc-b5b2-d47c53ad3a4c', '2023-10-15', '13:15:00', '15:15:00', 177, 'scheduled', NULL, FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(3, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '22e44313-86e5-432f-ac21-3b3486de3d59', '2023-08-04', '12:45:00', '14:15:00', 329, 'scheduled', NULL, FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(4, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'd67c7b1b-13de-48d2-ba76-89bff287c5a2', '2023-12-13', '14:00:00', '14:30:00', 318, 'scheduled', NULL, FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(5, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '3035e213-9b93-4414-a22c-9fb149c2bfd6', '2023-12-18', '14:45:00', '16:15:00', 229, 'cancelled', 'Decens vulariter tracto minima vetus.', FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(6, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'b88c9484-5950-421b-9235-70cefa5c5db0', '2023-11-07', '11:15:00', '13:15:00', 304, 'cancelled', 'Impedit temperantia talio.', FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(7, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '59a5031b-4197-45b4-8410-812eb705891f', '2023-08-26', '10:15:00', '11:15:00', 318, 'cancelled', 'Copia coruscus taceo caute umbra conturbo soleo.', FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(8, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '8cbb7d94-a651-42bd-bb98-b641578a434b', '2023-10-07', '14:00:00', '15:30:00', 173, 'completed', NULL, FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(9, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '2479d4a4-73b9-40dc-b5b2-d47c53ad3a4c', '2023-03-11', '16:15:00', '18:15:00', 201, 'cancelled', 'Corporis ceno brevis summisse amoveo.', FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(10, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'da255599-667f-4fca-83f0-576e0a3260ba', '2023-04-15', '13:15:00', '13:45:00', 200, 'completed', NULL, TRUE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(11, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '307c9146-fc13-469b-a9fd-b8c59bd4f36b', '2023-05-16', '13:30:00', '15:30:00', 206, 'cancelled', 'Spectaculum vociferor adstringo arcus tero cruentus uredo omnis ocer.', FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(12, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '59a5031b-4197-45b4-8410-812eb705891f', '2023-12-27', '15:00:00', '17:00:00', 178, 'cancelled', 'Quod tabula vulgivagus depereo depono non decretum.', FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(13, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'e8589e37-2ab6-4d55-9511-ef6560d2cff7', '2023-11-20', '13:15:00', '13:45:00', 105, 'completed', NULL, FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(14, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '7d389f67-ac4f-4043-a0c5-c7fad1868f35', '2023-09-26', '13:45:00', '14:15:00', 243, 'scheduled', NULL, FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(15, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '22e44313-86e5-432f-ac21-3b3486de3d59', '2023-11-23', '09:30:00', '10:00:00', 156, 'cancelled', 'Velut degero autus accusantium delectatio cupressus.', FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(16, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '307c9146-fc13-469b-a9fd-b8c59bd4f36b', '2023-02-13', '14:30:00', '16:00:00', 243, 'cancelled', 'Assumenda dolor alioqui sortitus tubineus custodia magnam.', TRUE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(17, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'd0dc1e92-1595-4db9-8d7c-36fc0c304278', '2023-04-25', '15:15:00', '17:15:00', 159, 'cancelled', 'Modi desipio cohaero.', FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(18, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '2479d4a4-73b9-40dc-b5b2-d47c53ad3a4c', '2023-10-08', '09:00:00', '10:00:00', 336, 'scheduled', NULL, FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(19, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '59a5031b-4197-45b4-8410-812eb705891f', '2023-12-10', '14:15:00', '15:15:00', 300, 'completed', NULL, FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(20, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'd67c7b1b-13de-48d2-ba76-89bff287c5a2', '2023-05-19', '11:30:00', '13:30:00', 279, 'completed', NULL, FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(21, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '3035e213-9b93-4414-a22c-9fb149c2bfd6', '2023-11-25', '12:45:00', '13:45:00', 340, 'cancelled', 'Attonbitus depraedor delinquo repellendus suppono utroque decipio dedico ultio.', FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(22, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '3035e213-9b93-4414-a22c-9fb149c2bfd6', '2023-06-17', '15:45:00', '17:45:00', 300, 'cancelled', 'Argentum aedificium dedico soluta solum adopto astrum clam vestigium cibus.', FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(23, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'b88c9484-5950-421b-9235-70cefa5c5db0', '2023-08-19', '15:00:00', '17:00:00', 158, 'completed', NULL, FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(24, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '2479d4a4-73b9-40dc-b5b2-d47c53ad3a4c', '2023-06-01', '09:15:00', '09:45:00', 159, 'cancelled', 'Aequitas dolorum defero.', FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(25, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '307c9146-fc13-469b-a9fd-b8c59bd4f36b', '2023-08-06', '16:30:00', '17:00:00', 79, 'completed', NULL, FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(26, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '8c306ce8-1e97-4d69-b63a-ae5b496f5ba4', '2023-01-22', '15:00:00', '16:00:00', 126, 'scheduled', NULL, FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(27, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '22e44313-86e5-432f-ac21-3b3486de3d59', '2023-11-15', '14:30:00', '15:00:00', 211, 'cancelled', 'Nesciunt minus illo nemo veniam damno.', FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(28, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'd0dc1e92-1595-4db9-8d7c-36fc0c304278', '2023-12-16', '16:45:00', '17:45:00', 250, 'cancelled', 'Defaeco consuasor spectaculum attonbitus demulceo spero.', FALSE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(29, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'd0dc1e92-1595-4db9-8d7c-36fc0c304278', '2023-03-13', '15:30:00', '16:30:00', 175, 'completed', NULL, TRUE);
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(30, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '2479d4a4-73b9-40dc-b5b2-d47c53ad3a4c', '2023-02-16', '10:30:00', '11:00:00', 333, 'cancelled', 'Aeternus benevolentia fugiat tolero aurum defessus.', FALSE);

-- Insert appointment services
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(1, 14, 'f23da762-5f27-4eb5-864d-aab759e29797', 1, 30, 49.53);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(1, 7, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 30, 54.47);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(2, 10, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 30, 49.44);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(3, 1, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 30, 45.97);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(3, 8, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 1, 30, 45.38);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(3, 1, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 1, 30, 50.92);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(4, 4, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 30, 52.07);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(5, 2, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 30, 52.74);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(6, 11, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 30, 49.01);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(7, 14, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 30, 53.56);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(7, 13, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 1, 30, 50.66);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(7, 8, 'f23da762-5f27-4eb5-864d-aab759e29797', 1, 30, 54.32);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(8, 2, 'f23da762-5f27-4eb5-864d-aab759e29797', 1, 30, 53.34);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(9, 3, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 1, 30, 47.73);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(9, 10, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 30, 45.10);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(9, 4, 'f23da762-5f27-4eb5-864d-aab759e29797', 1, 30, 49.75);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(10, 1, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 30, 50.73);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(10, 14, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 30, 53.51);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(10, 2, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 30, 52.18);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(11, 5, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 30, 53.21);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(11, 5, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 30, 52.13);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(12, 12, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 30, 47.75);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(13, 14, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 30, 49.40);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(13, 14, 'f23da762-5f27-4eb5-864d-aab759e29797', 1, 30, 48.40);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(13, 15, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 30, 45.82);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(14, 2, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 30, 49.59);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(14, 5, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 30, 46.81);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(14, 13, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 1, 30, 48.31);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(15, 2, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 30, 51.88);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(16, 8, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 30, 53.07);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(16, 10, 'f23da762-5f27-4eb5-864d-aab759e29797', 1, 30, 45.65);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(17, 7, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 30, 51.97);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(17, 6, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 1, 30, 47.25);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(17, 12, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 1, 30, 47.68);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(18, 1, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 1, 30, 51.76);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(19, 2, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 30, 53.58);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(19, 6, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 30, 52.88);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(19, 7, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 30, 49.11);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(20, 6, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 30, 45.45);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(21, 4, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 1, 30, 49.19);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(21, 4, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 1, 30, 49.73);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(22, 2, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 30, 46.23);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(23, 1, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 30, 51.44);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(23, 15, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 30, 51.20);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(23, 13, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 30, 54.66);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(24, 14, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 30, 49.16);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(25, 14, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 30, 53.08);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(25, 7, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 1, 30, 47.17);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(25, 8, 'f23da762-5f27-4eb5-864d-aab759e29797', 1, 30, 52.91);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(26, 12, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 30, 52.55);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(26, 5, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 30, 45.44);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(27, 3, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 30, 49.18);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(27, 9, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 30, 48.64);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(28, 6, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 30, 50.79);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(28, 11, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 30, 47.85);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(28, 10, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 30, 47.16);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(29, 12, 'f23da762-5f27-4eb5-864d-aab759e29797', 1, 30, 48.30);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(29, 2, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 30, 52.99);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(29, 2, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 1, 30, 49.27);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(30, 15, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 1, 30, 54.43);
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(30, 5, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 30, 52.22);

-- Insert appointment products
INSERT INTO appointment_products (appointment_id, product_id, staff_id, quantity, price, amount) VALUES
(2, 2, 'f23da762-5f27-4eb5-864d-aab759e29797', 1, 25.00, 25.00);
INSERT INTO appointment_products (appointment_id, product_id, staff_id, quantity, price, amount) VALUES
(2, 10, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 2, 25.00, 50.00);
INSERT INTO appointment_products (appointment_id, product_id, staff_id, quantity, price, amount) VALUES
(3, 8, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 25.00, 25.00);
INSERT INTO appointment_products (appointment_id, product_id, staff_id, quantity, price, amount) VALUES
(3, 5, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 2, 25.00, 50.00);
INSERT INTO appointment_products (appointment_id, product_id, staff_id, quantity, price, amount) VALUES
(4, 1, 'f23da762-5f27-4eb5-864d-aab759e29797', 3, 25.00, 75.00);
INSERT INTO appointment_products (appointment_id, product_id, staff_id, quantity, price, amount) VALUES
(4, 1, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 3, 25.00, 75.00);
INSERT INTO appointment_products (appointment_id, product_id, staff_id, quantity, price, amount) VALUES
(5, 5, 'f23da762-5f27-4eb5-864d-aab759e29797', 3, 25.00, 75.00);
INSERT INTO appointment_products (appointment_id, product_id, staff_id, quantity, price, amount) VALUES
(5, 9, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 2, 25.00, 50.00);
INSERT INTO appointment_products (appointment_id, product_id, staff_id, quantity, price, amount) VALUES
(13, 8, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 1, 25.00, 25.00);
INSERT INTO appointment_products (appointment_id, product_id, staff_id, quantity, price, amount) VALUES
(16, 7, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 3, 25.00, 75.00);
INSERT INTO appointment_products (appointment_id, product_id, staff_id, quantity, price, amount) VALUES
(17, 4, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 2, 25.00, 50.00);
INSERT INTO appointment_products (appointment_id, product_id, staff_id, quantity, price, amount) VALUES
(19, 2, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 2, 25.00, 50.00);
INSERT INTO appointment_products (appointment_id, product_id, staff_id, quantity, price, amount) VALUES
(22, 7, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 2, 25.00, 50.00);
INSERT INTO appointment_products (appointment_id, product_id, staff_id, quantity, price, amount) VALUES
(27, 6, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 3, 25.00, 75.00);
INSERT INTO appointment_products (appointment_id, product_id, staff_id, quantity, price, amount) VALUES
(27, 5, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 2, 25.00, 50.00);
INSERT INTO appointment_products (appointment_id, product_id, staff_id, quantity, price, amount) VALUES
(30, 7, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 3, 25.00, 75.00);
INSERT INTO appointment_products (appointment_id, product_id, staff_id, quantity, price, amount) VALUES
(30, 7, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 25.00, 25.00);

-- Insert payments
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(1, 'income', 'card', 289.00, 'cultura');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(2, 'income', 'cash', 273.00, 'cresco');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(3, 'income', 'bank', 222.00, 'trans');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(4, 'income', 'card', 58.00, 'convoco');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(4, 'income', 'cash', 47.00, 'tempus');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(5, 'income', 'cash', 133.00, 'inflammatio');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(6, 'income', 'cash', 278.00, 'audeo');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(7, 'income', 'pos', 121.00, 'cohibeo');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(8, 'income', 'bank', 64.00, 'collum');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(9, 'income', 'card', 215.00, 'cerno');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(10, 'income', 'pos', 183.00, 'temptatio');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(11, 'income', 'bank', 214.00, 'tutamen');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(12, 'income', 'pos', 58.00, 'supellex');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(12, 'income', 'bank', 118.00, 'sed');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(13, 'income', 'card', 164.00, 'cado');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(14, 'income', 'cash', 161.00, 'caelestis');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(14, 'income', 'bank', 61.00, 'tutis');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(15, 'income', 'pos', 202.00, 'molestias');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(16, 'income', 'bank', 135.00, 'coniuratio');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(17, 'income', 'pos', 261.00, 'taedium');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(18, 'income', 'cash', 276.00, 'defungo');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(19, 'income', 'bank', 50.00, 'tempus');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(20, 'income', 'bank', 155.00, 'tondeo');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(21, 'income', 'pos', 103.00, 'uterque');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(22, 'income', 'card', 334.00, 'cur');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(22, 'income', 'bank', 113.00, 'vis');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(23, 'income', 'bank', 238.00, 'sum');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(24, 'income', 'bank', 334.00, 'venustas');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(25, 'income', 'card', 74.00, 'itaque');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(26, 'income', 'pos', 216.00, 'nostrum');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(27, 'income', 'card', 306.00, 'voveo');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(28, 'income', 'card', 67.00, 'deprimo');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(29, 'income', 'card', 337.00, 'curatio');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(30, 'income', 'cash', 194.00, 'aedificium');
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(30, 'income', 'card', 109.00, 'calamitas');

-- Insert promo codes
INSERT INTO promo_codes (code, discount_percent, valid_from, valid_to, max_usage, created_by) VALUES
('AW3L9RGY', 15, '2023-04-11', '2023-10-15', 18, '5599e156-42b5-4d8b-882e-2ef1ede5de45');
INSERT INTO promo_codes (code, discount_percent, valid_from, valid_to, max_usage, created_by) VALUES
('RMH3NZR8', 30, '2023-05-20', '2023-11-15', 54, '5599e156-42b5-4d8b-882e-2ef1ede5de45');
INSERT INTO promo_codes (code, discount_percent, valid_from, valid_to, max_usage, created_by) VALUES
('PXOS6FFS', 30, '2023-02-09', '2023-12-04', 43, '5599e156-42b5-4d8b-882e-2ef1ede5de45');
INSERT INTO promo_codes (code, discount_percent, valid_from, valid_to, max_usage, created_by) VALUES
('GCLSED5W', 20, '2023-01-28', '2023-11-13', 51, '5599e156-42b5-4d8b-882e-2ef1ede5de45');
INSERT INTO promo_codes (code, discount_percent, valid_from, valid_to, max_usage, created_by) VALUES
('KGYTGIBJ', 25, '2023-05-13', '2023-12-04', 10, '5599e156-42b5-4d8b-882e-2ef1ede5de45');

-- Insert invoices
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(1, 'INV-645860', 243.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(2, 'INV-312829', 213.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(3, 'INV-866163', 240.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(4, 'INV-077464', 207.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(5, 'INV-341430', 298.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(6, 'INV-122438', 256.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(7, 'INV-765701', 184.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(8, 'INV-082928', 253.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(9, 'INV-164004', 244.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(10, 'INV-620869', 292.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(11, 'INV-104489', 129.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(12, 'INV-612958', 247.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(13, 'INV-636525', 159.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(14, 'INV-664313', 224.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(15, 'INV-817494', 243.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(16, 'INV-194544', 281.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(17, 'INV-613532', 151.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(18, 'INV-973790', 172.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(19, 'INV-872151', 164.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(20, 'INV-038027', 264.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(21, 'INV-420845', 335.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(22, 'INV-909642', 131.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(23, 'INV-033534', 105.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(24, 'INV-859497', 144.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(25, 'INV-300823', 324.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(26, 'INV-552551', 339.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(27, 'INV-374554', 220.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(28, 'INV-599324', 307.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(29, 'INV-424812', 230.00);
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(30, 'INV-086737', 168.00);

