import React from 'react';
import { MapPin, Scale, Tag, ArrowRight } from 'lucide-react';

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
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-200 shadow-sm overflow-hidden flex flex-col card-hover">
      {/* Card Image Header */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
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
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-sm text-slate-800 shadow-sm border border-slate-100">
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
          <h3 className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Dynamic crop specs */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-slate-600">
            <Scale className="h-4 w-4 text-emerald-500 shrink-0" />
            <div className="text-xs">
              <p className="text-slate-400 font-medium">Quantity</p>
              <p className="font-semibold text-slate-700">{quantity} {unit}s</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
            <div className="text-xs">
              <p className="text-slate-400 font-medium">Location</p>
              <p className="font-semibold text-slate-700 truncate max-w-[100px]">{location}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {onActionClick && (
          <button
            onClick={onActionClick}
            className="mt-6 w-full inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm"
          >
            <span>{actionText}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </div>
    </div>
  );
}
