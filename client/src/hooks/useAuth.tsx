import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

interface AuthSession {
  authenticated: boolean;
  admin?: {
    id: string;
    email: string;
  };
}

export function useAuth() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: session, isLoading } = useQuery<AuthSession>({
    queryKey: ['/api/admin/session'],
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/admin/logout');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/session'] });
      setLocation('/admin');
    },
  });

  return {
    session,
    isLoading,
    isAuthenticated: session?.authenticated || false,
    admin: session?.admin,
    logout: () => logoutMutation.mutate(),
  };
}
