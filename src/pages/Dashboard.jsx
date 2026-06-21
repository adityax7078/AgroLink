import React, { useState } from 'react';
import { LayoutDashboard, PlusCircle, CheckCircle, Clock, ShoppingBag, Sparkles, MapPin, DollarSign, Calendar, Sliders, MessageSquare } from 'lucide-react';

export default function Dashboard() {
  const [role, setRole] = useState('farmer'); // 'farmer' or 'processor'
  const [showAISuggestion, setShowAISuggestion] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [cropType, setCropType] = useState('Wheat');
  const [quantity, setQuantity] = useState('100');
  
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
    }, 1500);
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
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b border-slate-200/80 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <LayoutDashboard className="h-7 w-7 text-emerald-600" />
              <span>AgroLink Portal</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">Manage listings, analyze market prices, and process agreements.</p>
          </div>
          
          {/* Role Switcher */}
          <div className="flex bg-slate-200/60 p-1.5 rounded-xl border border-slate-300/40">
            <button
              onClick={() => setRole('farmer')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                role === 'farmer'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              Farmer Dashboard
            </button>
            <button
              onClick={() => setRole('processor')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                role === 'processor'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-emerald-600'
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
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Listings</p>
                  <p className="text-2xl font-bold text-slate-800 mt-2">4 Crops</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <ShoppingBag className="h-5 w-5" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Earnings Sourced</p>
                  <p className="text-2xl font-bold text-slate-800 mt-2">₹6,26,000</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Orders</p>
                  <p className="text-2xl font-bold text-slate-800 mt-2">1 Order</p>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Orders</p>
                  <p className="text-2xl font-bold text-slate-800 mt-2">12 Trades</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CheckCircle className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Create Listing Form (Left Column) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                  <PlusCircle className="h-5 w-5 text-emerald-600" />
                  <span>List New Harvest</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">List your crops so food processing companies can find and order them.</p>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-4 text-sm">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Crop Type</label>
                  <select
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="Wheat">Wheat (Gehun)</option>
                    <option value="Potato">Potato (Aloo)</option>
                    <option value="Rice">Rice (Chawal)</option>
                    <option value="Sugarcane">Sugarcane (Ganna)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Quantity</label>
                    <input
                      type="number"
                      placeholder="e.g. 100"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Unit</label>
                    <select className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors">
                      <option value="quintal">Quintals</option>
                      <option value="kg">kg</option>
                      <option value="ton">Metric Tons</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-semibold text-slate-600">Expected Price (₹)</label>
                    <button
                      type="button"
                      onClick={triggerAISuggestion}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 transition-colors"
                    >
                      <Sparkles className="h-3 w-3 animate-spin" />
                      <span>Get AI Suggested Price</span>
                    </button>
                  </div>
                  <input
                    type="number"
                    placeholder="Enter Price per unit"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Harvest Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="City, State"
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
                >
                  Publish Listing
                </button>
              </form>
            </div>

            {/* Manage Received Orders (Right Column) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  <span>Incoming Procurement Orders</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-3 font-medium">Order ID</th>
                        <th className="pb-3 font-medium">Crop</th>
                        <th className="pb-3 font-medium">Buyer</th>
                        <th className="pb-3 font-medium">Volume</th>
                        <th className="pb-3 font-medium">Total Price</th>
                        <th className="pb-3 font-medium text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sampleFarmerOrders.map((ord, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 font-semibold text-slate-800">{ord.id}</td>
                          <td className="py-3 text-slate-700 font-medium">{ord.crop}</td>
                          <td className="py-3 text-slate-600">{ord.processor}</td>
                          <td className="py-3 text-slate-500">{ord.qty}</td>
                          <td className="py-3 text-slate-800 font-bold">{ord.total}</td>
                          <td className="py-3 text-center">
                            <span
                              className={`inline-flex px-2 py-1 rounded-lg text-xs font-bold ${
                                ord.status === 'Accepted'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                  : ord.status === 'Pending'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                  : 'bg-slate-100 text-slate-600'
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
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-3xl text-white shadow-md relative overflow-hidden">
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
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Procurement</p>
                  <p className="text-2xl font-bold text-slate-800 mt-2">2 Contracts</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Sliders className="h-5 w-5" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Investment</p>
                  <p className="text-2xl font-bold text-slate-800 mt-2">₹6,05,000</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verified Farms Connected</p>
                  <p className="text-2xl font-bold text-slate-800 mt-2">8 Farmers</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CheckCircle className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Processor Sourcing Activity */}
            <div className="lg:col-span-12 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Your Procurement History</h3>
                  <p className="text-xs text-slate-400 mt-1">Track orders and communicate with farmer partners.</p>
                </div>
                <button
                  onClick={() => alert("Redirecting to Marketplace")}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Source New Crops
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold">
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
                  <tbody className="divide-y divide-slate-100">
                    {sampleProcessorOrders.map((ord, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 font-semibold text-slate-800">{ord.id}</td>
                        <td className="py-3 text-slate-700 font-medium">{ord.crop}</td>
                        <td className="py-3 text-slate-600">{ord.seller}</td>
                        <td className="py-3 text-slate-500">{ord.qty}</td>
                        <td className="py-3 text-slate-800 font-bold">{ord.total}</td>
                        <td className="py-3 text-slate-500">{ord.date}</td>
                        <td className="py-3 text-center">
                          <span
                            className={`inline-flex px-2 py-1 rounded-lg text-xs font-bold ${
                              ord.status === 'Accepted'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : 'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <button className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-emerald-600 bg-slate-100 hover:bg-emerald-50 px-2 py-1.5 rounded-lg border border-slate-200 transition-colors">
                            <MessageSquare className="h-3 w-3" />
                            <span>Message Farmer</span>
                          </button>
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
        {showAISuggestion && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200/50 overflow-hidden relative p-6 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-600 animate-bounce" />
                  <span>AI Market Valuation</span>
                </h3>
                <button
                  onClick={() => setShowAISuggestion(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              {aiLoading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin"></div>
                    <Sparkles className="h-5 w-5 text-emerald-500 absolute top-3.5 left-3.5 animate-pulse" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600 animate-pulse">Analyzing regional mandi rates...</p>
                </div>
              ) : (
                aiResult && (
                  <div className="space-y-6 text-sm text-slate-600">
                    <div className="text-center p-4 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-1">
                      <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Suggested Range ({aiResult.crop})</p>
                      <p className="text-3xl font-black text-emerald-700">
                        ₹{aiResult.min} - ₹{aiResult.max}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">per quintal</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">Market Trend</p>
                        <p className="font-bold text-slate-800 mt-0.5">{aiResult.marketTrend}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">Factory Demand</p>
                        <p className="font-bold text-emerald-600 mt-0.5">{aiResult.demandLevel}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="font-bold text-slate-800">Model Analysis Notes:</p>
                      <p className="text-xs text-slate-500 font-light leading-relaxed">
                        {aiResult.factors} Prices fluctuate based on quality, moisture levels (optimal &lt; 12%), and grain size metrics.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowAISuggestion(false)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-sm"
                    >
                      Use Recommended Price
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
