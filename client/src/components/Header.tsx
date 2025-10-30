import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoImage from '@assets/image_1761851162836.png';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#why-mindelevate', label: 'Why MindElevate' },
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#blog', label: 'Blog' },
    { href: '#contact', label: 'Contact' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20 md:h-24">
          <Link href="/" className="flex items-center hover-elevate active-elevate-2 transition-all duration-300 rounded-lg p-2 -m-2" data-testid="link-home">
            <img src={logoImage} alt="MindElevate" className="h-16 w-16 md:h-20 md:w-20" />
          </Link>

          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="px-5 py-2.5 text-sm font-medium text-foreground/70 hover:text-foreground transition-all duration-200 hover-elevate rounded-lg"
                data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center">
            <Button variant="default" size="default" className="shadow-sm" asChild data-testid="button-book-session">
              <Link href="#contact">Book a Session</Link>
            </Button>
          </div>

          <button
            className="lg:hidden p-2 hover-elevate active-elevate-2 rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-background border-t">
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="px-4 py-3 text-sm font-medium text-foreground/80 hover:text-foreground hover-elevate rounded-md"
                data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </a>
            ))}
            <Button variant="default" size="default" className="mt-2" asChild data-testid="button-mobile-book-session">
              <Link href="#contact">Book a Session</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
