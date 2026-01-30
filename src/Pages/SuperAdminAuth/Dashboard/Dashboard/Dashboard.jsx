import SuperAdminRecentUsersTable from "../../../../Components/SuperAdmin/Dashboard/RecentUsersTable";
import ProjectsDashboard from "../../../../Components/SuperAdmin/Dashboard/UserRatioChart";


const AdminDashboard = () => {
  return (
    <div className="min-h-screen ">
      <div className="p-4 mx-auto mt-16 ">
        <div>
            <ProjectsDashboard/>
          </div>
          <div>
            <SuperAdminRecentUsersTable/>
          </div>
        </div>
      </div>
   
  );
};

export default AdminDashboard;
