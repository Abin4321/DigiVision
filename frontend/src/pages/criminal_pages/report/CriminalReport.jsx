import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';

const CriminalReport = () => {
  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <motion.div
          className="max-w-4xl mx-auto bg-gray-900 shadow-lg rounded-2xl p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-semibold text-center mb-8">Criminal Report</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link to="/criminal-report-camwise">
              <motion.div
                className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition"
                whileHover={{ scale: 1.05 }}
              >
                <h2 className="text-xl font-semibold mb-2">By Camera Locations</h2>
                <p className="text-gray-400">View reports filtered by specific camera feeds.</p>
              </motion.div>
            </Link>
            <Link to="/criminal-report-criminalwise">
              <motion.div
                className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition"
                whileHover={{ scale: 1.05 }}
              >
                <h2 className="text-xl font-semibold mb-2">By Criminal List</h2>
                <p className="text-gray-400">View reports based on a list of known criminals.</p>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CriminalReport;