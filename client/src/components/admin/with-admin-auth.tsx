import { useEffect } from 'react';
import { useLocation, useNavigate } from 'wouter';
import { useAdminAuth, useAdminPermissions, ADMIN_PERMISSIONS } from '@/hooks/use-admin-auth';
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
    const [, navigate] = useLocation();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          await refreshToken();
        } catch (error) {
          navigate('/admin/login');
        }
      };

      checkAuth();
    }, [refreshToken, navigate]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-rich-black to-black">
          <Loader2 className="w-8 h-8 text-luxury-gold animate-spin" />
        </div>
      );
    }

    if (!isAuthenticated) {
      navigate('/admin/login');
      return null;
    }

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

    return <WrappedComponent {...props} />;
  };
}

// Example usage:
// const ProtectedAdminDashboard = withAdminAuth(AdminDashboard, {
//   requiredPermissions: [ADMIN_PERMISSIONS.MANAGE_CONTENT]
// });
