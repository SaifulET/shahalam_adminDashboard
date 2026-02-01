import React from 'react';
import { Building2, Home, Building } from 'lucide-react';

export default function ProjectsDashboard() {
  const projects = [
    {
      id: 1,
      name: 'Downtown Plaza',
      properties: 24,
      icon: Building2,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 2,
      name: 'Sunset Residences',
      properties: 18,
      icon: Home,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      id: 3,
      name: 'Metro Heights',
      properties: 31,
      icon: Building,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className=" bg-gray-50 py-8">
      <div className="">
        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <h2 className="font-poppins font-bold text-[28px] leading-[34px] tracking-[0px] text-gray-900 mb-2">110</h2>
              <p className="text-gray-600 text-lg">Total Project</p>
            </div>
            <div className="text-center border-l border-gray-200">
              <h2 className="font-poppins font-bold text-[28px] leading-[34px] tracking-[0px] text-gray-900 mb-2">10</h2>
              <p className="text-gray-600 text-lg">Active Employee</p>
            </div>
          </div>
        </div>

        {/* Recent Projects Section */}
        <div>
          <h3 className="font-inter font-semibold text-[18px] leading-[28px] tracking-[-0.5px] text-gray-900 mb-6">Recent Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const IconComponent = project.icon;
              return (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className={`${project.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
                    <IconComponent className={`w-8 h-8 ${project.iconColor}`} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h4>
                  <p className="text-gray-500">{project.properties} properties</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}