// Theme System Exports
// This file provides a centralized export for all theme-related components and utilities

// Core theme exports
export { ThemeProvider, useDesignSystem } from './ThemeProvider';
export { theme, themeOptions } from './theme';
export { designSystem } from './designSystem';

// Design system exports
export {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  transitions,
  components,
} from './designSystem';

// Data-focused component exports
export {
  DataCard,
  DataTable,
  StatusChip,
  ProgressCard,
  MetricGrid,
  DataAlert,
  SectionHeader,
} from './components/DataComponents';

// Re-export common Material-UI components with our styling
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
} from './components/DataComponents';

// Type exports
export type { DesignSystem } from './designSystem';
