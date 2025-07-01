import React, { useState, useEffect } from 'react';
import Color from 'colorjs.io';
import ColorScale from '/src/components/ColorScale.jsx';

export default function App() {
  const [colorInput, setColorInput] = useState('oklch(65% 0.25 25)');
  const [colorObj, setColorObj] = useState(null);
  const [parseError, setParseError] = useState('');

  useEffect(() => {
    // Set up dark mode listener
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateMode = () => document.documentElement.classList.toggle('dark', mediaQuery.matches);
    updateMode();
    mediaQuery.addEventListener('change', updateMode);
    return () => mediaQuery.removeEventListener('change', updateMode);
  }, []);

  useEffect(() => {
    // Parse color input
    try {
      let processedInput = colorInput.trim();
      if (/^#([A-Fa-f0-9]{3})$/.test(processedInput)) {
          const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
          processedInput = processedInput.replace(shorthandRegex, (m, r, g, b) => `#${r}${r}${g}${g}${b}${b}`);
      }
      const newColor = new Color(processedInput);
      setColorObj(newColor);
      setParseError('');
    } catch (e) {
      setColorObj(null);
      setParseError('Invalid color format.');
    }
  }, [colorInput]);

  return (
    <div className="min-h-screen font-sans bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Color Scale</h1>
        </header>
        
        <div className="mb-6">
          <label htmlFor="color-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Color Input
          </label>
          <input
            id="color-input"
            type="text"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border text-base transition-all duration-200 ${
              parseError
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
            } bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500`}
            placeholder="e.g., oklch(65% 0.25 25)"
          />
          {parseError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{parseError}</p>}
        </div>

        {colorObj ? (
          <ColorScale colorObj={colorObj} />
        ) : (
          <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold">Enter a valid color to begin</h2>
          </div>
        )}
      </main>
    </div>
  );
}
