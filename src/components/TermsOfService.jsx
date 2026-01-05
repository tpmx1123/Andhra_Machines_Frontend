import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center text-[#c54513] hover:text-[#a43a10] mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 lg:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-sm sm:prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to Andhra Machines Agencies. These Terms of Service ("Terms") govern your access to and use of our website, products, and services. By accessing or using our website, you agree to be bound by these Terms and all applicable laws and regulations.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you do not agree with any part of these Terms, you must not use our website or services. We reserve the right to modify these Terms at any time, and such modifications will be effective immediately upon posting on our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. About Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Andhra Machines Agencies is an e-commerce platform specializing in the sale of sewing machines and related products. We have been serving customers since 1982, offering quality products from renowned brands including Usha, Singer, Brother, Jack, Guru, and Shiela.
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mt-4">
                <p className="text-gray-700">
                  <strong>Business Information:</strong><br />
                  Andhra Machines Agencies<br />
                  Kandakam Road, Rajahmundry - 533101<br />
                  Andhra Pradesh, India<br />
                  Email: andhramachinesagencies@gmail.com<br />
                  Phone: +91 97013 32707 | +91 74164 21770
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Use of Website</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.1 Eligibility</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You must be at least 18 years old and have the legal capacity to enter into contracts to use our website and make purchases. By using our website, you represent and warrant that you meet these eligibility requirements.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.2 Account Registration</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                To make purchases, you may be required to create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your account information</li>
                <li>Keep your account credentials secure and confidential</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.3 Prohibited Activities</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>Use the website for any illegal or unauthorized purpose</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon intellectual property rights</li>
                <li>Transmit viruses, malware, or harmful code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt website functionality</li>
                <li>Use automated systems to access the website without permission</li>
                <li>Impersonate any person or entity</li>
                <li>Collect user information without consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Products and Pricing</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.1 Product Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We strive to provide accurate product descriptions, images, and specifications. However, we do not warrant that product descriptions, images, or other content on our website are accurate, complete, reliable, current, or error-free. Product images are for illustrative purposes and may not reflect the exact appearance of the product.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.2 Pricing</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                All prices are displayed in Indian Rupees (₹) and are subject to change without notice. We reserve the right to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>Modify prices at any time</li>
                <li>Correct pricing errors, even after order confirmation</li>
                <li>Offer promotional discounts and special pricing</li>
                <li>Limit quantities available for purchase</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                If we discover a pricing error after you have placed an order, we will notify you and provide options to either cancel the order or proceed at the correct price.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.3 Availability</h3>
              <p className="text-gray-700 leading-relaxed">
                Product availability is subject to change. We reserve the right to limit quantities, discontinue products, or refuse orders at our discretion. If a product becomes unavailable after you place an order, we will notify you and arrange for an exchange or replacement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Orders and Payment</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">5.1 Order Process</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you place an order:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>You make an offer to purchase products at the listed price</li>
                <li>We will send an order confirmation email (this is not acceptance of your order)</li>
                <li>We reserve the right to accept or reject your order</li>
                <li>Order acceptance occurs when we ship the product or confirm shipment</li>
                <li>We may cancel orders for reasons including product unavailability, pricing errors, or fraud prevention</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">5.2 Payment Terms</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Payment must be made at the time of order placement. We accept:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>Credit and debit cards (Visa, Mastercard, RuPay, etc.)</li>
                <li>Net banking</li>
                <li>UPI (Unified Payments Interface)</li>
                <li>Digital wallets (as available)</li>
                <li>Cash on Delivery (COD) - subject to availability and terms</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                All payments are processed through secure payment gateways. We do not store your complete payment card information on our servers.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">5.3 Payment Security</h3>
              <p className="text-gray-700 leading-relaxed">
                We use industry-standard encryption and security measures to protect your payment information. However, you are responsible for ensuring the security of your payment method and account credentials.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Shipping and Delivery</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">6.1 Delivery Areas</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We currently deliver across India. Delivery times and charges may vary based on your location. We will provide estimated delivery dates at checkout.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">6.2 Shipping Charges</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Shipping charges, if applicable, will be displayed at checkout. We may offer free shipping on orders above a certain value, subject to terms and conditions.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">6.3 Delivery Terms</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Delivery terms include:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>Delivery will be made to the address specified in your order</li>
                <li>You must provide accurate and complete delivery information</li>
                <li>Someone must be available to receive the delivery</li>
                <li>We are not responsible for delays caused by incorrect addresses or unavailability</li>
                <li>Risk of loss and title pass to you upon delivery</li>
                <li>Delivery times are estimates and not guaranteed</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">6.4 Failed Deliveries</h3>
              <p className="text-gray-700 leading-relaxed">
                If delivery cannot be completed due to incorrect address, recipient unavailability, or refusal to accept, additional charges may apply for re-delivery. We reserve the right to cancel orders after multiple failed delivery attempts.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Replacements and Exchanges</h2>
              <p className="text-gray-700 leading-relaxed">
                For details about replacements and exchanges, please contact us at andhramachinesagencies@gmail.com or call +91 97013 32707.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Warranties and Product Guarantees</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Products sold by us may come with manufacturer warranties. The warranty period varies by brand and model, typically ranging from 1 to 3 years only. We will provide warranty information with your purchase. We are not responsible for manufacturer warranties, but we will assist you in warranty claims when possible.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We warrant that products will be free from defects in materials and workmanship at the time of delivery. This warranty does not cover damage caused by misuse, accidents, or normal wear and tear.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All content on our website, including text, graphics, logos, images, software, and design, is the property of Andhra Machines Agencies or its content suppliers and is protected by Indian and international copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may not:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>Reproduce, distribute, or create derivative works from our content</li>
                <li>Use our trademarks or logos without written permission</li>
                <li>Remove copyright or proprietary notices</li>
                <li>Use automated systems to scrape or copy content</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                You may view and download content for personal, non-commercial use only, provided you maintain all copyright and proprietary notices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. User Content and Reviews</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may submit reviews, comments, and other content ("User Content") on our website. By submitting User Content, you grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, modify, and display such content.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree that your User Content:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>Is accurate and truthful</li>
                <li>Does not violate any laws or third-party rights</li>
                <li>Is not defamatory, obscene, or offensive</li>
                <li>Does not contain spam or promotional content</li>
                <li>Is your original work or you have permission to use it</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to remove, edit, or refuse to post any User Content at our discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To the maximum extent permitted by law:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>Our website and services are provided "as is" without warranties of any kind</li>
                <li>We disclaim all warranties, express or implied, including merchantability and fitness for a particular purpose</li>
                <li>We are not liable for indirect, incidental, special, or consequential damages</li>
                <li>Our total liability shall not exceed the amount you paid for the product in question</li>
                <li>We are not responsible for delays or failures due to circumstances beyond our control</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability, so some of the above limitations may not apply to you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Indemnification</h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify, defend, and hold harmless Andhra Machines Agencies, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of our website, violation of these Terms, or infringement of any rights of another party.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Termination</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>Terminate or suspend your account at any time for violation of these Terms</li>
                <li>Refuse service to anyone for any reason</li>
                <li>Modify or discontinue the website or services</li>
                <li>Cancel orders if we suspect fraud or violation of Terms</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                You may terminate your account at any time by contacting us. Upon termination, your right to use the website will immediately cease.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Dispute Resolution</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                In case of any disputes or complaints:
              </p>
              <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-700">
                <li>Contact our customer service first to resolve the issue amicably</li>
                <li>If unresolved, disputes will be subject to the exclusive jurisdiction of courts in Rajahmundry, Andhra Pradesh, India</li>
                <li>These Terms are governed by the laws of India</li>
              </ol>
              <p className="text-gray-700 leading-relaxed">
                You may also contact the Consumer Grievance Redressal Forum or Consumer Court as per applicable consumer protection laws in India.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Force Majeure</h2>
              <p className="text-gray-700 leading-relaxed">
                We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including natural disasters, war, terrorism, labor disputes, government actions, internet failures, or other force majeure events.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Severability</h2>
              <p className="text-gray-700 leading-relaxed">
                If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions will continue in full force and effect. The invalid provision will be replaced with a valid provision that most closely reflects the intent of the original provision.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">17. Entire Agreement</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and Andhra Machines Agencies regarding your use of our website and services, superseding all prior agreements and understandings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">18. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <p className="text-gray-700">
                  <strong>Andhra Machines Agencies</strong><br />
                  Kandakam Road, Rajahmundry - 533101<br />
                  Andhra Pradesh, India
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> <a href="mailto:andhramachinesagencies@gmail.com" className="text-[#c54513] hover:underline">andhramachinesagencies@gmail.com</a>
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> <a href="tel:+919701332707" className="text-[#c54513] hover:underline">+91 97013 32707</a> | <a href="tel:917416421770" className="text-[#c54513] hover:underline">+91 74164 21770</a>
                </p>
                <p className="text-gray-700">
                  <strong>Business Hours:</strong> Monday - Saturday: 10:30 AM to 8:30 PM
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}


