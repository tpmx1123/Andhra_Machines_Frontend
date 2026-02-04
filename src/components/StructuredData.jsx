import { useEffect } from 'react';

const StructuredData = ({ data }) => {
  useEffect(() => {
    if (!data) return;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    script.id = 'structured-data';
    
    // Remove existing structured data script if any
    const existingScript = document.getElementById('structured-data');
    if (existingScript) {
      existingScript.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [data]);

  return null;
};

// Helper functions to generate structured data
export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "Andhra Machines Agencies",
  "image": "https://res.cloudinary.com/durbtkhbz/image/upload/v1766121553/5ce7960d-fb0f-4693-8c80-800e26fcac92-removebg-preview_cilmdc.png",
  "description": "Premium sewing machines dealer since 1982. Specializing in Usha, Singer, Brother, Jack, Guru, and Shiela sewing machines.",
  "url": "https://andhramachinesagencies.com",
  "telephone": "+919701332707",
  "email": "andhramachinesagencies@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "JN Road",
    "addressLocality": "Rajahmahendravaram",
    "addressRegion": "Andhra Pradesh",
    "postalCode": "533101",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "17.0005",
    "longitude": "81.8040"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "opens": "09:00",
    "closes": "19:00"
  },
  "priceRange": "$$",
  "paymentAccepted": "Cash, Credit Card, Debit Card, UPI, Net Banking",
  "currenciesAccepted": "INR",
  "areaServed": {
    "@type": "Country",
    "name": "India"
  },
  "sameAs": [
    "https://www.facebook.com/andhramachinesagencies",
    "https://www.instagram.com/andhramachinesagencies"
  ],
  "foundingDate": "1982",
  "slogan": "Stitching Trust Since 1982"
});

export const generateProductSchema = (product) => {
  if (!product) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || `${product.name} - Premium sewing machine from ${product.brand || 'Andhra Machines Agencies'}`,
    "image": product.images && product.images.length > 0 ? product.images : ["https://res.cloudinary.com/durbtkhbz/image/upload/v1766121553/5ce7960d-fb0f-4693-8c80-800e26fcac92-removebg-preview_cilmdc.png"],
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Andhra Machines Agencies"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://andhramachinesagencies.com/products/${product.id}`,
      "priceCurrency": "INR",
      "price": product.price?.toString() || "0",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Store",
        "name": "Andhra Machines Agencies"
      }
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating.toString(),
      "reviewCount": product.reviewsCount?.toString() || "0"
    } : undefined
  };
};

export const generateBreadcrumbSchema = (items) => {
  if (!items || items.length === 0) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://andhramachinesagencies.com${item.url}`
    }))
  };
};

export const generateArticleSchema = (article) => {
  if (!article) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt || article.content?.substring(0, 200),
    "image": article.image || "https://res.cloudinary.com/durbtkhbz/image/upload/v1766121553/5ce7960d-fb0f-4693-8c80-800e26fcac92-removebg-preview_cilmdc.png",
    "author": {
      "@type": "Organization",
      "name": "Andhra Machines Agencies"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Andhra Machines Agencies",
      "logo": {
        "@type": "ImageObject",
        "url": "https://res.cloudinary.com/durbtkhbz/image/upload/v1766121553/5ce7960d-fb0f-4693-8c80-800e26fcac92-removebg-preview_cilmdc.png"
      }
    },
    "datePublished": article.createdAt || new Date().toISOString(),
    "dateModified": article.updatedAt || new Date().toISOString()
  };
};

export default StructuredData;

