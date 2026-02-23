import { useState, useEffect } from "react";
import { Search, Eye, ChevronLeft, ChevronRight, X } from "lucide-react";
import { VscDebugRestart } from "react-icons/vsc";
import api from "../../../lib/api";


const AdminBlockedList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToUnblock, setUserToUnblock] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [viewUserLoading, setViewUserLoading] = useState(false);

  const usersPerPage = 8;

  // Fetch blocked admins on component mount and when page changes
  useEffect(() => {
    fetchBlockedAdmins();
  }, [currentPage]);

  const fetchBlockedAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/admins/blocked", {
        params: {
          page: currentPage,
          limit: usersPerPage,
          search: searchTerm // Add search parameter if your API supports it
        }
      });
      
      if (response.data.success) {
        setUsers(response.data.data);
        // If your API returns total count, set it here
        // setTotalUsers(response.data.total)
        setTotalUsers(response.data.data.length); // Temporary, replace with actual total from API
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch blocked admins");
      console.error("Error fetching blocked admins:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        setCurrentPage(1); // Reset to first page on search
        fetchBlockedAdmins();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleViewUser = async (user) => {
    setViewUserLoading(true);
    try {
      const response = await api.get(`/admins/${user._id}`);
      if (response.data.success) {
        setSelectedUser(response.data.data);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      alert("Failed to fetch user details");
    } finally {
      setViewUserLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // OPEN UNBLOCK CONFIRMATION MODAL
  const handleUnblockUser = (user) => {
    setUserToUnblock(user);
    setIsConfirmModalOpen(true);
  };

  // CONFIRM UNBLOCK
  const handleConfirmUnblock = async () => {
    try {
      const response = await api.patch(`/admins/${userToUnblock._id}`, {
        status: "active"
      });
      
      if (response.data.success) {
        // Refresh the list
        fetchBlockedAdmins();
        setIsConfirmModalOpen(false);
        setUserToUnblock(null);
        
        // Close the view modal if it's open
        if (isModalOpen) {
          setIsModalOpen(false);
          setSelectedUser(null);
        }
      }
    } catch (err) {
      console.error("Error unblocking user:", err);
      alert(err.response?.data?.message || "Failed to unblock user");
    }
  };

  // CANCEL UNBLOCK
  const handleCancelUnblock = () => {
    setIsConfirmModalOpen(false);
    setUserToUnblock(null);
  };

  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const renderPaginationNumbers = () => {
    const pages = [];
    pages.push(1);

    if (currentPage > 3) pages.push("...");

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("...");

    if (totalPages > 1 && !pages.includes(totalPages)) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div
        style={{ boxShadow: "0px 1px 6px rgba(0,0,0,0.24)" }}
        className="mx-auto mt-16"
      >
        {/* Header */}
        <div className="px-6 py-4 mb-6 rounded-tl-lg rounded-tr-lg bg-[#71ABE0]">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">Admin Blocked List</h1>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Search User"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 py-2 pl-10 pr-4 text-sm bg-white border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="py-20 text-center text-red-500">
              {error}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">
                        S.ID
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">
                        Full Name
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">
                        Email
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">
                        Joined Date
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.length > 0 ? (
                      users.map((user, index) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {String(startIndex + index + 1).padStart(2, "0")}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <img 
                                src={user.profileImage || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000"} 
                                className="w-8 h-8 rounded-full" 
                                alt={user.name}
                              />
                              <span className="ml-3 text-sm font-medium text-gray-900">
                                {user.name}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-900">
                            {user.email}
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-900">
                            {formatDate(user.joinedDate)}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {/* UNBLOCK BUTTON */}
                              <button
                                onClick={() => handleUnblockUser(user)}
                                className="p-1 text-[#71ABE0] rounded-full hover:bg-blue-50"
                                title="Unblock user"
                              >
                                <VscDebugRestart className="w-4 h-4" />
                              </button>

                              {/* VIEW BUTTON */}
                              <button
                                onClick={() => handleViewUser(user)}
                                className="p-1 text-[#71ABE0] rounded-full hover:bg-blue-50"
                                disabled={viewUserLoading}
                                title="View details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-20 text-center text-gray-500">
                          No blocked admins found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <span className="text-sm text-gray-700">
                  SHOWING {startIndex + 1}-
                  {Math.min(startIndex + usersPerPage, totalUsers)} OF {totalUsers}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-400 rounded-lg disabled:opacity-50 hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {renderPaginationNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        typeof page === "number" && handlePageChange(page)
                      }
                      disabled={page === "..."}
                      className={`min-w-[32px] px-3 py-1 text-sm rounded-lg ${
                        page === currentPage
                          ? "bg-[#71ABE0] text-white"
                          : page === "..."
                          ? "text-gray-400 cursor-default"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-400 rounded-lg disabled:opacity-50 hover:bg-gray-100"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* VIEW USER MODAL */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="flex-1 text-2xl font-semibold text-center text-[#71ABE0]">
                User Details
              </h2>

              <button onClick={handleCloseModal} className="ml-4 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <img 
                  src={selectedUser.profileImage || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000"} 
                  className="w-16 h-16 mr-4 rounded-full" 
                  alt={selectedUser.name}
                />
                <h3 className="text-xl font-medium text-[#71ABE0]">
                  {selectedUser.name}
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Name</span>
                  <span>{selectedUser.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Email</span>
                  <span>{selectedUser.email}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Role</span>
                  <span className="capitalize">{selectedUser.role}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Status</span>
                  <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                    {selectedUser.status}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Joined Date</span>
                  <span>{formatDate(selectedUser.joinedDate)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 bg-white border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleCloseModal();
                  handleUnblockUser(selectedUser);
                }}
                className="flex-1 px-4 py-2 text-white bg-[#71ABE0] rounded-lg"
              >
                Unblock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNBLOCK CONFIRMATION MODAL */}
      {isConfirmModalOpen && userToUnblock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="flex-1 text-2xl font-semibold text-center text-[#71ABE0]">
                Confirm Unblock
              </h2>

              <button onClick={handleCancelUnblock} className="ml-4 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <img 
                  src={userToUnblock.profileImage || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000"} 
                  className="w-16 h-16 mr-4 rounded-full" 
                  alt={userToUnblock.name}
                />
                <h3 className="text-xl font-medium text-[#71ABE0]">
                  {userToUnblock.name}
                </h3>
              </div>

              <p className="mb-4 text-center text-gray-600">
                Are you sure you want to unblock this admin?
              </p>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Name</span>
                  <span>{userToUnblock.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Email</span>
                  <span>{userToUnblock.email}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Joined Date</span>
                  <span>{formatDate(userToUnblock.joinedDate)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t">
              <button
                onClick={handleCancelUnblock}
                className="flex-1 px-4 py-2 bg-white border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmUnblock}
                className="flex-1 px-4 py-2 text-white bg-[#71ABE0] rounded-lg"
              >
                Yes, Unblock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlockedList;