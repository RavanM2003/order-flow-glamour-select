import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@glamour.com',
  });
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [msg, setMsg] = useState('');
  const [pwMsg, setPwMsg] = useState('');

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('Profil məlumatları yadda saxlanıldı!');
    setTimeout(() => setMsg(''), 2000);
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      setPwMsg('Yeni parollar uyğun deyil!');
      return;
    }
    setPwMsg('Parol uğurla dəyişdirildi!');
    setTimeout(() => setPwMsg(''), 2000);
    setPassword({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4 text-glamour-800">Profil Məlumatları</h2>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Ad Soyad</label>
              <Input name="name" value={profile.name} onChange={handleProfileChange} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Input name="email" type="email" value={profile.email} onChange={handleProfileChange} required />
            </div>
            <Button type="submit" className="bg-glamour-700 hover:bg-glamour-800">Yadda saxla</Button>
            {msg && <div className="text-green-600 mt-2">{msg}</div>}
          </form>
        </CardContent>
      </Card>
      <Card className="mt-8">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4 text-glamour-800">Parolu dəyiş</h2>
          <form onSubmit={handlePasswordSave} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Cari parol</label>
              <Input name="current" type="password" value={password.current} onChange={handlePasswordChange} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Yeni parol</label>
              <Input name="new" type="password" value={password.new} onChange={handlePasswordChange} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Yeni parolu təkrar daxil edin</label>
              <Input name="confirm" type="password" value={password.confirm} onChange={handlePasswordChange} required />
            </div>
            <Button type="submit" className="bg-glamour-700 hover:bg-glamour-800">Parolu dəyiş</Button>
            {pwMsg && <div className="text-green-600 mt-2">{pwMsg}</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfile; 