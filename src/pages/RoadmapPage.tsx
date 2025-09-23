import {
  CheckCircle,
  CloudUpload,
  Edit,
  Group,
  Language,
  Payment,
  Rocket,
  School,
  Security
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Paper,
  Typography
} from '@mui/material';
import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { useDesignSystem } from '../theme/ThemeProvider';

const RoadmapPage: React.FC = () => {
  const { colors, typography } = useDesignSystem();

  const mvpFeatures = [
    {
      icon: <Security sx={{ fontSize: 32, color: colors.success.main }} />,
      title: 'Secure login',
      description: 'Safe and reliable authentication to protect your data and account.',
    },
    {
      icon: <CloudUpload sx={{ fontSize: 32, color: colors.primary.main }} />,
      title: 'Upload Excel data',
      description: 'Easily import your existing Excel files and spreadsheets into AiDB.',
    },
    {
      icon: <Language sx={{ fontSize: 32, color: colors.info.main }} />,
      title: 'Translate plain English into SQL',
      description: 'Ask questions in natural language and get instant SQL translations.',
    },
    {
      icon: <CheckCircle sx={{ fontSize: 32, color: colors.success.main }} />,
      title: 'Execute translated or custom SQL against your data',
      description: 'Run queries and get results from your data with full control and flexibility.',
    },
  ];

  const comingSoonFeatures = [
    {
      icon: <Payment sx={{ fontSize: 32, color: colors.primary.main }} />,
      title: 'Paid subscription tiers to unlock more browsing and features',
      description: 'Unlock more browsing and features with flexible subscription options.',
    },
    {
      icon: <Edit sx={{ fontSize: 32, color: colors.success.main }} />,
      title: 'Edit your data directly in the table',
      description: 'Make changes to your data right within the interface for seamless workflow.',
    },
    {
      icon: <Group sx={{ fontSize: 32, color: colors.info.main }} />,
      title: 'Teams: share data within your team or company',
      description: 'Collaborate with your team by sharing data and insights securely.',
    },
    {
      icon: <School sx={{ fontSize: 32, color: colors.success.main }} />,
      title: 'Sophisticated tutorial and practice sandbox for learning and experimenting',
      description: 'Learn and experiment with a comprehensive tutorial system and safe practice environment.',
    },
  ];

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 1000, mx: 'auto', px: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              mb: 2,
            }}
          >
            Roadmap
          </Typography>
        </Box>

        {/* MVP Section */}
        <Paper
          sx={{
            p: 4,
            mb: 7,
            border: `1px solid ${colors.border.light}`,
            backgroundColor: colors.background.paper,
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <CheckCircle sx={{ fontSize: 32, color: colors.success.main, mr: 2 }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              MVP (Available Now)
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            {mvpFeatures.map((feature, index) => (
              <Card
                key={index}
                sx={{
                  height: '100%',
                  border: `1px solid ${colors.border.light}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    borderColor: colors.success.main,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ mr: 3, mt: 0.5 }}>
                      {feature.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.text.primary,
                          mb: 1,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      
                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.text.secondary,
                          lineHeight: 1.6,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Paper>

        {/* Coming Soon Section */}
        <Paper
          sx={{
            p: 4,
            border: `1px solid ${colors.border.light}`,
            backgroundColor: colors.background.paper,
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Rocket sx={{ fontSize: 32, color: colors.primary.main, mr: 2 }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              Coming Soon
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            {comingSoonFeatures.map((feature, index) => (
              <Card
                key={index}
                sx={{
                  height: '100%',
                  border: `1px solid ${colors.border.light}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    borderColor: colors.primary.main,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ mr: 3, mt: 0.5 }}>
                      {feature.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.text.primary,
                          mb: 1,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      
                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.text.secondary,
                          lineHeight: 1.6,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default RoadmapPage;
