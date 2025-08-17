import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUser {
  id: string;
  username: string;
  role: 'super_admin' | 'admin' | 'editor';
  permissions: string[];
  token: string;
}

interface AdminAuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { username: string; password: string; twoFactorCode?: string }) => Promise<void>;
  logout: () => void;
  checkPermission: (permission: string) => boolean;
  refreshToken: () => Promise<void>;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com';

export const useAdminAuth = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${BACKEND_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
          }

          const data = await response.json();
          
          // Store the user data and token
          set({
            user: {
              id: data.id,
              username: data.username,
              role: data.role,
              permissions: data.permissions,
              token: data.token,
            },
            isAuthenticated: true,
          });

          // Store token in localStorage for persistence
          localStorage.setItem('adminToken', data.token);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'An error occurred' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem('adminToken');
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkPermission: (permission: string) => {
        const { user } = get();
        if (!user) return false;
        
        // Super admin has all permissions
        if (user.role === 'super_admin') return true;
        
        return user.permissions.includes(permission);
      },

      refreshToken: async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          const response = await fetch(`${BACKEND_URL}/admin/refresh-token`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Token refresh failed');
          }

          const data = await response.json();
          
          set({
            user: {
              ...get().user!,
              token: data.token,
            },
          });

          localStorage.setItem('adminToken', data.token);
        } catch (error) {
          // If token refresh fails, log out the user
          get().logout();
          throw error;
        }
      },
    }),
    {
      name: 'admin-auth-storage',
      // Only persist the user and isAuthenticated state
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Export permission constants
export const ADMIN_PERMISSIONS = {
  MANAGE_CONTENT: 'manage_content',
  MANAGE_BOOKINGS: 'manage_bookings',
  MANAGE_USERS: 'manage_users',
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_MEDIA: 'manage_media',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_TESTIMONIALS: 'manage_testimonials',
  MANAGE_SERVICES: 'manage_services',
} as const;

// Helper hook for checking multiple permissions
export const useAdminPermissions = (permissions: string[]) => {
  const checkPermission = useAdminAuth((state) => state.checkPermission);
  return permissions.every(permission => checkPermission(permission));
};
