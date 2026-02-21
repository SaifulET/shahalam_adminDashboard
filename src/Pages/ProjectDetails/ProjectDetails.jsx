import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../lib/api"; // adjust path if needed

const BuildingFloorLayout = () => {

  const  projectId = useParams().id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [project, setProject] = useState(null);
  const [floors, setFloors] = useState([]);
  const [models, setModels] = useState([]);

  const [selectedFloor, setSelectedFloor] = useState(null);

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${projectId}`);

      const { project, floors, models, floorWithUnitCounts } = res.data.data;

      setProject(project);
      setModels(models);

      setFloors(floorWithUnitCounts || floors);

      if (floorWithUnitCounts?.length) {
        setSelectedFloor(floorWithUnitCounts[0]._id);
      }

    } catch (err) {
      setError("Failed to load project data");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-800";
      case "reserved":
        return "bg-yellow-500";
      case "sold":
        return "bg-red-900";
      default:
        return "bg-gray-300";
    }
  };

  if (loading) return <p className="text-center mt-32">Loading...</p>;
  if (error) return <p className="text-center mt-32 text-red-600">{error}</p>;

  const selectedFloorData = floors.find(f => f._id === selectedFloor);

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-20">
      <div className="border-2 border-gray-300 rounded-lg p-6 space-y-6">

        {/* Header Card */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex">
            <div className="w-80 h-52 flex-shrink-0">
              <img
                src={project?.image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400"}
                alt="Building"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 p-8 flex gap-16">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <p className="text-base font-semibold text-gray-900 mb-6">
                  {project?.location}
                </p>

                <p className="text-xs text-gray-500 mb-1">Created Date</p>
                <p className="text-base text-gray-900">
                  {new Date(project?.createdAt).toDateString()}
                </p>
              </div>

              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Project Name</p>
                <p className="text-base font-semibold text-gray-900 mb-6">
                  {project?.name}
                </p>

                <p className="text-xs text-gray-500 mb-1">Total Floors</p>
                <p className="text-base text-gray-900">
                  {floors.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Units & Floor Layout */}
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="text-xl font-medium text-gray-900 mb-8">
            Units & Floor Layout
          </h2>

          <div className="flex gap-6">

            {/* Floor List */}
            <div className="flex-shrink-0 w-56">
              {floors.map((floor, index) => (
                <div key={floor._id}>
                  <button
                    onClick={() => setSelectedFloor(floor._id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center py-4 justify-between">
                      <span
                        className={`text-sm ${
                          selectedFloor === floor._id
                            ? "text-blue-600 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {floor.name}
                      </span>

                      <span
                        className={`text-sm ${
                          selectedFloor === floor._id
                            ? "text-blue-600 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {floor.unitCount || 0} units
                      </span>
                    </div>
                  </button>

                  {index < floors.length - 1 && (
                    <div className="border-b border-gray-100"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Units Grid */}
            <div className="flex-1 border border-gray-200 rounded-lg p-6 bg-gray-50">
              {selectedFloorData?.units?.length ? (
                <div className="grid grid-cols-4 gap-3">
                  {selectedFloorData.units.map((unit) => (
                    <div
                      key={unit._id}
                      className={`${getStatusColor(
                        unit.status
                      )} text-white rounded-lg py-7 px-4 text-center font-medium text-sm`}
                    >
                      {unit.unitNumber || unit.name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-12">
                  No units found for this floor
                </p>
              )}

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

        {/* =================== MODEL SECTION =================== */}

        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="text-xl font-medium text-gray-900 mb-6">
            Project Models
          </h2>

          {models.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((model) => (
                <div
                  key={model._id}
                  className="border border-gray-200 rounded-lg p-5 bg-gray-50 hover:shadow transition"
                >
                  <p className="text-sm text-gray-500 mb-1">Model Name</p>
                  <p className="font-semibold text-gray-900 mb-3">
                    {model.name}
                  </p>

                  <p className="text-sm text-gray-500 mb-1">Area</p>
                  <p className="text-gray-800 mb-3">{model.area} sqft</p>

                  <p className="text-sm text-gray-500 mb-1">Face</p>
                  <p className="text-gray-800">{model.face}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No models available</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default BuildingFloorLayout;