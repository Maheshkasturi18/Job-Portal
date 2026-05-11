import { useStore } from "../store";

function Footer() {
  const { isDarkMode } = useStore();
  return (
    <footer className={`${isDarkMode ? "dark bg-gray-800" : "bg-slate-200"} `}>
      <div className="container mx-auto px-4 py-6 ">
        <p className="text-gray-400 text-sm text-center">
          © 2026 <a href="#">JobHire</a>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
export default Footer;
