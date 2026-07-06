import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { testimonials as fallbackTestimonials } from '@/content/siteContent';
import { getTestimonials } from '@/lib/sanity';

export default function TestimonialsSection() {
  const { data } = useQuery({
    queryKey: ['sanity', 'testimonials'],
    queryFn: getTestimonials,
  });

  const testimonials = data && data.length > 0 ? data : fallbackTestimonials;
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (testimonials.length === 0) {
      return;
    }

    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real stories from students, parents, and professionals who transformed their careers
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Card className="p-8 md:p-12">
            <Quote className="h-12 w-12 text-primary/20 mb-6" />
            <p className="text-xl md:text-2xl text-foreground mb-8 leading-relaxed italic">{testimonials[currentIndex].quote}</p>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={testimonials[currentIndex].avatar || undefined} alt={testimonials[currentIndex].name} />
                <AvatarFallback>{testimonials[currentIndex].name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg" data-testid={`testimonial-name-${currentIndex}`}>{testimonials[currentIndex].name}</p>
                <p className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</p>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button variant="outline" size="icon" onClick={prev} data-testid="button-prev-testimonial">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((item, index) => (
                <button key={item.id} onClick={() => setCurrentIndex(index)} className={`h-2 rounded-full transition-all ${index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'}`} data-testid={`dot-${index}`} />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={next} data-testid="button-next-testimonial">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
