import React, { useState, useEffect } from "react";
import supabase from "../../../SupabaseClient"; // Import your Supabase client
import Sidebar from "../../../components/Sidebar/Sidebar"; // Import the Sidebar component

const MissingPersonsReports = () => {
  const [reports, setReports] = useState([]);
  const supabaseProjectid = import.meta.env.VITE_SUPABASE_PROJECT_ID;



  // Fetch missing persons reports from Supabase
  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from("missing_person_reports")
        .select("*, profiles(name)"

        ); // Fetch all columns from the missing_person_reports table


      if (error) {
        console.error("Error fetching reports:", error);
      } else {
        setReports(data); // Set the fetched data in the state
        // console.log(data);
      }
    };

    fetchReports();
  }, []);

  // Function to format dates safely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date"; // Return "Invalid Date" if the date is invalid
    return new Intl.DateTimeFormat("en-US").format(date);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-secondary overflow-y-auto">
        <h1 className="text-4xl font-semibold text-white text-center mb-8">
          Missing Persons Reports
        </h1>

        {/* Table for displaying reports */}
        {/* Table for displaying reports */}
<div className="overflow-x-auto bg-white rounded shadow-md">
  <div className="w-full overflow-x-auto">
    <table className="table-auto min-w-max border-collapse border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          {[
            "ID",
            "Name",
            "Uploader_Name",
            "Age",
            "Identification Marks",
            "Time of Missing",
            "Place of Missing",
            "Photo URL",
            "Video URL",
            "Report Time",
            "status",
          ].map((header) => (
            <th
              key={header}
              className="text-left px-4 py-2 border border-gray-200 text-gray-800 font-medium text-sm"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {reports.length > 0 ? (
          reports.map((report) => (
            <tr key={report.id} className="even:bg-gray-50">
              <td className="px-4 py-2 border border-gray-200 text-sm">
                {report.id}
              </td>
              <td className="px-4 py-2 border border-gray-200 text-sm">
                {report.name}
              </td>
              <td className="px-4 py-2 border border-gray-200 text-sm">
                {report.profiles.name}
              </td>
              <td className="px-4 py-2 border border-gray-200 text-sm">
                {report.age}
              </td>
              <td className="px-4 py-2 border border-gray-200 text-sm">
                {report.identification_mark}
              </td>
              <td className="px-4 py-2 border border-gray-200 text-sm">
                {report.time_of_missing}
              </td>
              <td className="px-4 py-2 border border-gray-200 text-sm">
                {report.place_of_missing}
              </td>
              <td className="px-4 py-2 border border-gray-200 text-sm">
                <img
                  src={`https://${supabaseProjectid}.supabase.co/storage/v1/object/public/missing-person-photos/${report.photo_url}`}
                  alt={`Photo of ${report.name}`}
                  className="w-16 h-16 rounded-full"
                  onError={(e) => (e.target.src = "/default-profile.jpg")}
                />
              </td>
              <td className="px-4 py-2 border border-gray-200 text-sm">
                <div className="flex flex-col items-center">
                  <video
                    id={`video-${report.id}`}
                    src={`https://${supabaseProjectid}.supabase.co/storage/v1/object/public/missing-person-videos/${report.video_url}`}
                    className="w-32 h-32 rounded-md mb-2"
                  >
                    Your browser does not support the video tag.
                  </video>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const video = document.getElementById(
                          `video-${report.id}`
                        );
                        video.play();
                      }}
                      className="px-4 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                    >
                      Play
                    </button>
                    <button
                      onClick={() => {
                        const video = document.getElementById(
                          `video-${report.id}`
                        );
                        video.pause();
                        video.currentTime = 0; // Reset to the beginning
                      }}
                      className="px-4 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                      Stop
                    </button>
                  </div>
                </div>
              </td>
              <td className="px-4 py-2 border border-gray-200 text-sm">
                {formatDate(report.report_time)}
              </td>
              <td className="px-4 py-2 border border-gray-200 text-sm">
                {report.status}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="12"
              className="px-4 py-2 text-center text-gray-500"
            >
              No reports available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

      </div>
    </div>
  );
};

export default MissingPersonsReports;
