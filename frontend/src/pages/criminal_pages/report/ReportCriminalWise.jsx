import React, { useState } from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';

const ReportCriminalWise = () => {
  const criminals = [
    {
      name: 'Criminal 1',
      details: [
        'Recent Location of Criminal 1',
        'Recent Location of Criminal 1',
        'Recent Location of Criminal 1',
        'Recent Location of Criminal 1',
        'Recent Location of Criminal 1'
      ]
    },
    {
      name: 'Criminal 2',
      details: [
        'Recent Location of Criminal 2',
        'Recent Location of Criminal 2',
        'Recent Location of Criminal 2',
        'Recent Location of Criminal 2',
        'Recent Location of Criminal 2'
      ]
    },
    {
      name: 'Criminal 3',
      details: [
        'Recent Location of Criminal 3',
        'Recent Location of Criminal 3',
        'Recent Location of Criminal 3',
        'Recent Location of Criminal 3',
        'Recent Location of Criminal 3'
      ]
    },
    {
      name: 'Criminal 4',
      details: [
        'Recent Location of Criminal 4',
        'Recent Location of Criminal 4',
        'Recent Location of Criminal 4',
        'Recent Location of Criminal 4',
        'Recent Location of Criminal 4'
      ]
    }
  ];

  const [selectedCriminal, setSelectedCriminal] = useState(null);

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-semibold text-center mb-6">Criminal Reports</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {criminals.map((criminal, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg text-center cursor-pointer hover:bg-gray-700 transition"
              onClick={() => setSelectedCriminal(criminal)}
            >
              <h2 className="text-xl font-semibold mb-2">{criminal.name}</h2>
            </div>
          ))}
        </div>
      </div>

      {selectedCriminal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-6">
          <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-lg w-full relative">
            <h2 className="text-2xl font-semibold mb-4">{selectedCriminal.name}</h2>
            <ul className="text-gray-300">
              {selectedCriminal.details.map((detail, index) => (
                <li key={index} className="mb-2">{detail}</li>
              ))}
            </ul>
            <button
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              onClick={() => setSelectedCriminal(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportCriminalWise;