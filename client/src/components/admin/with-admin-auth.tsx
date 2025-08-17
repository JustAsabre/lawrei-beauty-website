import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAdminAuth, useAdminPermissions } from '@/hooks/use-admin-auth';
import { Loader2 } from 'lucide-react';

interface WithAdminAuthProps {
  requiredPermissions?: string[];
}

export function withAdminAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { requiredPermissions = [] }: WithAdminAuthProps = {}
) {
  return function WithAdminAuthComponent(props: P) {
    const { isAuthenticated, isLoading, refreshToken } = useAdminAuth();
    const hasPermissions = useAdminPermissions(requiredPermissions);
    const [, setLocation] = useLocation();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          if (!isAuthenticated) {
            await refreshToken();
          }
        } catch (error) {
          setLocation('/admin/login');
        }
      };

      checkAuth();
    }, [isAuthenticated, refreshToken, setLocation]);

    // Show loading state while checking auth
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-rich-black to-black">
          <Loader2 className="w-8 h-8 text-luxury-gold animate-spin" />
        </div>
      );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      setLocation('/admin/login');
      return null;
    }

    // Show access denied if missing permissions
    if (requiredPermissions.length > 0 && !hasPermissions) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-rich-black to-black">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h2>
            <p className="text-gray-400">
              You don't have the required permissions to access this page.
            </p>
          </div>
        </div>
      );
    }

    // Render the protected component
    return <WrappedComponent {...props} />;
  };
}