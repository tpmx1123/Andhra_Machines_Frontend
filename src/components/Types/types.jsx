import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Check, Clock, Zap } from 'lucide-react';

// Machine types data with brand information
const machineBrands = [
  {
    id: 1,
    name: 'USHA',
    description: 'Trusted Indian brand offering a wide range of sewing machines for home and industrial use.',
    features: ['Durable', 'User-friendly', 'Wide service network'],
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1584917860127-7ee3bf0d81d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    popularModels: ['Janome Allure', 'Janome Memory Craft', 'Janome DC']
  },
  {
    id: 2,
    name: 'Singer',
    description: 'Iconic American brand known for reliable and innovative sewing machines since 1851.',
    features: ['Advanced features', 'Great for beginners', 'Widely available'],
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1584917860127-7ee3bf0d81d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    popularModels: ['Singer Heavy Duty', 'Singer Quantum', 'Singer Start']
  },
  {
    id: 3,
    name: 'JACK',
    description: 'Professional-grade industrial sewing machines built for heavy-duty performance.',
    features: ['Industrial strength', 'High-speed', 'Precision stitching'],
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1584917860127-7ee3bf0d81d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    popularModels: ['JACK F4', 'JACK F5', 'JACK A4']
  },
  {
    id: 4,
    name: 'Brother',
    description: 'Innovative Japanese brand offering computerized and mechanical sewing machines.',
    features: ['Advanced technology', 'User interface', 'Warranty support'],
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1584917860127-7ee3bf0d81d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    popularModels: ['Brother CS7000X', 'Brother PQ1500SL', 'Brother HC1850']
  },
  {
    id: 5,
    name: 'Shiela',
    description: 'Affordable and reliable sewing machines perfect for home use and small businesses.',
    features: ['Budget-friendly', 'Easy to maintain', 'Compact design'],
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1584917860127-7ee3bf0d81d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    popularModels: ['Shiela Deluxe', 'Shiela Smart', 'Shiela Compact']
  },
  {
    id: 6,
    name: 'Juki',
    description: 'Professional and industrial sewing machines known for speed and durability.',
    features: ['High-speed', 'Industrial grade', 'Precision engineering'],
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1584917860127-7ee3bf0d81d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    popularModels: ['Juki DDL-8700', 'Juki MO-6700S', 'Juki HZL-F600']
  }
];

const MachineTypes = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  const MotionWrapper = isMobile 
    ? ({ children, className }) => <div className={className}>{children}</div>
    : motion.div;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#c54513] to-[#1a365d]">
            Our Premium Sewing Machine Brands
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the perfect sewing machine from top brands trusted by professionals and hobbyists worldwide.
          </p>
        </motion.div>

        {/* Machine Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {machineBrands.map((brand, index) => (
            <MotionWrapper
              key={brand.id}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute top-4 right-4 bg-[#c54513] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md flex items-center">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  {brand.rating}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#c54513] transition-colors duration-300">
                    {brand.name}
                  </h3>
                  <div className="flex items-center bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded">
                    <Zap className="h-3 w-3 mr-1" />
                    In Stock
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {brand.description}
                </p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Key Features:</h4>
                  <ul className="space-y-2">
                    {brand.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Popular Models:</h4>
                  <div className="flex flex-wrap gap-2">
                    {brand.popularModels.map((model, i) => (
                      <span 
                        key={i}
                        className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button className="mt-6 w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#c54513] hover:bg-[#a4370f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c54513] transition-colors duration-200">
                  View All {brand.name} Models
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </MotionWrapper>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-white rounded-2xl p-8 shadow-lg text-center"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help Choosing?</h2>
            <p className="text-gray-600 mb-6">
              Our sewing machine experts are here to help you find the perfect machine for your needs. 
              Get personalized recommendations and expert advice.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-6 py-3 bg-[#c54513] text-white font-medium rounded-lg hover:bg-[#a4370f] transition-colors duration-200">
                Book a Free Consultation
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200">
                Call Us Now
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MachineTypes;