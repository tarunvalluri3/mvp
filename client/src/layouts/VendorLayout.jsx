import { useState } from "react";
import { HiOutlineBars3 } from "react-icons/hi2";

import VendorSidebar from "../components/VendorSidebar";
import "./VendorLayout.css";

export default function VendorLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="vendor-layout">
      <VendorSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <main className="vendor-main">

        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(true)}
        >
          <HiOutlineBars3 />
        </button>

        {children}

      </main>
    </div>
  );
}