import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../SupabaseClient"; // Import supabase client
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Authenticate user with Supabase
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        toast.error("Invalid email or password!");
        return;
      }

      // Fetch user details to check role
      const { data: userDetails, error: userError } = await supabase
        .from("profiles") // Replace "users" with your actual table name
        .select("roles")
        .eq("email", email)
        .single();

      if (userError || !userDetails || userDetails.roles !== "admin") {
        toast.error("Access denied! Admins only.");
        await supabase.auth.signOut();
        return;
      }

      // Save login state and navigate to Admin Dashboard
      localStorage.setItem("AdminDetails", JSON.stringify(userDetails));
      localStorage.setItem("LoginSuccess", "true");
      navigate("/home-criminal");
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error(err);
    }
  };

  useEffect(() => {
    // Handle logout
    if (localStorage.getItem("Session")) {
      toast.info("You have been logged out!");
      setTimeout(() => {
        localStorage.removeItem("Session");
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-secondary text-white text-center py-4 text-2xl font-bold">
        DigiVision : NextGen Security and Monitoring Network
      </div>

      <div className="flex flex-col justify-center items-center py-10">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
          <h2 className="text-3xl font-semibold text-indigo-700 mb-6 text-center">Admin Login</h2>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-lg text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-lg text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-700 text-white p-3 rounded-md font-semibold hover:bg-indigo-800 transition duration-300"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
