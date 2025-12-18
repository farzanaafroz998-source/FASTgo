import React, { useState, useEffect } from 'react';
import { OrderStatus } from '../types';
import { useGlobalState } from '../state/GlobalStore';

const DashboardRider: React.FC = () => {
  const [online, setOnline] = useState(false);
  const [coords, setCoords] = useState({ lat: 23.8103, lng: 90.4125 });
  const { updateRiderLocation, orders, updateOrderStatus } = useGlobalState();

  // Filter out orders that are already completed or cancelled
  const activeOrder = orders.find(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED);

  useEffect(() => {
    let watchId: number;
    if (online) {
      if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (pos) => {
            const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setCoords(newCoords);
            updateRiderLocation(newCoords.lat, newCoords.lng);
          },
          (err) => console.warn("Rider Geolocation Error:", err.message),
          { 
            enableHighAccuracy: true, 
            timeout: 10000, // Reasonable timeout for delivery environments
            maximumAge: 0   // Force fresh location updates
          }
        );
      } else {
        console.warn("Geolocation API is not available in this environment.");
      }
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [online, updateRiderLocation]);

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <header className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-10 gap-6 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${online ? 'bg-orange-50 text-[#FF5F00]' : 'bg-gray-50 text-gray-300'}`}>
            <i className={`fa-solid ${online ? 'fa-motorcycle' : 'fa-power-off'}`}></i>
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Rider Console</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${online ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
              <p className="text-gray-500 font-bold text-xs uppercase tracking-tight">
                {online ? 'Active & Visible' : 'Currently Offline'}
              </p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setOnline(!online)}
          className={`px-10 py-4 rounded-2xl font-black transition-all shadow-md active:scale-95 ${
            online 
              ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' 
              : 'bg-[#FF5F00] text-white shadow-orange-200 hover:bg-orange-600 hover:shadow-lg'
          }`}
        >
          {online ? 'Go Offline' : 'Go Online'}
        </button>
      </header>

      {online ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
           {activeOrder ? (
             <div className="bg-[#FF5F00] text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-white/80 font-bold text-[10px] uppercase tracking-widest mb-1">New Delivery Task</p>
                        <h2 className="text-3xl font-black">Incoming Assignment</h2>
                      </div>
                      <div className="bg-white/20 px-4 py-2 rounded-full text-[10px] font-black uppercase backdrop-blur-md">
                        # {activeOrder.id.slice(0,8)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/10">
                          <p className="text-white/60 text-[10px] mb-1 uppercase font-black tracking-tighter">Earnings Estimate</p>
                          <p className="font-bold text-lg">${activeOrder.total.toFixed(2)}</p>
                      </div>
                      <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/10">
                          <p className="text-white/60 text-[10px] mb-1 uppercase font-black tracking-tighter">Current Status</p>
                          <p className="font-bold text-lg">{activeOrder.status}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {activeOrder.status === OrderStatus.PENDING && (
                        <button 
                          onClick={() => updateOrderStatus(activeOrder.id, OrderStatus.PREPARING)}
                          className="w-full py-5 bg-white text-[#FF5F00] rounded-2xl font-black shadow-lg hover:shadow-2xl transition-all"
                        >
                          Accept Order
                        </button>
                      )}
                      {activeOrder.status === OrderStatus.PREPARING && (
                        <button 
                          onClick={() => updateOrderStatus(activeOrder.id, OrderStatus.OUT_FOR_DELIVERY)}
                          className="w-full py-5 bg-white text-[#FF5F00] rounded-2xl font-black shadow-lg hover:shadow-2xl transition-all"
                        >
                          Picked Up (Start Trip)
                        </button>
                      )}
                      {activeOrder.status === OrderStatus.OUT_FOR_DELIVERY && (
                        <button 
                          onClick={() => updateOrderStatus(activeOrder.id, OrderStatus.DELIVERED)}
                          className="w-full py-5 bg-green-500 text-white rounded-2xl font-black shadow-lg hover:bg-green-600 transition-all"
                        >
                          Confirm Delivery Complete
                        </button>
                      )}
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform"></div>
             </div>
           ) : (
             <div className="bg-white p-20 rounded-[2.5rem] border border-gray-100 text-center shadow-sm">
                <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fa-solid fa-satellite-dish text-4xl animate-pulse"></i>
                </div>
                <p className="font-black text-gray-900 text-xl">Searching for Orders</p>
                <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">Your live position is being shared with dispatch. Keep the app open to receive alerts.</p>
             </div>
           )}

           <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-3">
                    <i className="fa-solid fa-map-pin text-[#FF5F00]"></i> 
                    Telemetry Status
                </h3>
                <span className="text-[10px] font-black text-green-500 flex items-center gap-1">
                    <i className="fa-solid fa-bolt"></i> HIGH ACCURACY
                </span>
             </div>
             <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 text-center border-dashed">
                <p className="text-[10px] text-gray-400 mb-2 uppercase font-black tracking-widest">Real-time GPS Broadcast</p>
                <p className="font-mono text-xl font-bold text-gray-800 tabular-nums">
                    {coords.lat.toFixed(6)}° N, {coords.lng.toFixed(6)}° E
                </p>
                <div className="mt-4 flex items-center gap-3 justify-center">
                    <div className="flex gap-1">
                        <div className="w-1.5 h-4 bg-green-500 rounded-full"></div>
                        <div className="w-1.5 h-4 bg-green-500 rounded-full"></div>
                        <div className="w-1.5 h-4 bg-green-500 rounded-full"></div>
                        <div className="w-1.5 h-4 bg-gray-200 rounded-full"></div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Strong Connection</span>
                </div>
             </div>
           </div>
        </div>
      ) : (
        <div className="text-center py-40 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
           <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <i className="fa-solid fa-bed text-gray-300 text-4xl"></i>
           </div>
           <p className="text-gray-900 font-black text-2xl">Shift Ended</p>
           <p className="text-gray-400 mt-2 max-w-sm mx-auto">You're currently not accepting new orders. To start earning, tap 'Go Online' above.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardRider;