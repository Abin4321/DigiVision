import Home from "./pages/missing_person_pages/home/Home";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import UsersList from "./pages/missing_person_pages/Users/UsersList";
import NetworkList from "./pages/missing_person_pages/Network/NetworkList";
import ImportantUpdatesForm from "./pages/missing_person_pages/ImportantUpdatesForm/ImportantUpdatesForm";
import QuickSearch from "./pages/QuickSearch/QuickSearch";
import MissingPersonsReports from "./pages/missing_person_pages/MissingPersonsReports/MissingPersonsReports";
import Notification from "./pages/missing_person_pages/Notification/Notification";
import ViewProfile from "./pages/missing_person_pages/Users/ViewProfile";
import Camera from "./components/camera/Camera";
import UploadCriminalDb from "./pages/criminal_pages/UploadCriminalDb";
import CriminalDbList from "./pages/criminal_pages/CriminalDbList";
import HomeCriminal from "./pages/criminal_pages/home/HomeCriminal";
import CriminalNotification from "./pages/criminal_pages/CriminalNotification";
import CriminalReport from "./pages/criminal_pages/report/CriminalReport";
import ReportCamWise from "./pages/criminal_pages/report/ReportCamWise";
import ReportCriminalWise from "./pages/criminal_pages/report/ReportCriminalWise";


const App = () => {
  return (
    <div>
      <Router>
       
        <Routes>
          <Route index path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/home-criminal" element={<HomeCriminal />} />
          <Route path="/network-list" element={<NetworkList />} />
          <Route path="/users-list"  element={<UsersList />} />
          <Route path="/updates-form"  element={<ImportantUpdatesForm />} />
          <Route path="/quick-search"  element={<QuickSearch />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/reports" element={<MissingPersonsReports />} />
          <Route path="/camera" element={<Camera />} />
          <Route path="/profile/:userId" element={<ViewProfile />} />
          <Route path="/upload-criminaldb" element={<UploadCriminalDb />} />
          <Route path="/criminaldb" element={<CriminalDbList />} />
          <Route path="/criminal-notification" element={<CriminalNotification />} />
          
          <Route path="/criminal-report" element={<CriminalReport />} />
          <Route path="/criminal-report-camwise" element={<ReportCamWise />} />
          <Route path="/criminal-report-criminalwise" element={<ReportCriminalWise />} />
          

        </Routes>
      </Router>
    </div>
  );
};

export default App;
