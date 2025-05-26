
# Database Schema Documentation

Bu qovluq salon idarəetmə sisteminin tam məlumat bazası strukturunu əhatə edir.

## Fayllar

### 1. schema.sql
- Bütün cədvəllərin strukturu
- Enum tipləri
- İndekslər və məhdudiyyətlər
- Trigger-lər və function-lar
- View-lar

### 2. mock-data.sql
- Test məlumatları
- Nümunə müştərilər və işçilər
- Xidmətlər və məhsullar
- Randevular və ödənişlər

## Əsas Xüsusiyyətlər

### UUID İstifadəsi
Bütün cədvəllər UUID (Universally Unique Identifier) istifadə edir. Bu aşağıdakı üstünlükləri təmin edir:
- Təhlükəsizlik: ID-ləri təxmin etmək çətin
- Masştablanma: Paylanmış sistemlərdə unikal ID-lər
- Performans: Daha yaxşı indeksləmə

### Enum Tipləri
- `gender_enum`: Cins (male, female, other)
- `role_enum`: İstifadəçi rolları (admin, staff, customer, və s.)
- `appointment_status`: Randevu vəziyyətləri
- `payment_method`: Ödəniş üsulları
- `payment_type`: Ödəniş növləri (income, expense)

### Əlaqələr
- Users -> Staff (1:1)
- Users -> Appointments (1:M)
- Services -> Appointments (M:M)
- Products -> Appointments (M:M)
- Services -> Products (M:M)

### Trigger-lər
- Avtomatik timestamp yeniləmə
- History logging
- Invoice processing

### Function-lar
- `get_staff_by_service()`: Xidmətə görə işçi tapmaq
- `get_available_staff_by_service_and_date()`: Müəyyən tarixdə əlçatan işçi tapmaq
- `create_invoice_with_appointment()`: Randevu ilə birlikdə faktura yaratmaq

## İstifadə

1. Əvvəlcə `schema.sql` faylını icra edin
2. Sonra `mock-data.sql` faylını icra edin

```sql
-- Schema yaratmaq
\i src/database/schema.sql

-- Test məlumatları əlavə etmək
\i src/database/mock-data.sql
```

## Təhlükəsizlik

Sistem Row Level Security (RLS) istifadəsini dəstəkləyir. Hər istifadəçi yalnız öz məlumatlarına çıxış əldə edə bilər.

## Monitoring

- Histories cədvəli bütün dəyişiklikləri izləyir
- Payments və transactions cədvəlləri maliyyə hərəkətlərini qeyd edir
- Contact messages müştəri sorğularını saxlayır
