import React, { useState } from 'react';

const BuildingFloorLayout = () => {
  const [selectedFloor, setSelectedFloor] = useState(12);

  const buildingInfo = {
    location: "Downtown District, NYC",
    folderName: "SKL-RES-2024",
    createdDate: "March 15, 2024",
    totalFloors: "12 Floors"
  };

  const floorsData = {
    12: [
      { id: 801, status: 'available' },
      { id: 802, status: 'reserved' },
      { id: 803, status: 'sold' },
      { id: 804, status: 'available' },
      { id: 805, status: 'available' },
      { id: 806, status: 'sold' },
      { id: 807, status: 'available' },
      { id: 808, status: 'available' }
    ],
    11: [
      { id: 701, status: 'available' },
      { id: 702, status: 'available' },
      { id: 703, status: 'sold' },
      { id: 704, status: 'available' },
      { id: 705, status: 'reserved' },
      { id: 706, status: 'available' },
      { id: 707, status: 'sold' },
      { id: 708, status: 'available' }
    ],
    10: [
      { id: 601, status: 'sold' },
      { id: 602, status: 'available' },
      { id: 603, status: 'available' },
      { id: 604, status: 'reserved' },
      { id: 605, status: 'available' },
      { id: 606, status: 'available' },
      { id: 607, status: 'available' },
      { id: 608, status: 'sold' }
    ],
    9: [
      { id: 501, status: 'available' },
      { id: 502, status: 'sold' },
      { id: 503, status: 'available' },
      { id: 504, status: 'available' },
      { id: 505, status: 'available' },
      { id: 506, status: 'reserved' },
      { id: 507, status: 'available' },
   
    ],
    8: [
      { id: 401, status: 'available' },
      { id: 402, status: 'available' },
      { id: 403, status: 'available' },
      { id: 404, status: 'sold' },
      { id: 405, status: 'available' },
      { id: 406, status: 'available' },
      { id: 407, status: 'reserved' },
      { id: 408, status: 'available' }
    ]
  };

  const floors = [
    { floor: 12, units: 8 },
    { floor: 11, units: 8 },
    { floor: 10, units: 8 },
    { floor: 9, units: 7 },
    { floor: 8, units: 8 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-800';
      case 'reserved':
        return 'bg-yellow-500';
      case 'sold':
        return 'bg-red-900';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-20 ">
      <div className=" border-2 border-gray-300 rounded-lg  p-6 space-y-6 ">
        {/* Header Card */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex">
            {/* Building Image */}
            <div className="w-80 h-52 flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"
                alt="Modern Building"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Building Info */}
            <div className="flex-1 p-8 flex gap-16">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <p className="text-base font-semibold text-gray-900 mb-6">{buildingInfo.location}</p>
                <p className="text-xs text-gray-500 mb-1">Created Date</p>
                <p className="text-base text-gray-900">{buildingInfo.createdDate}</p>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Folder Name</p>
                <p className="text-base font-semibold text-gray-900 mb-6">{buildingInfo.folderName}</p>
                <p className="text-xs text-gray-500 mb-1">Total Floors</p>
                <p className="text-base text-gray-900">{buildingInfo.totalFloors}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Units & Floor Layout */}
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="text-xl font-medium text-gray-900 mb-8">Units & Floor Layout</h2>
          
          <div className="flex gap-6">
            {/* Floor List - Left Side */}
            <div className="flex-shrink-0">
              {floors.map((floorData, index) => (
                <div key={floorData.floor}>
                  <button 
                    onClick={() => setSelectedFloor(floorData.floor)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center py-4 gap-12">
                      {/* Floor Label */}
                      <div className="w-16">
                        <span className={`text-sm ${selectedFloor === floorData.floor ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                          Floor {floorData.floor}
                        </span>
                      </div>

                      {/* Units Count */}
                      <div className="w-16">
                        <span className={`text-sm ${selectedFloor === floorData.floor ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>{floorData.units} units</span>
                      </div>
                    </div>
                  </button>
                  {index < floors.length - 1 && <div className="border-b border-gray-100"></div>}
                </div>
              ))}
            </div>

            {/* Unit Grid - Right Side in bordered box */}
            <div className="flex-1 border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="grid grid-cols-4 gap-3">
                {floorsData[selectedFloor].map((unit) => (
                  <div
                    key={unit.id}
                    className={`${getStatusColor(unit.status)} text-white rounded-lg py-7 px-4 text-center font-medium text-sm`}
                  >
                    {unit.id}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-8 pt-6 border-t border-gray-300">
                <div className="flex items-center justify-center gap-12">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-800 rounded"></div>
                    <span className="text-sm text-gray-700">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-yellow-500 rounded"></div>
                    <span className="text-sm text-gray-700">Reserved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-red-900 rounded"></div>
                    <span className="text-sm text-gray-700">Sold</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingFloorLayout;