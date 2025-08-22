import type React from 'react';

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  max: number;
  step: number;
  className?: string;
}

export function Slider({ value, onValueChange, max, step, className = '' }: SliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange([parseFloat(e.target.value)]);
  };

  const percentage = (value[0] / max) * 100;

  return (
    <div className={`relative flex items-center ${className}`}>
      <input
        type='range'
        min='0'
        max={max}
        step={step}
        value={value[0] || 0}
        onChange={handleChange}
        className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer'
        style={{
          background: `linear-gradient(to right, rgb(var(--primary)) 0%, rgb(var(--primary)) ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
        }}
      />
      <style>{`
				input[type="range"]::-webkit-slider-thumb {
					appearance: none;
					height: 20px;
					width: 20px;
					border-radius: 50%;
					background: white;
					border: 2px solid rgb(var(--primary));
					cursor: pointer;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				}
				input[type="range"]::-moz-range-thumb {
					height: 20px;
					width: 20px;
					border-radius: 50%;
					background: white;
					border: 2px solid rgb(var(--primary));
					cursor: pointer;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				}
			`}</style>
    </div>
  );
}
