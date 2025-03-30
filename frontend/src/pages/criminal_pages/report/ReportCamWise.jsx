import React, { useState } from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';

const ReportCamWise = () => {
  const locations = [
    { 
      name: 'Location 1', 
      details: [
        'Incident 1 at Location 1', 
        'Incident 2 at Location 1', 
        'Incident 3 at Location 1', 
        'Incident 4 at Location 1', 
        'Incident 5 at Location 1'
      ]
    },
    { 
      name: 'Location 2', 
      details: [
        'Incident 1 at Location 2', 
        'Incident 2 at Location 2', 
        'Incident 3 at Location 2', 
        'Incident 4 at Location 2', 
        'Incident 5 at Location 2'
      ]
    },
    { 
      name: 'Location 3', 
      details: [
        'Incident 1 at Location 3', 
        'Incident 2 at Location 3', 
        'Incident 3 at Location 3', 
        'Incident 4 at Location 3', 
        'Incident 5 at Location 3'
      ]
    },
    { 
      name: 'Location 4', 
      details: [
        'Incident 1 at Location 4', 
        'Incident 2 at Location 4', 
        'Incident 3 at Location 4', 
        'Incident 4 at Location 4', 
        'Incident 5 at Location 4'
      ]
    }
  ];

  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-semibold text-center mb-6">Camera Reports by Location</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {locations.map((location, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg text-center cursor-pointer hover:bg-gray-700 transition"
              onClick={() => setSelectedLocation(location)}
            >
              <h2 className="text-xl font-semibold mb-2">{location.name}</h2>
            </div>
          ))}
        </div>
      </div>

      {selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-6">
          <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-lg w-full relative">
            <h2 className="text-2xl font-semibold mb-4">{selectedLocation.name}</h2>
            <ul className="text-gray-300">
              {selectedLocation.details.map((detail, index) => (
                <li key={index} className="mb-2">{detail}</li>
              ))}
            </ul>
            <button
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              onClick={() => setSelectedLocation(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportCamWise;
