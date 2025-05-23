
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useSettings } from '@/hooks/use-settings';
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from '@/components/ui/skeleton';

const Contact = () => {
  const { toast } = useToast();
  const { getLocalizedSetting, isLoading: settingsLoading } = useSettings();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([formData]);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Message Sent",
        description: "We've received your message and will respond shortly.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactPhone = getLocalizedSetting('contact_phone');
  const contactEmail = getLocalizedSetting('contact_email');
  const address = getLocalizedSetting('address');
  const workingHours = getLocalizedSetting('working_hours');
  
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-12">
        <div className="container">
          <h1 className="text-4xl font-bold text-glamour-800 mb-2 text-center">Contact Us</h1>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto text-center">
            We'd love to hear from you! Whether you have questions about our services, need help with booking, or want to provide feedback, our team is here to help.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-glamour-800 mb-6">Send Us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+994 XX XXX XX XX"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input 
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message</Label>
                    <Textarea 
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                      rows={6}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="bg-glamour-700 hover:bg-glamour-800" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold text-glamour-800 mb-6">Contact Information</h2>
                
                {settingsLoading ? (
                  <div className="space-y-6">
                    <div className="flex">
                      <Phone className="h-5 w-5 text-glamour-700 mr-3 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-medium">Phone</h3>
                        <Skeleton className="h-4 w-32 mt-1" />
                      </div>
                    </div>
                    <div className="flex">
                      <Mail className="h-5 w-5 text-glamour-700 mr-3 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-medium">Email</h3>
                        <Skeleton className="h-4 w-40 mt-1" />
                      </div>
                    </div>
                    <div className="flex">
                      <MapPin className="h-5 w-5 text-glamour-700 mr-3 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-medium">Address</h3>
                        <Skeleton className="h-8 w-full mt-1" />
                      </div>
                    </div>
                    <div className="flex">
                      <Clock className="h-5 w-5 text-glamour-700 mr-3 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-medium">Business Hours</h3>
                        <Skeleton className="h-12 w-full mt-1" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex">
                      <Phone className="h-5 w-5 text-glamour-700 mr-3 mt-1" />
                      <div>
                        <h3 className="font-medium">Phone</h3>
                        <p className="text-gray-600">{contactPhone}</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <Mail className="h-5 w-5 text-glamour-700 mr-3 mt-1" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-gray-600">{contactEmail}</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <MapPin className="h-5 w-5 text-glamour-700 mr-3 mt-1" />
                      <div>
                        <h3 className="font-medium">Address</h3>
                        <div 
                          className="text-gray-600"
                          dangerouslySetInnerHTML={{ __html: address }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex">
                      <Clock className="h-5 w-5 text-glamour-700 mr-3 mt-1" />
                      <div>
                        <h3 className="font-medium">Business Hours</h3>
                        <div 
                          className="text-gray-600"
                          dangerouslySetInnerHTML={{ __html: workingHours }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
                <p className="text-glamour-600">Map will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
