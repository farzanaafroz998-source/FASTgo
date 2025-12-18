import React, { useState, useEffect } from 'react';
import { OrderStatus } from '../types';
import { useGlobalState } from '../state/GlobalStore';

const DashboardRider: React.FC = () => {
  const [online, setOnline] = useState(false);
  const [coords, setCoords] = useState({ lat: 23.8103, lng: 90.4125 });
  const { updateRiderLocation, orders, updateOrderStatus } = useGlobalState();

  const activeOrder = orders.find(o => o.status !== OrderStatus.DELIVERED);

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
          (err) => console.warn("Location error:", err),
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      }
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [online, updateRiderLocation]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Rider Console</h1>
          <p className="text-gray-500">Shift status: {online ? 'Active' : 'Offline'}</p>
        </div>
        <button 
          onClick={() => setOnline(!online)}
          className={`px-8 py-3 rounded-2xl font-bold transition-all ${
            online ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-[#FF5F00] text-white shadow-lg shadow-orange-200'
          }`}
        >
          {online ? 'Stop Shift' : 'Start Shift'}
        </button>
      </header>

      {online ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
           {activeOrder ? (
             <div className="bg-[#FF5F00] text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-white/80 font-bold text-xs uppercase mb-2">Order ID: {activeOrder.id.slice(0,8)}</p>
                    <h2 className="text-2xl font-bold mb-6">Delivery Assignment</h2>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                          <p className="text-white/60 text-[10px] mb-1 uppercase font-bold tracking-widest">Items</p>
                          <p className="font-bold text-sm">{activeOrder.items.length} Items</p>
                      </div>
                      <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                          <p className="text-white/60 text-[10px] mb-1 uppercase font-bold tracking-widest">Status</p>
                          <p className="font-bold text-sm">{activeOrder.status}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {activeOrder.status === OrderStatus.PENDING && (
                        <button 
                          onClick={() => updateOrderStatus(activeOrder.id, OrderStatus.PREPARING)}
                          className="w-full py-4 bg-white text-[#FF5F00] rounded-2xl font-black shadow-lg hover:bg-orange-50 transition-colors"
                        >
                          Accept Order
                        </button>
                      )}
                      {activeOrder.status === OrderStatus.PREPARING && (
                        <button 
                          onClick={() => updateOrderStatus(activeOrder.id, OrderStatus.OUT_FOR_DELIVERY)}
                          className="w-full py-4 bg-white text-[#FF5F00] rounded-2xl font-black shadow-lg hover:bg-orange-50 transition-colors"
                        >
                          Picked Up (Start Delivery)
                        </button>
                      )}
                      {activeOrder.status === OrderStatus.OUT_FOR_DELIVERY && (
                        <button 
                          onClick={() => updateOrderStatus(activeOrder.id, OrderStatus.DELIVERED)}
                          className="w-full py-4 bg-green-500 text-white rounded-2xl font-black shadow-lg hover:bg-green-600 transition-colors"
                        >
                          Complete Delivery
                        </button>
                      )}
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
             </div>
           ) : (
             <div className="bg-white p-16 rounded-[2.5rem] border border-gray-100 text-center shadow-sm">
                <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fa-solid fa-map-marked-alt text-3xl"></i>
                </div>
                <p className="font-black text-gray-900 text-lg">Waiting for Nearby Orders</p>
                <p className="text-gray-400 text-sm mt-2">You are currently visible on the map.</p>
             </div>
           )}

           <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
             <h3 className="font-bold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-tower-broadcast text-[#FF5F00]"></i> 
                GPS Signal Strength
             </h3>
             <div className="h-48 bg-gray-50 rounded-2xl border flex flex-col items-center justify-center p-6 border-dashed">
                <div className="text-center">
                   <p className="text-[10px] text-gray-400 mb-2 uppercase font-black tracking-widest">Live Telemetry</p>
                   <p className="font-mono text-xl font-bold text-gray-800">{coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</p>
                   <div className="mt-4 flex items-center gap-2 justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                      <span className="text-[10px] text-green-600 font-black uppercase">Transmitting</span>
                   </div>
                </div>
             </div>
           </div>
        </div>
      ) : (
        <div className="text-center py-32 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
           <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <i className="fa-solid fa-moon text-gray-300 text-4xl"></i>
           </div>
           <p className="text-gray-900 font-black text-xl">You're currently Offline</p>
           <p className="text-gray-400 mt-2 max-w-xs mx-auto">Start your shift to begin receiving delivery requests and earning money.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardRider;