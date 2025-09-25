import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'AiDB - AI-Powered Database | Query Your Data in Plain English',
  description = 'Transform your Excel data into a powerful database. Ask questions in plain English and get instant answers. No coding required. Secure, fast, and easy to use.',
  keywords = 'AI database, natural language queries, Excel alternative, data analysis, business intelligence, no-code database, AI-powered analytics',
  canonicalUrl = 'https://askaidb.com',
  ogImage = '/aidbLogo.svg',
  ogType = 'website',
  structuredData
}) => {
  const fullTitle = title.includes('AiDB') ? title : `${title} | AiDB`;
  const fullCanonicalUrl = canonicalUrl.startsWith('http') ? canonicalUrl : `https://askaidb.com${canonicalUrl}`;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `https://askaidb.com${ogImage}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
      <meta property="og:site_name" content="AiDB" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonicalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullOgImage} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
