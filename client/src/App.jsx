import React, { useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
//import "./App.css";

import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import UserRegister from "./components/UserRegister";
import UserHome from "./components/UserHome";
import UserProfile from './components/UserProfile';
import EditUserProfile from './components/EditUserProfile';
import Index from './components/Index';
import AdminHome from './components/AdminHome';
import ViewUserAdmin from './components/ViewUserAdmin';
import PostComplaint from './components/PostComplaint';
import ResetPassword from './components/ResetPassword';
import UserLogin from "./components/UserLogin";
import PostOfficer from './components/PostOfficer';
import UpdateComplaint from './components/UpdateComplaint';
import FeedbackUser from './components/FeedbackUser';
import OfficerLogin from './components/OfficerLogin';
import OfficerHome from './components/OfficerHome';
import UpdateStatusOfficer from './components/UpdateStatusOfficer';
import Customers from './components/Customers';
import ViewFeedback from './components/ViewFeedback';
import ViewComplaintReport from './components/ViewComplaintReport';
import StatusCount from './components/StatusCount';
import ViewOfficerAdmin from './components/ViewOfficerAdmin';
import OfficerProfile from './components/OfficerProfile';
import ViewComplaintUser from './components/ViewComplaintUser';
import ViewComplaintOfficer from './components/ViewComplaintOfficer';
import MyFeedback from './components/MyFeedback';
import AdminProfile from './components/AdminProfile';
import PhotoUser from './components/PhotoUser';
import ViewComplaintReportOfficer from './components/ViewComplaintReportOfficer';
import UpdateOfficerAdmin from './components/UpdateOfficerAdmin';
import UpdateAdminProfile from './components/UpdateAdminProfile';
import PostLocation from './components/PostLocation';
import UpdateLocationAdmin from './components/UpdateLocationAdmin';
import AdvocateRegister from './components/AdvocateRegister';
import AdvocateLogin from './components/AdvocateLogin';
import AdvocateHome from './components/AdvocateHome';
import PostAdvocate from './components/PostAdvocate';
import UpdateBusiness from './components/UpdateBusiness';
import ViewAdvocateAdmin from './components/ViewAdvocateAdmin';
import UpdateAdvocateAdmin from './components/UpdateAdvocateAdmin';
import ViewAdvocate from './components/ViewAdvocate';
import ViewAdvocateDetails from './components/ViewAdvocateDetails';
import ViewMyAdvocate from './components/ViewMyAdvocate';
import ResetPasswordAdvocate from './components/ResetPasswordAdvocate';
import EditOfficerProfile from './components/EditOfficerProfile';
import AiAssistant from './components/AiAssistant';
import CourtLogin from './components/CourtLogin';
import CourtRegister from './components/CourtRegister';
import CourtHome from './components/CourtHome';
import ManageFIR from './components/ManageFIR';
import ManageCourtCases from './components/ManageCourtCases';
import CourtCaseDetails from './components/CourtCaseDetails';
import ManageHearings from './components/ManageHearings.jsx';
import ManageJudgments from './components/ManageJudgments.jsx';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<Index />} />
          <Route path='/view_user_admin' element={<ViewUserAdmin />} />
          <Route path='/user_profile' element={<UserProfile />} />
          <Route path='/edit_user_profile/:id' element={<EditUserProfile />} />
          <Route path='/user_home' element={<UserHome />} />
          <Route path='/user_register' element={<UserRegister />} />
          <Route path='/admin_login' element={<AdminLogin />} />
          <Route path='/admin_home' element={<AdminHome />} />
          <Route path='/post_complaint' element={<PostComplaint />} />
          <Route path='/reset_password' element={<ResetPassword />} />
          <Route path='/reset_password_advocate' element={<ResetPasswordAdvocate />} />
          <Route path='/user_auth' element={<UserLogin />} />
          <Route path='/post_officer' element={<PostOfficer />} />
          <Route path='/update_complaint/:id' element={<UpdateComplaint />} />
          <Route path='/feedback_user' element={<FeedbackUser />} />
          <Route path='/officer_login' element={<OfficerLogin />} />
          <Route path='/officer_home' element={<OfficerHome />} />
          <Route path='/view_complaint_officer' element={<ViewComplaintOfficer />} />
          <Route path='/update_status_officer/:id' element={<UpdateStatusOfficer />} />
          <Route path='/customers' element={<Customers />} />
          <Route path='/view_feedback' element={<ViewFeedback />} />
          <Route path='/view_complaint_report' element={<ViewComplaintReport />} />
          <Route path='/status_count' element={<StatusCount />} />
          <Route path='/view_officer_admin' element={<ViewOfficerAdmin />} />
          <Route path='/officer_profile' element={<OfficerProfile />} />
          <Route path='/edit_officer_profile/:id' element={<EditOfficerProfile />} />
          <Route path='/view_complaint_user' element={<ViewComplaintUser />} />
          <Route path='/my_feedback' element={<MyFeedback />} />
          <Route path='/admin_profile' element={<AdminProfile />} />
          <Route path='/photo_user/:id' element={<PhotoUser />} />
          <Route path='/view_complaint_report_officer' element={<ViewComplaintReportOfficer />} />
          <Route path='/update_officer_admin/:id' element={<UpdateOfficerAdmin />} />
          <Route path='/update_admin_profile/:id' element={<UpdateAdminProfile />} />
          <Route path='/post_location' element={<PostLocation />} />
          <Route path='/update_location_admin/:id' element={<UpdateLocationAdmin />} />
          <Route path='/advocate_register' element={<AdvocateRegister />} />
          <Route path='/advocate_auth' element={<AdvocateLogin />} />
          <Route path='/advocate_home' element={<AdvocateHome />} />
          <Route path='/post_advocate' element={<PostAdvocate />} />
          <Route path='/view_my_advocate' element={<ViewMyAdvocate />} />
          <Route path='/update_business/:id' element={<UpdateBusiness />} />
          <Route path='/view_advocate' element={<ViewAdvocate />} />
          <Route path='/view_advocate_details/:id' element={<ViewAdvocateDetails />} />
          <Route path='/view_advocate_admin' element={<ViewAdvocateAdmin />} />
          <Route path='/update_advocate_admin/:id' element={<UpdateAdvocateAdmin />} />
          <Route path='/ai_assistant' element={<AiAssistant />} />
          <Route path='/court_auth' element={<CourtLogin />} />
          <Route path='/court_register' element={<CourtRegister />} />
          <Route path='/court_home' element={<CourtHome />} />
          <Route path='/manage_firs' element={<ManageFIR />} />
          <Route path='/manage_court_cases' element={<ManageCourtCases />} />
          <Route path='/court_case/:id' element={<CourtCaseDetails />} />
          <Route path='/manage_hearings' element={<ManageHearings />} />
          <Route path='/manage_judgments' element={<ManageJudgments />} />









        </Routes>
      </BrowserRouter>
    </div>
  );
}



export default App;

{/*
unused 
import Viewlist from "./assets/unused/Viewlist";
import Edit from "./assets/unused/Edit";
import CreateBusiness from "./assets/unused/CreateBusiness";
import ViewAxios from "./assets/unused/ViewAxios";
import advocateLogin from './components/AdvocateLogin';
import PostAdvocate from './components/PostAdvocate';

<Route path='/viewtest' element={<Viewlist />} />            
<Route path='/axios' element={<ViewAxios />} />
<Route path='/create' element={<CreateBusiness />} />          
<Route path='/edit/:id' element={<Edit />} />

*/}