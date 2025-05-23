
import React from 'react';
import { ProductList } from '@/features/products';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

const Products = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <h1 className="text-4xl font-bold text-glamour-800 mb-2">
          {t("products.title", "Məhsullar")}
        </h1>
        <p className="text-lg text-gray-600 mb-6 max-w-3xl">
          {t("products.description", "Gündəlik qulluq rutininizi artırmaq üçün təbii inqrediyentlərlə hazırlanmış premium gözəllik məhsullarımızı kəşf edin.")}
        </p>
        <ProductList />
      </main>
      <Footer />
    </div>
  );
}

export default Products;
