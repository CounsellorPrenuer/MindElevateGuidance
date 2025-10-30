import { useQuery, useMutation } from '@tanstack/react-query';
import { Trash2, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Contact } from '@shared/schema';

export default function ContactsManagement() {
  const { toast } = useToast();

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ['/api/admin/contacts'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/admin/contacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contacts'] });
      toast({ title: 'Contact deleted successfully' });
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contact Submissions</h1>
        <p className="text-muted-foreground">Total: {contacts.length}</p>
      </div>

      <div className="space-y-4">
        {contacts.map((contact) => (
          <Card key={contact.id} className="p-6" data-testid={`contact-card-${contact.id}`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{contact.name}</h3>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${contact.email}`} className="hover:text-foreground">
                      {contact.email}
                    </a>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${contact.phone}`} className="hover:text-foreground">
                        {contact.phone}
                      </a>
                    </div>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap">{contact.message}</p>
                <p className="text-xs text-muted-foreground mt-4">
                  {new Date(contact.createdAt).toLocaleString()}
                </p>
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteMutation.mutate(contact.id)}
                data-testid={`button-delete-${contact.id}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}

        {contacts.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No contact submissions yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
