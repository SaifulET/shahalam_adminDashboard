import { useEffect, useState } from "react"
import { Search, Eye, Ban, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Link } from "react-router-dom"
import api from "../../lib/api"
import { useAuthStore } from "../../store/authStore"

const UserList = () => {
  const { user } = useAuthStore()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [userToBlock, setUserToBlock] = useState(null)

  const usersPerPage = 8

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/employees/allemployee/${user?.id}`)
      setUsers(res.data.data || [])
    } catch (error) {
      console.error("Failed to fetch employees:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id) fetchEmployees()
  }, [user?.id])

  // Search filter
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  )

  // Pagination
  const totalUsers = filteredUsers.length
  const totalPages = Math.ceil(totalUsers / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage)

  const handlePageChange = (page) => setCurrentPage(page)

  // Modal handlers
  const handleViewUser = (user) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  const handleBanUser = (user) => {
    setUserToBlock(user)
    setIsConfirmModalOpen(true)
  }

  // 🔥 Block API integration
  const handleConfirmBlock = async () => {
    if (!userToBlock) return

    try {
      setLoading(true)

      await api.patch(`/employees/${userToBlock._id}`, {
        userId: user?.id,
        status: "blocked",
      })

      setIsConfirmModalOpen(false)
      setUserToBlock(null)
      fetchEmployees()
    } catch (error) {
      console.error("Block failed:", error)
      alert("Failed to block employee")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBlock = () => {
    setIsConfirmModalOpen(false)
    setUserToBlock(null)
  }

  const renderPaginationNumbers = () => {
    const pages = []
    pages.push(1)

    if (currentPage > 3) pages.push("...")

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (!pages.includes(i)) pages.push(i)
    }

    if (currentPage < totalPages - 2) pages.push("...")

    if (totalPages > 1 && !pages.includes(totalPages)) pages.push(totalPages)

    return pages
  }

  return (
    <div className="min-h-screen py-4 bg-gray-50">
      <div className="mx-auto mt-16 shadow-md">
        {/* Header */}
        <div className="px-6 py-4 mb-6 bg-[#71ABE0] rounded-t-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">
              Employee List
            </h1>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Search Employee"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 py-2 pl-10 pr-4 text-sm bg-white rounded-lg focus:ring-2 focus:ring-cyan-300"
                />
              </div>

              <Link to="/block-list">
                <button className="px-4 py-2 text-sm font-medium bg-white rounded-lg text-cyan-600 hover:bg-gray-100">
                  Blocked Users
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg">
          {loading ? (
            <div className="py-12 text-center text-gray-500">
              Loading...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">
                      S.ID
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-[#71ABE0] uppercase">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {String(startIndex + index + 1).padStart(2, "0")}
                      </td>

                      <td className="px-6 py-4 flex items-center gap-2">
                        <img
                          src={`https://ui-avatars.com/api/?name=${user.name}`}
                          className="w-8 h-8 rounded-full"
                        />
                        {user.name}
                      </td>

                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.phone}</td>

                      <td className="px-6 py-4 capitalize">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            user.status === "active"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {new Date(user.joiningDate).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleBanUser(user)}
                            className="p-1 text-red-500 rounded hover:bg-red-50"
                          >
                            <Ban size={16} />
                          </button>

                          <button
                            onClick={() => handleViewUser(user)}
                            className="p-1 text-[#71ABE0] rounded hover:bg-blue-50"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <span className="text-sm">
              Showing {startIndex + 1} -{" "}
              {Math.min(startIndex + usersPerPage, totalUsers)} of{" "}
              {totalUsers}
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  handlePageChange(Math.max(1, currentPage - 1))
                }
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>

              {renderPaginationNumbers().map((page, index) => (
                <button
                  key={index}
                  disabled={page === "..."}
                  onClick={() =>
                    typeof page === "number" &&
                    handlePageChange(page)
                  }
                  className={`px-3 py-1 rounded text-sm ${
                    page === currentPage
                      ? "bg-[#71ABE0] text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  handlePageChange(
                    Math.min(totalPages, currentPage + 1)
                  )
                }
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Employee Details</h2>
              <button onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-3">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <p><strong>Status:</strong> {selectedUser.status}</p>
              <p>
                <strong>Joining:</strong>{" "}
                {new Date(selectedUser.joiningDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Block Modal */}
      {isConfirmModalOpen && userToBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm bg-white rounded-lg p-6 text-center">
            <h2 className="mb-6 text-lg font-semibold">
              Block this employee?
            </h2>

            <div className="flex gap-3">
              <button
                onClick={handleCancelBlock}
                className="flex-1 border py-2 rounded"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={handleConfirmBlock}
                className="flex-1 bg-red-600 text-white py-2 rounded disabled:opacity-50"
              >
                {loading ? "Blocking..." : "Yes, Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserList