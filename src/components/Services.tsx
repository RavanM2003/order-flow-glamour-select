import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const services = [
    {
      id: 1,
      title: "Facial Treatments",
      description: "Our signature facial treatment begins with a detailed consultation to understand your skin concerns and goals. The procedure starts with a gentle cleansing to remove surface impurities, followed by a deeper cleanse to prepare your skin for treatment. Next, our esthetician will perform a careful exfoliation to remove dead skin cells, unclog pores, and reveal fresh skin underneath. Depending on your skin's needs, we may incorporate steam to soften the skin and facilitate extraction of clogged pores. A specialized mask will then be applied to address your specific concerns, whether it's hydration, purification, or anti-aging. During the mask application, you'll enjoy a relaxing hand and arm massage. The treatment concludes with the application of toner, serums, moisturizer, and SPF protection tailored to your skin type. Our specialists will also provide you with personalized skincare recommendations to maintain your results at home.",
      benefits: [
        "Deep cleansing and pore purification",
        "Improved skin texture and tone",
        "Reduced appearance of fine lines and wrinkles",
        "Hydration boost for glowing skin",
        "Customized treatment for your skin type"
      ],
      image: "facial.jpg",
      duration: "60 min",
      price: 150
    },
    {
      id: 2,
      title: "Massage Therapy",
      description: "Experience ultimate relaxation with our therapeutic massage treatments. Our skilled massage therapists use various techniques to relieve muscle tension, reduce stress, and promote overall wellness. Each session begins with a consultation to understand your specific needs and preferences. We offer a range of massage styles, from gentle Swedish massage to deep tissue therapy, all performed in our serene, private treatment rooms. Our therapists use premium massage oils and lotions to enhance the experience and nourish your skin. The treatment includes a brief consultation, the main massage session, and time to relax afterward. We also provide personalized recommendations for maintaining the benefits between sessions.",
      benefits: [
        "Relieves muscle tension and pain",
        "Reduces stress and anxiety",
        "Improves circulation and flexibility",
        "Promotes better sleep quality",
        "Enhances overall well-being"
      ],
      image: "massage.jpg",
      duration: "45-90 min",
      price: 120
    },
    {
      id: 3,
      title: "Hair Styling",
      description: "Transform your look with our professional hair styling services. From cuts and colors to specialized treatments, our stylists help you achieve the perfect hairstyle.",
      image: "hair.jpg",
      duration: "45-60 min",
      price: 80
    },
    {
      id: 4,
      title: "Manicure & Pedicure",
      description: "Treat your hands and feet to our luxurious nail care services. Choose from a variety of colors and finishes for a polished, beautiful look.",
      image: "nails.jpg",
      duration: "30-60 min",
      price: 50
    },
    {
      id: 5,
      title: "Makeup Application",
      description: "Enhance your natural beauty with our makeup services for any occasion. Our makeup artists use premium products to create flawless, long-lasting looks.",
      image: "makeup.jpg",
      duration: "60 min",
      price: 90
    },
    {
      id: 6,
      title: "Body Treatments",
      description: "Pamper yourself with our rejuvenating body treatments. From scrubs to wraps, these services leave your skin glowing and refreshed.",
      image: "body.jpg",
      duration: "60-90 min",
      price: 140
    }
  ];

  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <h1 className="text-4xl font-bold text-glamour-800 mb-2">Our Services</h1>
        <p className="text-lg text-gray-600 mb-6 max-w-3xl">
          Discover our comprehensive range of beauty and wellness services designed to enhance your natural beauty and promote wellbeing.
        </p>
        
        {/* Search Bar */}
        <div className="mb-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              placeholder="Search services..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <p className="text-glamour-600">Service Image</p>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold text-glamour-800">{service.title}</h2>
                  <div className="text-glamour-700 font-semibold">${service.price}</div>
                </div>
                <p className="text-sm text-gray-500 mb-4">Duration: {service.duration}</p>
                <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>
                {service.benefits && service.benefits.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-glamour-800 mb-2">Benefits:</h3>
                    <ul className="space-y-1">
                      {service.benefits.slice(0, 3).map((benefit, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <span className="text-glamour-700 mr-2">✓</span>
                          {benefit}
                        </li>
                      ))}
                      {service.benefits.length > 3 && (
                        <li className="text-sm text-glamour-700">
                          +{service.benefits.length - 3} more benefits
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                <Button className="w-full bg-glamour-700 hover:bg-glamour-800" asChild>
                  <Link to={`/services/${service.id}`}>
                    View Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No services found matching "{searchTerm}"</p>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 mb-6">Ready to experience our premium services?</p>
          <Button size="lg" className="bg-glamour-700 hover:bg-glamour-800" asChild>
            <Link to="/booking">Book an Appointment</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
