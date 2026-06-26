import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Card from '../components/Card';
import wheatImage from '../assets/crop_wheat.png';
import potatoImage from '../assets/crop_potato.png';
import { Leaf, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { Button, Loader } from '../components/ui';

export default function Home() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/listings')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch listings');
        return res.json();
      })
      .then(data => {
        setListings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching listings:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleBrowseMarketplace = () => {
    navigate('/dashboard');
  };

  const handleListProduce = () => {
    navigate('/dashboard');
  };

  const getCropImage = (cropType) => {
    if (cropType === 'Wheat') return wheatImage;
    if (cropType === 'Potato') return potatoImage;
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30 dark:bg-slate-950/20 transition-colors duration-300">
      {/* Hero Section */}
      <Hero
        onPrimaryClick={handleBrowseMarketplace}
        onSecondaryClick={handleListProduce}
      />

      {/* Trust & Process Row */}
      <section className="py-12 bg-white dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">Fresh from Source</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Get direct access to fresh, graded harvests direct from rural farms without storage delays.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400">
                <Cpu className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">AI Price Suggestion</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Our AI analyze mandi rates and historic trends to suggest optimized trading price windows.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">Verified Contracts</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Direct communication and system-verified digital receipts build total transaction trust.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Live Offers</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">Featured Produce Listings</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg font-light">
              Explore some of the available crop listings published by verified local farmers from central and western India.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBrowseMarketplace}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/50 dark:bg-slate-900 border border-emerald-150 dark:border-slate-800 hover:border-emerald-200 transition-colors"
          >
            <span>View All Listings</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader variant="spinner" size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-slate-550">
            <p className="text-red-500 font-semibold mb-2">Error connecting to marketplace</p>
            <p className="text-xs">{error}</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p className="font-semibold">No crop listings available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {listings.slice(0, 4).map((crop) => (
              <Card
                key={crop.id}
                title={crop.title}
                description={crop.description}
                price={crop.price}
                unit={crop.unit}
                quantity={crop.quantity}
                location={crop.location}
                badge={crop.badge}
                image={getCropImage(crop.cropType)}
                actionText="Place Order Offer"
                onActionClick={handleBrowseMarketplace}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
