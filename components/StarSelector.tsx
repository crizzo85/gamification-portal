import React from 'react';
import SvgIcon from './SvgIcon';

interface StarSelectorProps {
  count: number;
  onSelect: (count: number) => void;
}

const StarSelector: React.FC<StarSelectorProps> = ({ count, onSelect }) => {
  return (
    <div className="flex items-center space-x-2">
      {[1, 2, 3].map((star) => (
        <div key={star} onClick={() => onSelect(star)} className="cursor-pointer">
          <SvgIcon 
            name="FaStar" 
            className={`w-8 h-8 ${star <= count ? 'text-yellow-400' : 'text-gray-300'}`}
            fill={star <= count ? 'gold' : 'currentColor'}
          />
        </div>
      ))}
    </div>
  );
};

export default StarSelector;
