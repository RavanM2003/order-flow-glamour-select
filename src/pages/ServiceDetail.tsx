
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const services = [
  {
    id: "1",
    title: "Facial Treatment",
    description: "Our advanced facial treatment is designed to cleanse, exfoliate, and nourish your skin, promoting a clear, well-hydrated complexion. The treatment begins with a thorough skin analysis to determine your specific needs, followed by deep cleansing, gentle exfoliation, and a customized mask application. Our estheticians use premium products that target your unique skin concerns, whether it's dryness, acne, signs of aging, or sensitivity. The treatment concludes with a relaxing facial massage that improves circulation and enhances the absorption of applied products. You'll leave with glowing, refreshed skin and personalized recommendations for your home skincare routine.",
    longDescription: "Our signature facial treatment begins with a detailed consultation to understand your skin concerns and goals. The procedure starts with a gentle cleansing to remove surface impurities, followed by a deeper cleanse to prepare your skin for treatment. Next, our esthetician will perform a careful exfoliation to remove dead skin cells, unclog pores, and reveal fresh skin underneath. Depending on your skin's needs, we may incorporate steam to soften the skin and facilitate extraction of clogged pores. A specialized mask will then be applied to address your specific concerns, whether it's hydration, purification, or anti-aging. During the mask application, you'll enjoy a relaxing hand and arm massage. The treatment concludes with the application of toner, serums, moisturizer, and SPF protection tailored to your skin type. Our specialists will also provide you with personalized skincare recommendations to maintain your results at home.",
    image: "facial.jpg",
    duration: "60 min",
    price: 150,
    benefits: [
      "Deep cleansing and pore purification",
      "Improved skin texture and tone",
      "Reduced appearance of fine lines and wrinkles",
      "Hydration boost for glowing skin",
      "Customized treatment for your skin type"
    ],
    relatedProducts: [
      { id: 1, name: "Moisturizer Cream", price: 45 },
      { id: 2, name: "Anti-Aging Serum", price: 75 }
    ]
  },
  {
    id: "2",
    title: "Massage Therapy",
    description: "Relax and unwind with our therapeutic massage treatments. Our skilled massage therapists use various techniques to relieve muscle tension and promote overall wellness.",
    longDescription: "Our professional massage therapy service is designed to alleviate tension, reduce stress, and promote overall well-being. Our skilled therapists begin with a consultation to understand your specific needs and concerns, allowing them to customize the pressure and techniques used during your session. The massage incorporates a blend of Swedish, deep tissue, and therapeutic techniques to address muscle tension, improve circulation, and enhance relaxation. Essential oils may be used to enhance the therapeutic benefits. Throughout the session, your therapist will check in regarding pressure and comfort levels to ensure the most beneficial experience. Regular massage therapy can help reduce chronic pain, improve mobility, enhance sleep quality, and contribute to better mental health by reducing stress and anxiety levels.",
    image: "massage.jpg",
    duration: "45 min",
    price: 120,
    benefits: [
      "Relief from muscle tension and pain",
      "Reduced stress and anxiety",
      "Improved circulation",
      "Enhanced mobility and flexibility",
      "Better sleep quality"
    ],
    relatedProducts: [
      { id: 3, name: "Hair Care Kit", price: 60 }
    ]
  },
  // Additional services would be added here
];

const ServiceDetail = () => {
  const { id } = useParams<{id: string}>();
  const service = services.find(s => s.id === id);
  
  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12 text-center">
          <h1 className="text-4xl font-bold text-glamour-800 mb-6">Service Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">The service you're looking for doesn't exist or has been removed.</p>
          <Button className="bg-glamour-700 hover:bg-glamour-800" asChild>
            <Link to="/services">Browse All Services</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-2/3">
            <h1 className="text-4xl font-bold text-glamour-800 mb-4">{service.title}</h1>
            
            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center text-glamour-600">
                <Clock className="mr-2 h-5 w-5" />
                <span>{service.duration}</span>
              </div>
              <div className="flex items-center text-glamour-700 font-semibold">
                <DollarSign className="mr-1 h-5 w-5" />
                <span>${service.price}</span>
              </div>
            </div>
            
            <div className="bg-gray-200 h-80 rounded-lg mb-8 flex items-center justify-center">
              <p className="text-glamour-600">Service Image</p>
            </div>
            
            <div className="prose max-w-none mb-8">
              <h2 className="text-2xl font-semibold text-glamour-800 mb-4">Description</h2>
              <p className="text-gray-700 mb-6">{service.longDescription || service.description}</p>
              
              <h2 className="text-2xl font-semibold text-glamour-800 mb-4">Benefits</h2>
              <ul className="space-y-2 mb-6">
                {service.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-glamour-100 text-glamour-800 font-semibold rounded-full p-1 mr-2">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold text-glamour-800 mb-4">Book this Service</h3>
              <p className="text-gray-600 mb-6">
                Ready to experience the benefits of our {service.title.toLowerCase()}? Book your appointment today.
              </p>
              
              <Button className="w-full bg-glamour-700 hover:bg-glamour-800 mb-4" size="lg" asChild>
                <Link to="/booking">Book Now</Link>
              </Button>
              
              {service.relatedProducts && service.relatedProducts.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-glamour-800 mt-8 mb-4">Recommended Products</h3>
                  <div className="space-y-4">
                    {service.relatedProducts.map(product => (
                      <div key={product.id} className="border rounded-md p-4">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">{product.name}</h4>
                          <span className="text-glamour-700 font-semibold">${product.price}</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link to={`/products/${product.id}`}>
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
