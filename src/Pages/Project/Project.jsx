import React from 'react';
import { Building2, ShoppingBag, Warehouse, Building, Store, Factory, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';


const ProjectTable = () => {
  const projects = [
    {
      id: '01',
      name: 'Sunset Boulevard',
      location: 'Los Angeles',
      status: 'Active',
      createdDate: '02-24-2024',
      icon: Building2,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: '01',
      name: 'Downtown Center',
      location: 'Oakland',
      status: 'Active',
      createdDate: '02-24-2024',
      icon: ShoppingBag,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      id: '01',
      name: 'Industrial city Park',
      location: 'San Diego',
      status: 'Active',
      createdDate: '02-24-2024',
      icon: Warehouse,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      id: '01',
      name: 'Corporate Building',
      location: 'San Jose',
      status: 'Active',
      createdDate: '02-24-2024',
      icon: Building,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: '01',
      name: 'Rental Plaza Park',
      location: 'Frensо',
      status: 'Active',
      createdDate: '02-24-2024',
      icon: Store,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      id: '01',
      name: 'Manufacturing',
      location: 'Riverside',
      status: 'Active',
      createdDate: '02-24-2024',
      icon: Factory,
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600'
    }
  ];

  return (
    <div className='min-h-screen mt-16'>
        <div className="w-full  p-4">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 text-white">
          <div className="grid grid-cols-6 gap-4 px-6 py-4 font-medium">
            <div>S.ID</div>
            <div>Project Name</div>
            <div>Location</div>
            <div>Status</div>
            <div>Created Date</div>
            <div>Action</div>
          </div>
        </div>

        {/* Body */}
        <div className="bg-white">
          {projects.map((project, index) => (
            <div
              key={index}
              className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-200 last:border-b-0 items-center hover:bg-gray-50 transition-colors"
            >
              <div className="text-gray-700 font-medium">{project.id}</div>
              
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${project.iconBg} rounded-lg flex items-center justify-center`}>
                  <project.icon className={`w-5 h-5 ${project.iconColor}`} />
                </div>
                <span className="text-gray-900 font-medium">{project.name}</span>
              </div>
              
              <div className="text-gray-700">{project.location}</div>
              
              <div className="text-gray-700">{project.status}</div>
              
              <div className="text-gray-700">{project.createdDate}</div>
              
              <div className="flex items-center gap-3">
                <button className="text-red-500 hover:text-red-700 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
                <Link to={`/project/${project.id}`}>
                <button  className="text-blue-500 hover:text-blue-700 transition-colors">
                  <Eye className="w-5 h-5" />
                </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
    
  );
};

export default ProjectTable;