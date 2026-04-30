import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { User, Mail, Briefcase, Star, LogOut, MapPin } from 'lucide-react';
import { CITIES } from '@/lib/lebanon-data';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useLang } from '@/lib/LanguageContext';
import ProfileLanguageSwitcher from '@/components/ProfileLanguageSwitcher';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [preferredCity, setPreferredCity] = useState('');
  const { t } = useLang();

  useEffect(() => {
    base44.auth.me().then((u) => {
      setUser(u);
      setPreferredCity(u?.preferred_city || '');
    }).catch(() => {});
  }, []);

  const { data: myServices = [] } = useQuery({
    queryKey: ['my-services-count', user?.email],
    queryFn: () => base44.entities.Service.filter({ provider_email: user.email }, '', 100),
    enabled: !!user?.email,
  });

  const { data: myReviews = [] } = useQuery({
    queryKey: ['my-reviews-count', user?.email],
    queryFn: () => base44.entities.Review.filter({ reviewer_email: user.email }, '', 100),
    enabled: !!user?.email,
  });

  const handleSaveCity = async () => {
    await base44.auth.updateMe({ preferred_city: preferredCity });
    toast.success(t.save);
  };

  const handleLogout = () => {
    base44.auth.logout('/');
  };

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-5 pt-6 text-center py-20">
        <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-5 pt-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading font-bold text-xl">{user.full_name || 'User'}</h1>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
            <Mail className="w-3.5 h-3.5" />
            {user.email}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-2xl border border-border p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
              <Briefcase className="w-4 h-4" />
            </div>
            <p className="font-heading font-bold text-2xl">{myServices.length}</p>
            <p className="text-xs text-muted-foreground">{t.totalServices}</p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-chart-4 mb-1">
              <Star className="w-4 h-4" />
            </div>
            <p className="font-heading font-bold text-2xl">{myReviews.length}</p>
            <p className="text-xs text-muted-foreground">{t.totalReviews}</p>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
          <h3 className="font-heading font-semibold text-sm">{t.editProfile}</h3>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{t.myLocation}</Label>
            <Select value={preferredCity} onValueChange={setPreferredCity}>
              <SelectTrigger className="rounded-xl bg-background border-border h-10">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  <SelectValue placeholder={t.selectCity} />
                </div>
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {CITIES.filter(c => c.key !== 'all').map(city => (
                  <SelectItem key={city.key} value={city.key}>{city.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSaveCity} size="sm"
            className="bg-secondary text-secondary-foreground rounded-xl font-heading font-semibold">
            {t.save}
          </Button>
        </div>

        {/* Language */}
        <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
          <h3 className="font-heading font-semibold text-sm">Language / اللغة / Langue</h3>
          <ProfileLanguageSwitcher />
        </div>

        {/* Logout */}
        <Button variant="outline" onClick={handleLogout}
          className="w-full rounded-xl h-11 border-destructive/30 text-destructive hover:bg-destructive/5 font-heading font-semibold">
          <LogOut className="w-4 h-4 mr-2" />
          {t.logout}
        </Button>
      </motion.div>
    </div>
  );
}
