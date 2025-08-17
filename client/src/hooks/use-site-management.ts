import { create } from 'zustand';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface SiteContent {
  id: string;
  section: string;
  title?: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  settings?: Record<string, any>;
  seoMetadata?: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

interface ContentVersion {
  id: string;
  contentId: string;
  version: number;
  data: Partial<SiteContent>;
  createdAt: string;
  createdBy: string;
}

interface SiteManagementState {
  isDirty: boolean;
  pendingChanges: Record<string, Partial<SiteContent>>;
  setIsDirty: (isDirty: boolean) => void;
  updateContent: (section: string, data: Partial<SiteContent>) => void;
  discardChanges: () => void;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://lawrei-beauty-website.onrender.com';

export const useSiteManagement = create<SiteManagementState>()((set) => ({
  isDirty: false,
  pendingChanges: {},
  setIsDirty: (isDirty) => set({ isDirty }),
  updateContent: (section, data) =>
    set((state) => ({
      isDirty: true,
      pendingChanges: {
        ...state.pendingChanges,
        [section]: {
          ...state.pendingChanges[section],
          ...data,
        },
      },
    })),
  discardChanges: () =>
    set({
      isDirty: false,
      pendingChanges: {},
    }),
}));

export function useSiteContent(section?: string) {
  const queryClient = useQueryClient();

  const { data: allContent, isLoading } = useQuery({
    queryKey: ['site-content'],
    queryFn: async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${BACKEND_URL}/admin/site-content`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch content');

      const data = await response.json();
      return data.reduce((acc: Record<string, SiteContent>, item: SiteContent) => {
        acc[item.section] = item;
        return acc;
      }, {});
    },
  });

  const { mutateAsync: saveContent } = useMutation({
    mutationFn: async ({
      section,
      data,
    }: {
      section: string;
      data: Partial<SiteContent>;
    }) => {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication required');

      const existingContent = allContent?.[section];
      const method = existingContent ? 'PUT' : 'POST';
      const url = existingContent
        ? `${BACKEND_URL}/admin/site-content/${section}`
        : `${BACKEND_URL}/admin/site-content`;

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          ...data,
          isActive: true,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save content');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-content'] });
    },
  });

  const { data: contentVersions } = useQuery({
    queryKey: ['content-versions', section],
    queryFn: async () => {
      if (!section) return [];

      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(
        `${BACKEND_URL}/admin/site-content/${section}/versions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch versions');

      return response.json();
    },
    enabled: !!section,
  });

  const { mutateAsync: rollbackVersion } = useMutation({
    mutationFn: async ({
      section,
      versionId,
    }: {
      section: string;
      versionId: string;
    }) => {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(
        `${BACKEND_URL}/admin/site-content/${section}/rollback/${versionId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to rollback version');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-content'] });
      queryClient.invalidateQueries({ queryKey: ['content-versions'] });
    },
  });

  const { mutateAsync: uploadImage } = useMutation({
    mutationFn: async ({
      section,
      file,
    }: {
      section: string;
      file: File;
    }) => {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication required');

      const formData = new FormData();
      formData.append('image', file);
      formData.append('section', section);

      const response = await fetch(`${BACKEND_URL}/admin/upload-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload image');
      }

      return response.json();
    },
  });

  return {
    content: section ? allContent?.[section] : allContent,
    isLoading,
    saveContent,
    contentVersions,
    rollbackVersion,
    uploadImage,
  };
}

export function useContentPreview() {
  const previewContent = async (section: string, data: Partial<SiteContent>) => {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${BACKEND_URL}/admin/preview-content`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        section,
        data,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate preview');
    }

    const previewData = await response.json();
    return previewData.previewUrl;
  };

  return { previewContent };
}
