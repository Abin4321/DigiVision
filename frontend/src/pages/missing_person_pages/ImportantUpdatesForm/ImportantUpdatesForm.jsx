import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "../../../components/Sidebar/Sidebar";
import supabase from "../../../SupabaseClient";


const ImportantUpdatesForm = () => {
  const [updateMessage, setUpdateMessage] = useState("");
  const [users, setUsers] = useState([]); // List of users from the profiles table
  const [selectedUserId, setSelectedUserId] = useState(null); // Selected user for unicast

  // Fetch users from the profiles table
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("profiles").select("id, name, email");
      if (error) {
        console.error("Error fetching users:", error.message);
      } else {
        setUsers(data);
      }
    };
    fetchUsers();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (updateMessage.trim()) {
      try {
        // Insert the update into the "important_updates" table
        const { data, error } = await supabase.from("important_updates").insert([
          {
            message: updateMessage,
           
            user_id: selectedUserId || null, // Null for broadcast, user_id for unicast
          },
        ]);

        if (error) {
          console.error("Error submitting update:", error.message);
          alert("Failed to submit the update. Please try again.");
        } else {
          console.log("Update submitted:", data);
          alert("Important update submitted successfully!");
          setUpdateMessage(""); // Clear the form after submission
          setSelectedUserId(null); // Reset the selected user
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        alert("Something went wrong. Please try again.");
      }
    } else {
      alert("Please enter a valid update message.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
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
            Post Important Update
          </motion.h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="updateMessage"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Update Message:
              </label>
              <textarea
                id="updateMessage"
                name="updateMessage"
                rows="5"
                value={updateMessage}
                onChange={(e) => setUpdateMessage(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-700"
                placeholder="Enter the update message here..."
                required
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="selectUser"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Select User (Leave blank for broadcast):
              </label>
              <select
                id="selectUser"
                value={selectedUserId || ""}
                onChange={(e) =>
                  setSelectedUserId(e.target.value === "" ? null : e.target.value)
                }
                className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-700"
              >
                <option value="">Broadcast to All</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white py-3 px-6 rounded-lg font-bold shadow-md hover:bg-blue-600 transition-all"
            >
              Submit Update
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ImportantUpdatesForm;
