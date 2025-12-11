import React from 'react';
import HeroSlider from './HeroSlider';
import AboutSection from './AboutSection';
import BrandsSection from './BrandsSection';
import ProductsSection from './ProductsSection';
import WhyChooseUs from './WhyChooseUs';
import FAQSection from './FAQSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSlider />
      <AboutSection />
      <BrandsSection />
      <ProductsSection />
      <WhyChooseUs />
      <FAQSection />
    </div>
  );
}
