import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Search, X } from 'lucide-react';

export default function FAQSection() {
  const [openIndices, setOpenIndices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredFaqs, setFilteredFaqs] = useState([]);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'warranty', name: 'Warranty' },
    { id: 'delivery', name: 'Delivery' },
    { id: 'services', name: 'Services' },
    { id: 'payments', name: 'Payments' }
  ];

  const faqs = [
    {
      question: 'Do you provide warranty on sewing machines?',
      answer: 'Yes, all our sewing machines come with manufacturer warranty. The warranty period varies by brand and model, typically ranging from 1 to 3 years only.',
      category: 'warranty'
    },
    {
      question: 'What areas do you deliver to?',
      answer: 'We provide free delivery services across India. For outstation deliveries, please contact our customer support team for details.',
      category: 'delivery'
    },
    {
      question: 'Do you offer repair and maintenance services?',
      answer: 'Absolutely! We have a team of experienced technicians who provide comprehensive repair and maintenance services for all brands of sewing machines. We offer both on-site and in-store repair options.',
      category: 'services'
    },
    {
      question: 'Can I exchange my old sewing machine?',
      answer: 'Yes, we offer exchange programs for old sewing machines. The exchange value depends on the brand, model, and condition of your old machine. Our team will assess your machine and provide you with the best exchange offer.',
      category: 'services'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept various payment methods including cash, credit/debit cards, UPI payments, and bank transfers. We also provide easy EMI (Bajaj) options for select models through our financing partners.',
      category: 'payments'
    },
    {
      question: 'How do I claim my warranty?',
      answer: 'To claim your warranty, please have your purchase receipt and warranty card ready. You can visit our service center or call our customer support for assistance. Our team will guide you through the process and schedule a service appointment if needed.',
      category: 'warranty'
    },
    {
      question: 'What are your supporting timings?',
      answer: 'Support is available during business hours. Monday to Saturday from 10:30 AM to 8:30 PM. Sunday is closed.',
      category: 'services'
    }
  ];

  useEffect(() => {
    let results = [...faqs];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        faq => faq.question.toLowerCase().includes(term) || 
               faq.answer.toLowerCase().includes(term)
      );
    }
    
    // Filter by category
    if (activeCategory !== 'all') {
      results = results.filter(faq => faq.category === activeCategory);
    }
    
    setFilteredFaqs(results);
  }, [searchTerm, activeCategory]);

  const toggleFAQ = (index) => {
    setOpenIndices(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="w-24 h-1 bg-[#c54513] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600">
            Find answers to common questions about our products and services
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="relative max-w-xl mx-auto mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search FAQs..."
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-[#c54513] focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-[#c54513] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndices.includes(index)}
                >
                  <span className="text-lg font-medium text-gray-900 text-left">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-gray-500 transition-transform duration-200 ${
                      openIndices.includes(index) ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ${
                    openIndices.includes(index) ? 'max-h-96 py-4' : 'max-h-0 py-0'
                  }`}
                >
                  <div className="pb-4 text-gray-600 border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No FAQs found matching your search.</p>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <Link
            to="/contact"
            className="inline-block bg-[#c54513] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#a5380e] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}