import { Package } from 'lucide-react';

export default function BrandsSection() {
  const brands = [
    { name: 'Usha', color: 'bg-red-600' },
    { name: 'Singer', color: 'bg-blue-700' },
    { name: 'Jack', color: 'bg-gray-800' },
    { name: 'Juki', color: 'bg-teal-600' },
    { name: 'Brother', color: 'bg-indigo-600' },
    { name: 'Janome', color: 'bg-purple-600' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Brands</h2>
          <div className="w-24 h-1 bg-[#c54513] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600">
            Authorized dealers for the world's leading sewing machine brands
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className={`${brand.color} text-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer`}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <Package size={40} className="mb-3" />
                <h3 className="text-xl font-semibold">{brand.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
