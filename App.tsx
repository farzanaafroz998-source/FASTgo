import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import DashboardAdmin from './components/DashboardAdmin';
import DashboardCustomer from './components/DashboardCustomer';
import DashboardRider from './components/DashboardRider';
import DashboardStore from './components/DashboardStore';
import { UserRole } from './types';
import { GlobalProvider } from './state/GlobalStore';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    // Subdomain detection logic
    const hostname = window.location.hostname;
    if (hostname.includes('admin.')) setRole(UserRole.ADMIN);
    else if (hostname.includes('rider.')) setRole(UserRole.RIDER);
    else if (hostname.includes('store.')) setRole(UserRole.STORE);
    else if (hostname.includes('customer.')) setRole(UserRole.CUSTOMER);
  }, []);

  const handleLogout = () => {
    // Clear subdomain state or redirect to main landing
    setRole(null);
    if (window.location.hostname !== 'fastgo.com' && !window.location.hostname.includes('localhost')) {
      // In a real production app, you might redirect to the main domain here
      // window.location.href = 'https://fastgo.com';
    }
  };

  return (
    <GlobalProvider>
      <div className="min-h-screen bg-gray-50">
        {!role ? (
          <LandingPage onLogin={setRole} />
        ) : (
          <>
            <nav className="sticky top-0 z-50 bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
              <div 
                className="flex items-center gap-2 cursor-pointer" 
                onClick={() => setRole(null)}
              >
                <div className="w-8 h-8 bg-[#FF5F00] rounded-lg flex items-center justify-center text-white font-bold text-lg">F</div>
                <span className="text-xl font-extrabold text-gray-900 hidden sm:block">FASTgo</span>
                <span className="bg-orange-50 text-[#FF5F00] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ml-1 border border-orange-100">
                  {role.replace('_', ' ')} Portal
                </span>
              </div>
              
              <div className="flex items-center gap-6">
                 <button className="text-gray-400 hover:text-[#FF5F00] transition-colors relative">
                    <i className="fa-solid fa-bell"></i>
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF5F00] rounded-full border border-white"></span>
                 </button>
                 <div className="h-8 w-[1px] bg-gray-100"></div>
                 <button 
                   onClick={handleLogout}
                   className="text-sm font-bold text-gray-500 hover:text-red-500 transition-colors"
                 >
                   Logout
                 </button>
                 <div className="w-10 h-10 bg-gray-100 rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                   <i className="fa-solid fa-user text-gray-400"></i>
                 </div>
              </div>
            </nav>

            <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {role === UserRole.ADMIN && <DashboardAdmin />}
              {role === UserRole.CUSTOMER && <DashboardCustomer />}
              {role === UserRole.RIDER && <DashboardRider />}
              {role === UserRole.STORE && <DashboardStore />}
            </main>

            <footer className="mt-20 py-10 px-6 border-t bg-white text-center">
              <p className="text-gray-400 text-sm font-medium">© 2024 FASTgo Delivery Ecosystem. All Systems Operational.</p>
            </footer>
          </>
        )}
      </div>
    </GlobalProvider>
  );
};

export default App;