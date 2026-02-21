import React, { useEffect, useState } from 'react';
import { Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from "../../lib/api"
import { useAuthStore } from '../../store/authStore';
const ProjectTable = () => {
  const {user}= useAuthStore();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/my-projects/${user?.id}`);
      setProjects(res.data.projects || []);
    } catch (error) {
      console.error('Fetch projects error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchProjects();
    }
  }, [user?.id]);

  const handleDelete = async (projectId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this project?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/projects/${projectId}`);
      fetchProjects(); // reload after delete
    } catch (error) {
      console.error('Delete project error:', error);
    }
  };

  return (
    <div className="min-h-screen mt-16">
      <div className="w-full py-4">
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
            {loading && (
              <div className="text-center py-6 text-gray-500">
                Loading projects...
              </div>
            )}

            {!loading && projects.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No projects found.
              </div>
            )}

            {projects.map((project, index) => (
              <div
                key={project._id}
                className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-200 last:border-b-0 items-center hover:bg-gray-50"
              >
                <div className="text-gray-700 font-medium">
                  {index + 1}
                </div>

                <div className="text-gray-900 font-medium">
                  {project.name}
                </div>

                <div className="text-gray-700">
                  {project.location}
                </div>

                <div className="text-green-600 font-medium">
                  Active
                </div>

                <div className="text-gray-700">
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <Link to={`/project/${project._id}`}>
                    <button className="text-blue-500 hover:text-blue-700">
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