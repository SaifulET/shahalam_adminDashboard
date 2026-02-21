'use client';
import React, { useEffect, useState } from 'react';
import { Building2, Home, Building } from 'lucide-react';
import api from '../../lib/api'; // make sure this is your API instance
import { useAuthStore } from '../../store/authStore';

export default function ProjectsDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalProjects: 0,
    totalActiveEmployees: 0,
    recentProjects: []
  });
const {user}=useAuthStore()
const userId = user?.id;  
  // Icons array to assign icons to projects (keep static order)
  const icons = [Building2, Home, Building];

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await api.get(`/projects/dashboard/${userId}`);
        if (response.data.success) {
          setDashboardData({
            totalProjects: response.data.data.totalProjects,
            totalActiveEmployees: response.data.data.totalActiveEmployees,
            recentProjects: response.data.data.recentProjects
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    }

    fetchDashboard();
  }, [userId]);

  return (
    <div className="bg-gray-50 py-8">
      <div>
        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <h2 className="font-poppins font-bold text-[28px] leading-[34px] tracking-[0px] text-gray-900 mb-2">
                {dashboardData.totalProjects}
              </h2>
              <p className="text-gray-600 text-lg">Total Project</p>
            </div>
            <div className="text-center border-l border-gray-200">
              <h2 className="font-poppins font-bold text-[28px] leading-[34px] tracking-[0px] text-gray-900 mb-2">
                {dashboardData.totalActiveEmployees}
              </h2>
              <p className="text-gray-600 text-lg">Active Employee</p>
            </div>
          </div>
        </div>

        {/* Recent Projects Section */}
        <div>
          <h3 className="font-inter font-semibold text-[18px] leading-[28px] tracking-[-0.5px] text-gray-900 mb-6">
            Recent Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData.recentProjects.map((project, index) => {
              const IconComponent = icons[index % icons.length]; // cycle icons if less than projects
              const bgColors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100'];
              const iconColors = ['text-blue-600', 'text-green-600', 'text-purple-600'];

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className={`${bgColors[index % bgColors.length]} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
                    <IconComponent className={`w-8 h-8 ${iconColors[index % iconColors.length]}`} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h4>
                  <p className="text-gray-500">{project.unitCount} properties</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
