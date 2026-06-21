import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Card from '../components/Card';
import wheatImage from '../assets/crop_wheat.png';
import potatoImage from '../assets/crop_potato.png';
import { Leaf, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const handleBrowseMarketplace = () => {
    navigate('/dashboard');
  };

  const handleListProduce = () => {
    navigate('/dashboard');
  };

  const featuredCrops = [
    {
      title: 'Premium Sharbati Wheat',
      description: 'High-gluten premium Sharbati wheat, freshly harvested, sun-dried, and ready for milling.',
      price: '2,450',
      unit: 'quintal',
      quantity: '120',
      location: 'Sehore, MP',
      badge: 'Grains',
      image: wheatImage,
    },
    {
      title: 'Organic Jyoti Potatoes',
      description: 'Firm, high-starch Jyoti potatoes, perfect for manufacturing potato chips and starches.',
      price: '1,800',
      unit: 'quintal',
      quantity: '250',
      location: 'Nashik, Maharashtra',
      badge: 'Tubers',
      image: potatoImage,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30">
      {/* Hero Section */}
      <Hero
        onPrimaryClick={handleBrowseMarketplace}
        onSecondaryClick={handleListProduce}
      />

      {/* Trust & Process Row */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800">Fresh from Source</h4>
                <p className="text-sm text-slate-500 mt-1">Get direct access to fresh, graded harvests direct from rural farms without storage delays.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                <Cpu className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800">AI Price Suggestion</h4>
                <p className="text-sm text-slate-500 mt-1">Our AI analyze mandi rates and historic trends to suggest optimized trading price windows.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800">Verified Contracts</h4>
                <p className="text-sm text-slate-500 mt-1">Direct communication and system-verified digital receipts build total transaction trust.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Live Offers</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">Featured Produce Listings</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-lg font-light">
              Explore some of the available crop listings published by verified local farmers from central and western India.
            </p>
          </div>
          <button
            onClick={handleBrowseMarketplace}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors shrink-0"
          >
            <span>View All Listings</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {featuredCrops.map((crop, idx) => (
            <Card
              key={idx}
              title={crop.title}
              description={crop.description}
              price={crop.price}
              unit={crop.unit}
              quantity={crop.quantity}
              location={crop.location}
              badge={crop.badge}
              image={crop.image}
              actionText="Place Order Offer"
              onActionClick={handleBrowseMarketplace}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
