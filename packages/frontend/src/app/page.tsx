'use client';

import { Box, Button, Typography, Container, Stack } from '@mui/material';
import NextLink from 'next/link';

/**
 * This is the root page component for the entire application (`/`).
 * It serves as the main landing page, providing users with a welcome
 * message and clear options to either sign in or create a new account.
 */
export default function HomePage() {
  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: { xs: 2, sm: 4 },
        }}
      >
        <Typography component="h1" variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          Deep Finance Research Chatbot
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Your AI-powered assistant for conducting in-depth financial analysis and research. Get cited reports, streamed reasoning, and answers in seconds.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4, width: { xs: '100%', sm: 'auto' } }}>
          <Button
            component={NextLink}
            href="/login"
            variant="contained"
            size="large"
            sx={{ px: 5, py: 1.5 }}
          >
            Login
          </Button>
          <Button
            component={NextLink}
            href="/signup"
            variant="outlined"
            size="large"
            sx={{ px: 5, py: 1.5 }}
          >
            Sign Up
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}

