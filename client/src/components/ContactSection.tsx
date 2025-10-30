import { useState } from 'react';
import { Mail, Phone, Linkedin, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Message Sent!',
          description: 'Thank you for reaching out. We will get back to you soon.',
        });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
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
            <h3 className="text-2xl font-semibold mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  data-testid="input-name"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  data-testid="input-email"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  data-testid="input-phone"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  data-testid="input-message"
                  className="mt-2"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
                data-testid="button-submit-contact"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <a
                  href="mailto:gladis69diana@gmail.com"
                  className="flex items-center gap-3 text-foreground/80 hover:text-foreground hover-elevate p-3 rounded-md transition-colors"
                  data-testid="link-email"
                >
                  <Mail className="h-5 w-5 text-primary" />
                  <span>gladis69diana@gmail.com</span>
                </a>
                <a
                  href="tel:+919791237169"
                  className="flex items-center gap-3 text-foreground/80 hover:text-foreground hover-elevate p-3 rounded-md transition-colors"
                  data-testid="link-phone"
                >
                  <Phone className="h-5 w-5 text-primary" />
                  <span>+91 97912 37169</span>
                </a>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  data-testid="button-linkedin"
                >
                  <a href="https://linkedin.com/in/gladis-diana-63617129" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  data-testid="button-facebook"
                >
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-5 w-5" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  data-testid="button-instagram"
                >
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-5 w-5" />
                  </a>
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/10 to-purple-600/10">
              <h3 className="text-xl font-semibold mb-2">Free Consultation</h3>
              <p className="text-muted-foreground mb-4">
                Book a free 30-minute consultation to discuss your career goals and explore how we can help.
              </p>
              <p className="text-sm text-muted-foreground">
                Available for students, parents, professionals, and institutions.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
