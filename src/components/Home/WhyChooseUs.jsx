import { Clock, Headphones, BadgeCheck, Zap, TrendingUp, Users } from 'lucide-react';

function Feature({ Icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
      <div className="bg-[#c54513] text-white p-4 rounded-full mb-4">
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default function WhyChooseUs() {
  const features = [
    {
      Icon: BadgeCheck,
      title: 'Genuine Products',
      description: 'All our products are 100% genuine with manufacturer warranty',
    },
    {
      Icon: Clock,
      title: '43+ Years Experience',
      description: 'Trusted service provider with decades of industry expertise',
    },
    {
      Icon: Users,
      title: 'Expert Technicians',
      description: 'Skilled and experienced technicians providing reliable repair and maintenance services',
    },
    {
      Icon: Headphones,
      title: 'Customer Support',
      description: 'Support is available but during Business Hours only.',
    },
    {
      Icon: Zap,
      title: 'Same Day Service',
      description: 'Quick installation and repair services available',
    },
    {
      Icon: TrendingUp,
      title: 'Best Prices',
      description: 'Competitive pricing with regular discounts and offers',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
          <div className="w-24 h-1 bg-[#c54513] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We are committed to providing the best sewing solutions with exceptional service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature
              key={index}
              Icon={feature.Icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
