import { Award, Wrench, Truck } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-10 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Who We Are?</h2>
          <div className="w-24 h-1 bg-[#c54513] mx-auto mb-6"></div>
          <div className="space-y-4 max-w-4xl mx-auto">
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              We are one of Andhra Pradesh's most trusted sewing machine specialists, serving customers since 1982. With over 43 years of experience, we provide a complete range of domestic, professional, and industrial sewing machines, along with genuine accessories and expert servicing.
            </p>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              From our roots in Rajahmundry to our branch in Visakhapatnam, we have built a reputation for quality, reliability, and customer-first service. Today, we are proud to extend our reach beyond the state—delivering sewing machines and accessories across India and supporting customers nationwide.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow h-full flex flex-col">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#c54513] text-white rounded-full mb-3 sm:mb-4 mx-auto">
              <Award size={32} />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Authorized Dealer</h3>
            <p className="text-gray-600 text-sm sm:text-base mt-auto">
              Official authorized dealer for all major brands including Usha, Singer, Jack, and more.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow h-full flex flex-col">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#c54513] text-white rounded-full mb-3 sm:mb-4 mx-auto">
              <Wrench size={32} />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Expert Repairs</h3>
            <p className="text-gray-600 text-sm sm:text-base mt-auto">
              Our certified technicians provide reliable repair and maintenance services for all types of machines.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow h-full flex flex-col">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#c54513] text-white rounded-full mb-3 sm:mb-4 mx-auto">
              <Truck size={32} />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Free Installation</h3>
            <p className="text-gray-600 text-sm sm:text-base mt-auto">
              We offer free installation and demonstration for all machines purchased from our store.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
