import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const isMobile = window.innerWidth < 768;
      setMobile(isMobile);
      if (isMobile) setCollapsed(true);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const sidebarWidth = collapsed ? 64 : 260;

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(p => !p)} />

      {/* Mobile overlay */}
      {!collapsed && mobile && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <Navbar sidebarWidth={sidebarWidth} />

      <main
        className="min-h-screen pt-14 transition-all duration-300"
        style={{ paddingLeft: sidebarWidth }}
      >
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
