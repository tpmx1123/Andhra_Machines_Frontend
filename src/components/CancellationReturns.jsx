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
                You may cancel your order at any time before it is shipped. To cancel an order, please contact our customer service team at <a href="mailto:andhramachinesagencies@gmail.com" className="text-[#c54513] hover:underline">andhramachinesagencies@gmail.com</a> or call <a href="tel:+919701332707" className="text-[#c54513] hover:underline">+91 97013 32707</a>.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.2 After Shipment</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Once your order has been shipped, you cannot cancel it. For details about replacements, please contact us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Replacements Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                For details about replacements and exchanges, please contact us at <a href="mailto:andhramachinesagencies@gmail.com" className="text-[#c54513] hover:underline">andhramachinesagencies@gmail.com</a> or call <a href="tel:+919701332707" className="text-[#c54513] hover:underline">+91 97013 32707</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Contact for Details</h2>
              <p className="text-gray-700 leading-relaxed">
                For details about replacement shipping, exchanges, damaged products, wrong products, installation services, bulk orders, custom orders, or sale items, please contact us at <a href="mailto:andhramachinesagencies@gmail.com" className="text-[#c54513] hover:underline">andhramachinesagencies@gmail.com</a> or call <a href="tel:+919701332707" className="text-[#c54513] hover:underline">+91 97013 32707</a>.
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
                  <strong>Business Hours:</strong> Monday - Saturday: 10:30 AM to 8:30 PM
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

