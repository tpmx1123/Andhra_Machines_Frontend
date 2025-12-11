import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'Do you provide warranty on sewing machines?',
      answer: 'Yes, all our sewing machines come with manufacturer warranty. The warranty period varies by brand and model, typically ranging from 1 to 5 years. We also offer extended warranty options for additional peace of mind.',
    },
    {
      question: 'What areas do you deliver to?',
      answer: 'We provide free delivery services across Chennai and surrounding areas. Same-day delivery is available for orders placed before 2 PM. For outstation deliveries, please contact our customer support team for details.',
    },
    {
      question: 'Do you offer repair and maintenance services?',
      answer: 'Absolutely! We have a team of experienced technicians who provide comprehensive repair and maintenance services for all brands of sewing machines. We offer both on-site and in-store repair options.',
    },
    {
      question: 'Can I exchange my old sewing machine?',
      answer: 'Yes, we offer exchange programs for old sewing machines. The exchange value depends on the brand, model, and condition of your old machine. Our team will assess your machine and provide you with the best exchange offer.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept various payment methods including cash, credit/debit cards, UPI payments, and bank transfers. We also provide easy EMI options for select models through our financing partners.',
    },
    {
      question: 'Do you provide training for beginners?',
      answer: 'Yes, we offer beginner training programs for those new to sewing. Our training covers basic machine operation, threading, stitching techniques, and simple projects. Both individual and group training sessions are available.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="w-24 h-1 bg-[#c54513] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600">
            Find answers to common questions about our products and services
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-medium text-gray-900">
                  {faq.question}
                </span>
                <ChevronDown 
                  size={20} 
                  className={`text-gray-500 transition-transform duration-200 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`} 
                />
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-white">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <button className="bg-[#c54513] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#a5380e] transition-colors">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
}
