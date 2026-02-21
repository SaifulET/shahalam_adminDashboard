import React from 'react';
import { Building2, Home, Building } from 'lucide-react';

export default function ProjectsDashboard() {
  

  return (
    <div className=" bg-gray-50 ">
      <div className="">
        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <h2 className="font-poppins font-bold text-[28px] leading-[34px] tracking-[0px] text-gray-900 mb-2">110</h2>
              <p className="text-gray-600 text-lg">Total Companies</p>
            </div>
            <div className="text-center border-l border-gray-200">
              <h2 className="font-poppins font-bold text-[28px] leading-[34px] tracking-[0px] text-gray-900 mb-2">10</h2>
              <p className="text-gray-600 text-lg">Active Admin</p>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
}