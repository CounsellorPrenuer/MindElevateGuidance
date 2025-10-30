import { Check, Award, Users, Target, Heart } from 'lucide-react';
import doctorImage from '@assets/generated_images/Dr._Gladis_professional_portrait_e7784a16.png';

export default function AboutSection() {
  const highlights = [
    { icon: Award, text: '16 Years of Experience in Career Guidance' },
    { icon: Users, text: 'Empowering Students, Parents & Professionals' },
    { icon: Target, text: 'Personalized, Action-Oriented Approach' },
    { icon: Heart, text: 'Compassionate & Results-Driven Mentorship' },
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">About Dr. Gladis Diana Sivakumar</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              I'm Dr. Gladis Diana Sivakumar, a dedicated counselor and mentor with a deep passion for guiding individuals towards personal and professional success.
            </p>
            <p className="text-base text-muted-foreground mb-8 leading-relaxed">
              With 16 years of experience in Career Guidance, life coaching, and mentorship, I specialize in helping clients unlock their potential, overcome challenges, and navigate their journeys with clarity and confidence. Through MindElevate, I empower ambitious individuals and business leaders to develop resilience, sharpen their vision, and build meaningful, fulfilling careers.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-start gap-3" data-testid={`highlight-${index}`}>
                  <div className="p-2 bg-primary/10 rounded-md">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground/80 leading-snug">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="p-6 bg-card border rounded-lg">
              <p className="text-base italic text-card-foreground leading-relaxed">
                "My mission is to empower individuals with the tools, strategies, and confidence they need to design careers that align with their passions and aspirations."
              </p>
              <p className="text-sm font-semibold text-primary mt-4">— Dr. Gladis Diana Sivakumar</p>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl transform rotate-3"></div>
              <img
                src={doctorImage}
                alt="Dr. Gladis Diana Sivakumar"
                className="relative rounded-2xl shadow-xl w-full object-cover"
                data-testid="img-doctor"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
