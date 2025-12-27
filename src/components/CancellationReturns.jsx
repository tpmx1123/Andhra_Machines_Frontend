import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CancellationReturns() {
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
            Cancellation & Replacements Policy
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-sm sm:prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Overview</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                At Andhra Machines Agencies, we want you to be completely satisfied with your purchase. This Cancellation & Replacements Policy outlines the terms and conditions for canceling orders and replacing products purchased from our website.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Please read this policy carefully before making a purchase. By placing an order with us, you agree to the terms outlined in this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Order Cancellation</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.1 Before Shipment</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may cancel your order at any time before it is shipped. To cancel an order:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>Contact our customer service team immediately at <a href="mailto:andhramachinesagencies@gmail.com" className="text-[#c54513] hover:underline">andhramachinesagencies@gmail.com</a> or call <a href="tel:+919701332707" className="text-[#c54513] hover:underline">+91 97013 32707</a></li>
                <li>Provide your order number and cancellation request</li>
                <li>We will process the cancellation and arrange for an exchange or replacement within 5-7 business days</li>
                <li>Exchange or replacement will be processed based on your preference and product availability</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.2 After Shipment</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Once your order has been shipped, you cannot cancel it. However, you may request a replacement for the product as per our Replacements Policy outlined below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Replacements Policy</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.1 Replacement Eligibility</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may request replacement for products within <strong>7 days</strong> from the date of delivery if:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>The product is defective, damaged, or not working properly</li>
                <li>The product received does not match the description on our website</li>
                <li>The wrong product was delivered</li>
                <li>The product is unused, unopened, and in its original packaging with all tags and accessories</li>
                <li>The product has not been installed, used, or modified</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.2 Non-Replaceable Items</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                The following items cannot be replaced:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>Products damaged due to misuse, accidents, or normal wear and tear</li>
                <li>Products without original packaging, tags, or accessories</li>
                <li>Products that have been installed, used, or modified</li>
                <li>Personalized or custom-made products</li>
                <li>Products purchased during special sales or clearance (unless specified otherwise)</li>
                <li>Digital products or downloadable content</li>
                <li>Products requested for replacement after the 7-day replacement period</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.3 Replacement Process</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                To initiate a replacement, please follow these steps:
              </p>
              <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-700">
                <li><strong>Contact Us:</strong> Email us at <a href="mailto:andhramachinesagencies@gmail.com" className="text-[#c54513] hover:underline">andhramachinesagencies@gmail.com</a> or call <a href="tel:+919701332707" className="text-[#c54513] hover:underline">+91 97013 32707</a> within 7 days of delivery</li>
                <li><strong>Provide Details:</strong> Include your order number, product name, reason for replacement, and photos (if the product is damaged or defective)</li>
                <li><strong>Get Approval:</strong> Our team will review your request and provide a Replacement Authorization (RA) number</li>
                <li><strong>Package Securely:</strong> Pack the product in its original packaging with all accessories, tags, and documentation</li>
                <li><strong>Ship Back:</strong> Send the product to our address (we will provide the replacement address with your RA number)</li>
                <li><strong>Inspection:</strong> We will inspect the product within 3-5 business days of receipt</li>
                <li><strong>Replacement:</strong> Once approved, we will process your replacement within 7-14 business days</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Replacement Shipping</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.1 Shipping Costs</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Replacement shipping costs are handled as follows:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li><strong>Defective/Wrong Product:</strong> We will bear the replacement shipping costs. We may arrange for pickup or reimburse your shipping charges</li>
                <li><strong>Change of Mind:</strong> You are responsible for the replacement shipping costs</li>
                <li><strong>Damaged in Transit:</strong> We will bear all replacement shipping costs</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.2 Replacement Address</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Please use the replacement address provided with your Replacement Authorization number. Do not send products without an RA number, as we may not be able to process your replacement.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <p className="text-gray-700">
                  <strong>Replacement Address:</strong><br />
                  Andhra Machines Agencies<br />
                  Kandakam Road, Rajahmundry - 533101<br />
                  Andhra Pradesh, India<br />
                  <strong>Note:</strong> Always include your RA number on the replacement package
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Exchanges & Replacements</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We offer replacements for defective or damaged products. If you wish to exchange a product:
              </p>
              <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-700">
                <li>Contact us immediately if you receive a defective or damaged product</li>
                <li>We will arrange for a replacement of the same product</li>
                <li>For defective products, we offer replacements instead of exchanges</li>
                <li>The replacement will be processed with priority</li>
                <li>If you wish to exchange for a different product, contact our customer service team to discuss available options</li>
              </ol>
              <p className="text-gray-700 leading-relaxed">
                All replacements are subject to product availability and our quality inspection. We will work with you to find the best solution for your needs.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Damaged or Defective Products</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you receive a damaged or defective product:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>Do not use or install the product</li>
                <li>Take photos of the damage or defect</li>
                <li>Contact us immediately within 48 hours of delivery</li>
                <li>Provide your order number, photos, and a description of the issue</li>
                <li>We will arrange for pickup and replacement at no additional cost to you</li>
                <li>We may request the product to be sent back for quality inspection</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Wrong Product Delivered</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you receive a product that is different from what you ordered:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>Contact us immediately within 48 hours of delivery</li>
                <li>Do not open or use the product</li>
                <li>We will arrange for pickup of the wrong product</li>
                <li>We will ship the correct product at no additional cost</li>
                <li>Alternatively, you may request an exchange for a different product</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Installation and Service</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For products that require installation:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                <li>If installation has been completed, the product cannot be replaced unless it is defective</li>
                <li>If you have not yet installed the product, you may request replacement as per our standard Replacements Policy</li>
                <li>For installation-related issues, please contact our service team for assistance</li>
                <li>We offer free installation service, and our technicians can help resolve any issues</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Special Cases</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">9.1 Bulk Orders</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                For bulk orders (5 or more units), special replacement terms may apply. Please contact us before placing a bulk order to discuss replacement policies.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">9.2 Custom Orders</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Custom-made or personalized products are non-replaceable unless they are defective or do not meet the agreed specifications.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">9.3 Sale Items</h3>
              <p className="text-gray-700 leading-relaxed">
                Products purchased during special sales or clearance events may have different replacement policies. These will be clearly stated at the time of purchase.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For any questions, concerns, or to initiate a replacement or cancellation, please contact us:
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
                  <strong>Business Hours:</strong> Monday - Saturday: 9:00 AM - 7:00 PM
                </p>
                <p className="text-gray-700">
                  <strong>Response Time:</strong> We aim to respond to all replacement/cancellation requests within 24-48 hours during business days.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Policy Updates</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to modify this Cancellation & Replacements Policy at any time. Changes will be effective immediately upon posting on our website. We encourage you to review this policy periodically.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The policy in effect at the time of your purchase will apply to your order, unless otherwise required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Consumer Rights</h2>
              <p className="text-gray-700 leading-relaxed">
                This policy is in addition to your statutory rights as a consumer under Indian law. Nothing in this policy affects your legal rights, including the right to claim for defective products or misrepresentation under the Consumer Protection Act, 2019.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

