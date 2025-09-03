import AdminSidebar from "./AdminSidebar"
import AdminHeader from "./AdminHeader"

const AdminLayout = ({ children, navegacion, paginaActiva, setPaginaActiva, onLogout }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar navegacion={navegacion} paginaActiva={paginaActiva} setPaginaActiva={setPaginaActiva} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader onLogout={onLogout} />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
