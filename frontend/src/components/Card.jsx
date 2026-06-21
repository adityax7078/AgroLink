import { MapPin, Scale, Tag, ArrowRight } from 'lucide-react';
import { Button } from './ui';

export default function Card({
  title,
  description,
  image,
  price,
  unit = 'kg',
  quantity,
  location,
  badge,
  actionText = 'View Listing',
  onActionClick,
}) {
  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 shadow-sm overflow-hidden flex flex-col card-hover transition-colors duration-300">
      {/* Card Image Header */}
      <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full gradient-bg flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:12px_12px] opacity-70"></div>
            <Tag className="h-12 w-12 text-white/40" />
          </div>
        )}
        
        {/* Category Badge */}
        {badge && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-slate-800 dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-800">
              {badge}
            </span>
          </div>
        )}

        {/* Live Price Tag */}
        <div className="absolute bottom-4 right-4">
          <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-emerald-600/95 backdrop-blur-sm text-white font-bold text-sm shadow-md">
            ₹{price} <span className="text-emerald-200 text-xs font-normal ml-0.5">/ {unit}</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Dynamic crop specs */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Scale className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <div className="text-xs">
              <p className="text-slate-400 dark:text-slate-500 font-medium">Quantity</p>
              <p className="font-semibold text-slate-700 dark:text-slate-350">{quantity} {unit}s</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <MapPin className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <div className="text-xs">
              <p className="text-slate-400 dark:text-slate-500 font-medium">Location</p>
              <p className="font-semibold text-slate-700 dark:text-slate-350 truncate max-w-[100px]">{location}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {onActionClick && (
          <Button
            variant="outline"
            onClick={onActionClick}
            className="mt-6 w-full text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800 bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/30"
          >
            <span>{actionText}</span>
            <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-0.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
