import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function fetchMe() {
  const res = await fetch(`${API_URL}/api/admin/me`, { credentials: 'include' });
  if (!res.ok) throw new Error('Not authenticated');
  const data = await res.json();
  return data.user;
}

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    retry: false,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
