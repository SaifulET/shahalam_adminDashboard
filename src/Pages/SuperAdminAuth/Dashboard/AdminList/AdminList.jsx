import { useState, useEffect } from "react"
import { Search, Eye, Ban, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Link } from "react-router-dom"
import api from "../../../../lib/api"


const AdminList = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [userToBlock, setUserToBlock] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totalUsers, setTotalUsers] = useState(0)
  const [viewUserLoading, setViewUserLoading] = useState(false)

  const usersPerPage = 8

  // Fetch admins on component mount and when page changes
  useEffect(() => {
    fetchAdmins()
  }, [currentPage])

  const fetchAdmins = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get("/admins/role", {
        params: {
          page: currentPage,
          limit: usersPerPage,
          search: searchTerm // Add search parameter if your API supports it
        }
      })
      if (response.data.success) {
        setUsers(response.data.data)
        // If your API returns total count, set it here
        // setTotalUsers(response.data.total)
        setTotalUsers(response.data.data.length) // Temporary, replace with actual total from API
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch admins")
    } finally {
      setLoading(false)
    }
  }

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        setCurrentPage(1) // Reset to first page on search
        fetchAdmins()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleViewUser = async (user) => {
    setViewUserLoading(true)
    try {
      const response = await api.get(`/admins/${user._id}`)
      if (response.data.success) {
        setSelectedUser(response.data.data)
        setIsModalOpen(true)
      }
    } catch (err) {
      console.error("Error fetching user details:", err)
      alert("Failed to fetch user details")
    } finally {
      setViewUserLoading(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  const handleBanUser = (user) => {
    setUserToBlock(user)
    setIsConfirmModalOpen(true)
  }

  const handleConfirmBlock = async () => {
    try {
      const response = await api.patch(`/admins/${userToBlock._id}`, {
        status: "blocked"
      })
      
      if (response.data.success) {
        // Refresh the list
        fetchAdmins()
        setIsConfirmModalOpen(false)
        setUserToBlock(null)
        
        // Close the view modal if it's open
        if (isModalOpen) {
          setIsModalOpen(false)
          setSelectedUser(null)
        }
      }
    } catch (err) {
      console.error("Error blocking user:", err)
      alert(err.response?.data?.message || "Failed to block user")
    }
  }

  const handleCancelBlock = () => {
    setIsConfirmModalOpen(false)
    setUserToBlock(null)
  }

  const totalPages = Math.ceil(totalUsers / usersPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    })
  }

  const renderPaginationNumbers = () => {
    const pages = []
    pages.push(1)

    if (currentPage > 3) pages.push("...")

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) pages.push(i)
    }

    if (currentPage < totalPages - 2) pages.push("...")

    if (totalPages > 1 && !pages.includes(totalPages)) pages.push(totalPages)

    return pages
  }

  return (
    <div className="min-h-screen py-4 bg-gray-50">
      <div
        style={{ boxShadow: "0px 1px 6px 0px rgba(0, 0, 0, 0.24)" }}
        className="mx-auto mt-16"
      >
        {/* Header */}
        <div className="px-6 py-4 mb-6 rounded-tl-lg rounded-tr-lg bg-[#71ABE0]">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">Admin List</h1>

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
              <Link to={'/admin/block-list'}>
                <button className="px-4 py-2 text-sm font-medium bg-white rounded-lg text-cyan-600 hover:bg-gray-50">
                  Blocked Users
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Table */}
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
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-[#71ABE0] uppercase">
                        S.ID
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-[#71ABE0] uppercase">
                        Full Name
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-[#71ABE0] uppercase">
                        Email
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-[#71ABE0] uppercase">
                        Phone No
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-[#71ABE0] uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-[#71ABE0] uppercase">
                        Joined Date
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-[#71ABE0] uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.length > 0 ? (
                      users.map((user, index) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                            {String((currentPage - 1) * usersPerPage + index + 1).padStart(2, "0")}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img 
                                src={user.profileImage || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000"} 
                                className="w-8 h-8 rounded-full" 
                                alt={user.name}
                              />
                              <span className="ml-3 text-sm font-medium text-gray-900">{user.name}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{user.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{user.phone || "N/A"}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                            {formatDate(user.joinedDate)}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleBanUser(user)}
                                className="p-1 text-red-500 rounded-full hover:bg-red-50"
                                disabled={user.status === 'blocked'}
                              >
                                <Ban className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleViewUser(user)}
                                className="flex items-center gap-1 p-1 text-[#71ABE0] rounded-full hover:bg-blue-50"
                                disabled={viewUserLoading}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-20 text-center text-gray-500">
                          No admins found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <span className="text-sm text-gray-700">
                  SHOWING {((currentPage - 1) * usersPerPage) + 1}-{Math.min(currentPage * usersPerPage, totalUsers)} OF {totalUsers}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-400 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {renderPaginationNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === "number" && handlePageChange(page)}
                      disabled={page === "..."}
                      className={`min-w-[32px] rounded-lg px-3 py-1 text-sm ${
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
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-400 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* View User Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="flex-1 text-2xl font-semibold text-center text-[#71ABE0]">
                User Details
              </h2>
              <button onClick={handleCloseModal} className="ml-4 text-gray-400 hover:text-gray-600">
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
                <h3 className="text-xl font-medium text-[#71ABE0]">{selectedUser.name}</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Name</span>
                  <span className="text-gray-900">{selectedUser.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Email</span>
                  <span className="text-gray-900">{selectedUser.email}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Role</span>
                  <span className="text-gray-900 capitalize">{selectedUser.role}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Status</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    selectedUser.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedUser.status}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Joining Date</span>
                  <span className="text-gray-900">{formatDate(selectedUser.joinedDate)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 text-sm font-medium bg-white border rounded-lg"
              >
                Cancel
              </button>

              {selectedUser.status !== 'blocked' && (
                <button
                  onClick={() => {
                    handleCloseModal()
                    handleBanUser(selectedUser)
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg"
                >
                  Block
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Block Confirmation Modal */}
      {isConfirmModalOpen && userToBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-sm p-6 mx-4 text-center bg-white rounded-lg shadow-xl">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Do you want to block {userToBlock.name}?
            </h2>

            <div className="flex gap-3">
              <button
                onClick={handleCancelBlock}
                className="flex-1 px-4 py-2 text-sm bg-white border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmBlock}
                className="flex-1 px-4 py-2 text-sm text-white bg-red-600 rounded-lg"
              >
                Yes, Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminList