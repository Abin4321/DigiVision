import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import supabase from "../../../SupabaseClient";
import Sidebar from "../../../components/Sidebar/Sidebar";

const ViewProfile = () => {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user details:", error.message);
      } else {
        setUserDetails(data);
      }
      setLoading(false);
    };

    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading user details...</p>;
  }

  if (!userDetails) {
    return <p className="text-center text-red-500">User not found!</p>;
  }

  const {
    name,
    email,
    phone,
    place,
    pincode,
    profile_photo_url,
    area_code,
  } = userDetails;

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <Sidebar />

      <div className="flex-1 p-4 md:p-6 bg-secondary overflow-y-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          ← Back
        </button>

        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center mb-6">
            <img
              src={profile_photo_url || "/default-profile.jpg"}
              alt={name}
              className="w-24 h-24 rounded-full shadow-lg mr-6"
            />
            <div>
              <h1 className="text-2xl font-bold">{name}</h1>
              <p className="text-gray-500">{email}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Contact Information</h2>
              <p>Phone: {phone || "N/A"}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Address</h2>
              <p>
                Place: {place} <br /> Last Connected Area: {area_code || "N/A"} <br /> Pincode: {pincode}
              </p>
            </div>
          </div>

          {/* Block and Delete Buttons UI (without backend logic) */}
          <div className="mt-6 space-x-4">
            <button
              className="inline-flex items-center rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Block User
            </button>
            <button
              className="inline-flex items-center rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
