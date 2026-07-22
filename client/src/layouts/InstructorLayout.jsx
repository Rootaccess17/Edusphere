import InstructorSidebar from "../components/InstructorSidebar";

function InstructorLayout({ children }) {
  return (
    <div className="flex">
      <InstructorSidebar />
      <main className="ml-64 flex-1 min-h-screen bg-gray-50 p-8">
        {children}
      </main>
    </div>
  );
}

export default InstructorLayout;