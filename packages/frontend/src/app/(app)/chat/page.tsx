'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import io, { Socket } from 'socket.io-client';

import MessageBubble from '@/components/MessageBubble';
import { useAuth } from '@/context/Authcontext';

import ThinkingPanel from '@/components/Thinking';
import SourcePanel from '@/components/SourcePannel';
import ChatInput from '@/components/ChatInput';


// Define message types
interface Message {
  role: 'user' | 'assistant';
  content: string;
}
interface Source {
  url: string;
  title: string;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000';
let socket: Socket;

export default function ChatPage() {
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [thinkingSteps, setThinkingSteps] = useState<any[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;

    // Initialize socket connection with auth token
    socket = io(SOCKET_URL, {
      auth: { token },
    });

    socket.on('connect', () => console.log('Socket connected!'));
    
    // Listen for streaming tokens for the final answer
    socket.on('token', (chunk: { content: string }) => {
      // Logic to append streaming tokens to the last message
      setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.role === 'assistant') {
              lastMessage.content += chunk.content;
              return [...prev];
          }
          return [...prev, { role: 'assistant', content: chunk.content }];
      });
    });

    // Listen for the agent's reasoning steps
    socket.on('thinking', (step: any) => {
        setThinkingSteps(prev => [...prev, step]);
    });

    // Listen for final sources
    socket.on('sources', (finalSources: Source[]) => {
        setSources(finalSources);
    });

    socket.on('error', (error) => {
        console.error('Socket Error:', error);
        // Handle error display to the user
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);
  
  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear previous results and send message
    setThinkingSteps([]);
    setSources([]);
    socket.emit('sendMessage', { content, threadId: 'thread-123' /* TODO: Use dynamic thread ID */ });
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100vh' }}>
      
      {/* Left Panel for Threads/History - Future improvement */}
      <Paper elevation={3} sx={{ width: '250px', p: 2, display: { xs: 'none', md: 'block' } }}>
        <Typography variant="h6">Chat History</Typography>
        {/* TODO: List chat threads here */}
      </Paper>

      {/* Main Chat Window */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </Box>
        <ChatInput onSend={handleSendMessage} />
      </Box>

      {/* Right Panel for Thinking & Sources */}
      <Paper elevation={3} sx={{ width: '300px', p: 2, display: { xs: 'none', md: 'block' }, overflowY: 'auto' }}>
        <ThinkingPanel steps={thinkingSteps} />
        <SourcePanel sources={sources} />
      </Paper>
    </Box>
  );
}
