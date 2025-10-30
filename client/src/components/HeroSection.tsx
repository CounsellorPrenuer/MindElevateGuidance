import { ArrowRight, Sparkles } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import heroImage from '@assets/generated_images/Hero_section_background_image_e3ef8340.png';

export default function HeroSection() {
  const [, setLocation] = useLocation();

  const scrollToServices = () => {
    const element = document.querySelector('#services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/60 to-background/80" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-32 md:py-40">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 text-sm font-medium" data-testid="badge-experience">
            <Sparkles className="h-4 w-4 mr-2" />
            16 Years of Experience
          </Badge>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
            Elevating Perspectives and Careers through Counseling
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            I'm Dr. Gladis Diana Sivakumar, a dedicated counselor and mentor helping individuals unlock their potential, overcome challenges, and navigate their journeys with clarity and confidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="default"
              className="text-base px-8 bg-primary/90 backdrop-blur-sm"
              onClick={() => setLocation('/booking')}
              data-testid="button-book-session"
            >
              Book a Session
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 bg-background/50 backdrop-blur-sm"
              onClick={scrollToServices}
              data-testid="button-explore-services"
            >
              Explore Services
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { label: 'Students', icon: '🎓' },
              { label: 'Parents', icon: '👨‍👩‍👧‍👦' },
              { label: 'Schools', icon: '🏫' },
              { label: 'Professionals', icon: '💼' },
            ].map((audience) => (
              <div key={audience.label} className="text-center" data-testid={`audience-${audience.label.toLowerCase()}`}>
                <div className="text-3xl mb-2">{audience.icon}</div>
                <p className="text-sm font-medium text-foreground/80">{audience.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
