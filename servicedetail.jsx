import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MapPin, DollarSign, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import ContactButtons from '@/components/services/ContactButtons';
import ReviewSection from '@/components/services/ReviewSection';
import { CATEGORY_ICONS as categoryIcons, CATEGORY_LABELS as categoryLabels, CITY_LABELS as cityLabels } from '@/lib/lebanon-data';
import { format } from 'date-fns';
import { useLang } from '@/lib/LanguageContext';

export default function ServiceDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const { t } = useLang();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: () => base44.entities.Service.filter({ id }, '', 1),
  });

  const service = services[0];

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => base44.entities.Review.filter({ service_id: id }, '-created_date', 50),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto px-5 pt-6">
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-muted rounded-2xl" />
          <div className="h-6 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-20 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-lg mx-auto px-5 pt-6 text-center py-20">
        <p className="text-4xl mb-3">😕</p>
        <p className="text-muted-foreground">{t.noResults}</p>
        <Link to="/browse" className="text-primary text-sm font-medium mt-3 inline-block">
          ← Back to browse
        </Link>
      </div>
    );
  }

  const priceText = service.price_max
    ? `$${service.price_min} – $${service.price_max}`
    : `$${service.price_min}`;

  return (
    <div className="max-w-lg mx-auto">
      {/* Hero Image */}
      <div className="relative h-56 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
        {service.image_url ? (
          <img src={service.image_url} alt={service.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl">
            {categoryIcons[service.category] || '⭐'}
          </div>
        )}
        <Link
          to="/browse"
          className="absolute top-4 left-4 p-2 bg-card/80 backdrop-blur-sm rounded-xl border border-border"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        {service.featured && (
          <Badge className="absolute top-4 right-4 bg-chart-4 text-foreground border-0 font-semibold">
            ⚡ Featured
          </Badge>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 pt-5 space-y-5"
      >
        {/* Title & Meta */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-heading font-bold text-xl leading-tight">{service.title}</h1>
            <Badge className="bg-primary/10 text-primary border-0 font-medium flex-shrink-0">
              {categoryLabels[service.category]}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {cityLabels[service.city]}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {format(new Date(service.created_date), 'MMM d, yyyy')}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="bg-secondary/10 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="font-heading font-bold text-2xl text-secondary flex items-center">
              <DollarSign className="w-5 h-5" />
              {priceText.replace('$', '')}
            </p>
          </div>
          <span className="text-xs text-muted-foreground">USD</span>
        </div>

        {/* Description */}
        <div>
          <h3 className="font-heading font-semibold text-sm mb-2">Description</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
        </div>

        {/* Provider */}
        <div className="bg-muted/50 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center">
            <User className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="font-medium text-sm">{service.provider_name}</p>
            <p className="text-xs text-muted-foreground">Service Provider</p>
          </div>
        </div>

        {/* Contact */}
        <ContactButtons phone={service.phone} whatsapp={service.whatsapp} />

        {/* Reviews */}
        <ReviewSection serviceId={id} reviews={reviews} currentUser={user} />
      </motion.div>
    </div>
  );
}
