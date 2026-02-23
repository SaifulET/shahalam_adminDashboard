import { useState, useEffect } from "react"
import { Eye, Ban, X } from "lucide-react"
import { useAuthStore } from "../../store/authStore"
import api from "../../lib/api"

const RecentUsersTable = () => {
  const { user } = useAuthStore()

  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [userToBlock, setUserToBlock] = useState(null)

  // ===================== Fetch Employees =====================
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/employees/allemployee/${user?.id}`)

        if (res.data.success) {
          setEmployees(res.data.data)
        }
      } catch (error) {
        console.error("Failed to fetch employees", error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      fetchEmployees()
    }
  }, [user])

  // ===================== Handlers =====================
  const handleViewUser = (employee) => {
    setSelectedUser(employee)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  const handleBanUser = (employee) => {
    setUserToBlock(employee)
    setIsConfirmModalOpen(true)
  }

  const handleConfirmBlock = async () => {
    try {
      // Example block API (update if you have specific route)
      await api.patch(`/employees/${userToBlock._id}`, {
        status: "blocked",
      })

      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === userToBlock._id
            ? { ...emp, status: "blocked" }
            : emp
        )
      )
      
      // Close the view modal if it's open and showing the blocked user
      if (isModalOpen && selectedUser?._id === userToBlock._id) {
        setIsModalOpen(false)
        setSelectedUser(null)
      }
    } catch (error) {
      console.error("Failed to block employee", error)
    }

    setIsConfirmModalOpen(false)
    setUserToBlock(null)
  }

  const handleCancelBlock = () => {
    setIsConfirmModalOpen(false)
    setUserToBlock(null)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    })
  }

  const displayedUsers = employees.slice(0, 5)

  return (
    <div className="py-4 bg-gray-50">
      <div
        style={{ boxShadow: "0px 1px 6px 0px rgba(0, 0, 0, 0.24)" }}
        className="rounded-lg"
      >
        <div className="px-6 py-4 mb-6 rounded-tl-lg rounded-tr-lg">
          <h1 className="text-2xl font-semibold">Recent Employees</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-[#71ABE0]">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">S.ID</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">Full Name</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">Email</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">Phone</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">Status</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">Joining Date</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">Action</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {displayedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-20 text-center text-gray-500">
                      No employees found
                    </td>
                  </tr>
                ) : (
                  displayedUsers.map((employee, index) => (
                    <tr key={employee._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {String(index + 1).padStart(2, "0")}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={
                              employee?.profileImage
                                ? employee.profileImage
                                : `https://ui-avatars.com/api/?name=${employee?.name}`
                            }
                            className="w-8 h-8 rounded-full" 
                            alt={employee.name}
                          />
                          <span className="ml-3 text-sm font-medium text-gray-900">
                            {employee.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{employee.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{employee.phone || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          employee.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {formatDate(employee.joiningDate)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleBanUser(employee)}
                            className="p-1 text-red-500 rounded-full hover:bg-red-50"
                            disabled={employee.status === 'blocked'}
                          >
                            <Ban className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleViewUser(employee)}
                            className="flex items-center gap-1 p-1 text-[#71ABE0] rounded-full hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ================= View Modal - Enhanced with AdminList styling ================= */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="flex-1 text-2xl font-semibold text-center text-[#71ABE0]">
                Employee Details
              </h2>
              <button 
                onClick={handleCloseModal} 
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <img 
                  src={
                    selectedUser?.profileImage
                      ? selectedUser.profileImage
                      : `https://ui-avatars.com/api/?name=${selectedUser?.name}`
                  }
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
                  <span className="font-medium text-gray-700">Phone</span>
                  <span className="text-gray-900">{selectedUser.phone || "N/A"}</span>
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
                  <span className="text-gray-900">{formatDate(selectedUser.joiningDate)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 text-sm font-medium bg-white border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>

              {selectedUser.status !== 'blocked' && (
                <button
                  onClick={() => {
                    handleCloseModal()
                    handleBanUser(selectedUser)
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
                >
                  Block
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= Confirm Modal - Enhanced ================= */}
      {isConfirmModalOpen && userToBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-sm p-6 mx-4 text-center bg-white rounded-lg shadow-xl">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Do you want to block {userToBlock.name}?
            </h2>

            <div className="flex gap-3">
              <button
                onClick={handleCancelBlock}
                className="flex-1 px-4 py-2 text-sm bg-white border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmBlock}
                className="flex-1 px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
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

export default RecentUsersTable