import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase"; // Assuming supabase is initialized here

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const getUser = async () => {
  //     const { data, error } = await supabase.auth.getUser();
  //     if (error) {
  //       console.error(error);
  //       setIsLogged(false);
  //       setUser(null);
  //     } else {
  //       setIsLogged(!!data.user);
  //       setUser(data.user);
  //     }
  //     setLoading(false);
  //   };

  //   getUser();
  // }, []);
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: authData, error: authError } = await supabase.auth.getUser();
  
      if (authError || !authData?.user) {
        setIsLogged(false);
        setUser(null);
        setLoading(false);
        return;
      }
  
      // Fetch user profile from `profiles` table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*") // Fetch name and area_code
        .eq("id", authData.user.id) // Match user ID
        .single();
  
      if (profileError) console.error("Profile fetch error:", profileError);
  
      // Merge authentication data with profile details
      setUser({ ...authData.user, ...profile });
      setIsLogged(true);
      setLoading(false);
    };
  
    fetchUser();
  }, []);
  
  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
