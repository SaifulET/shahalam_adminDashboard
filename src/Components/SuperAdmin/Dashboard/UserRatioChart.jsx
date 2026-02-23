import React, { useState, useEffect } from 'react';
import { Building2, Home, Building } from 'lucide-react';
import api from '../../../lib/api';


export default function ProjectsDashboard() {
  const [stats, setStats] = useState({
    totalAdmins: 0,
    totalActiveAdmins: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/admins/get/statistics");
      
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch statistics");
      console.error("Error fetching statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="">
        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <h2 className="font-poppins font-bold text-[28px] leading-[34px] tracking-[0px] text-gray-900 mb-2">
                  {stats.totalAdmins}
                </h2>
                <p className="text-gray-600 text-lg">Total Companies</p>
              </div>
              <div className="text-center border-l border-gray-200">
                <h2 className="font-poppins font-bold text-[28px] leading-[34px] tracking-[0px] text-gray-900 mb-2">
                  {stats.totalActiveAdmins}
                </h2>
                <p className="text-gray-600 text-lg">Active Admin</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}