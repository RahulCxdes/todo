import React, { useState } from 'react';

const ChatBot = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&titles=${encodeURIComponent(query)}&format=json&origin=*`);
      const data = await response.json();
      const page = data.query.pages[Object.keys(data.query.pages)[0]];

      if (page.missing) {
        setResult('No results found.');
      } else {
        // Extract and clean the text content
        const htmlContent = page.extract;
        const textContent = new DOMParser().parseFromString(htmlContent, 'text/html').body.textContent || "";
        setResult(textContent);
      }
    } catch (error) {
      setResult('An error occurred while fetching data.');
    }
    setLoading(false);
  };

  const handleClear = () => {
    setQuery('');
    setResult('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="p-6 max-w-xl bg-white rounded-lg shadow-lg w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Wikipedia..."
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex space-x-2">
          <button
            onClick={handleSearch}
            disabled={loading}
            className={`flex-1 p-3 text-white rounded-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button
            onClick={handleClear}
            className="flex-1 p-3 text-white bg-gray-500 rounded-lg hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
        <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
          {result}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
