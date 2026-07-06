import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { services as fallbackServices } from '@/content/siteContent';
import { getServices } from '@/lib/sanity';

export default function ServicesSection() {
  const [, setLocation] = useLocation();
  const { data } = useQuery({
    queryKey: ['sanity', 'services'],
    queryFn: getServices,
  });

  const services = data && data.length > 0 ? data : fallbackServices;

  return (
    <section id="services" className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive counseling and guidance services tailored to your unique needs and aspirations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={service.id} className="overflow-hidden hover-elevate active-elevate-2 transition-all duration-300 hover:shadow-lg" data-testid={`card-service-${index}`}>
              <div className="aspect-[4/3] overflow-hidden bg-muted/40">
                {service.image ? (
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                ) : null}
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {(service.features || []).map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-foreground/80">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" size="sm" className="w-full" onClick={() => setLocation('/booking')} data-testid={`button-book-service-${index}`}>
                  View Plans
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
