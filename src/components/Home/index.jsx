import React from 'react';
import SEO from '../SEO';
import StructuredData, { generateOrganizationSchema } from '../StructuredData';
import HeroSlider from './HeroSlider';
import AboutSection from './AboutSection';
import BrandsSection from './BrandsSection';
import ProductsSection from './ProductsSection';
import WhyChooseUs from './WhyChooseUs';
import FAQSection from './FAQSection';

export default function Home() {
  const organizationSchema = generateOrganizationSchema();
  
  return (
    <>
      <SEO
        title="Andhra Machines Agencies - Premium Sewing Machines Since 1982 | Usha, Singer, Brother"
        description="Your trusted partner for premium sewing machines since 1982. Shop Usha, Singer, Brother, Jack, Guru & Shiela sewing machines. Delivery across India. Expert service & genuine products."
        keywords="sewing machines, Usha sewing machine, Singer sewing machine, Brother sewing machine, sewing machine dealer, Rajahmundry, Andhra Pradesh, industrial sewing machines, domestic sewing machines"
        image="https://res.cloudinary.com/durbtkhbz/image/upload/v1766121553/5ce7960d-fb0f-4693-8c80-800e26fcac92-removebg-preview_cilmdc.png"
      />
      <StructuredData data={organizationSchema} />
      <div className="min-h-screen bg-white">
        <HeroSlider />
        <AboutSection />
        <BrandsSection />
        <ProductsSection />
        <WhyChooseUs />
        <FAQSection />
      </div>
    </>
  );
}
