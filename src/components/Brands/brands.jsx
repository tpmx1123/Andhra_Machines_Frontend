import React from 'react';

export default function Brands() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1a365d] mb-8">Our Brands</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {['Usha', 'Singer', 'Jack', 'Juki', 'Brother', 'Janome'].map((brand) => (
            <div key={brand} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-[#c54513] mb-2">{brand}</h2>
              <p className="text-gray-600">Explore our range of {brand} sewing machines and accessories.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
