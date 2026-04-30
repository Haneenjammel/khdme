import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ServiceCard from '@/components/services/ServiceCard';
import CategoryFilter from '@/components/services/CategoryFilter';
import CityFilter from '@/components/services/CityFilter';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/LanguageContext';

export default function Browse() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [city, setCity] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useLang();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services-browse'],
    queryFn: () => base44.entities.Service.filter({ status: 'active' }, '-created_date', 100),
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

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchCategory = category === 'all' || s.category === category;
      const matchCity = city === 'all' || s.city === city;
      const matchSearch = !searchQuery ||
        s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchCity && matchSearch;
    });
  }, [services, category, city, searchQuery]);

  return (
    <div className="max-w-lg mx-auto px-5 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-heading font-bold text-2xl">{t.browse}</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-xl border transition-all ${
            showFilters ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={t.searchServices}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 rounded-xl bg-card border-border h-11 font-body"
        />
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <CityFilter selected={city} onSelect={setCity} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories */}
      <div className="mb-5">
        <CategoryFilter selected={category} onSelect={setCategory} />
      </div>

      {/* Results Count */}
      <p className="text-xs text-muted-foreground mb-3">
        {t.results(filteredServices.length)}
      </p>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-card rounded-2xl border border-border h-52 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredServices.map((service, i) => (
            <ServiceCard key={service.id} service={service} avgRating={getAvgRating(service.id)} index={i} />
          ))}
        </div>
      )}
      {!isLoading && filteredServices.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-muted-foreground text-sm">{t.noResults}</p>
          <p className="text-muted-foreground text-xs mt-1">{t.tryDifferent}</p>
        </div>
      )}
    </div>
  );
}
