import React, { useState, useEffect, useRef } from 'react';
import type { Locale, Portfolio, DeviceView } from '../types';
import { LOCALES } from '../constants';
import { Smartphone, Tablet, Monitor, Download, Globe } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CanvasContent } from './CanvasContent';


const generateHtml = (portfolio: Portfolio) => {
  const bodyContent = renderToStaticMarkup(<CanvasContent sections={portfolio.sections} activeLocale={portfolio.defaultLocale} isExport={true} />);
  
  return `
<!DOCTYPE html>
<html lang="${portfolio.defaultLocale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${portfolio.name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: sans-serif; background-color: #111827; color: #f9fafb; }
    /* Add more basic styles here to replicate tailwind config */
    .section { padding: 4rem 1rem; }
  </style>
</head>
<body>
  ${bodyContent}
</body>
</html>
  `;
};


export const TopBar: React.FC<{
  projectName: string;
  activeLocale: Locale;
  setActiveLocale: (locale: Locale) => void;
  enabledLocales: Locale[];
  portfolio: Portfolio;
  deviceView: DeviceView;
  setDeviceView: (view: DeviceView) => void;
}> = ({ projectName, activeLocale, setActiveLocale, enabledLocales, portfolio, deviceView, setDeviceView }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isLocaleMenuOpen, setIsLocaleMenuOpen] = useState(false);
  const localeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (localeMenuRef.current && !localeMenuRef.current.contains(event.target as Node)) {
        setIsLocaleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleExport = () => {
    setIsExporting(true);
    try {
      const htmlContent = generateHtml(portfolio);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${portfolio.name.toLowerCase().replace(/\s/g, '-')}-portfolio.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Check the console for details.");
    } finally {
      setIsExporting(false);
    }
  };
  
  const getButtonClass = (view: DeviceView) => {
    return `p-2 rounded-md transition-colors ${
      deviceView === view ? 'bg-brand-accent text-white' : 'text-brand-mist hover:text-white hover:bg-gray-700'
    }`;
  };

  return (
    <header className="h-16 bg-brand-dark border-b border-gray-700 flex items-center justify-between px-4 md:px-6 w-full z-10 flex-shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-white hidden md:block">{projectName}</h1>
        {/* Locale Switcher */}
        <div className="relative" ref={localeMenuRef}>
          <button onClick={() => setIsLocaleMenuOpen(!isLocaleMenuOpen)} className="flex items-center gap-2 text-brand-mist hover:text-white transition-colors">
            <Globe size={18} />
            <span className="uppercase">{activeLocale}</span>
          </button>
          <div className={`absolute top-full mt-2 left-0 bg-brand-night rounded-md shadow-lg p-2 transition-opacity duration-200 w-32 z-20 ${isLocaleMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            {enabledLocales.map((locale) => (
              <button 
                key={locale}
                onClick={() => {
                  setActiveLocale(locale as Locale);
                  setIsLocaleMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-md text-sm ${activeLocale === locale ? 'bg-brand-accent text-white' : 'hover:bg-gray-700'}`}
              >
                {LOCALES.find(l => l.code === locale)?.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Device Preview */}
      <div className="hidden md:flex items-center gap-2 p-1 bg-brand-night rounded-lg">
        <button onClick={() => setDeviceView('desktop')} className={getButtonClass('desktop')} aria-label="Desktop view">
            <Monitor size={20} />
        </button>
        <button onClick={() => setDeviceView('tablet')} className={getButtonClass('tablet')} aria-label="Tablet view">
            <Tablet size={20} />
        </button>
        <button onClick={() => setDeviceView('mobile')} className={getButtonClass('mobile')} aria-label="Mobile view">
            <Smartphone size={20} />
        </button>
      </div>

      <button
        onClick={handleExport}
        disabled={isExporting}
        className="flex items-center gap-2 bg-brand-accent text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-500"
      >
        <Download size={18} />
        <span>{isExporting ? 'Exporting...' : 'Export'}</span>
      </button>
    </header>
  );
};