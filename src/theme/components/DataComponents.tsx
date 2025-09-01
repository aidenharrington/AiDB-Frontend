import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  CircularProgress,
  Alert,
  AlertTitle,
  Divider,
  Grid,
  Stack,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Remove,
  Info,
  Warning,
  Error,
  CheckCircle,
} from '@mui/icons-material';
import { useDesignSystem } from '../ThemeProvider';

// Data Card Component
interface DataCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    period?: string;
  };
  variant?: 'default' | 'elevated' | 'outlined';
  children?: React.ReactNode;
}

export const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  variant = 'default',
  children,
}) => {
  const { colors, typography, shadows } = useDesignSystem();

  const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return <TrendingUp sx={{ color: colors.success.main, fontSize: 16 }} />;
      case 'down':
        return <TrendingDown sx={{ color: colors.error.main, fontSize: 16 }} />;
      default:
        return <Remove sx={{ color: colors.text.secondary, fontSize: 16 }} />;
    }
  };

  const getTrendColor = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return colors.success.main;
      case 'down':
        return colors.error.main;
      default:
        return colors.text.secondary;
    }
  };

  return (
    <Card
      sx={{
        ...(variant === 'elevated' && {
          boxShadow: shadows.md,
          border: 'none',
        }),
        ...(variant === 'outlined' && {
          boxShadow: shadows.none,
          border: `1px solid ${colors.border.medium}`,
        }),
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1, fontWeight: typography.fontWeight.medium }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              mb: 1,
            }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              {subtitle}
            </Typography>
          )}
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getTrendIcon(trend.direction)}
              <Typography
                variant="caption"
                sx={{
                  color: getTrendColor(trend.direction),
                  fontWeight: typography.fontWeight.medium,
                }}
              >
                {trend.value > 0 ? '+' : ''}{trend.value}%
                {trend.period && ` ${trend.period}`}
              </Typography>
            </Box>
          )}
        </Box>
        {children}
      </CardContent>
    </Card>
  );
};

// Data Table Component
interface DataTableProps {
  columns: Array<{
    id: string;
    label: string;
    align?: 'left' | 'right' | 'center';
    width?: string | number;
  }>;
  data: Array<Record<string, any>>;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: Record<string, any>) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
}) => {
  const { colors, typography } = useDesignSystem();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${colors.border.light}` }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || 'left'}
                sx={{
                  width: column.width,
                  fontWeight: typography.fontWeight.semibold,
                  backgroundColor: colors.neutral[50],
                  borderBottom: `1px solid ${colors.border.medium}`,
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                align="center"
                sx={{ py: 8, color: colors.text.secondary }}
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow
                key={index}
                onClick={() => onRowClick?.(row)}
                sx={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  '&:hover': {
                    backgroundColor: colors.neutral[50],
                  },
                  '& .MuiTableCell-body': {
                    borderBottom: `1px solid ${colors.border.light}`,
                    padding: 4,
                  },
                }}
              >
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align || 'left'}>
                    {row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Status Chip Component
interface StatusChipProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  label: string;
  size?: 'small' | 'medium';
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  label,
  size = 'medium',
}) => {
  const { colors, typography } = useDesignSystem();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'success':
        return {
          color: colors.success.main,
          backgroundColor: `${colors.success.main}15`,
          icon: <CheckCircle sx={{ fontSize: 16 }} />,
        };
      case 'warning':
        return {
          color: colors.warning.main,
          backgroundColor: `${colors.warning.main}15`,
          icon: <Warning sx={{ fontSize: 16 }} />,
        };
      case 'error':
        return {
          color: colors.error.main,
          backgroundColor: `${colors.error.main}15`,
          icon: <Error sx={{ fontSize: 16 }} />,
        };
      case 'info':
        return {
          color: colors.info.main,
          backgroundColor: `${colors.info.main}15`,
          icon: <Info sx={{ fontSize: 16 }} />,
        };
      default:
        return {
          color: colors.text.secondary,
          backgroundColor: colors.neutral[100],
          icon: undefined,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={label}
      size={size}
      icon={config.icon}
      sx={{
        backgroundColor: config.backgroundColor,
        color: config.color,
        fontWeight: typography.fontWeight.medium,
        '& .MuiChip-icon': {
          color: config.color,
        },
      }}
    />
  );
};

// Progress Card Component
interface ProgressCardProps {
  title: string;
  value: number;
  maxValue: number;
  subtitle?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'error';
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  value,
  maxValue,
  subtitle,
  showPercentage = true,
  color = 'primary',
}) => {
  const { colors, typography } = useDesignSystem();
  const percentage = Math.round((value / maxValue) * 100);

  const getColor = (colorType: string) => {
    switch (colorType) {
      case 'success':
        return colors.success.main;
      case 'warning':
        return colors.warning.main;
      case 'error':
        return colors.error.main;
      default:
        return colors.primary.main;
    }
  };

  return (
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1, fontWeight: typography.fontWeight.medium }}
          >
            {title}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: typography.fontWeight.bold }}
            >
              {value.toLocaleString()}
            </Typography>
            {showPercentage && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: typography.fontWeight.medium }}
              >
                {percentage}%
              </Typography>
            )}
          </Box>
                      {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                {subtitle}
              </Typography>
            )}
        </Box>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.neutral[200],
            '& .MuiLinearProgress-bar': {
              backgroundColor: getColor(color),
              borderRadius: 4,
            },
          }}
        />
      </CardContent>
    </Card>
  );
};

// Metric Grid Component
interface MetricGridProps {
  metrics: Array<{
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: {
      value: number;
      direction: 'up' | 'down' | 'neutral';
      period?: string;
    };
  }>;
  columns?: 2 | 3 | 4;
}

export const MetricGrid: React.FC<MetricGridProps> = ({
  metrics,
  columns = 4,
}) => {
  return (
    <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', gap: 3 }}>
      {metrics.map((metric, index) => (
        <Box key={index} sx={{ flex: `1 1 ${100 / columns}%`, minWidth: 250 }}>
          <DataCard
            title={metric.title}
            value={metric.value}
            subtitle={metric.subtitle}
            trend={metric.trend}
          />
        </Box>
      ))}
    </Stack>
  );
};

// Data Alert Component
interface DataAlertProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  action?: React.ReactNode;
}

export const DataAlert: React.FC<DataAlertProps> = ({
  type,
  title,
  message,
  action,
}) => {
  return (
    <Alert
      severity={type}
      action={action}
      sx={{
        borderRadius: 2,
        '& .MuiAlert-message': {
          width: '100%',
        },
      }}
    >
      <AlertTitle sx={{ fontWeight: 600 }}>{title}</AlertTitle>
      {message}
    </Alert>
  );
};

// Section Header Component
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  divider?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
  divider = true,
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ mb: subtitle ? 1 : 0 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && <Box>{action}</Box>}
      </Box>
      {divider && <Divider />}
    </Box>
  );
};

// Export all components
export {
  Box,
  Button,
  Card,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  Stack,
  Tooltip,
  IconButton,
};
