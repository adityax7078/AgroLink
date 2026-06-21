import React from 'react';
import { Target, Users, Landmark, HeartHandshake } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-slate-50/50 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Our Mission</span>
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight">
            About Agro<span className="text-emerald-600">Link</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
            Pioneering a decentralized agricultural commerce model to bridge the gap between Indian farmers and the food processing sector.
          </p>
        </div>

        {/* Narrative Section */}
        <div className="mt-16 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800">Eliminating the Middleman Dependency</h2>
            <p className="text-slate-600 leading-relaxed font-light">
              Indian agriculture suffers from fragmented supply chains. Small and medium farmers often sell their harvest to local commission agents (*arhtiyas*) at low prices due to lack of transport, sorting infrastructure, and transparent pricing. At the same time, processing factories (flour mills, chip makers, juice extractors) pay inflated prices to sourcing middlemen.
            </p>
            <p className="text-slate-600 leading-relaxed font-light">
              **AgroLink** establishes a direct digital marketplace where farmers publish their exact crop listings (produce type, moisture levels, quantity, and location). Food processing units search the listings, negotiate terms in-app, and buy directly.
            </p>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
            <div className="flex gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0 h-12 w-12 flex items-center justify-center">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Target Sellers</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Small-to-medium farmers (aged 25–60) in rural & semi-urban India seeking transparent rates and wider access.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0 h-12 w-12 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Target Buyers</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Food processing managers seeking cost-efficient, traceable raw materials with standardized specifications.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0 h-12 w-12 flex items-center justify-center">
                <Landmark className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Fair Price Discovery</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  AI-driven suggestion models trained on historical data and current local mandi prices to minimize rate uncertainty.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0 h-12 w-12 flex items-center justify-center">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Unified Contracts</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Integrated chat messaging and easy billing to make transaction negotiation fast, fair, and documented.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
