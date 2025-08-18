import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Testimonial {
  id: string;
  rating: number;
  review: string;
  isApproved: boolean;
  createdAt: string;
  customerFirstName?: string;
  customerLastName?: string;
  customerEmail?: string;
  serviceName?: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com';

export function useTestimonials() {
  const queryClient = useQueryClient();

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${BACKEND_URL}/admin/testimonials`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch testimonials');

      return response.json();
    },
  });

  const { mutateAsync: updateTestimonial } = useMutation({
    mutationFn: async ({ id, isApproved }: { id: string; isApproved: boolean }) => {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${BACKEND_URL}/admin/testimonials/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isApproved }),
      });

      if (!response.ok) throw new Error('Failed to update testimonial');

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });

  const { mutateAsync: deleteTestimonial } = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${BACKEND_URL}/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete testimonial');

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });

  return {
    testimonials,
    isLoading,
    updateTestimonial,
    deleteTestimonial,
  };
}
