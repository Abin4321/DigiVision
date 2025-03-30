import React, { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../../components/Sidebar/Sidebar";

const QuickSearch = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // Single file
  const [name, setName] = useState("");
  const [postUrl, setPostUrl] = useState("");

  const uploadPhoto = async () => {
    if (!postUrl) {
      alert("Please enter the upload URL!");
      return;
    }

    if (!selectedFile) {
      alert("Please select a photo!");
      return;
    }

    if (!name.trim()) {
      alert("Please enter a valid name!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile); // Match the backend key
      formData.append("name", name);

      const response = await fetch(postUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Error uploading photo:", response.statusText);
        alert("Failed to upload the photo. Please check the server.");
        return;
      }

      const result = await response.json();
      alert(result.message || "Photo uploaded successfully!");
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-6 bg-secondary overflow-y-auto">
        <motion.div
          className="w-full max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-4xl font-bold text-center text-blue-600 mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Upload Photo to Server
          </motion.h1>

          <p className="text-center text-gray-600 mb-6">
            Upload a single image with a name to the server.
          </p>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="postUrl"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Enter Upload URL:
              </label>
              <input
                type="text"
                id="postUrl"
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-700"
                placeholder="https://example.com/upload"
                required
              />
            </div>

            <div>
              <label
                htmlFor="file"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Select Photo:
              </label>
              <input
                type="file"
                id="file"
                onChange={(e) => setSelectedFile(e.target.files[0])} // Single file
                className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-700"
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Enter Name:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-700"
                placeholder="Enter a name"
                required
              />
            </div>

            <button
              onClick={uploadPhoto}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-bold shadow-md hover:bg-blue-600 transition-all disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload Photo"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuickSearch;
