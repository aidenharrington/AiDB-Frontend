import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDesignSystem } from '../theme';

interface AiDBLogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'horizontal' | 'vertical';
  showTagline?: boolean;
}

export const AiDBLogo: React.FC<AiDBLogoProps> = ({
  size = 'medium',
  variant = 'horizontal',
  showTagline = true,
}) => {
  const { colors, typography } = useDesignSystem();

  const getSizeConfig = (size: string) => {
    switch (size) {
      case 'small':
        return {
          iconSize: 32,
          fontSize: typography.h6.fontSize,
          taglineSize: typography.caption.fontSize,
          spacing: 2,
        };
      case 'large':
        return {
          iconSize: 64,
          fontSize: typography.h3.fontSize,
          taglineSize: typography.body1.fontSize,
          spacing: 3,
        };
      default: // medium
        return {
          iconSize: 48,
          fontSize: typography.h4.fontSize,
          taglineSize: typography.body2.fontSize,
          spacing: 2,
        };
    }
  };

  const config = getSizeConfig(size);

  const LogoIcon = () => (
    <Box
      sx={{
        width: config.iconSize,
        height: config.iconSize,
        borderRadius: 2,
        background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '20%',
          left: '20%',
          right: '20%',
          bottom: '20%',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 1,
        },
      }}
    >
      {/* Database/Grid pattern */}
      <Box
        sx={{
          position: 'relative',
          width: '60%',
          height: '60%',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: '2px',
        }}
      >
        {/* Top row - AI representation */}
        <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)', borderRadius: '1px' }} />
        <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.7)', borderRadius: '1px' }} />
        <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)', borderRadius: '1px' }} />
        
        {/* Middle row - Database representation */}
        <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.7)', borderRadius: '1px' }} />
        <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)', borderRadius: '1px' }} />
        <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.7)', borderRadius: '1px' }} />
        
        {/* Bottom row - Data flow */}
        <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)', borderRadius: '1px' }} />
        <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.7)', borderRadius: '1px' }} />
        <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)', borderRadius: '1px' }} />
      </Box>
    </Box>
  );

  if (variant === 'vertical') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: config.spacing }}>
        <LogoIcon />
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontSize: config.fontSize,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
            }}
          >
            AiDB
          </Typography>
          {showTagline && (
            <Typography
              variant="body2"
              sx={{
                fontSize: config.taglineSize,
                color: colors.text.secondary,
                fontWeight: typography.fontWeight.medium,
                letterSpacing: '0.025em',
                mt: 0.5,
              }}
            >
              AI-Powered Database
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: config.spacing }}>
      <LogoIcon />
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontSize: config.fontSize,
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
            letterSpacing: '-0.025em',
            lineHeight: 1.2,
          }}
        >
          AiDB
        </Typography>
        {showTagline && (
          <Typography
            variant="body2"
            sx={{
              fontSize: config.taglineSize,
              color: colors.text.secondary,
              fontWeight: typography.fontWeight.medium,
              letterSpacing: '0.025em',
            }}
          >
            AI-Powered Database
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default AiDBLogo;
