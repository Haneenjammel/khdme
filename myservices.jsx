import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pause, Play, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORY_LABELS as categoryLabels, CITY_LABELS as cityLabels } from '@/lib/lebanon-data';
import { toast } from 'sonner';
import { useLang } from '@/lib/LanguageContext';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function MyServices() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();
  const { t } = useLang();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['my-services', user?.email],
    queryFn: () => base44.entities.Service.filter({ provider_email: user.email }, '-created_date', 50),
    enabled: !!user?.email,
  });

  const updateService = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Service.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-services'] }),
  });

  const deleteService = useMutation({
    mutationFn: (id) => base44.entities.Service.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-services'] });
      toast.success(t.delete);
    },
  });

  const toggleStatus = (service) => {
    const newStatus = service.status === 'active' ? 'paused' : 'active';
    updateService.mutate({ id: service.id, data: { status: newStatus } });
  };

  const statusColors = {
    active: 'bg-secondary/10 text-secondary',
    paused: 'bg-chart-4/10 text-chart-4',
    removed: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className="max-w-lg mx-auto px-5 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl">{t.myServicesTitle}</h1>
        <Link to="/post">
          <Button size="sm" className="bg-primary text-primary-foreground rounded-xl font-heading font-semibold">
            <Plus className="w-4 h-4 mr-1" /> {t.post}
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-card rounded-2xl border border-border h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-3">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl border border-border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-heading font-semibold text-sm truncate">{service.title}</h3>
                      <Badge className={`text-[10px] px-1.5 py-0 border-0 ${statusColors[service.status]}`}>
                        {t[service.status] || service.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {categoryLabels[service.category]} · {cityLabels[service.city]} · ${service.price_min}{service.price_max ? `–$${service.price_max}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Link to={`/service/${service.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"
                      onClick={() => toggleStatus(service)}>
                      {service.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t.confirmDelete}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t.confirmDeleteMsg}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteService.mutate(service.id)}>
                            {t.delete}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {!isLoading && services.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-muted-foreground text-sm">{t.noMyServices}</p>
          <Link to="/post" className="inline-block mt-3">
            <Button className="bg-primary text-primary-foreground rounded-xl font-heading font-semibold">
              <Plus className="w-4 h-4 mr-1" /> {t.postFirst}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
