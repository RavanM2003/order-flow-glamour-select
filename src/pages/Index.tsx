
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const services = [
    {
      title: "Facial Treatments",
      description: "Rejuvenate your skin with our advanced facial treatments",
      image: "facial.jpg"
    },
    {
      title: "Body Treatments",
      description: "Pamper yourself with our luxurious body treatments",
      image: "body.jpg"
    },
    {
      title: "Hair Styling",
      description: "Transform your look with our professional hair styling services",
      image: "hair.jpg"
    }
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 w-full">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-bold text-2xl text-glamour-800">Glamour Studio</div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/services">Services</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/about">About</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/contact">Contact</Link>
            </Button>
            <Button className="bg-glamour-700 hover:bg-glamour-800" asChild>
              <Link to="/booking">Book Now</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin">Admin</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-glamour-50 to-glamour-100">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-glamour-900 leading-tight">
                  Your Beauty Journey <br />
                  <span className="text-glamour-700">Starts Here</span>
                </h1>
                <p className="text-lg text-gray-700 max-w-xl">
                  Experience personalized beauty treatments in a luxurious environment. 
                  Our expert staff is dedicated to enhancing your natural beauty.
                </p>
                <div className="flex gap-4 pt-4">
                  <Button className="bg-glamour-700 hover:bg-glamour-800 px-6 py-6" size="lg" asChild>
                    <Link to="/booking">
                      Book an Appointment
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg">View Our Services</Button>
                </div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-glamour-200 mx-auto overflow-hidden">
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <p className="text-glamour-600">Featured Image</p>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
                    <p className="font-medium text-glamour-800">50+ satisfied clients</p>
                    <p className="text-sm text-gray-500">Last week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-glamour-800 mb-4">Our Premium Services</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We offer a wide range of beauty and wellness services to help you look and feel your best.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <p className="text-glamour-600">Service Image</p>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-glamour-800 mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <Button variant="outline" className="w-full">
                      Learn More
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button className="bg-glamour-700 hover:bg-glamour-800" size="lg" asChild>
                <Link to="/services">View All Services</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-16 bg-glamour-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-glamour-800 mb-4">What Our Clients Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Hear from our satisfied clients about their experiences at Glamour Studio.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
              <p className="text-xl text-gray-600 italic mb-6">
                "Glamour Studio completely transformed my look! The staff was professional and attentive, 
                and the results exceeded my expectations. I've never felt more beautiful and confident."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold text-glamour-800">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500">Regular client since 2023</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-glamour-700 text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Look?</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              Book an appointment today and experience the difference with our premium beauty services.
            </p>
            <Button className="bg-white text-glamour-700 hover:bg-gray-100" size="lg" asChild>
              <Link to="/booking">Book Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-glamour-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-xl text-glamour-800 mb-4">Glamour Studio</h3>
              <p className="text-gray-600">
                Providing premium beauty services since 2020. We're dedicated to enhancing your 
                natural beauty and building your confidence.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-glamour-800 mb-4">Contact Us</h3>
              <address className="text-gray-600 not-italic">
                <p>123 Beauty Street</p>
                <p>Baku, Azerbaijan</p>
                <p className="mt-2">Email: info@glamourstudio.az</p>
                <p>Phone: +994 50 123 4567</p>
              </address>
            </div>
            <div>
              <h3 className="font-bold text-glamour-800 mb-4">Hours</h3>
              <ul className="text-gray-600">
                <li className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>9:00 - 19:00</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday:</span>
                  <span>10:00 - 18:00</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday:</span>
                  <span>Closed</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
            <p>© 2024 Glamour Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
