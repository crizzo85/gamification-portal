import React from 'react';
import SvgIcon from './SvgIcon';
import { Badge } from './types';

interface BadgePatchProps {
  badge: Badge;
  onRemove?: () => void; // La funzione onRemove non ha bisogno di argomenti qui
  compact?: boolean; // Nuovo prop per la vista compatta
}

const BadgePatch: React.FC<BadgePatchProps> = ({ badge, onRemove, compact }) => {
  const bgColorClass = `bg-${badge.color}`;

  const renderStars = () => {
    return (
      <div className="flex justify-center items-center">
        {Array.from({ length: badge.stars || 1 }).map((_, index) => (
          <SvgIcon key={index} name="FaStar" className="w-6 h-6 text-yellow-400" fill="gold" />
        ))}
      </div>
    );
  };

  if (compact) {
    return (
      <div className="relative group w-24 h-24 rounded-xl flex flex-col items-center justify-center transform hover:scale-110 transition-all duration-300">
        <div className="absolute top-0 z-20">
          {renderStars()}
        </div>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${bgColorClass}`}>
          <SvgIcon name={badge.icon} className="w-8 h-8 text-white" fill="white" />
        </div>
        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
          {badge.name}
        </div>
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-0 right-0 -mt-2 -mr-2 bg-gray-100 rounded-full p-1 text-gray-400 hover:text-red-500 hover:bg-red-100 transition-colors z-10"
            aria-label="Rimuovi badge"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-xl shadow-md p-6 pt-12 text-center transform hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center">
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 right-2 bg-gray-100 rounded-full p-1 text-gray-400 hover:text-red-500 hover:bg-red-100 transition-colors z-10"
          aria-label="Rimuovi badge"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      <div className="absolute top-2 z-20">
        {renderStars()}
      </div>
      <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${bgColorClass} mb-4`}>
        <SvgIcon name={badge.icon} className="w-10 h-10 text-white" fill="white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mt-4">{badge.name}</h3>
      <p className="text-sm text-gray-500 mt-1">{badge.description}</p>
    </div>
  );
};

export default BadgePatch;
