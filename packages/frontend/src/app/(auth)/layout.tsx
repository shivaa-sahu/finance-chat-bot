'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/context/Authcontext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If auth status is checked and user is not authenticated, redirect
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // While checking auth or redirecting, show a loader
  if (!isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        {/* <CircularProgress /> */}
        {children}
      </Box>
    );
  }

  // If authenticated, render the chat layout
  return <Box sx={{ display: 'flex', height: '100vh' }}>{children}</Box>;
}
