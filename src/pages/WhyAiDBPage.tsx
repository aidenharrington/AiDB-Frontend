import {
  CheckCircle,
  Cloud,
  Payment,
  QuestionAnswer,
  Security,
  Speed,
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
import SEOHead from '../components/SEOHead';

const WhyAiDBPage: React.FC = () => {
  const { colors, typography } = useDesignSystem();

  const benefits = [
    {
      icon: <QuestionAnswer sx={{ fontSize: 32, color: colors.primary.main }} />,
      title: 'Ask questions in plain English',
      description: 'Type what you want to know, no formulas, coding, or technical skills needed.',
    },
    {
      icon: <Speed sx={{ fontSize: 32, color: colors.success.main }} />,
      title: 'Get answers instantly',
      description: 'Results appear in a table you can view and explore.',
    },
    {
      icon: <CheckCircle sx={{ fontSize: 32, color: colors.success.main }} />,
      title: 'No setup headaches',
      description: 'AiDB is ready to go, so you can start asking questions about your data immediately.',
    },
    {
      icon: <Cloud sx={{ fontSize: 32, color: colors.info.main }} />,
      title: 'Store your data securely',
      description: 'Everything is managed by trusted companies like Google and Amazon, following industry-standard security practices. AiDB itself never stores your raw data.',
    },
    {
      icon: <Security sx={{ fontSize: 32, color: colors.success.main }} />,
      title: 'Queries handled for you',
      description: 'AiDB translates your question into secure database queries behind the scenes, so all your data stays protected.',
    },
    {
      icon: <Payment sx={{ fontSize: 32, color: colors.warning.main }} />,
      title: 'Manage payments safely',
      description: 'Subscription billing is handled through Stripe, so your payment info is secure.',
    },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Why AiDB - AI-Powered Database Benefits",
    "description": "Learn why AiDB is the best solution for transforming Excel data into a powerful database with natural language queries.",
    "url": "https://askaidb.com/why-aidb",
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "AiDB",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Natural language queries",
        "Excel data import",
        "Real-time data analysis",
        "Secure data storage",
        "No coding required",
        "Instant results"
      ]
    }
  };

  return (
    <>
      <SEOHead
        title="Why AiDB - AI-Powered Database Benefits"
        description="Learn why AiDB is the best solution for transforming Excel data into a powerful database. Ask questions in plain English, get instant answers, and manage your data securely without coding."
        keywords="AI database benefits, natural language queries, Excel alternative, data analysis tool, business intelligence, no-code database, secure data management"
        canonicalUrl="/why-aidb"
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
            Why AiDB
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
            Get Answers from Your Data — No Coding Needed
          </Typography>
        </Box>

        {/* Problem Statement */}
        <Paper
          sx={{
            p: 4,
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
              textAlign: 'justify',
            }}
          >
            Most teams and small businesses store their important data in Excel or spreadsheets. 
            It works for simple lists, but as your data grows, Excel becomes hard to manage, 
            analyze, and keep secure. Many questions — like "Which customers signed up last month?" 
            or "What are our top-selling products?" — are hard to answer quickly without complex 
            formulas or manual work.
          </Typography>
        </Paper>

        {/* Solution Introduction */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              mb: 1,
            }}
          >
            AiDB was built to solve that problem.
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.secondary,
              mb: 2,
            }}
          >
            It lets you:
          </Typography>
        </Box>

        {/* Benefits Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
          {benefits.map((benefit, index) => (
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
                    {benefit.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.text.primary,
                        mb: 2,
                      }}
                    >
                      {benefit.title}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.text.secondary,
                        lineHeight: 1.6,
                      }}
                    >
                      {benefit.description}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Summary */}
        <Paper
          sx={{
            p: 4,
            border: `1px solid ${colors.border.light}`,
            backgroundColor: colors.background.paper,
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.primary,
            }}
          >
            In short, AiDB gives you the speed, organization, and safety of a real database 
            while letting you keep working with the data you already have in Excel.
          </Typography>
        </Paper>
        </Box>
      </MainLayout>
    </>
  );
};

export default WhyAiDBPage;
