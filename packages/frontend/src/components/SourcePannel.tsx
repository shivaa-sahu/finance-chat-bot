import { Box, Typography, Link, Divider } from '@mui/material';

interface Source {
    url: string;
    title: string;
}

const SourcePanel = ({ sources }: { sources: Source[] }) => {
  if (sources.length === 0) return null;

  return (
    <Box>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>Sources</Typography>
      {sources.map((source, index) => (
        <Box key={index} sx={{ mb: 1 }}>
          <Link href={source.url} target="_blank" rel="noopener noreferrer" variant="body2">
            {source.title}
          </Link>
        </Box>
      ))}
    </Box>
  );
};

export default SourcePanel;
