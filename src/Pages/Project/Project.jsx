import React, { useEffect, useState } from 'react';
import { Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { useI18n } from '../../i18n/I18nProvider';

const ProjectTable = () => {
  const { user } = useAuthStore();
  const { locale, t } = useI18n();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 10;

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
    if (user?.id) fetchProjects();
  }, [user?.id, locale]);

  const formatNumber = (value) =>
    locale === "ar" ? Number(value).toLocaleString("ar-EG") : String(value);

  const handleDelete = async (projectId) => {
    const confirmDelete = window.confirm(t('project.deleteConfirm'));
    if (!confirmDelete) return;

    try {
      await api.delete(`/projects/${projectId}`);
      fetchProjects();
    } catch (error) {
      console.error('Delete project error:', error);
    }
  };

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen mt-16">
      <div className="w-full py-4">
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <div className="text-white bg-blue-500">
            <div className="grid grid-cols-6 gap-4 px-6 py-4 font-medium">
              <div>{t('project.sid')}</div>
              <div>{t('project.projectName')}</div>
              <div>{t('project.location')}</div>
              <div>{t('project.status')}</div>
              <div>{t('project.createdDate')}</div>
              <div>{t('project.action')}</div>
            </div>
          </div>

          <div className="bg-white">
            {loading && <div className="py-6 text-center text-gray-500">{t('project.loading')}</div>}

            {!loading && projects.length === 0 && (
              <div className="py-6 text-center text-gray-500">{t('project.empty')}</div>
            )}

            {!loading &&
              currentProjects.map((project, index) => (
                <div
                  key={project._id}
                  className="grid items-center grid-cols-6 gap-4 px-6 py-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                >
                  <div className="font-medium text-gray-700">
                    {formatNumber(indexOfFirstProject + index + 1)}
                  </div>

                  <div className="font-medium text-gray-900">{project.name}</div>
                  <div className="text-gray-700">{project.location}</div>
                  <div className="font-medium text-green-600">{t('project.active')}</div>
                  <div className="text-gray-700">
                    {new Date(project.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                  </div>

                  <div className="flex items-center gap-3">
                    <button onClick={() => handleDelete(project._id)} className="text-red-500 hover:text-red-700">
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

          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-2 py-4">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                {t('common.prev')}
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'text-white bg-blue-500' : ''}`}
                >
                  {formatNumber(i + 1)}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                {t('common.next')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectTable;
