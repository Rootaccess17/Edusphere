import DashboardSidebar from "../components/DashboardSidebar";

function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="ml-64 flex-1 min-h-screen bg-gray-50 p-8">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;