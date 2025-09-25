// SEO Configuration for AiDB
export const SEO_CONFIG = {
  site: {
    name: 'AiDB',
    fullName: 'AiDB - AI-Powered Database',
    description: 'Transform your Excel data into a powerful database. Ask questions in plain English and get instant answers. No coding required.',
    url: 'https://askaidb.com',
    logo: '/aidbLogo.svg',
    twitterHandle: '@aidb_dev', // Update with actual Twitter handle
    facebookAppId: '', // Add if you have a Facebook app
  },
  
  defaultMeta: {
    title: 'AiDB - AI-Powered Database | Query Your Data in Plain English',
    description: 'Transform your Excel data into a powerful database. Ask questions in plain English and get instant answers. No coding required. Secure, fast, and easy to use.',
    keywords: 'AI database, natural language queries, Excel alternative, data analysis, business intelligence, no-code database, AI-powered analytics',
    image: '/aidbLogo.svg',
    type: 'website',
  },
  
  pages: {
    home: {
      title: 'AiDB - AI-Powered Database | Query Your Data in Plain English',
      description: 'Transform your Excel data into a powerful database. Ask questions in plain English and get instant answers. No coding required.',
      keywords: 'AI database, natural language queries, Excel alternative, data analysis, business intelligence, no-code database',
      path: '/',
    },
    projects: {
      title: 'My Projects - AiDB',
      description: 'Manage and analyze your data projects with AiDB. Upload Excel files and query your data using natural language.',
      keywords: 'data projects, Excel import, data management, project dashboard, data analysis',
      path: '/projects',
    },
    whyAidb: {
      title: 'Why AiDB - AI-Powered Database Benefits',
      description: 'Learn why AiDB is the best solution for transforming Excel data into a powerful database. Ask questions in plain English, get instant answers, and manage your data securely.',
      keywords: 'AI database benefits, natural language queries, Excel alternative, data analysis tool, business intelligence, no-code database',
      path: '/why-aidb',
    },
    howToUse: {
      title: 'How to Use AiDB - Getting Started Guide',
      description: 'Learn how to use AiDB to transform your Excel data into a powerful database. Step-by-step guide to importing data and asking natural language questions.',
      keywords: 'how to use AiDB, getting started, Excel import guide, natural language queries tutorial, data analysis guide',
      path: '/how-to-use',
    },
    roadmap: {
      title: 'AiDB Roadmap - Upcoming Features',
      description: 'See what\'s coming next for AiDB. Check out our roadmap for upcoming features, improvements, and new capabilities.',
      keywords: 'AiDB roadmap, upcoming features, product updates, new features, development roadmap',
      path: '/roadmap',
    },
    about: {
      title: 'About the Creator - Aiden Harrington',
      description: 'Meet Aiden Harrington, the software engineer who created AiDB. Learn about his journey building an AI-powered database to help teams transform Excel data.',
      keywords: 'Aiden Harrington, software engineer, AiDB creator, Vancouver developer, AI database developer, Excel alternative creator',
      path: '/about',
    },
  },
  
  structuredData: {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'AiDB',
      url: 'https://askaidb.com',
      logo: 'https://askaidb.com/aidbLogo.svg',
      description: 'AI-Powered Database for natural language queries',
      founder: {
        '@type': 'Person',
        name: 'Aiden Harrington',
        email: 'aharrington.dev@gmail.com',
        jobTitle: 'Software Engineer',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Vancouver',
          addressCountry: 'CA'
        }
      },
      sameAs: [
        // Add social media URLs when available
        // 'https://twitter.com/aidb_dev',
        // 'https://linkedin.com/company/aidb',
      ]
    },
    
    softwareApplication: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'AiDB',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web Browser',
      url: 'https://askaidb.com',
      description: 'Transform your Excel data into a powerful database. Ask questions in plain English and get instant answers.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      creator: {
        '@type': 'Person',
        name: 'Aiden Harrington'
      },
      featureList: [
        'Natural language queries',
        'Excel data import',
        'Real-time data analysis',
        'Secure data storage',
        'No coding required',
        'Instant results'
      ]
    }
  }
};

export default SEO_CONFIG;
