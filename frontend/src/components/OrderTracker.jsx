import React from 'react';
import { Check, Package, Truck, CheckCircle2 } from 'lucide-react';

const steps = [
  { id: 'PENDING', label: 'Order Placed', icon: Package },
  { id: 'CONFIRMED', label: 'Confirmed', icon: Check },
  { id: 'PACKED', label: 'Packed', icon: Package },
  { id: 'SHIPPED', label: 'Shipped', icon: Truck },
  { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
  { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
];

export default function OrderTracker({ currentStatus }) {
  // Find current step index
  let currentIndex = steps.findIndex((step) => step.id === currentStatus?.toUpperCase());
  if (currentIndex === -1) {
    if (['CANCELLED', 'FAILED'].includes(currentStatus?.toUpperCase())) {
      currentIndex = -1; // Specific handling below if needed
    } else {
      currentIndex = 0;
    }
  }

  const isCancelled = ['CANCELLED', 'FAILED'].includes(currentStatus?.toUpperCase());

  return (
    <div className="w-full py-6">
      <div className="relative flex justify-between items-center w-full">
        {/* Connecting line background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
        
        {/* Active connecting line */}
        {!isCancelled && (
            <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-sky-500 rounded-full z-0 transition-all duration-500 ease-in-out"
            style={{ width: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 100}%` }}
            ></div>
        )}

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = !isCancelled && index <= currentIndex;
          const isCurrent = !isCancelled && index === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all duration-300 ${
                  isCancelled
                    ? 'bg-gray-300 text-white'
                    : isCompleted
                    ? 'bg-sky-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                } ${isCurrent ? 'ring-4 ring-sky-100 scale-110' : ''}`}
              >
                <Icon size={18} strokeWidth={isCompleted ? 3 : 2} />
              </div>
              
              <div className="absolute top-12 mt-2 w-24 text-center">
                <span className={`text-xs font-bold ${
                    isCancelled 
                      ? 'text-gray-400' 
                      : isCompleted 
                        ? 'text-sky-700' 
                        : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {isCancelled && (
          <div className="mt-16 text-center">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-700 font-bold">
                  Order {currentStatus}
              </span>
          </div>
      )}
    </div>
  );
}
