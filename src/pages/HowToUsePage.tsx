import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  CloudUpload,
  Language,
  CheckCircle,
  Lightbulb,
  Security,
  Speed,
} from '@mui/icons-material';
import { useDesignSystem } from '../theme/ThemeProvider';
import MainLayout from '../components/Layout/MainLayout';

const HowToUsePage: React.FC = () => {
  const { colors, typography } = useDesignSystem();

  const steps = [
    {
      icon: <CloudUpload sx={{ fontSize: 32, color: colors.primary.main }} />,
      title: 'Step 1: Upload Your Data',
      description: 'Upload your data from Excel or Google Sheets files (.xlsx).',
      details: 'Each file is stored securely, so your data stays organized and protected.',
    },
    {
      icon: <Language sx={{ fontSize: 32, color: colors.info.main }} />,
      title: 'Step 2: Ask Questions in English',
      description: 'Just type what you want to know, like you would ask a person.',
      details: 'AiDB translates your question into a safe query behind the scenes.',
      examples: [
        '"Which customers signed up last month?"',
        '"List the top 5 products by total sales."',
      ],
    },
    {
      icon: <CheckCircle sx={{ fontSize: 32, color: colors.success.main }} />,
      title: 'Step 3: View Your Answers',
      description: 'Results appear in a simple, easy-to-read table.',
      details: 'Quickly scan through your data to find the answers you need.',
    },
  ];

  const quickTips = [
    {
      icon: <Speed sx={{ fontSize: 20, color: colors.success.main }} />,
      text: 'Be specific for faster results — include the table names and column names exactly as they appear on the site.',
    },
    {
      icon: <Security sx={{ fontSize: 20, color: colors.primary.main }} />,
      text: 'Only questions about the data you uploaded can be answered — everything stays private.',
    },
    {
      icon: <Lightbulb sx={{ fontSize: 20, color: colors.warning.main }} />,
      text: 'No formulas or technical knowledge needed — just type your question and get answers.',
    },
  ];

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 1000, mx: 'auto', px: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              mb: 2,
            }}
          >
            How to Use AiDB
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.primary,
              mb: 3,
              lineHeight: 1.3,
            }}
          >
            Work With Your Data in 3 Simple Steps
          </Typography>
        </Box>

        {/* Introduction */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            border: `1px solid ${colors.border.light}`,
            backgroundColor: colors.background.paper,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: colors.text.secondary,
              lineHeight: 1.8,
              fontSize: '1.1rem',
              textAlign: 'center',
            }}
          >
            AiDB makes it easy to store your data safely and get answers instantly — no formulas, coding, or technical skills required.
          </Typography>
        </Paper>

        {/* Steps Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
          {steps.map((step, index) => (
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
                    {step.icon}
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
                      {step.title}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.text.secondary,
                        lineHeight: 1.6,
                        mb: 1,
                      }}
                    >
                      {step.description}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.text.secondary,
                        lineHeight: 1.6,
                        mb: step.examples ? 2 : 0,
                      }}
                    >
                      {step.details}
                    </Typography>

                    {step.examples && (
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: typography.fontWeight.semibold,
                            color: colors.text.primary,
                            mb: 1,
                          }}
                        >
                          Examples:
                        </Typography>
                        <List dense sx={{ py: 0 }}>
                          {step.examples.map((example, exampleIndex) => (
                            <ListItem key={exampleIndex} sx={{ py: 0.5, px: 0 }}>
                              <ListItemText
                                primary={example}
                                primaryTypographyProps={{
                                  variant: 'body2',
                                  color: colors.text.secondary,
                                  fontStyle: 'italic',
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Quick Tips */}
        <Paper
          sx={{
            p: 4,
            border: `1px solid ${colors.border.light}`,
            backgroundColor: colors.background.paper,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.primary,
              mb: 3,
              textAlign: 'center',
            }}
          >
            Quick Tips
          </Typography>
          
          <List>
            {quickTips.map((tip, index) => (
              <React.Fragment key={index}>
                <ListItem sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {tip.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={tip.text}
                    primaryTypographyProps={{
                      variant: 'body1',
                      color: colors.text.secondary,
                      lineHeight: 1.6,
                    }}
                  />
                </ListItem>
                {index < quickTips.length - 1 && (
                  <Divider sx={{ mx: 4 }} />
                )}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default HowToUsePage;
