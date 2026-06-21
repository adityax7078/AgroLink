import { useState } from 'react';
import { LayoutDashboard, PlusCircle, CheckCircle, Clock, ShoppingBag, Sparkles, MapPin, DollarSign, Calendar, Sliders, MessageSquare } from 'lucide-react';
import { Button, Input, Modal, Loader, useToast } from '../components/ui';

export default function Dashboard() {
  const { addToast } = useToast();
  const [role, setRole] = useState('farmer'); // 'farmer' or 'processor'
  const [showAISuggestion, setShowAISuggestion] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [cropType, setCropType] = useState('Wheat');
  const [quantity, setQuantity] = useState('100');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [location, setLocation] = useState('');
  
  // AI pricing suggestion state
  const [aiResult, setAiResult] = useState(null);

  const triggerAISuggestion = () => {
    if (!cropType || !quantity) return;
    setAiLoading(true);
    setShowAISuggestion(true);
    
    // Simulate API delay
    setTimeout(() => {
      setAiLoading(false);
      // Realistic mandi suggestions based on crop type
      let basePrice = 22;
      let qualityMultiplier = 1.1;
      if (cropType === 'Potato') { basePrice = 16; }
      if (cropType === 'Rice') { basePrice = 28; }
      if (cropType === 'Sugarcane') { basePrice = 32; }

      const suggestedMin = Math.round(basePrice * 100);
      const suggestedMax = Math.round(basePrice * qualityMultiplier * 100);

      setAiResult({
        crop: cropType,
        quantity: quantity,
        min: suggestedMin,
        max: suggestedMax,
        marketTrend: 'Bullish (+4.2% this week)',
        demandLevel: 'High',
        factors: 'Due to low pre-monsoon storage stocks in central mandis.',
      });
      addToast('AI valuation generated successfully!', 'success');
    }, 1500);
  };

  const handlePublishListing = (e) => {
    e.preventDefault();
    if (!quantity || !expectedPrice || !location) {
      addToast('Please fill all required listing fields.', 'error');
      return;
    }
    addToast(`${cropType} harvest listing published successfully!`, 'success');
    setExpectedPrice('');
    setLocation('');
  };

  const handleMessageClick = (name) => {
    addToast(`Initializing chat channel with ${name}...`, 'info');
  };

  const sampleFarmerOrders = [
    { id: 'ORD-1002', crop: 'Jyoti Potatoes', processor: 'Haldiram Foods', qty: '150 Quintals', total: '₹2,70,000', status: 'Accepted', date: '21 Jun 2026' },
    { id: 'ORD-1003', crop: 'Sharbati Wheat', processor: 'ITC Limited', qty: '80 Quintals', total: '₹1,96,000', status: 'Pending', date: '20 Jun 2026' },
    { id: 'ORD-1001', crop: 'Basmati Rice', processor: 'Bikanervala', qty: '50 Quintals', total: '₹1,60,000', status: 'Delivered', date: '15 Jun 2026' },
  ];

  const sampleProcessorOrders = [
    { id: 'ORD-2001', crop: 'Premium Wheat', seller: 'Ramesh Patel', qty: '100 Quintals', total: '₹2,45,000', status: 'Accepted', date: '21 Jun 2026' },
    { id: 'ORD-2002', crop: 'Jyoti Potatoes', seller: 'Sanjay Deshmukh', qty: '200 Quintals', total: '₹3,60,000', status: 'Pending', date: '21 Jun 2026' },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950/20 min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b border-slate-200/80 dark:border-slate-800/80 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <LayoutDashboard className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              <span>AgroLink Portal</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage listings, analyze market prices, and process agreements.</p>
          </div>
          
          {/* Role Switcher */}
          <div className="flex bg-slate-200/60 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-300/40 dark:border-slate-700">
            <button
              onClick={() => setRole('farmer')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                role === 'farmer'
                  ? 'bg-emerald-600 text-white shadow-sm dark:bg-emerald-500'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-455'
              }`}
            >
              Farmer Dashboard
            </button>
            <button
              onClick={() => setRole('processor')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                role === 'processor'
                  ? 'bg-emerald-600 text-white shadow-sm dark:bg-emerald-500'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              Processor Dashboard
            </button>
          </div>
        </div>

        {/* Dashboard Content for Farmers */}
        {role === 'farmer' && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Stats Overview */}
            <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Listings</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">4 Crops</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <ShoppingBag className="h-5 w-5" />
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Earnings Sourced</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">₹6,26,000</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pending Orders</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">1 Order</p>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-xl">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Completed Orders</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">12 Trades</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <CheckCircle className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Create Listing Form (Left Column) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <PlusCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span>List New Harvest</span>
                </h3>
                <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">List your crops so food processing companies can find and order them.</p>
              </div>

              <form onSubmit={handlePublishListing} className="space-y-4 text-sm">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-350 mb-1.5">Crop Type</label>
                  <select
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="Wheat">Wheat (Gehun)</option>
                    <option value="Potato">Potato (Aloo)</option>
                    <option value="Rice">Rice (Chawal)</option>
                    <option value="Sugarcane">Sugarcane (Ganna)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Quantity"
                    type="number"
                    placeholder="e.g. 100"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-350 mb-1.5">Unit</label>
                    <select className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors">
                      <option value="quintal">Quintals</option>
                      <option value="kg">kg</option>
                      <option value="ton">Metric Tons</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-350">Expected Price (₹)</label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={triggerAISuggestion}
                      className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-450 hover:text-emerald-700 bg-emerald-50 dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 hover:border-emerald-200 py-1 px-2 text-[11px]"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Get AI Suggested Price</span>
                    </Button>
                  </div>
                  <Input
                    type="number"
                    placeholder="Enter Price per unit"
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(e.target.value)}
                  />
                </div>

                <Input
                  label="Harvest Location"
                  type="text"
                  placeholder="City, State"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />

                <Button
                  type="submit"
                  className="w-full py-3 shadow-md hover:shadow-lg mt-2"
                >
                  Publish Listing
                </Button>
              </form>
            </div>

            {/* Manage Received Orders (Right Column) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Incoming Procurement Orders</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold">
                        <th className="pb-3 font-medium">Order ID</th>
                        <th className="pb-3 font-medium">Crop</th>
                        <th className="pb-3 font-medium">Buyer</th>
                        <th className="pb-3 font-medium">Volume</th>
                        <th className="pb-3 font-medium">Total Price</th>
                        <th className="pb-3 font-medium text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {sampleFarmerOrders.map((ord, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">{ord.id}</td>
                          <td className="py-3 text-slate-700 dark:text-slate-300 font-medium">{ord.crop}</td>
                          <td className="py-3 text-slate-600 dark:text-slate-400">{ord.processor}</td>
                          <td className="py-3 text-slate-500 dark:text-slate-500">{ord.qty}</td>
                          <td className="py-3 text-slate-800 dark:text-slate-100 font-bold">{ord.total}</td>
                          <td className="py-3 text-center">
                            <span
                              className={`inline-flex px-2 py-1 rounded-lg text-xs font-bold ${
                                ord.status === 'Accepted'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50'
                                  : ord.status === 'Pending'
                                  ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mandi pricing trend helper */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 p-6 rounded-3xl text-white shadow-md relative overflow-hidden">
                <div className="absolute -right-12 -bottom-12 opacity-15">
                  <Sparkles className="h-44 w-44" />
                </div>
                <h4 className="font-bold text-lg mb-2">Need advice on crop pricing?</h4>
                <p className="text-sm text-emerald-100 font-light max-w-md mb-4 leading-relaxed">
                  Use our OpenAI price analysis. It parses seasonal rainfall, regional storage stocks, and mandi trends to safeguard your farm earnings.
                </p>
                <div className="flex gap-4">
                  <div className="bg-white/10 px-3.5 py-2 rounded-xl border border-white/15">
                    <p className="text-xs text-emerald-200">Wheat Mandi Avg</p>
                    <p className="font-bold">₹2,380 / Qtl</p>
                  </div>
                  <div className="bg-white/10 px-3.5 py-2 rounded-xl border border-white/15">
                    <p className="text-xs text-emerald-200">Potato Mandi Avg</p>
                    <p className="font-bold">₹1,650 / Qtl</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content for Processors */}
        {role === 'processor' && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Procurement</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">2 Contracts</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <Sliders className="h-5 w-5" />
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Investment</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">₹6,05,000</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Verified Farms Connected</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">8 Farmers</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <CheckCircle className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Processor Sourcing Activity */}
            <div className="lg:col-span-12 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Your Procurement History</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Track orders and communicate with farmer partners.</p>
                </div>
                <Button
                  onClick={() => addToast("Redirecting to marketplace catalog...", "info")}
                  size="sm"
                  className="shadow-sm"
                >
                  Source New Crops
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold">
                      <th className="pb-3 font-medium">Order ID</th>
                      <th className="pb-3 font-medium">Crop</th>
                      <th className="pb-3 font-medium">Farmer / Seller</th>
                      <th className="pb-3 font-medium">Quantity</th>
                      <th className="pb-3 font-medium">Total Offer</th>
                      <th className="pb-3 font-medium">Placed Date</th>
                      <th className="pb-3 font-medium text-center">Status</th>
                      <th className="pb-3 font-medium text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {sampleProcessorOrders.map((ord, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">{ord.id}</td>
                        <td className="py-3 text-slate-700 dark:text-slate-300 font-medium">{ord.crop}</td>
                        <td className="py-3 text-slate-600 dark:text-slate-400">{ord.seller}</td>
                        <td className="py-3 text-slate-500 dark:text-slate-500">{ord.qty}</td>
                        <td className="py-3 text-slate-800 dark:text-slate-100 font-bold">{ord.total}</td>
                        <td className="py-3 text-slate-500 dark:text-slate-500">{ord.date}</td>
                        <td className="py-3 text-center">
                          <span
                            className={`inline-flex px-2 py-1 rounded-lg text-xs font-bold ${
                              ord.status === 'Accepted'
                                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50'
                                : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMessageClick(ord.seller)}
                            className="flex items-center gap-1.5 mx-auto bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-750"
                          >
                            <MessageSquare className="h-3 w-3" />
                            <span>Message Farmer</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* AI PRICING SUGGESTION MODAL */}
        <Modal
          isOpen={showAISuggestion}
          onClose={() => setShowAISuggestion(false)}
          title="AI Market Valuation"
        >
          {aiLoading ? (
            <div className="py-10 flex flex-col items-center justify-center space-y-4">
              <Loader variant="spinner" size="lg" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 animate-pulse">Analyzing regional mandi rates...</p>
            </div>
          ) : (
            aiResult && (
              <div className="space-y-6 text-sm text-slate-600 dark:text-slate-350">
                <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl space-y-1">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Suggested Range ({aiResult.crop})</p>
                  <p className="text-3xl font-black text-emerald-700 dark:text-emerald-300">
                    ₹{aiResult.min} - ₹{aiResult.max}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">per quintal</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Market Trend</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{aiResult.marketTrend}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Factory Demand</p>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{aiResult.demandLevel}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-slate-800 dark:text-slate-200">Model Analysis Notes:</p>
                  <p className="text-xs text-slate-505 dark:text-slate-450 font-light leading-relaxed">
                    {aiResult.factors} Prices fluctuate based on quality, moisture levels (optimal &lt; 12%), and grain size metrics.
                  </p>
                </div>

                <Button
                  onClick={() => {
                    setExpectedPrice(Math.round((aiResult.min + aiResult.max) / 2));
                    setShowAISuggestion(false);
                    addToast('Recommended price applied to listing expected rate.', 'info');
                  }}
                  className="w-full py-3"
                >
                  Use Recommended Price
                </Button>
              </div>
            )
          )}
        </Modal>
      </div>
    </div>
  );
}
