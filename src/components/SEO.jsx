import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  type = 'website',
  noindex = false 
}) => {
  const location = useLocation();
  const baseUrl = 'https://andhramachinesagencies.com';
  const currentUrl = `${baseUrl}${location.pathname}`;
  const defaultImage = 'https://res.cloudinary.com/durbtkhbz/image/upload/v1766121553/5ce7960d-fb0f-4693-8c80-800e26fcac92-removebg-preview_cilmdc.png';
  const defaultTitle = 'Andhra Machines Agencies - Premium Sewing Machines Since 1982';
  const defaultDescription = 'Your trusted partner for premium sewing machines since 1982. Shop Usha, Singer, JUKI, Brother, Jack, Guru & Shiela sewing machines. Delivery across India. Expert service & genuine products.';

  useEffect(() => {
    // Update document title
    document.title = title || defaultTitle;

    // Update or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      if (!content) return;
      
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Update or create link tags
    const updateLinkTag = (rel, href) => {
      if (!href) return;
      
      let element = document.querySelector(`link[rel="${rel}"]`);
      
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      
      element.setAttribute('href', href);
    };

    // Primary Meta Tags
    updateMetaTag('title', title || defaultTitle);
    updateMetaTag('description', description || defaultDescription);
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }
    updateMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph Tags
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:title', title || defaultTitle, true);
    updateMetaTag('og:description', description || defaultDescription, true);
    updateMetaTag('og:image', image || defaultImage, true);
    updateMetaTag('og:site_name', 'Andhra Machines Agencies', true);

    // Twitter Card Tags
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:url', currentUrl, true);
    updateMetaTag('twitter:title', title || defaultTitle, true);
    updateMetaTag('twitter:description', description || defaultDescription, true);
    updateMetaTag('twitter:image', image || defaultImage, true);

    // Canonical URL
    updateLinkTag('canonical', currentUrl);

    // Cleanup function (optional, but good practice)
    return () => {
      // Meta tags will persist, which is what we want for SEO
    };
  }, [title, description, keywords, image, type, noindex, currentUrl]);

  return null; // This component doesn't render anything
};

export default SEO;

