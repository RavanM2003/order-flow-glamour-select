import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, value, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    if (value.includes(option.value)) {
      onChange(value.filter(v => v !== option.value));
    } else {
      onChange([...value, option.value]);
    }
  };

  const handleRemove = (val: string) => {
    onChange(value.filter(v => v !== val));
  };

  return (
    <div className="relative" ref={ref}>
      <div
        className="min-h-[42px] border rounded px-3 py-2 flex flex-wrap gap-1 items-center cursor-pointer bg-white"
        onClick={() => setOpen(o => !o)}
        tabIndex={0}
      >
        {value.length === 0 && (
          <span className="text-gray-400 select-none">{placeholder || 'Seçin...'}</span>
        )}
        {value.map(val => {
          const opt = options.find(o => o.value === val);
          return opt ? (
            <span key={val} className="flex items-center bg-glamour-100 text-glamour-800 rounded px-2 py-1 text-xs mr-1 mb-1">
              {opt.label}
              <button
                type="button"
                className="ml-1 text-gray-500 hover:text-red-500 focus:outline-none"
                onClick={e => { e.stopPropagation(); handleRemove(val); }}
                aria-label="Sil"
              >
                ×
              </button>
            </span>
          ) : null;
        })}
      </div>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-auto">
          {options.map(opt => (
            <div
              key={opt.value}
              className={`px-3 py-2 cursor-pointer flex items-center gap-2 hover:bg-glamour-50 ${value.includes(opt.value) ? 'bg-glamour-100 font-semibold' : ''}`}
              onClick={() => handleSelect(opt)}
            >
              <input
                type="checkbox"
                checked={value.includes(opt.value)}
                readOnly
                className="accent-glamour-700"
              />
              <span>{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect; 