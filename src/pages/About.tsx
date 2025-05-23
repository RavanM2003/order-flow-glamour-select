
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSettings } from '@/hooks/use-settings';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/context/LanguageContext';

interface TeamMember {
  id: string;
  full_name: string;
  bio?: string;
  photo_url?: string;
  role: string;
  position?: string;
}

const About = () => {
  const { getLocalizedSetting, isLoading: settingsLoading } = useSettings();
  const { t } = useLanguage();

  const { data: teamMembers, isLoading: teamLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          full_name,
          bio,
          photo_url,
          role
        `)
        .in('role', ['staff', 'admin', 'super_admin'])
        .not('full_name', 'is', null);

      if (error) {
        console.error('Error fetching team members:', error);
        throw error;
      }

      return data as TeamMember[];
    },
  });

  const aboutUs = getLocalizedSetting('about_us');
  const siteName = getLocalizedSetting('site_name');

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-12">
        <div className="container">
          <h1 className="text-4xl font-bold text-glamour-800 mb-2 text-center">{t('nav.about')}</h1>
          
          {/* About Section */}
          <div className="max-w-4xl mx-auto mb-16">
            {settingsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-5/6" />
              </div>
            ) : (
              <p className="text-lg text-gray-600 leading-relaxed text-center">
                {aboutUs}
              </p>
            )}
          </div>

          {/* Our Story Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-glamour-800 mb-6 text-center">Our Story</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Founded with a passion for enhancing natural beauty, {siteName} has been serving our community with dedication and expertise. Our journey began with a simple mission: to create a space where everyone feels beautiful and confident.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We believe that beauty is not just about appearance, but about feeling confident and comfortable in your own skin. Our team of skilled professionals is committed to providing personalized services that bring out the best in you.
                </p>
              </div>
              <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
                <p className="text-glamour-600">Studio Image</p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-glamour-800 mb-8 text-center">Meet Our Team</h2>
            
            {teamLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-6">
                    <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ))}
              </div>
            ) : teamMembers && teamMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member) => (
                  <div key={member.id} className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {member.photo_url ? (
                        <img 
                          src={member.photo_url} 
                          alt={member.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl text-glamour-600">
                          {member.full_name?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-glamour-800 mb-1">
                      {member.full_name}
                    </h3>
                    <p className="text-glamour-600 mb-3 capitalize">
                      {member.role.replace('_', ' ')}
                    </p>
                    {member.bio && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {member.bio}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No team members to display at the moment.</p>
              </div>
            )}
          </div>

          {/* Values Section */}
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-3xl font-bold text-glamour-800 mb-8 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-glamour-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold text-glamour-800 mb-2">Quality</h3>
                <p className="text-gray-600">We use only the highest quality products and maintain the strictest standards in all our services.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-glamour-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💝</span>
                </div>
                <h3 className="text-xl font-semibold text-glamour-800 mb-2">Care</h3>
                <p className="text-gray-600">Every client receives personalized attention and care tailored to their unique needs and preferences.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-glamour-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌟</span>
                </div>
                <h3 className="text-xl font-semibold text-glamour-800 mb-2">Excellence</h3>
                <p className="text-gray-600">We strive for excellence in every service, ensuring you leave feeling confident and beautiful.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
