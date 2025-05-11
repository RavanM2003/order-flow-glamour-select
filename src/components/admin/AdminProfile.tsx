import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const AdminProfile = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@glamour.com',
    phone: '+994 50 123 45 67',
    address: 'Baku, Azerbaijan',
  });
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Profil məlumatları yadda saxlanıldı!',
      duration: 2000,
    });
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      toast({
        title: 'Yeni parollar uyğun deyil!',
        duration: 2500,
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Parol uğurla dəyişdirildi!',
      duration: 2000,
    });
    setPassword({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="w-full py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="profile">Profil məlumatları</TabsTrigger>
          <TabsTrigger value="password">Parol dəyiş</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profil Məlumatları</CardTitle>
              <CardDescription>Admin hesabınız üçün əsas məlumatlar</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input id="name" name="name" value={profile.name} onChange={handleProfileChange} required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={profile.email} onChange={handleProfileChange} required />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" name="phone" value={profile.phone} onChange={handleProfileChange} required />
                </div>
                <div>
                  <Label htmlFor="address">Ünvan</Label>
                  <Input id="address" name="address" value={profile.address} onChange={handleProfileChange} required />
                </div>
                <Button type="submit" className="bg-glamour-700 hover:bg-glamour-800">Yadda saxla</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Parolu dəyiş</CardTitle>
              <CardDescription>Hesabınız üçün yeni parol təyin edin</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSave} className="space-y-4">
                <div>
                  <Label htmlFor="current">Cari parol</Label>
                  <Input id="current" name="current" type="password" value={password.current} onChange={handlePasswordChange} required />
                </div>
                <div>
                  <Label htmlFor="new">Yeni parol</Label>
                  <Input id="new" name="new" type="password" value={password.new} onChange={handlePasswordChange} required />
                </div>
                <div>
                  <Label htmlFor="confirm">Yeni parolu təkrar daxil edin</Label>
                  <Input id="confirm" name="confirm" type="password" value={password.confirm} onChange={handlePasswordChange} required />
                </div>
                <Button type="submit" className="bg-glamour-700 hover:bg-glamour-800">Parolu dəyiş</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProfile; 