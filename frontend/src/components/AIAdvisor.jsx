import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Bot, AlertTriangle, CheckCircle2, RefreshCw, FileText, Send, Zap, ShieldAlert, Cpu, ChevronDown, Terminal, X, Activity } from 'lucide-react';
import { Button, Input, Loader, useToast } from './ui';
import { loggedFetch } from '../utils/api';
import { API_URL } from '../config';

export default function AIAdvisor() {
  const { addToast } = useToast();

  // Form Parameters
  const [inventorySync, setInventorySync] = useState('');
  const [cropName, setCropName] = useState('Mango');
  const [quantity, setQuantity] = useState('25');
  const [unit, setUnit] = useState('Tons');
  const [location, setLocation] = useState('Nashik, Maharashtra');
  const [query, setQuery] = useState('Should I process my mangoes to pickle or sell them raw at local mandi?');
  const [simulateError, setSimulateError] = useState(false);

  // Loading & Output States
  const [loading, setLoading] = useState(false);
  const [loadingTip, setLoadingTip] = useState('Analyzing local APMC mandi volumes...');
  const [aiResult, setAiResult] = useState(null);
  const [displayedAdvice, setDisplayedAdvice] = useState('');

  // Typing animation ref
  const typingIntervalRef = useRef(null);

  // DevTools Simulation State
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [networkLogs, setNetworkLogs] = useState([]);

  // Clear typing interval on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

  // Handle Quick Sync from Inventory
  const handleInventorySyncChange = (e) => {
    const val = e.target.value;
    setInventorySync(val);
    if (val === 'mango') {
      setCropName('Mango');
      setQuantity('25');
      setUnit('Tons');
      setLocation('Nashik, Maharashtra');
      setQuery('Should I process my mangoes to pickle or sell them raw at local mandi?');
    } else if (val === 'wheat') {
      setCropName('Wheat');
      setQuantity('100');
      setUnit('Quintals');
      setLocation('Karnal, Haryana');
      setQuery('Hold harvest for 3 weeks or sell to local flour mill immediately?');
    } else if (val === 'potato') {
      setCropName('Potato');
      setQuantity('50');
      setUnit('Tons');
      setLocation('Agra, Uttar Pradesh');
      setQuery('Best cold storage options and price trend for Jyoti variety.');
    }
  };

  // Rotating tips during loading
  useEffect(() => {
    let interval;
    if (loading) {
      const tips = [
        'Analyzing local APMC mandi volumes...',
        'Evaluating value-addition processing margins...',
        'Querying Gemini AI models for Nashik region...',
        'Synthesizing buyer procurement sentiment...'
      ];
      let idx = 0;
      interval = setInterval(() => {
        idx = (idx + 1) % tips.length;
        setLoadingTip(tips[idx]);
      }, 700);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cropName || !quantity) {
      addToast('Please provide crop name and quantity.', 'error');
      return;
    }

    const qtyVal = Number(quantity);
    if (isNaN(qtyVal) || qtyVal <= 0) {
      addToast('Quantity must be a valid positive number.', 'error');
      return;
    }

    // Clear any previous typing animation
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    setLoading(true);
    setAiResult(null);
    setDisplayedAdvice('');

    // Initial info toast
    addToast('Connecting to AgroLink AI Advisor engines...', 'info', 2500);

    const startTime = Date.now();

    try {
      const response = await loggedFetch(`${API_URL}/api/ai/advise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName,
          quantity: qtyVal,
          unit,
          location,
          query,
          simulateError
        })
      });

      const latency = Date.now() - startTime;
      const data = await response.json();

      if (!response.ok) {
        // Log Error in DevTools console simulation
        setNetworkLogs((prev) => [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            method: 'POST',
            endpoint: '/api/ai/advise',
            status: response.status,
            statusText: 'Rate Limit Exceeded',
            latency: `${latency}ms`,
            isError: true
          },
          ...prev
        ]);
        throw new Error(data.message || data.error || 'API Connection Timeout (HTTP 429 Rate Limit Exceeded). Please retry in 60 seconds.');
      }

      // Log Success in DevTools console simulation
      setNetworkLogs((prev) => [
        {
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          method: 'POST',
          endpoint: '/api/ai/advise',
          status: 200,
          statusText: '200 OK',
          latency: `${latency}ms`,
          isError: false
        },
        ...prev
      ]);

      setAiResult(data);
      addToast('AI Market & Advisory report generated successfully!', 'success');

      // Start typing simulation
      const fullText = data.marketAdvice || '';
      let currentIdx = 0;
      setDisplayedAdvice('');

      typingIntervalRef.current = setInterval(() => {
        setDisplayedAdvice((prev) => {
          if (currentIdx < fullText.length) {
            const nextChar = fullText[currentIdx];
            currentIdx++;
            return prev + nextChar;
          } else {
            if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
            return prev;
          }
        });
      }, 6); // Faster typing speed for fluid display
      
    } catch (err) {
      console.error('Advisor Error:', err);
      addToast(err.message || 'API Connection Timeout (HTTP 429 Rate Limit Exceeded). Please retry in 60 seconds.', 'error', 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-40">
      
      {/* Banner / Header Subtitle */}
      <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 rounded-2xl p-4 text-slate-700 dark:text-slate-200 text-sm">
        Receive dynamic economic advice, processing guides, price projections, and buyers.
      </div>

      {/* Main Parameters & Advisory Grid */}
      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Left Column: Strategy Parameters Form */}
        <div className="md:col-span-5 bg-slate-50/90 dark:bg-slate-900/90 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-emerald-600 font-bold">🔍</span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Strategy Parameters
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
            
            {/* Quick Sync */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Quick Sync From Inventory
              </label>
              <select
                value={inventorySync}
                onChange={handleInventorySyncChange}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Select a saved crop harvest --</option>
                <option value="mango">Mango - 25 Tons (Nashik, Maharashtra)</option>
                <option value="wheat">Wheat - 100 Quintals (Karnal, Haryana)</option>
                <option value="potato">Potato - 50 Tons (Agra, Uttar Pradesh)</option>
              </select>
            </div>

            {/* Crop Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Crop Name
              </label>
              <Input
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder="e.g. Mango"
                className="bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            {/* Quantity & Unit */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Quantity
                </label>
                <Input
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="25"
                  className="bg-white dark:bg-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Tons">Tons</option>
                  <option value="Quintals">Quintals</option>
                  <option value="Bags">Bags</option>
                </select>
              </div>
            </div>

            {/* Location / District */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Location / District
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Nashik, Maharashtra"
                className="bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            {/* Specific Advisory Question */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Specific Advisory Question (Optional)
              </label>
              <textarea
                rows={3}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Should I process my mangoes to pickle or sell them raw at local mandi?"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            {/* Checkbox: Simulate API Error State */}
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-red-600 dark:text-red-400 font-semibold select-none">
                <input
                  type="checkbox"
                  checked={simulateError}
                  onChange={(e) => setSimulateError(e.target.checked)}
                  className="rounded border-red-300 text-red-600 focus:ring-red-500 h-4 w-4"
                />
                <span>Simulate API Error State (For testing Toast notification)</span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size="sm" className="border-t-white" />
                  <span>Consulting Advisor...</span>
                </>
              ) : (
                <span>Consult AgroLink AI Advisor</span>
              )}
            </Button>
          </form>
        </div>

        {/* Right Column: Output Card / Results */}
        <div className="md:col-span-7 bg-slate-50/90 dark:bg-slate-900/90 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between min-h-[460px]">
          
          {loading ? (
            /* Loading State */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <Loader size="lg" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Consulting AI Agricultural Engine...</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold animate-pulse">{loadingTip}</p>
              </div>
              <div className="w-full max-w-sm pt-2">
                <Loader variant="skeleton" lines={4} />
              </div>
            </div>
          ) : aiResult ? (
            /* Final AI Output Display */
            <div className="space-y-5 text-xs">
              
              {/* Top Stat Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-100/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PROJECTED PREMIUM MARGIN</span>
                  <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{aiResult.projectedMargin}</p>
                </div>
                <div className="bg-slate-100/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">HOLDING TARGET WINDOW</span>
                  <p className="text-lg font-extrabold text-sky-600 dark:text-sky-400 pt-1">{aiResult.holdingWindow}</p>
                </div>
              </div>

              {/* AI Market Analysis & Advice */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">AI MARKET ANALYSIS & ADVICE</span>
                <div className="p-4 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 leading-relaxed min-h-[80px]">
                  {displayedAdvice}
                </div>
              </div>

              {/* APMC Price & Supply Sentiment */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">APMC PRICE & SUPPLY SENTIMENT</span>
                <div className="p-3 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 leading-relaxed">
                  {aiResult.apmcSentiment}
                </div>
              </div>

              {/* Value Addition & Buyers */}
              <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/40 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                  <span>🏷️</span>
                  <span>{aiResult.valueAdditionGuide}</span>
                </div>
                {aiResult.suggestedBuyers && (
                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Recommended Procurement Buyers:</span>
                    <div className="flex flex-wrap gap-2">
                      {aiResult.suggestedBuyers.map((buyer, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-[11px] border border-slate-200 dark:border-slate-700 font-medium">
                          {buyer}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* Empty Initial State: Advisor Ready */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-2xl border border-indigo-100 dark:border-indigo-900">
                🤖
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Advisor Ready</h3>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Provide your crop details in the parameter card on the left. The AI model will calculate customized value-addition percentages, holding price targets, and local buyers.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
