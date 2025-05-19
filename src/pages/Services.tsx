
import React from 'react';
import { ServiceList } from '@/features/services';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <h1 className="text-4xl font-bold text-glamour-800 mb-2">Xidmətlərimiz</h1>
        <p className="text-lg text-gray-600 mb-6 max-w-3xl">
          Təbii gözəlliyinizi artırmaq və rifahınızı təşviq etmək üçün hazırlanmış hərtərəfli gözəllik və sağlamlıq xidmətlərimizi kəşf edin.
        </p>
        <ServiceList />
      </main>
      <Footer />
    </div>
  );
}

export default Services;
