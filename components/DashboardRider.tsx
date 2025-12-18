
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
          (err) => console.error("Geo Error:", err),
          { enableHighAccuracy: true }
        );
      }
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [online]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black">Rider Console</h1>
          <p className="text-gray-500">Shift status: {online ? 'Active' : 'Offline'}</p>
        </div>
        <button 
          onClick={() => setOnline(!online)}
          className={`px-8 py-3 rounded-2xl font-bold transition-all ${
            online ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-[#FF5F00] text-white shadow-lg'
          }`}
        >
          {online ? 'Go Offline' : 'Go Online'}
        </button>
      </header>

      {online ? (
        <div className="space-y-6">
           {activeOrder ? (
             <div className="bg-[#FF5F00] text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                <p className="text-white/80 font-bold text-sm uppercase mb-2">Ongoing Task: {activeOrder.id}</p>
                <h2 className="text-2xl font-bold mb-6">Pick up from Restaurant</h2>
                <div className="flex gap-4 mb-8">
                   <div className="flex-1 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                      <p className="text-white/60 text-xs mb-1">Items</p>
                      <p className="font-bold text-sm">{activeOrder.items.length} Packages</p>
                   </div>
                   <div className="flex-1 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                      <p className="text-white/60 text-xs mb-1">Status</p>
                      <p className="font-bold text-sm">{activeOrder.status}</p>
                   </div>
                </div>

                <div className="space-y-3">
                  {activeOrder.status === OrderStatus.PENDING && (
                    <button 
                      onClick={() => updateOrderStatus(activeOrder.id, OrderStatus.PREPARING)}
                      className="w-full py-4 bg-white text-[#FF5F00] rounded-2xl font-black shadow-lg"
                    >
                      Accept & Start Preparing
                    </button>
                  )}
                  {activeOrder.status === OrderStatus.PREPARING && (
                    <button 
                      onClick={() => updateOrderStatus(activeOrder.id, OrderStatus.OUT_FOR_DELIVERY)}
                      className="w-full py-4 bg-white text-[#FF5F00] rounded-2xl font-black shadow-lg"
                    >
                      Confirm Pickup
                    </button>
                  )}
                  {activeOrder.status === OrderStatus.OUT_FOR_DELIVERY && (
                    <button 
                      onClick={() => updateOrderStatus(activeOrder.id, OrderStatus.DELIVERED)}
                      className="w-full py-4 bg-green-500 text-white rounded-2xl font-black shadow-lg"
                    >
                      Confirm Delivery
                    </button>
                  )}
                </div>
             </div>
           ) : (
             <div className="bg-white p-10 rounded-3xl border text-center text-gray-400">
                <i className="fa-solid fa-map-marked-alt text-4xl mb-4"></i>
                <p className="font-bold">Waiting for orders...</p>
             </div>
           )}

           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
             <h3 className="font-bold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-location-dot text-[#FF5F00]"></i> 
                Real Geolocation Data
             </h3>
             <div className="h-40 bg-gray-50 rounded-2xl border flex items-center justify-center">
                <div className="text-center">
                   <p className="text-xs text-gray-400 mb-1 uppercase font-bold">Current GPS</p>
                   <p className="font-mono text-sm text-gray-700">{coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</p>
                   <p className="text-[10px] text-green-500 mt-2 font-bold animate-pulse">Broadcasting to Ecosystem</p>
                </div>
             </div>
           </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
           <i className="fa-solid fa-moon text-gray-300 text-5xl mb-4"></i>
           <p className="text-gray-500 font-bold">You are currently offline</p>
        </div>
      )}
    </div>
  );
};

export default DashboardRider;
