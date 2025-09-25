import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Person,
  LocationOn,
  SportsHockey,
  Book,
  SportsEsports,
  FitnessCenter,
  DirectionsBike,
  Email,
} from '@mui/icons-material';
import { useDesignSystem } from '../theme/ThemeProvider';
import MainLayout from '../components/Layout/MainLayout';
import SEOHead from '../components/SEOHead';
import profilePic from '../assets/profile_pic_resized.jpg';

const AboutPage: React.FC = () => {
  const { colors, typography } = useDesignSystem();

  const interests = [
    {
      icon: <FitnessCenter sx={{ fontSize: 20, color: colors.warning.main }} />,
      label: 'Weight Lifting',
    },
    {
      icon: <DirectionsBike sx={{ fontSize: 20, color: colors.error.main }} />,
      label: 'Road Biking',
    },
    {
      icon: <SportsHockey sx={{ fontSize: 20, color: colors.primary.main }} />,
      label: 'Hockey (Go Canucks!)',
    },
    {
      icon: <Book sx={{ fontSize: 20, color: colors.info.main }} />,
      label: 'Reading',
    },
    {
      icon: <SportsEsports sx={{ fontSize: 20, color: colors.success.main }} />,
      label: 'Gaming',
    },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About AiDB Creator - Aiden Harrington",
    "description": "Learn about Aiden Harrington, the software engineer who created AiDB to help teams and businesses transform their Excel data into powerful databases.",
    "url": "https://askaidb.com/about",
    "mainEntity": {
      "@type": "Person",
      "name": "Aiden Harrington",
      "email": "aharrington.dev@gmail.com",
      "jobTitle": "Software Engineer",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Vancouver",
        "addressCountry": "CA"
      },
      "knowsAbout": [
        "Software Engineering",
        "AI-Powered Applications",
        "Database Design",
        "Web Development"
      ],
      "creator": {
        "@type": "SoftwareApplication",
        "name": "AiDB",
        "description": "AI-Powered Database for natural language queries"
      }
    }
  };

  return (
    <>
      <SEOHead
        title="About the Creator - Aiden Harrington"
        description="Meet Aiden Harrington, the software engineer who created AiDB. Learn about his journey building an AI-powered database to help teams transform Excel data into powerful databases."
        keywords="Aiden Harrington, software engineer, AiDB creator, Vancouver developer, AI database developer, Excel alternative creator"
        canonicalUrl="/about"
        structuredData={structuredData}
      />
      <MainLayout>
        <Box sx={{ maxWidth: 1000, mx: 'auto', px: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              mb: 2,
            }}
          >
            About the Creator
          </Typography>
        </Box>

        {/* Main Content */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            border: `1px solid ${colors.border.light}`,
            backgroundColor: colors.background.paper,
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'flex-start' }}>
            <Avatar
              src={profilePic}
              sx={{
                width: 120,
                height: 120,
                backgroundColor: colors.primary.main,
                fontSize: '2.5rem',
                fontWeight: typography.fontWeight.bold,
                flexShrink: 0,
                objectFit: 'cover',
                objectPosition: 'center',
                border: `3px solid ${colors.text.primary}`,
                '& img': {
                  objectFit: 'cover',
                  objectPosition: 'center',
                  transform: 'scale(1.2)',
                  transformOrigin: 'center center',
                },
              }}
            >
              A
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  mb: 1,
                }}
              >
                Aiden Harrington
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                  <Person sx={{ color: colors.text.secondary, mr: 1, fontSize: 20 }} />
                  <Typography
                    variant="body1"
                    sx={{
                      color: colors.text.secondary,
                      fontWeight: typography.fontWeight.medium,
                    }}
                  >
                    Software Engineer
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ color: colors.text.secondary, mr: 1, fontSize: 20 }} />
                  <Typography
                    variant="body1"
                    sx={{
                      color: colors.text.secondary,
                      fontWeight: typography.fontWeight.medium,
                    }}
                  >
                    Vancouver
                  </Typography>
                </Box>
              </Box>
              
              <Typography
                variant="body1"
                sx={{
                  color: colors.text.secondary,
                  lineHeight: 1.8,
                  fontSize: '1.1rem',
                  mb: 3,
                }}
              >
                Hi there! I'm Aiden Harrington, a software engineer based in Vancouver. I've always been fascinated by how software can turn ideas into real, useful tools — that curiosity led me to build AiDB.
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  color: colors.text.secondary,
                  lineHeight: 1.8,
                  fontSize: '1.1rem',
                  mb: 3,
                }}
              >
                I created AiDB because I noticed so many students, teams, research groups, and small businesses storing, sharing, and analyzing important data in Excel — a tool that works for basic lists but isn't ideal for larger or more complex data. With advancements in AI, people no longer need a technical background to safely and easily use databases, and AiDB is designed to make that possible.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: colors.text.secondary,
                  lineHeight: 1.8,
                  fontSize: '1.1rem',
                  mb: 3,
                }}
              >
                I'm passionate about building high-quality applications that genuinely help people. AiDB has been a long-term dream project for me, and I'm fully committed to making it even better over time. Lots of updates and new features are coming, and I'll be adding platforms to follow AiDB's progress.
              </Typography>



              <Typography
                variant="body1"
                sx={{
                  color: colors.text.secondary,
                  lineHeight: 1.8,
                  fontSize: '1.1rem',
                  fontWeight: typography.fontWeight.medium,
                }}
              >
                I'd love to hear your feedback or ideas! Please submit any thoughts or issues by clicking the Feedback button at the top right or reach out directly to me at{' '}
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                  <Email sx={{ mr: 0.5, fontSize: '1.1rem' }} />
                  <Box component="span" sx={{ 
                    color: colors.primary.main, 
                    fontWeight: typography.fontWeight.semibold,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    '&:hover': {
                      color: colors.primary.dark,
                    }
                  }}>
                    aharrington.dev@gmail.com
                  </Box>
                </Box>
                {' '}.
              </Typography>

              {/* Interests */}
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.text.primary,
                    mb: 2,
                  }}
                >
                  Outside of coding, I enjoy:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {interests.map((interest, index) => (
                    <Chip
                      key={index}
                      icon={interest.icon}
                      label={interest.label}
                      sx={{
                        backgroundColor: colors.background.default,
                        border: `1px solid ${colors.border.light}`,
                        color: colors.text.secondary,
                        fontWeight: typography.fontWeight.medium,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
        </Box>
      </MainLayout>
    </>
  );
};

export default AboutPage;
