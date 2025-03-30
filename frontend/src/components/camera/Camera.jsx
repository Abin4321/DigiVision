import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../Sidebar/Sidebar';

const Camera = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [feedUrls, setFeedUrls] = useState([]);

  const handleIpChange = (e) => setIpAddress(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ipAddress.trim() && !feedUrls.includes(`http://${ipAddress}/video`)) {
      setFeedUrls([...feedUrls, `http://${ipAddress}/video`]);
    } else {
      alert('Please enter a valid IP address.');
    }
  };

  const stopFeed = (url) => setFeedUrls(feedUrls.filter(feed => feed !== url));

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
          <h1 className="text-4xl font-semibold text-center mb-8">Camera Feed Viewer</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="ipAddress" className="block text-lg font-medium mb-2">Enter IP Address:</label>
              <div className="relative">
                <input
                  type="text"
                  id="ipAddress"
                  value={ipAddress}
                  onChange={handleIpChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter webcam IP"
                  required
                />
                <select
                  onChange={(e) => handleIpChange({ target: { value: e.target.value } })}
                  className="absolute top-0 right-0 h-full px-4 py-3 border-l  bg-gray-800 border border-gray-700 rounded-r-lg cursor-pointer"
                >
                  <option value="">Select IP</option>
                  <option value="192.168.1.6:4748">192.168.1.6:4748</option>
                  <option value="192.168.1.7:8080">192.168.1.7:8080</option>
                  <option value="172.16.12.58:4748">172.16.12.58:4748</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">Show Feed</button>
          </form>
          {feedUrls.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-medium mb-4">Camera Feeds</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {feedUrls.map((url, index) => (
                  <div key={index} className="relative bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <iframe
                      title={`Camera Feed ${index + 1}`}
                      src={url}
                      className="w-full h-64 rounded-lg"
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                    <button
                      onClick={() => stopFeed(url)}
                      className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg font-bold hover:bg-red-700 transition"
                    >
                      Stop
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Camera;