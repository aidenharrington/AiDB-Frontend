import React from 'react';
import {
  ThemeProvider,
  DataCard,
  DataTable,
  StatusChip,
  ProgressCard,
  MetricGrid,
  DataAlert,
  SectionHeader,
  Box,
  Button,
  Stack,
} from '../index';

// Demo data
const demoMetrics: Array<{
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    period?: string;
  };
}> = [
  {
    title: 'Total Users',
    value: '12,847',
    subtitle: 'Active this month',
    trend: { value: 12, direction: 'up' as const, period: 'vs last month' },
  },
  {
    title: 'Revenue',
    value: '$234,567',
    subtitle: 'This quarter',
    trend: { value: 8, direction: 'up' as const, period: 'vs last quarter' },
  },
  {
    title: 'Conversion Rate',
    value: '3.2%',
    subtitle: 'Overall',
    trend: { value: 2, direction: 'down' as const, period: 'vs last month' },
  },
  {
    title: 'Active Sessions',
    value: '1,234',
    subtitle: 'Currently online',
    trend: { value: 5, direction: 'neutral' as const, period: 'vs last hour' },
  },
];

const demoTableData = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'Active',
    lastLogin: '2024-01-15',
    usage: '85%',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'Inactive',
    lastLogin: '2024-01-10',
    usage: '45%',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    status: 'Active',
    lastLogin: '2024-01-14',
    usage: '92%',
  },
];

const demoTableColumns = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'status', label: 'Status' },
  { id: 'lastLogin', label: 'Last Login' },
  { id: 'usage', label: 'Usage', align: 'right' as const },
];

export const DesignSystemDemo: React.FC = () => {
  return (
    <ThemeProvider>
      <Box sx={{ p: 4, maxWidth: 1200, margin: '0 auto' }}>
        {/* Page Header */}
        <SectionHeader
          title="Design System Demo"
          subtitle="Showcasing the AiDB design system components and data-focused design patterns"
          action={
            <Button variant="contained" size="small">
              Export Data
            </Button>
          }
        />

        {/* Alert Section */}
        <Box sx={{ mb: 4 }}>
          <DataAlert
            type="info"
            title="Welcome to the Design System"
            message="This demo showcases all the components and design tokens available in the AiDB design system."
          />
        </Box>

        {/* Metrics Grid */}
        <SectionHeader title="Key Metrics" subtitle="Important KPIs and performance indicators" />
        <Box sx={{ mb: 6 }}>
          <MetricGrid metrics={demoMetrics} columns={4} />
        </Box>

        {/* Progress Cards */}
        <SectionHeader title="Progress Indicators" subtitle="Usage and capacity metrics" />
        <Box sx={{ mb: 6 }}>
          <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', gap: 3 }}>
            <ProgressCard
              title="Storage Usage"
              value={75}
              maxValue={100}
              subtitle="75GB of 100GB used"
              color="warning"
            />
            <ProgressCard
              title="API Calls"
              value={1200}
              maxValue={2000}
              subtitle="1,200 of 2,000 daily limit"
              color="primary"
            />
            <ProgressCard
              title="Success Rate"
              value={98}
              maxValue={100}
              subtitle="98% successful operations"
              color="success"
            />
          </Stack>
        </Box>

        {/* Status Chips */}
        <SectionHeader title="Status Indicators" subtitle="Various status states and their visual representation" />
        <Box sx={{ mb: 6 }}>
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
            <StatusChip status="success" label="Active" />
            <StatusChip status="warning" label="Pending" />
            <StatusChip status="error" label="Failed" />
            <StatusChip status="info" label="Processing" />
            <StatusChip status="neutral" label="Unknown" />
            <StatusChip status="success" label="Completed" size="small" />
            <StatusChip status="warning" label="Review Required" size="small" />
          </Stack>
        </Box>

        {/* Data Table */}
        <SectionHeader title="Data Table" subtitle="Professional data display with consistent styling" />
        <Box sx={{ mb: 6 }}>
          <DataTable
            columns={demoTableColumns}
            data={demoTableData}
            onRowClick={(row) => console.log('Row clicked:', row)}
          />
        </Box>

        {/* Individual Data Cards */}
        <SectionHeader title="Individual Data Cards" subtitle="Different variants and use cases" />
        <Box sx={{ mb: 6 }}>
          <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', gap: 3 }}>
            <DataCard
              title="Default Card"
              value="1,234"
              subtitle="Standard variant"
              variant="default"
            />
            <DataCard
              title="Elevated Card"
              value="5,678"
              subtitle="With shadow emphasis"
              variant="elevated"
              trend={{ value: 15, direction: 'up', period: 'vs last week' }}
            />
            <DataCard
              title="Outlined Card"
              value="9,012"
              subtitle="Minimal border style"
              variant="outlined"
              trend={{ value: 3, direction: 'down', period: 'vs last week' }}
            />
          </Stack>
        </Box>

        {/* Error and Warning States */}
        <SectionHeader title="Alert States" subtitle="Different alert types for various scenarios" />
        <Box sx={{ mb: 6 }}>
          <Stack spacing={2}>
            <DataAlert
              type="success"
              title="Data Import Successful"
              message="All 1,234 records have been successfully imported into the database."
            />
            <DataAlert
              type="warning"
              title="High Usage Warning"
              message="You are approaching your monthly API limit. Consider upgrading your plan."
            />
            <DataAlert
              type="error"
              title="Connection Failed"
              message="Unable to connect to the database. Please check your network connection and try again."
            />
          </Stack>
        </Box>

        {/* Design Tokens Demo */}
        <SectionHeader title="Design Tokens" subtitle="Colors, typography, and spacing examples" />
        <Box sx={{ mb: 6 }}>
          <Stack spacing={4}>
            {/* Color Palette */}
            <Box>
              <h3>Color Palette</h3>
              <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ width: 60, height: 60, bgcolor: 'primary.main', borderRadius: 1 }} />
                <Box sx={{ width: 60, height: 60, bgcolor: 'secondary.main', borderRadius: 1 }} />
                <Box sx={{ width: 60, height: 60, bgcolor: 'success.main', borderRadius: 1 }} />
                <Box sx={{ width: 60, height: 60, bgcolor: 'warning.main', borderRadius: 1 }} />
                <Box sx={{ width: 60, height: 60, bgcolor: 'error.main', borderRadius: 1 }} />
                <Box sx={{ width: 60, height: 60, bgcolor: 'info.main', borderRadius: 1 }} />
              </Stack>
            </Box>

            {/* Typography Scale */}
            <Box>
              <h3>Typography Scale</h3>
              <Stack spacing={1}>
                <h1>Heading 1 - Page Titles</h1>
                <h2>Heading 2 - Section Titles</h2>
                <h3>Heading 3 - Subsection Titles</h3>
                <h4>Heading 4 - Card Titles</h4>
                <h5>Heading 5 - Small Headers</h5>
                <h6>Heading 6 - Micro Headers</h6>
                <p>Body 1 - Main content text with good readability for data-heavy applications.</p>
                <p style={{ fontSize: '0.875rem' }}>Body 2 - Secondary text for supporting information.</p>
                <p style={{ fontSize: '0.75rem' }}>Caption - Small text for metadata and labels.</p>
              </Stack>
            </Box>

            {/* Spacing Scale */}
            <Box>
              <h3>Spacing Scale (4px increments)</h3>
              <Stack spacing={1}>
                <Box sx={{ height: 4, bgcolor: 'primary.main', width: '4px' }}>4px</Box>
                <Box sx={{ height: 8, bgcolor: 'primary.main', width: '8px' }}>8px</Box>
                <Box sx={{ height: 16, bgcolor: 'primary.main', width: '16px' }}>16px</Box>
                <Box sx={{ height: 24, bgcolor: 'primary.main', width: '24px' }}>24px</Box>
                <Box sx={{ height: 32, bgcolor: 'primary.main', width: '32px' }}>32px</Box>
                <Box sx={{ height: 48, bgcolor: 'primary.main', width: '48px' }}>48px</Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default DesignSystemDemo;
