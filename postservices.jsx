import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { CATEGORIES, CITIES } from '@/lib/lebanon-data';
import { useLang } from '@/lib/LanguageContext';

const categories = CATEGORIES.filter(c => c.key !== 'all');
const cities = CITIES.filter(c => c.key !== 'all');

export default function PostService() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { t } = useLang();
  const [form, setForm] = useState({
    title: '', description: '', category: '',
    price_min: '', price_max: '', phone: '', whatsapp: '', city: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const createService = useMutation({
    mutationFn: async (data) => {
      let image_url = '';
      if (imageFile) {
        setUploading(true);
        const { file_url } = await base44.integrations.Core.UploadFile({ file: imageFile });
        image_url = file_url;
        setUploading(false);
      }
      return base44.entities.Service.create({
        ...data,
        image_url,
        provider_name: user?.full_name || 'Provider',
        provider_email: user?.email || '',
        status: 'active',
      });
    },
    onSuccess: () => {
      toast.success(t.submit);
      navigate('/my-services');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createService.mutate({
      ...form,
      price_min: parseFloat(form.price_min) || 5,
      price_max: form.price_max ? parseFloat(form.price_max) : undefined,
    });
  };

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="max-w-lg mx-auto px-5 pt-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-2xl mb-1">{t.postService}</h1>
        <p className="text-sm text-muted-foreground mb-6">{t.tagline}</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">{t.serviceTitle} *</Label>
            <Input placeholder={t.titlePlaceholder} value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="rounded-xl bg-card border-border h-11" required />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">{t.description} *</Label>
            <Textarea placeholder={t.descPlaceholder} value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              className="rounded-xl bg-card border-border min-h-[100px]" required />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">{t.category} *</Label>
            <Select value={form.category} onValueChange={(v) => updateField('category', v)} required>
              <SelectTrigger className="rounded-xl bg-card border-border h-11">
                <SelectValue placeholder={t.selectCategory} />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c.key} value={c.key}>{t[c.key] || c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">{t.minPrice} *</Label>
              <Input type="number" min="1" step="0.5" placeholder="5"
                value={form.price_min} onChange={(e) => updateField('price_min', e.target.value)}
                className="rounded-xl bg-card border-border h-11" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">{t.maxPrice}</Label>
              <Input type="number" min="1" step="0.5" placeholder="7"
                value={form.price_max} onChange={(e) => updateField('price_max', e.target.value)}
                className="rounded-xl bg-card border-border h-11" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">{t.city} *</Label>
            <Select value={form.city} onValueChange={(v) => updateField('city', v)} required>
              <SelectTrigger className="rounded-xl bg-card border-border h-11">
                <SelectValue placeholder={t.selectCity} />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {cities.map(c => (
                  <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">{t.phone} *</Label>
            <Input type="tel" placeholder="+961 XX XXX XXX" value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="rounded-xl bg-card border-border h-11" required />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">{t.whatsapp}</Label>
            <Input type="tel" placeholder="+961 XX XXX XXX" value={form.whatsapp}
              onChange={(e) => updateField('whatsapp', e.target.value)}
              className="rounded-xl bg-card border-border h-11" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">{t.addImage}</Label>
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary/50 transition-colors bg-card">
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => setImageFile(e.target.files[0])} />
              {imageFile ? (
                <div className="flex items-center gap-2 text-secondary">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{imageFile.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Upload className="w-6 h-6" />
                  <span className="text-sm">{t.addImage}</span>
                </div>
              )}
            </label>
          </div>

          <Button type="submit" disabled={createService.isPending || uploading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 font-heading font-semibold text-base">
            {createService.isPending || uploading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.submitting}
              </span>
            ) : t.submit}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
