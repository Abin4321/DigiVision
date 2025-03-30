import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../../../components/Sidebar/Sidebar";
import supabase from "../../../SupabaseClient"; // Import Supabase client

const NetworkList = () => {
  const [networks, setNetworks] = useState([]); // State to store networks and requests
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch network and request data
  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        // Fetch networks and counts for requests
        const { data, error } = await supabase
          .from("area_code")
          .select(`
            id,
            area_code,
            name,
            missing_person_reports (
              id,
              name,
              time_of_missing,
              area_code
            )
          `)
          .order("area_code");

        if (error) {
          throw new Error(error.message);
        }

       
        // Group networks by area_code and count the total requests
        const networkCounts = data.map((network) => {
          const totalRequests = network.missing_person_reports.length;

          return {
            ...network,
            totalRequests,
          };
        });

        setNetworks(networkCounts); // Set the networks data
      } catch (err) {
        setError(err.message); // Set error if fetch fails
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchNetworkData();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-secondary overflow-y-auto">
        <motion.h1
          className="text-4xl font-semibold text-white text-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Network Requests
        </motion.h1>

        {/* Loading, Error handling, and Data Display */}
        {loading && <p className="text-center text-white">Loading...</p>}
        {error && <p className="text-center text-red-500">{`Error: ${error}`}</p>}

        {/* Display Networks */}
        {!loading && !error && networks.length > 0 ? (
          <div className="flex justify-center gap-6 flex-wrap">
            {networks.map((network, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md w-72 hover:translate-y-2 transition-all duration-300"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
              >
                <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">
                  {network.name} ({network.area_code})
                </h2>

                <div className="flex flex-col space-y-4">
                  <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                    <h3 className="text-lg text-gray-600">Total Requests</h3>
                    <p className="text-2xl font-bold text-gray-900">{network.totalRequests}</p>
                  </div>
                </div>

                {/* List of Requests */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Requests</h3>
                  {network.missing_person_reports.map((report, idx) => (
                    
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg mb-3">
                      <p className="text-gray-700 font-semibold">{report.name}</p>
                      <p className="text-gray-500 text-sm">
                        
                        Time of Missing: {report.time_of_missing || "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No networks or requests available.
          </p>
        )}
      </div>
    </div>
  );
};

export default NetworkList;
