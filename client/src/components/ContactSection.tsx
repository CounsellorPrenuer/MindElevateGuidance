import { useState } from 'react';
import { Facebook, Instagram, Linkedin, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { openMailDraft, saveLeadToCloudflareBackground } from '@/lib/formSubmit';

export default function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const body = `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || 'Not provided'}\n\nMessage:\n${formData.message}`;

    saveLeadToCloudflareBackground({
      formType: 'contact',
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
    });

    // Must be triggered directly from the submit event for maximum browser compatibility.
    openMailDraft(`MindElevate inquiry from ${formData.name}`, body);

    toast({
      title: 'Email draft ready',
      description: 'Your details were prepared and a pre-filled email draft should open now.',
    });

    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to transform your career? Reach out for a free consultation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <Card className="p-8">
            <h3 className="text-2xl font-semibold mb-2">Send us a Message</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Submissions are logged to your Cloudflare worker and open a pre-filled email draft for fast follow-up.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required data-testid="input-name" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required data-testid="input-email" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} data-testid="input-phone" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required data-testid="input-message" className="mt-2" />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting} data-testid="button-submit-contact">
                {isSubmitting ? 'Preparing...' : 'Send Inquiry'}
              </Button>
            </form>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <a href="mailto:gladis69diana@gmail.com" className="flex items-center gap-3 text-foreground/80 hover:text-foreground hover-elevate p-3 rounded-md transition-colors" data-testid="link-email">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>gladis69diana@gmail.com</span>
                </a>
                <a href="tel:+919791237169" className="flex items-center gap-3 text-foreground/80 hover:text-foreground hover-elevate p-3 rounded-md transition-colors" data-testid="link-phone">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>+91 97912 37169</span>
                </a>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
              <div className="flex gap-3">
                <Button variant="outline" size="icon" asChild data-testid="button-linkedin">
                  <a href="https://linkedin.com/in/gladis-diana-63617129" target="_blank" rel="noopener noreferrer"><Linkedin className="h-5 w-5" /></a>
                </Button>
                <Button variant="outline" size="icon" asChild data-testid="button-facebook">
                  <a href="#" aria-label="Facebook link coming soon"><Facebook className="h-5 w-5" /></a>
                </Button>
                <Button variant="outline" size="icon" asChild data-testid="button-instagram">
                  <a href="#" aria-label="Instagram link coming soon"><Instagram className="h-5 w-5" /></a>
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/10 to-purple-600/10">
              <h3 className="text-xl font-semibold mb-2">Free Consultation</h3>
              <p className="text-muted-foreground mb-4">Book a free 30-minute consultation to discuss your career goals and explore how we can help.</p>
              <p className="text-sm text-muted-foreground">Available for students, parents, professionals, and institutions.</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
