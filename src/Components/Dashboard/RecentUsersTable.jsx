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
        console.log("Employees fetched:", res.data)

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
          <table className="w-full">
            <thead className="bg-[#71ABE0]">
              <tr>
                <th className="px-6 py-3 text-xs text-left text-white uppercase">S.ID</th>
                <th className="px-6 py-3 text-xs text-left text-white uppercase">Full Name</th>
                <th className="px-6 py-3 text-xs text-left text-white uppercase">Email</th>
                <th className="px-6 py-3 text-xs text-left text-white uppercase">Phone</th>
                <th className="px-6 py-3 text-xs text-left text-white uppercase">Status</th>
                <th className="px-6 py-3 text-xs text-left text-white uppercase">Joining Date</th>
                <th className="px-6 py-3 text-xs text-left text-white uppercase">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : displayedUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center">
                    No employees found
                  </td>
                </tr>
              ) : (
                displayedUsers.map((employee, index) => (
                  <tr key={employee._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">
                      {String(index + 1).padStart(2, "0")}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src="https://ui-avatars.com/api/?name=${employee.name}"
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="ml-3 text-sm font-medium">
                          {employee.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm">{employee.email}</td>
                    <td className="px-6 py-4 text-sm">{employee.phone}</td>
                    <td className="px-6 py-4 text-sm capitalize">
                      {employee.status}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(employee.joiningDate).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleBanUser(employee)}
                          className="p-1 text-red-500 rounded-full hover:bg-red-50"
                        >
                          <Ban className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleViewUser(employee)}
                          className="p-1 text-[#71ABE0] rounded-full hover:bg-blue-50"
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
        </div>
      </div>

      {/* ================= View Modal ================= */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="flex-1 text-2xl font-semibold text-center text-[#71ABE0]">
                Employee Details
              </h2>
              <button onClick={handleCloseModal}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <p><strong>Status:</strong> {selectedUser.status}</p>
              <p>
                <strong>Joining Date:</strong>{" "}
                {new Date(selectedUser.joiningDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= Confirm Modal ================= */}
      {isConfirmModalOpen && userToBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-xl text-center">
            <h2 className="mb-6 text-xl font-semibold">
              Do you want to block this employee?
            </h2>

            <div className="flex gap-3">
              <button
                onClick={handleCancelBlock}
                className="flex-1 px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmBlock}
                className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg"
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
