import { GraduationCap, Users, Building2, Briefcase, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function WhyMindElevateSection() {
  const audiences = [
    {
      icon: GraduationCap,
      title: 'Students',
      description: 'Discover your strengths, choose the right stream, and build a clear roadmap for academic and career success.',
    },
    {
      icon: Users,
      title: 'Parents',
      description: 'Gain insights and guidance to effectively support your children in making informed career decisions.',
    },
    {
      icon: Building2,
      title: 'Schools & Colleges',
      description: 'Empower your students with structured career awareness programs and professional development workshops.',
    },
    {
      icon: Briefcase,
      title: 'Professionals',
      description: 'Navigate career transitions, upskill for the future, and achieve your professional growth goals.',
    },
  ];

  const reasons = [
    '16+ Years of Proven Expertise',
    'Personalized, One-on-One Guidance',
    'Holistic Career Development Approach',
    'Action-Oriented Results',
    'Empathetic & Supportive Environment',
    'Industry-Relevant Insights',
  ];

  return (
    <section id="why-mindelevate" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose MindElevate?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Empowering diverse audiences with clarity, confidence, and career success
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-8">Who We Help</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {audiences.map((audience, index) => (
              <Card
                key={index}
                className="p-6 text-center hover-elevate active-elevate-2 transition-all duration-300"
                data-testid={`card-audience-${index}`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <audience.icon className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-2">{audience.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{audience.description}</p>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-center mb-8">Why MindElevate Stands Out</h3>
          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-4">
              {reasons.map((reason, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-lg hover-elevate active-elevate-2 transition-all"
                  data-testid={`reason-${index}`}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <p className="font-medium text-foreground">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
