import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  inquiryType: string;
  message: string;
  createdAt: string;
  status?: "new" | "read" | "replied" | "archived";
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com';

export function useContacts() {
  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${BACKEND_URL}/contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch contacts');

      return response.json();
    },
  });

  const { mutateAsync: updateContact } = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${BACKEND_URL}/contacts/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update contact');

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });

  const { mutateAsync: deleteContact } = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${BACKEND_URL}/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete contact');

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });

  return {
    contacts,
    isLoading,
    updateContact,
    deleteContact,
  };
}
