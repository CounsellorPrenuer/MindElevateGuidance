import { Mail, Phone, Linkedin, Facebook, Instagram } from 'lucide-react';
import { Link } from 'wouter';
import logoImage from '@assets/image_1761851162836.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logoImage} alt="MindElevate" className="h-10 w-10" />
              <span className="font-bold text-lg text-foreground">MindElevate</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Elevating perspectives and careers through personalized counseling and guidance.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <a href="#about" onClick={(e) => scrollToSection(e, '#about')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <a href="#services" onClick={(e) => scrollToSection(e, '#services')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Services
              </a>
              <a href="#testimonials" onClick={(e) => scrollToSection(e, '#testimonials')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Testimonials
              </a>
              <a href="#blog" onClick={(e) => scrollToSection(e, '#blog')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </a>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <nav className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Career Guidance</span>
              <span className="text-sm text-muted-foreground">Admission Guidance</span>
              <span className="text-sm text-muted-foreground">Workshops & Seminars</span>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:gladis69diana@gmail.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <Mail className="h-4 w-4" />
                gladis69diana@gmail.com
              </a>
              <a href="tel:+919791237169" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +91 97912 37169
              </a>
              <div className="flex gap-2 mt-2">
                <a href="https://linkedin.com/in/gladis-diana-63617129" target="_blank" rel="noopener noreferrer" className="p-2 hover-elevate active-elevate-2 rounded-md">
                  <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 hover-elevate active-elevate-2 rounded-md">
                  <Facebook className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 hover-elevate active-elevate-2 rounded-md">
                  <Instagram className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} MindElevate. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Website: <span className="text-foreground font-medium">elevatemindset.com</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
