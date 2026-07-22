import AdminSidebar from "../components/AdminSidebar";

function AdminLayout({ children }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-64 flex-1 min-h-screen bg-gray-50 p-8">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;