import { Box, Typography, Divider } from '@mui/material';

const ThinkingPanel = ({ steps }: { steps: any[] }) => {
  if (steps.length === 0) return null;

  return (
    <Box mb={3}>
      <Typography variant="h6" gutterBottom>Thinking...</Typography>
      {steps.map((step, index) => (
        <Box key={index} sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>{step.step}:</strong> {step.details}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ThinkingPanel;
