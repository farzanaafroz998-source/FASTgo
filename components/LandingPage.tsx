
import React from 'react';
import { UserRole } from '../types';

interface LandingPageProps {
  onLogin: (role: UserRole) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 border-b">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#FF5F00] rounded-xl flex items-center justify-center text-white font-bold text-xl">
            F
          </div>
          <span className="text-2xl font-extrabold tracking-tighter text-gray-900">FASTgo</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">System Operational</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-24 grid md:grid-cols-2 items-center gap-12">
        <div className="space-y-8">
          <h1 className="text-5xl md:text-7xl font-black leading-tight text-gray-900">
            Fastest Delivery in <span className="text-[#FF5F00]">Your Hands.</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
            Whether you're hungry, riding, selling, or managing - FASTgo provides the most reliable ecosystem for food delivery.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onLogin(UserRole.CUSTOMER)}
              className="px-8 py-4 bg-[#FF5F00] text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-burger"></i> Get Started
            </button>
            <button className="px-8 py-4 border-2 border-gray-100 text-gray-900 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all">
              Learn More
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-3xl font-bold text-[#FF5F00]">15m</p>
              <p className="text-sm text-gray-500 font-medium">Avg. Delivery Time</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-3xl font-bold text-[#FF5F00]">500+</p>
              <p className="text-sm text-gray-500 font-medium">Partner Stores</p>
            </div>
          </div>
        </div>

        {/* Mockup Display */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-[#FF5F00]/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
          <div className="w-64 h-[500px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20"></div>
            <div className="h-full bg-white p-6 pt-12 flex flex-col items-center gap-6">
               <div className="w-16 h-16 bg-[#FF5F00] rounded-2xl flex items-center justify-center text-white text-3xl font-black">F</div>
               <h3 className="text-xl font-bold">Login to FASTgo</h3>
               <div className="w-full space-y-3 mt-4">
                  <div className="h-10 bg-gray-100 rounded-lg w-full"></div>
                  <div className="h-10 bg-gray-100 rounded-lg w-full"></div>
                  <div className="h-10 bg-[#FF5F00] rounded-lg w-full"></div>
               </div>
               <div className="mt-auto flex gap-2 w-full">
                  <div className="h-2 bg-gray-100 rounded flex-1"></div>
                  <div className="h-2 bg-gray-100 rounded flex-1"></div>
               </div>
            </div>
          </div>
          {/* Decorative Floating Cards */}
          <div className="absolute -top-4 -right-4 md:right-12 p-4 bg-white shadow-xl rounded-2xl border flex items-center gap-3 animate-bounce">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
               <i className="fa-solid fa-check"></i>
            </div>
            <div>
              <p className="font-bold text-sm">Order Delivered</p>
              <p className="text-xs text-gray-500">2 mins ago</p>
            </div>
          </div>
        </div>
      </main>

      {/* Role Tabs Section */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16">One Platform, <span className="text-[#FF5F00]">All Users.</span></h2>
          <div className="grid md:grid-cols-4 gap-6">
            <RoleCard 
              icon="fa-user" 
              title="Customer" 
              desc="Browse, Order & Track effortlessly." 
              onAction={() => onLogin(UserRole.CUSTOMER)}
            />
            <RoleCard 
              icon="fa-motorcycle" 
              title="Rider" 
              desc="Deliver & Earn with flexibility." 
              onAction={() => onLogin(UserRole.RIDER)}
            />
            <RoleCard 
              icon="fa-shop" 
              title="Store" 
              desc="Grow your business online." 
              onAction={() => onLogin(UserRole.STORE)}
            />
            <RoleCard 
              icon="fa-shield" 
              title="Admin" 
              desc="Complete system management." 
              onAction={() => onLogin(UserRole.ADMIN)}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const RoleCard = ({ icon, title, desc, onAction }: any) => (
  <div 
    onClick={onAction}
    className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-[#FF5F00]/30 hover:shadow-xl transition-all cursor-pointer group text-center"
  >
    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl text-gray-400 group-hover:bg-[#FF5F00] group-hover:text-white transition-colors mx-auto mb-6">
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-500 text-sm mb-6">{desc}</p>
    <span className="text-[#FF5F00] font-bold text-sm group-hover:underline">Access App →</span>
  </div>
);

export default LandingPage;
