import React, { useEffect, useState } from 'react';
import { Card } from "flowbite-react";
import supabase from '../../SupabaseClient';
import Sidebar from '../../components/Sidebar/Sidebar';

const CriminalDbList = () => {
  const [criminals, setCriminals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCriminals = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('criminal_db').select('id, name, photo_url, video_url');
      if (error) {
        console.error('Error fetching data:', error.message);
      } else {
        setCriminals(data);
      }
      setLoading(false);
    };
    fetchCriminals();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const { error: dbError } = await supabase.from('criminal_db').delete().eq('id', id);
      if (dbError) {
        console.error('Error deleting record:', dbError.message);
      } else {
        setCriminals(criminals.filter((criminal) => criminal.id !== id));
        alert('Record deleted successfully.');
      }
    }
  };

  const filteredCriminals = criminals.filter((criminal) =>
    criminal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-4xl font-semibold text-center mb-6">Criminal Database</h1>
        
        {/* Search Bar */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 border rounded-lg text-black"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-screen">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCriminals.length > 0 ? (
              filteredCriminals.map((criminal) => (
                <Card key={criminal.id} className="bg-gray-900 shadow-lg">
                  <div className="flex items-center space-x-4">
                    <img
                      src={criminal.photo_url || '/images/default-profile.png'}
                      alt={`${criminal.name}'s photo`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h5 className="text-lg font-bold">{criminal.name}</h5>
                    </div>
                  </div>
                  <div className="mt-4">
                    <video
                      src={criminal.video_url}
                      className="w-full h-32 rounded-md"
                      controls
                    />
                  </div>
                  <button
                    onClick={() => handleDelete(criminal.id)}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
                  >
                    Delete
                  </button>
                </Card>
              ))
            ) : (
              <p className="text-center w-full">No results found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CriminalDbList;
