import { ArrowRight, ShieldCheck, Sprout } from 'lucide-react';
import heroImage from '../assets/hero.png';
import { Button } from './ui';

export default function Hero({ onPrimaryClick, onSecondaryClick }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800/80 transition-colors duration-300">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mx-auto lg:mx-0 shadow-sm animate-fade-in">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Direct Trade. No Middlemen. AI-Powered.</span>
            </div>
 
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] sm:leading-none">
              Connecting <span className="text-emerald-600 dark:text-emerald-400">Farmers</span> Directly to <span className="gradient-text font-black">Processors</span>
            </h1>
 
            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-350 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              AgroLink cuts out commission agents. Indian farmers list harvest quantities and locations, while food processing units source premium raw materials directly at fair, AI-suggested prices.
            </p>
 
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={onPrimaryClick}
                className="w-full sm:w-auto shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-base"
              >
                <span>Browse Produce</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={onSecondaryClick}
                className="w-full sm:w-auto shadow-sm hover:shadow active:translate-y-0 text-base bg-white dark:bg-slate-900"
              >
                <Sprout className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                <span>List Your Crop</span>
              </Button>
            </div>
 
            {/* Key stats row */}
            <div className="pt-6 border-t border-slate-150 dark:border-slate-800/80 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">0%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-1">Middlemen Fees</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">₹24/7</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-1">AI Price Guard</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">100%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-1">Direct Orders</p>
              </div>
            </div>
 
          </div>
 
          {/* Graphic / Image Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              {/* Decorative glows */}
              <div className="absolute -inset-4 bg-emerald-400/20 rounded-full blur-3xl opacity-30 select-none pointer-events-none"></div>
              
              <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 p-2.5 transition-transform duration-500 hover:rotate-1 hover:scale-[1.01]">
                <img
                  src={heroImage}
                  alt="AgroLink crop trade illustration"
                  className="w-full h-auto object-cover rounded-xl"
                  loading="eager"
                />
              </div>
            </div>
          </div>
 
        </div>
      </div>
    </div>
  );
}
