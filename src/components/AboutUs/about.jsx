import React from "react";
import { Link } from "react-router-dom";
import { Check, Award, Lightbulb, Hand,Webhook, Handshake } from "lucide-react";
import SEO from "../SEO";

export default function About() {
  return (
    <>
      <SEO
        title="About Us - Andhra Machines Agencies | Trusted Sewing Machine Dealer Since 1982"
        description="Learn about Andhra Machines Agencies - your trusted partner for premium sewing machines since 1982. Four decades of excellence in Rajahmundry, Andhra Pradesh. Expert service, genuine products, and customer satisfaction."
        keywords="Andhra Machines Agencies about, sewing machine dealer Rajahmundry, trusted sewing machine store, sewing machine service since 1982, Andhra Pradesh sewing machines"
      />
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#eef2f7] py-10 sm:py-14 px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <div className="text-center mb-8 sm:mb-12 px-2 transition-all duration-300">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#1a365d]">
            Our <span className="text-[#c54513]">Story</span>
          </h1>
          <p className="text-sm sm:text-lg text-gray-600 mt-2 sm:mt-3 px-2 max-w-3xl mx-auto">
            Four decades of trust, quality, and innovation in the world of sewing
          </p>
        </div>
      </div>

      {/* Introduction Section */}
      <section className="max-w-6xl mx-auto mb-20">
        <div className="bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-5 sm:p-7 md:p-10 lg:p-12 mb-10 sm:mb-12 transition-all duration-300 transform hover:scale-[1.01]">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a365d] mb-4 sm:mb-6">Our Journey Since 1982</h2>
          <div className="space-y-4 sm:space-y-5 text-gray-700 leading-relaxed text-sm sm:text-base">
          <p>
          Our journey began in 1982 in Rajahmundry, with a simple but powerful vision: to bring reliable sewing machines and genuine service to every customer who values craftsmanship. Over the past 43 years, that vision has grown into a legacy.
          </p>

          <p>
          From a humble, family-run business, we have become one of the most trusted names in sewing machines, accessories, and servicing in Andhra Pradesh.
          </p>

          <p>
          With a strong presence in Rajahmundry and an expanding footprint through our branch in Visakhapatnam, we have served thousands of households, boutiques, professional tailors, and industries—each one becoming a part of our story.
          </p>

          </div>
        </div>

        {/* Heritage Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7 md:gap-8 mb-14 sm:mb-20">
          <div className="bg-gradient-to-br from-[#1a365d] to-[#2c5282] text-white p-8 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center mb-6">
              <Award className="h-8 w-8 mr-3 text-[#c54513]" />
              <h3 className="text-xl sm:text-2xl font-bold">A Heritage of Trust and Quality</h3>
            </div>
            <p className="text-gray-200 leading-relaxed">
            Built on dedication, honesty, and expertise, our brand has earned deep-rooted customer trust that spans generations. We believe in delivering not just products, but long-lasting solutions, backed by expert service and personal guidance. This trust has positioned us among the leading sewing machine dealers in the region.
            </p>
          </div>

          {/* What We Offer */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-8 transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center mb-6">
              <Hand className="h-8 w-8 mr-3 text-[#c54513]" />
              <h3 className="text-2xl font-bold text-[#1a365d]">What We Offer</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>A wide range of domestic, professional, and industrial sewing machines</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Genuine accessories, spare parts, attachments, and upgrades</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Technical servicing and repairs by skilled, experienced technicians</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Personalized consultation to help you choose the perfect machine</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Long-term after-sales support for smooth, reliable performance</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Innovation Section */}
        <div className="bg-gradient-to-r from-[#f8fafc] to-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 mb-14 sm:mb-20 transition-all duration-300 transform hover:scale-[1.01]">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#c54513]/10 text-[#c54513] mb-6">
             <Handshake className="h-10 w-10 mr-0 text-[#c54513]" />

            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold text-[#1a365d] mb-3 sm:mb-4">Commitment to Innovation and Growth</h3>
            <p className="text-gray-700 leading-relaxed">
              As the sewing industry evolves, so do we. We continue to adopt new technologies, modern models, and advanced solutions to ensure our customers always have access to the best tools for their creative and business needs.
            </p>
          </div>
        </div>

        {/* Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7 md:gap-8 mb-14 sm:mb-20">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-8 flex flex-col justify-center transition-all duration-300 transform hover:scale-[1.01]">
            <div className="flex items-center mb-6">
              <Webhook className="h-8 w-8 mr-3 text-[#c54513]" />
              <h3 className="text-2xl font-bold text-[#1a365d]">Moving Forward</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              From 1982 to today, our purpose remains the same: to support creativity, empower livelihoods, and provide dependable sewing solutions with integrity and care. As we expand across India, we carry forward the values that built our foundation—quality, trust, and unwavering customer commitment.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-2xl h-full min-h-[300px] sm:min-h-[400px] transition-all duration-300 transform hover:scale-[1.01]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#c54513] to-[#1a365d] opacity-90"></div>
              <div className="relative p-6 sm:p-8 text-white h-full flex flex-col justify-center">
              <div className="flex items-center mb-4 sm:mb-6">
                <Lightbulb className="h-8 w-8 mr-3 text-white" />
                <h3 className="text-xl sm:text-2xl font-bold">Our Vision for India</h3>
              </div>
              <p className="text-gray-200 leading-relaxed text-sm sm:text-base">
                After becoming a trusted name in Andhra Pradesh for over four decades, we are now stepping into a larger dream—
                <br /> <span className="text-white font-bold text-base sm:text-lg">to serve the pan-India market and deliver sewing machines and accessories to customers across the country.</span>
              </p>
              <p className="text-gray-200 leading-relaxed mt-3 sm:mt-4 text-sm sm:text-base">
                With nationwide delivery capabilities, strengthened logistics, and a growing digital presence, we are committed to making our products and services accessible to every corner of India.
              </p>
            </div>
          </div>

          
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-14 sm:mb-20">
          <div className="p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#c54513] mb-1 sm:mb-2">43+</div>
            <div className="text-gray-700 text-sm sm:text-base">Years of Excellence</div>
          </div>
          <div className="p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#c54513] mb-1 sm:mb-2">2,50,000+</div>
            <div className="text-gray-700 text-sm sm:text-base">Happy Customers</div>
          </div>
          
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#1a365d] to-[#2c5282] rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 text-center text-white transition-all duration-300 transform hover:scale-[1.01]">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Become Part of Our Growing Family</h3>
          <p className="text-gray-200 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
            Join thousands of satisfied customers who trust us for their sewing needs. Experience the difference of working with a company that truly cares.
          </p>

          <Link to="/contact">
            <button className="bg-[#c54513] hover:bg-[#a43a10] text-white font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-colors text-sm sm:text-base">
              Contact Us Today
            </button>
          </Link>

        </div>
      </section>
    </div>
    </>
  );
}