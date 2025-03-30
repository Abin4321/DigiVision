import React, { useState, useEffect } from "react";
import { Card, Dropdown, DropdownItem } from "flowbite-react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import supabase from "../../../SupabaseClient";
import Message from "./Message";

const UsersList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("profiles").select("id, name, email, profile_photo_url");
      if (error) {
        console.error("Error fetching users:", error.message);
      } else {
        setData(data);
      }
    };

    fetchData();
  }, []);

  // Filter data based on search term
  const filteredData = data.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 bg-secondary overflow-y-auto">
        <h1 className="text-2xl md:text-4xl font-semibold text-white text-center mb-6">Users List</h1>

        {/* Search Input */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded shadow-sm focus:outline-none w-full md:w-1/2 lg:w-1/3"
          />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredData.length > 0 ? (
            filteredData.map((user) => (
              <Card key={user.id} className="w-full">
                {/* Dropdown for options */}
                <div className="flex justify-end px-4 pt-4">
                  <Dropdown inline label="">
                    <DropdownItem>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Block User
                      </a>
                    </DropdownItem>
                    <DropdownItem>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Delete User
                      </a>
                    </DropdownItem>
                  </Dropdown>
                </div>

                {/* Profile Details */}
                <div className="flex flex-col items-center pb-10">
                  <img
                    src={user.profile_photo_url || "/default-profile.jpg"}
                    alt={user.name}
                    className="mb-3 w-20 h-20 md:w-24 md:h-24 rounded-full shadow-lg"
                  />
                  <h5 className="mb-1 text-lg md:text-xl font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </h5>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
                  <div className="mt-4 flex space-x-3">
                    <a
                      href={`/profile/${user.id}`}
                      className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                    >
                      View Profile
                    </a>
                    <button
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setIsModalOpen(true);
                      }}
                      className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                    >
                      Message
                    </button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-white text-center">No users found</p>
          )}
        </div>

        {/* Modal for sending message */}
        <Message
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          selectedUserId={selectedUserId}
        />
      </div>
    </div>
  );
};

export default UsersList;
