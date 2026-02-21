import RecentUsersTable from "../../Components/Dashboard/RecentUsersTable";
import ProjectsDashboard from "../../Components/Dashboard/UserRatioChart";

const Dashboard = () => {
  return (
    <div className="min-h-screen ">
      <div className=" mx-auto mt-16 ">
        <div>
            <ProjectsDashboard/>
          </div>
          <div>
            <RecentUsersTable />
          </div>
        </div>
      </div>
   
  );
};

export default Dashboard;
