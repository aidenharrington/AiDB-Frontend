import { useEffect } from 'react';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

interface PerformanceMonitorProps {
  onMetric?: (metric: any) => void;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ onMetric }) => {
  useEffect(() => {
    const handleMetric = (metric: any) => {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Performance Metric:', metric);
      }
      
      // Send to analytics service in production
      if (process.env.NODE_ENV === 'production' && onMetric) {
        onMetric(metric);
      }
    };

    // Measure Core Web Vitals
    getCLS(handleMetric);
    getFID(handleMetric);
    getFCP(handleMetric);
    getLCP(handleMetric);
    getTTFB(handleMetric);

    // Additional performance monitoring
    if ('performance' in window) {
      // Monitor page load time
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.fetchStart;
          handleMetric({
            name: 'page-load-time',
            value: loadTime,
            delta: loadTime
          });
        }
      });

      // Monitor resource loading
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resource = entry as PerformanceResourceTiming;
            if (resource.duration > 1000) { // Log slow resources
              handleMetric({
                name: 'slow-resource',
                value: resource.duration,
                delta: resource.duration,
                url: resource.name
              });
            }
          }
        }
      });

      observer.observe({ entryTypes: ['resource'] });

      return () => observer.disconnect();
    }
  }, [onMetric]);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;
