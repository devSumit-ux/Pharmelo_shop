import React, { useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';

const { useLocation } = ReactRouterDOM as any;

interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string;
}

const Seo: React.FC<SeoProps> = ({ title, description, canonical, keywords }) => {
  const location = useLocation();
  const fullUrl = canonical || `https://pharmelo.vercel.app${location.pathname}`;

  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Update Meta Tags
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    } else {
        const meta = document.createElement('meta');
        meta.name = "description";
        meta.content = description;
        document.head.appendChild(meta);
    }

    const metaTitle = document.querySelector('meta[name="title"]');
    if (metaTitle) {
      metaTitle.setAttribute('content', title);
    }

    // Update Keywords if provided
    if (keywords) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.setAttribute('content', keywords);
        }
    }

    // 3. Update Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (linkCanonical) {
      linkCanonical.setAttribute('href', fullUrl);
    } else {
        const link = document.createElement('link');
        link.rel = "canonical";
        link.href = fullUrl;
        document.head.appendChild(link);
    }

    // 4. Update Open Graph Tags (For Social Sharing)
    const updateMeta = (property: string, content: string) => {
        let element = document.querySelector(`meta[property="${property}"]`);
        if (element) {
            element.setAttribute('content', content);
        } else {
            element = document.createElement('meta');
            element.setAttribute('property', property);
            element.setAttribute('content', content);
            document.head.appendChild(element);
        }
    };

    updateMeta('og:title', title);
    updateMeta('og:description', description);
    updateMeta('og:url', fullUrl);
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:url', fullUrl);

  }, [title, description, fullUrl, keywords]);

  return null;
};

export default Seo;