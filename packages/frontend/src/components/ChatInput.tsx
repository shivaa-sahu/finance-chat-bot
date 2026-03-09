import { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface ChatInputProps {
  onSend: (message: string) => void;
}

const ChatInput = ({ onSend }: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <Box component="form" sx={{ display: 'flex', alignItems: 'center' }} onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Ask a financial question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey ? handleSend() : null}
        sx={{ bgcolor: 'background.paper' }}
      />
      <IconButton color="primary" onClick={handleSend} sx={{ ml: 1 }}>
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default ChatInput;
