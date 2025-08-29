import React from 'react';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Box,
} from '@mui/material';
import {
  NavigateNext,
  Home,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDesignSystem } from '../../theme/ThemeProvider';

const Breadcrumbs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors, typography } = useDesignSystem();

  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbs = [];

    // Always add home
    breadcrumbs.push({
      label: 'AiDB',
      path: '/projects',
      icon: <Home sx={{ fontSize: 16 }} />,
    });

    if (pathnames.length === 0) {
      return breadcrumbs;
    }

    // Handle projects page
    if (pathnames[0] === 'projects') {
      breadcrumbs.push({
        label: 'Projects',
        path: '/projects',
        icon: null,
      });

      // Handle project detail page
      if (pathnames.length > 1) {
        breadcrumbs.push({
          label: `Project ${pathnames[1]}`,
          path: `/projects/${pathnames[1]}`,
          icon: null,
        });
      }
    } else {
      // Handle other pages
      const pageLabels: { [key: string]: string } = {
        'why-aidb': 'Why AiDB',
        'how-to-use': 'How to Use',
        'roadmap': 'Roadmap',
        'about': 'About the Creator',
      };

      pathnames.forEach((pathname, index) => {
        const label = pageLabels[pathname] || pathname;
        const path = `/${pathnames.slice(0, index + 1).join('/')}`;
        
        breadcrumbs.push({
          label,
          path,
          icon: null,
        });
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleClick = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ py: 2, px: 3 }}>
      <MuiBreadcrumbs
        separator={<NavigateNext fontSize="small" sx={{ color: colors.text.secondary }} />}
        aria-label="breadcrumb"
      >
                  {breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

          if (isLast) {
            return (
              <Typography
                key={breadcrumb.path}
                color="text.primary"
                sx={{
                  fontWeight: typography.fontWeight.medium,
                  color: colors.text.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                {breadcrumb.icon}
                {breadcrumb.label}
              </Typography>
            );
          }

          return (
            <Link
              key={breadcrumb.path}
              color="inherit"
              onClick={() => handleClick(breadcrumb.path)}
              sx={{
                cursor: 'pointer',
                color: colors.text.secondary,
                textDecoration: 'none',
                fontWeight: typography.fontWeight.regular,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                '&:hover': {
                  color: colors.primary.main,
                  textDecoration: 'underline',
                },
              }}
            >
              {breadcrumb.icon}
              {breadcrumb.label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
