import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import ServiceCard from '@/components/services/ServiceCard';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLang } from '@/lib/LanguageContext';

const categoryCards = [
  { key: 'cleaning', icon: '🧹', color: 'from-primary/20 to-primary/5' },
  { key: 'tutoring', icon: '📚', color: 'from-secondary/20 to-secondary/5' },
  { key: 'repair', icon: '🔧', color: 'from-accent/20 to-accent/5' },
  { key: 'design', icon: '🎨', color: 'from-chart-4/20 to-chart-4/5' },
  { key: 'delivery', icon: '🚚', color: 'from-chart-5/20 to-chart-5/5' },
  { key: 'tech_support', icon: '💻', color: 'from-primary/20 to-primary/5' },
];

export default function Home() {
  const [user, setUser] = useState(null);
  const { t } = useLang();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services-home'],
    queryFn: () => base44.entities.Service.filter({ status: 'active' }, '-created_date', 10),
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews-all'],
    queryFn: () => base44.entities.Review.list('-created_date', 200),
  });

  const getAvgRating = (serviceId) => {
    const serviceReviews = reviews.filter(r => r.service_id === serviceId);
    if (serviceReviews.length === 0) return 0;
    return serviceReviews.reduce((sum, r) => sum + r.rating, 0) / serviceReviews.length;
  };

  const featuredServices = services.filter(s => s.featured);
  const recentServices = services.slice(0, 6);

  return (
    <div className="max-w-lg mx-auto">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-primary via-primary/90 to-secondary text-primary-foreground px-5 pt-12 pb-8 rounded-b-[2rem]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-8 w-20 h-20 rounded-full bg-white/30" />
          <div className="absolute bottom-4 left-6 w-14 h-14 rounded-full bg-white/20" />
        </div>
        <LanguageSwitcher className="absolute top-4 right-4" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-body opacity-80">
            {user ? t.welcomeBack(user.full_name?.split(' ')[0] || 'friend') : t.welcomeTo}
          </p>
          <h1 className="font-heading font-extrabold text-3xl mt-1 leading-tight">
            {t.appName}<span className="text-chart-4">.</span>
          </h1>
          <p className="text-sm font-body opacity-80 mt-1.5 max-w-[280px]">
            {t.tagline}
          </p>

          {/* Search */}
          <Link to="/browse" className="block mt-5">
            <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
              <Search className="w-4 h-4 opacity-70" />
              <span className="ml-3 text-sm opacity-70">{t.searchPlaceholder}</span>
            </div>
          </Link>
        </motion.div>
      </div>

      <div className="px-5 pt-6 space-y-7">
        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-bold text-lg">{t.categories}</h2>
            <Link to="/browse" className="text-primary text-xs font-medium flex items-center gap-1">
              {t.seeAll} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {categoryCards.map((cat, i) => (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/browse?category=${cat.key}`}
                  className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-gradient-to-br ${cat.color} border border-border/50 hover:shadow-md transition-all`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-xs font-medium text-foreground">{t[cat.key]}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured */}
        {featuredServices.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-chart-4" />
              <h2 className="font-heading font-bold text-lg">{t.featured}</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
              {featuredServices.map((service, i) => (
                <div key={service.id} className="min-w-[260px] max-w-[260px]">
                  <ServiceCard service={service} avgRating={getAvgRating(service.id)} index={i} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-bold text-lg">{t.recentServices}</h2>
            <Link to="/browse" className="text-primary text-xs font-medium flex items-center gap-1">
              {t.viewAll} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-card rounded-2xl border border-border h-52 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {recentServices.map((service, i) => (
                <ServiceCard key={service.id} service={service} avgRating={getAvgRating(service.id)} index={i} />
              ))}
            </div>
          )}
          {!isLoading && recentServices.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground text-sm">{t.noServices}</p>
              <Link to="/post" className="text-primary text-sm font-medium mt-2 inline-block">
                {t.beFirst}
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
