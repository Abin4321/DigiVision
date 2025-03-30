import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const activeStyle = "bg-gray-700 text-white font-semibold";
  const [trackingMode, setTrackingMode] = useState("criminal");

  useEffect(() => {
    const savedMode = localStorage.getItem("trackingMode") || "criminal";
    setTrackingMode(savedMode);
  }, []);

  return (
  <aside
    className={`${
      trackingMode === "criminal" ? "bg-black" : "bg-gray-800"
    } text-white w-64 flex flex-col h-screen border-r border-gray-400`}
  >

      <div className="p-6 font-bold text-xl border-b border-gray-200">Admin Dashboard</div>
      <nav className="flex-1">
        <ul className="p-4 space-y-4">
          {trackingMode === "missing" ? (
            <>
              <li>
                <NavLink
                  to="/home"
                  className={({ isActive }) =>
                    `block p-2 rounded hover:bg-gray-700 ${isActive ? activeStyle : ""}`
                  }
                >
                  Home
                </NavLink>
              </li>
              {/* <li>
                <NavLink
                  to="/quick-search"
                  className={({ isActive }) =>
                    `block p-2 rounded hover:bg-gray-700 ${isActive ? activeStyle : ""}`
                  }
                >
                  Upload Data to Server
                </NavLink>
              </li> */}
              <li>
                <NavLink
                  to="/users-list"
                  className={({ isActive }) =>
                    `block p-2 rounded hover:bg-gray-700 ${isActive ? activeStyle : ""}`
                  }
                >
                  Users List
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/network-list"
                  className={({ isActive }) =>
                    `block p-2 rounded hover:bg-gray-700 ${isActive ? activeStyle : ""}`
                  }
                >
                  Network List
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/reports"
                  className={({ isActive }) =>
                    `block p-2 rounded hover:bg-gray-700 ${isActive ? activeStyle : ""}`
                  }
                >
                  Missing Person Reports
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/notification"
                  className={({ isActive }) =>
                    `block p-2 rounded hover:bg-gray-700 ${isActive ? activeStyle : ""}`
                  }
                >
                  Notifications
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/updates-form"
                  className={({ isActive }) =>
                    `block p-2 rounded hover:bg-gray-700 ${isActive ? activeStyle : ""}`
                  }
                >
                  Important Updates Form
                </NavLink>
              </li>
            </>
          ) : (
            <>
             <li>
                <NavLink
                  to="/home-criminal"
                  className={({ isActive }) =>
                    `block p-2 rounded hover:bg-gray-700 ${isActive ? activeStyle : ""}`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/camera"
                  className={({ isActive }) =>
                    `block p-2 rounded hover:bg-gray-700 ${isActive ? activeStyle : ""}`
                  }
                >
                  Check Camera
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/upload-criminaldb"
                  className={({ isActive }) =>
                    `block p-2 rounded hover:bg-gray-700 ${isActive ? activeStyle : ""}`
                  }
                >
                  Upload CriminalDB
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/criminaldb"
                  className={({ isActive }) =>
                    `block p-2 rounded hover:bg-gray-700 ${isActive ? activeStyle : ""}`
                  }
                >
                  CriminalDB List
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/criminal-notification"
                  className={({ isActive }) =>
                    `block p-2 rounded hover:bg-gray-700 ${isActive ? activeStyle : ""}`
                  }
                >
                  Notifications
                </NavLink>
              </li>
              {/* <li>
                <NavLink
                  to="/criminal-report"
                  className={({ isActive }) =>
                    `block p-2 rounded hover:bg-gray-700 ${isActive ? activeStyle : ""}`
                  }
                >
                  Report
                </NavLink>
              </li> */}
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
