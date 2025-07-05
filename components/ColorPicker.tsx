import React from 'react';

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const colors = [
  'red-300', 'red-400', 'red-500',
  'blue-300', 'blue-400', 'blue-500',
  'green-300', 'green-400', 'green-500',
  'yellow-300', 'yellow-400', 'yellow-500',
  'purple-300', 'purple-400', 'purple-500',
  'pink-300', 'pink-400', 'pink-500',
  'indigo-300', 'indigo-400', 'indigo-500',
  'lime-300', 'lime-400', 'lime-500',
  'orange-300', 'orange-400', 'orange-500',
  'teal-300', 'teal-400', 'teal-500',
];

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onSelectColor }) => {
  return (
    <div className="grid grid-cols-6 gap-2 p-4 border rounded-md bg-gray-50">
      {colors.map((color) => (
        <div
          key={color}
          className={`w-8 h-8 rounded-full cursor-pointer ${`bg-${color}`} ${selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
          onClick={() => onSelectColor(color)}
        ></div>
      ))}
    </div>
  );
};

export default ColorPicker;
