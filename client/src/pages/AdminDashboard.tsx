import { Link, useLocation } from 'wouter';
import { LogOut, LayoutDashboard, MessageSquare, Newspaper, Star, CreditCard, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import ServicesManagement from '@/components/admin/ServicesManagement';
import TestimonialsManagement from '@/components/admin/TestimonialsManagement';
import BlogPostsManagement from '@/components/admin/BlogPostsManagement';
import ContactsManagement from '@/components/admin/ContactsManagement';
import PaymentsManagement from '@/components/admin/PaymentsManagement';
import logoImage from '@assets/image_1761851162836.png';

export default function AdminDashboard() {
  const { logout, admin } = useAuth();
  const [location] = useLocation();

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/services', label: 'Services', icon: Settings },
    { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
    { href: '/admin/blog-posts', label: 'Blog Posts', icon: Newspaper },
    { href: '/admin/contacts', label: 'Contacts', icon: MessageSquare },
    { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  ];

  const renderContent = () => {
    if (location === '/admin/services') return <ServicesManagement />;
    if (location === '/admin/testimonials') return <TestimonialsManagement />;
    if (location === '/admin/blog-posts') return <BlogPostsManagement />;
    if (location === '/admin/contacts') return <ContactsManagement />;
    if (location === '/admin/payments') return <PaymentsManagement />;
    
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navItems.slice(1).map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="p-6 bg-card border rounded-lg hover-elevate active-elevate-2 transition-all cursor-pointer">
                <item.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="text-xl font-semibold">{item.label}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Manage {item.label.toLowerCase()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex">
        <aside className="w-64 bg-card border-r fixed h-full overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3 mb-2">
              <img src={logoImage} alt="MindElevate" className="h-10 w-10" />
              <span className="font-bold text-lg">MindElevate</span>
            </div>
            <p className="text-sm text-muted-foreground">Admin Dashboard</p>
          </div>

          <nav className="p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'hover-elevate text-foreground/80 hover:text-foreground'
                    }`}
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-card">
            <div className="text-sm text-muted-foreground mb-3">
              Logged in as:<br />
              <span className="font-medium text-foreground">{admin?.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={logout}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </aside>

        <main className="ml-64 flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </ProtectedRoute>
  );
}
