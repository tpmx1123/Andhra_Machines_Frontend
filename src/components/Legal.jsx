import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Legal() {
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
            Legal / Business Information
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-sm sm:prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Business Details</h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <p className="text-gray-700">
                    <strong className="text-gray-900">Business Name:</strong> Andhra Machines Agencies
                  </p>
                </div>
                <div>
                  <p className="text-gray-700">
                    <strong className="text-gray-900">GSTIN:</strong> 37ABCDE1234F1Z5
                  </p>
                </div>
                <div>
                  <p className="text-gray-700">
                    <strong className="text-gray-900">Registered State:</strong> Andhra Pradesh
                  </p>
                </div>
                <div>
                  <p className="text-gray-700">
                    <strong className="text-gray-900">Registered Address:</strong><br />
                    Kandakam Road, Rajahmundry - 533101<br />
                    Andhra Pradesh, India
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <p className="text-gray-700">
                  <strong>Email:</strong> <a href="mailto:andhramachinesagencies@gmail.com" className="text-[#c54513] hover:underline">andhramachinesagencies@gmail.com</a>
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> <a href="tel:+919701332707" className="text-[#c54513] hover:underline">+91 97013 32707</a> | <a href="tel:917416421770" className="text-[#c54513] hover:underline">+91 74164 21770</a>
                </p>
                <p className="text-gray-700">
                  <strong>Business Hours:</strong> Monday - Saturday: 9:00 AM - 7:00 PM
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Legal Documents</h2>
              <div className="space-y-3">
                <Link
                  to="/privacy-policy"
                  className="block text-[#c54513] hover:text-[#a43a10] hover:underline transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms-of-service"
                  className="block text-[#c54513] hover:text-[#a43a10] hover:underline transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/cancellation-returns"
                  className="block text-[#c54513] hover:text-[#a43a10] hover:underline transition-colors"
                >
                  Cancellation & Replacements
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

