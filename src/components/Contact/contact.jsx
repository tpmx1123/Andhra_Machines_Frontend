import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, MessageCircle, Facebook, Instagram, Send } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle success message from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      // Add small delay to ensure smooth transition after page load
      const timer = setTimeout(() => {
        setSubmitStatus({
          success: true,
          message: 'Thank you for your message! We will get back to you soon.'
        });
        // Clear the URL parameters without triggering scroll
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // The form will be submitted to FormSubmit
    setSubmitStatus({
      success: true,
      message: 'Sending your message...'
    });
    
    // The actual form submission is handled by the browser
    e.target.submit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#eef2f7] py-6 sm:py-10 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Heading - Optimized for mobile */}
        <div className="text-center mb-6 sm:mb-10 px-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a365d]">
            Contact <span className="text-[#c54513]">Us</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            We'd love to hear from you. Get in touch with us!
          </p>
        </div>

        {/* Main 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Contact Info Card - Simplified animation */}
          <div className="lg:col-span-1 bg-white/95 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-[#1a365d] to-[#2c5282] p-6 text-white shadow-md">
              <h2 className="text-2xl md:text-3xl font-bold">Our Information</h2>
              <p className="opacity-90 mt-1">We're here to help you</p>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 bg-gray-50/50">
              {/* Contact Item */}
              <div className="group flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                <div className="p-2 sm:p-3 bg-[#1a365d]/10 rounded-xl group-hover:bg-[#c54513]/10 transition-colors">
                  <Phone className="h-6 w-6 text-[#c54513]" />
                </div>
                <div className="flex-shrink-0 mt-0.5">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">Call Us</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <a href="tel:9701332707" className="block text-gray-600 hover:text-[#c54513] transition-colors font-medium">
                      +91 97013 32707
                    </a>
                   
                  </div>
                </div>
              </div>
              {/* Email Item */}
              <div className="group flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                <div className="p-2 sm:p-3 bg-[#1a365d]/10 rounded-xl group-hover:bg-[#c54513]/10 transition-colors">
                  <Mail className="h-6 w-6 text-[#c54513]" />
                </div>
                <div className="flex-shrink-0 mt-0.5">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">Email Us</h3>
                  <a 
                    href="#"
                    className="text-gray-600 hover:text-[#c54513] transition-colors break-words font-medium block"
                    onClick={(e) => {
                      e.preventDefault();
                      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                      const email = 'andhramachinesagencies@gmail.com';
                      const subject = 'Contact from Andhra Machines Website';
                      
                      if (isMobile) {
                        // For mobile devices, try to open the default email app
                        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
                        // Fallback to copy email to clipboard if the above doesn't work
                        setTimeout(() => {
                          navigator.clipboard.writeText(email).then(() => {
                            alert('Email address copied to clipboard! Please paste it in your email app.');
                          });
                        }, 200);
                      } else {
                        // For desktop, try to open default email client
                        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
                        // Fallback for webmail users
                        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}`, '_blank');
                      }
                      return false;
                    }}
                  >
                    andhramachinesagencies@gmail.com
                  </a>
                </div>
              </div>

              {/* WhatsApp Item */}
              <div className="group flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                <div className="p-2 sm:p-3 bg-[#1a365d]/10 rounded-xl group-hover:bg-[#c54513]/10 transition-colors">
                  <MessageCircle className="h-6 w-6 text-[#c54513]" />
                </div>
                <div className="flex-shrink-0 mt-0.5">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">WhatsApp</h3>
                  <a
                    href="https://wa.me/917416421770"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#c54513] transition-colors font-medium block"
                  >
                    +91 74164 21770
                  </a>
                </div>
              </div>

              {/* Address Item */}
              <div className="group flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                <div className="p-2 sm:p-3 bg-[#1a365d]/10 rounded-xl group-hover:bg-[#c54513]/10 transition-colors">
                  <MapPin className="h-6 w-6 text-[#c54513]" />
                </div>
                <div className="flex-shrink-0 mt-0.5">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">Our Location</h3>
                  <address className="not-italic text-sm sm:text-base text-gray-600 font-medium">
                    Andhra Machines Agencies,
                    Kandakam Road,<br />
                    Rajahmundry - 533101,
                    Andhra Pradesh, India
                  </address>
                  <a 
                    href="https://maps.app.goo.gl/HBKjcTHosNKR9nBJ8" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 text-[#1a365d] hover:text-[#c54513] font-medium text-sm"
                  >
                    View on Map
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Contact Form and Business Hours - Simplified animation */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Form Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-5 sm:p-6 md:p-8 border border-gray-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1a365d] mb-4">Send us a Message</h2>
              
              {submitStatus.message && (
                <div className={`p-3 rounded-lg mb-4 ${submitStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {submitStatus.message}
                </div>
              )}
              
              <form 
                action="https://formsubmit.co/bhanu.rupa2003@gmail.com" 
                method="POST"
                onSubmit={handleSubmit}
                className="space-y-3 sm:space-y-4"
              >
                <input type="hidden" name="_subject" value="New Contact Form Submission - Andhra Machines" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_next" value={`${window.location.origin}${window.location.pathname}?success=true`} />
                <input type="text" name="_honey" style={{display: 'none'}} />
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c54513] focus:border-transparent transition-all text-sm sm:text-base"
                    placeholder="Your name"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c54513] focus:border-transparent transition-all text-sm sm:text-base"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit Indian phone number"
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c54513] focus:border-transparent transition-all text-sm sm:text-base"
                      placeholder="98XXXXXX70"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="3"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c54513] focus:border-transparent transition-all text-sm sm:text-base"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                <div className="mt-10 sm:mt-14">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 bg-[#c54513] text-white py-2 sm:py-2.5 px-4 rounded-lg hover:bg-[#a43a10] transition-colors font-medium text-sm ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Business Hours Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-5 sm:p-6 md:p-8 border border-gray-100">
              <div className="flex items-start space-x-3">
                <div className="p-1.5 sm:p-2.5 bg-[#1a365d]/10 rounded-lg">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-[#c54513]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Get in Touch</h3>
                  <div className="text-gray-600 space-y-1 text-sm">
                    <p>Monday - Saturday: <span className="text-gray-800 font-medium">10:30 AM – 9:00 PM</span></p>
                    <p className="text-red-600 font-medium">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section - Simplified animation */}
        <div className="lg:col-span-1 bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden h-full border border-gray-100 mt-6 sm:mt-8">
          <div className="h-[300px] sm:h-[350px] w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3790.1199999999994!2d81.7772144!3d17.0001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3785f8b0b1b1b5%3A0x3a3785f8b0b1b1b6!2sAndhra%20Machines%20Agencies!5e0!3m2!1sen!2sin!4v1702104960000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Andhra Machines Agencies Location"
              className="w-full h-full"
            ></iframe>
          </div>
            
          {/* Map Controls */}
          <div className="p-3 sm:p-6 bg-white border-t border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Our Location</h3>
                <p className="text-sm sm:text-base text-gray-600">Kandakam Road, Rajahmundry - 533101</p>
              </div>
              <a
                href="https://maps.app.goo.gl/HBKjcTHosNKR9nBJ8"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-[#1a365d] text-white rounded-lg hover:bg-[#c54513] transition-colors flex items-center gap-2 text-sm sm:text-base"
              >
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                Get Directions
              </a>
            </div>
          </div>
        </div>

        {/* Social Media Connect Section */}
        <div className="mt-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#1a365d] mb-8 sm:mb-10">
            Connect With <span className="text-[#c54513]">Us</span>
          </h2>

          <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-2 sm:px-0">
            {/* Instagram Card */}
            <a
              href="https://www.instagram.com/andhramachinesagencies"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-blue-300 to-blue-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-white/20 p-4 rounded-full mb-4 group-hover:bg-white/30 transition-colors">
                  <Instagram className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Instagram</h3>
                <p className="opacity-90 text-sm">Follow us for the latest updates and offers</p>
                
              </div>
            </a>

            {/* Facebook Card */}
            <a
              href="https://www.facebook.com/andhramachinesagencies"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-white/20 p-4 rounded-full mb-4 group-hover:bg-white/30 transition-colors">
                  <Facebook className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Facebook</h3>
                <p className="opacity-90 text-sm">Connect with us on Facebook</p>
                
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}