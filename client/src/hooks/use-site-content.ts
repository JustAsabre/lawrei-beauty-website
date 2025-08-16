import { useQuery, useQueryClient } from "@tanstack/react-query";

interface SiteContent {
  id: string;
  section: string;
  title?: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  settings?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useSiteContent(section: string) {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ["/api/site-content", section],
    queryFn: async () => {
      console.log(`[useSiteContent] Fetching ${section} content...`);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/admin/site-content/${section}`);
        if (response.ok) {
          const data = await response.json();
          console.log(`[useSiteContent] Successfully fetched ${section} content:`, data);
          return data as SiteContent;
        }
        console.warn(`[useSiteContent] Failed to fetch ${section} content:`, response.status);
        return null;
      } catch (error) {
        console.error(`[useSiteContent] Error fetching ${section} content:`, error);
        return null;
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - longer cache for static content
    gcTime: 60 * 60 * 1000, // 1 hour garbage collection
    retry: 1,
    retryDelay: 2000,
  });

  // Function to invalidate and refresh this specific content
  const refreshContent = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/site-content", section] });
  };

  // Function to invalidate all site content
  const refreshAllContent = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/site-content"] });
  };

  return {
    ...query,
    refreshContent,
    refreshAllContent
  };
}

export function useServices() {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ["/api/services"],
    queryFn: async () => {
      console.log('[useServices] Fetching services...');
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/api/services`);
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        console.log('[useServices] Successfully fetched services:', data.length);
        return data;
      } catch (error) {
        console.error('[useServices] Error fetching services:', error);
        throw error;
      }
    },
    staleTime: 15 * 60 * 1000, // 15 minutes - services don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
    retry: 1,
    retryDelay: 2000,
  });

  const refreshServices = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/services"] });
  };

  return {
    ...query,
    refreshServices
  };
}

export function usePortfolio() {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ["/api/portfolio"],
    queryFn: async () => {
      console.log('[usePortfolio] Fetching portfolio...');
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com'}/api/portfolio`);
        if (!response.ok) throw new Error('Failed to fetch portfolio');
        const data = await response.json();
        console.log('[usePortfolio] Successfully fetched portfolio:', data.length);
        return data;
      } catch (error) {
        console.error('[usePortfolio] Error fetching portfolio:', error);
        throw error;
      }
    },
    staleTime: 15 * 60 * 1000, // 15 minutes - portfolio doesn't change often
    gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
    retry: 1,
    retryDelay: 2000,
  });

  const refreshPortfolio = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
  };

  return {
    ...query,
    refreshPortfolio
  };
}

// Global function to refresh all site content (can be called from anywhere)
export async function refreshAllSiteContent() {
  const queryClient = new (await import('@tanstack/react-query')).QueryClient();
  queryClient.invalidateQueries({ queryKey: ["/api/site-content"] });
}
