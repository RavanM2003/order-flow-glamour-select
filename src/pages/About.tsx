
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  const team = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Founder & Lead Stylist",
      image: "sarah.jpg",
      bio: "With over 15 years of experience in the beauty industry, Sarah founded Glamour Studio with a vision to provide premium beauty services in a luxurious environment."
    },
    {
      id: 2,
      name: "David Chen",
      role: "Senior Makeup Artist",
      image: "david.jpg",
      bio: "David specializes in creating flawless makeup looks for special events and photoshoots, with a reputation for enhancing natural beauty."
    },
    {
      id: 3,
      name: "Amina Khalid",
      role: "Master Esthetician",
      image: "amina.jpg",
      bio: "Amina is our skincare expert with advanced training in facial treatments and personalized skincare regimens for all skin types."
    },
    {
      id: 4,
      name: "Michael Rodriguez",
      role: "Hair Stylist",
      image: "michael.jpg",
      bio: "Michael brings creativity and precision to every haircut and styling session, keeping up with the latest trends and techniques."
    }
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-16 bg-glamour-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-glamour-800 mb-6">About Glamour Studio</h1>
              <p className="text-lg text-gray-700 mb-8">
                Founded in 2020, Glamour Studio was born from a passion for beauty and wellness. 
                We strive to create a sanctuary where clients can relax, rejuvenate, and leave feeling 
                more confident and beautiful than when they arrived.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                  <p className="text-glamour-600">Studio Image</p>
                </div>
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-glamour-800 mb-6">Our Story</h2>
                <p className="text-gray-700 mb-4">
                  Glamour Studio began with a simple idea: to create a beauty destination where quality, 
                  personalization, and luxury come together. Our founder, Sarah Johnson, had spent years 
                  working in high-end salons but dreamed of creating a space that felt both exclusive and welcoming.
                </p>
                <p className="text-gray-700 mb-4">
                  In 2020, that dream became reality with the opening of our first studio in Baku. 
                  Since then, we've built a reputation for exceptional service, skilled professionals, 
                  and a commitment to using premium products that deliver results.
                </p>
                <p className="text-gray-700">
                  Today, Glamour Studio continues to grow, but our core values remain the same: 
                  enhancing natural beauty, providing personalized care, and ensuring every client 
                  leaves feeling their absolute best.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-glamour-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-glamour-800 mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-glamour-700 mb-4">Excellence</h3>
                <p className="text-gray-700">
                  We strive for excellence in every service we provide, from the products we use 
                  to the techniques we employ. Our team regularly updates their skills to stay 
                  at the forefront of beauty innovation.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-glamour-700 mb-4">Personalization</h3>
                <p className="text-gray-700">
                  We recognize that every client is unique, with different needs and preferences. 
                  That's why we take the time to understand your goals and create customized 
                  beauty solutions just for you.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-glamour-700 mb-4">Integrity</h3>
                <p className="text-gray-700">
                  Honesty and transparency guide everything we do. We provide straightforward 
                  recommendations, use high-quality products, and price our services fairly 
                  to build lasting relationships with our clients.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-glamour-800 mb-8 text-center">Meet Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member) => (
                <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-64 bg-gray-200 flex items-center justify-center">
                    <p className="text-glamour-600">Team Member Image</p>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-glamour-800 mb-1">{member.name}</h3>
                    <p className="text-glamour-600 text-sm mb-4">{member.role}</p>
                    <p className="text-gray-700 text-sm">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-glamour-700 text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6">Experience the Glamour Studio Difference</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              Ready to transform your look and feel your best? Book an appointment today and 
              experience our premium beauty services firsthand.
            </p>
            <Button className="bg-white text-glamour-700 hover:bg-gray-100" size="lg" asChild>
              <Link to="/booking">Book Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
