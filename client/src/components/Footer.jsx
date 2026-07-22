function Footer() {
  return (
    <footer className="border-t border-gray-200 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-sm text-gray-500">
          © {new Date().getFullYear()} EduSphere. All rights reserved.
        </span>
        <div className="flex gap-6 text-sm text-gray-500">
          <a href="#" className="hover:text-gray-900 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-gray-900 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-gray-900 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;