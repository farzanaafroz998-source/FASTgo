import React, { useState } from 'react';
import { MOCK_STORES, MOCK_MENU } from '../constants';
import { getStoreSummary } from '../services/geminiService';
import { Store, MenuItem, OrderStatus, Order } from '../types';
import { useGlobalState } from '../state/GlobalStore';

const DashboardCustomer: React.FC = () => {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [cart, setCart] = useState<MenuItem[]>([]);
  const { placeOrder, orders, riderLocation } = useGlobalState();

  // Find most recent active order for this mock customer
  const activeOrder = orders.find(o => o.customerId === 'C-01' && o.status !== OrderStatus.DELIVERED);

  const handleStoreClick = async (store: Store) => {
    setSelectedStore(store);
    setSummary("Asking AI for store insights...");
    const aiSummary = await getStoreSummary(store.name);
    setSummary(aiSummary);
  };

  const addToCart = (item: MenuItem) => {
    setCart([...cart, item]);
  };

  const handleCheckout = () => {
    if (!selectedStore || cart.length === 0) return;

    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      customerId: 'C-01',
      storeId: selectedStore.id,
      status: OrderStatus.PENDING,
      total: cart.reduce((sum, i) => sum + i.price, 0),
      items: cart.map(i => ({ name: i.name, quantity: 1, price: i.price })),
      timestamp: new Date(),
      location: { lat: 23.8103, lng: 90.4125 }
    };

    placeOrder(newOrder);
    setCart([]);
    setSelectedStore(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900">What are we eating?</h1>
          <p className="text-gray-500">Fast delivery, hot food.</p>
        </div>
        {activeOrder && (
          <div className="bg-[#FF5F00] text-white px-6 py-4 rounded-2xl flex items-center gap-4 animate-bounce shadow-lg">
             <i className="fa-solid fa-truck-fast"></i>
             <div>
                <p className="text-[10px] font-black uppercase">Order {activeOrder.status}</p>
                <p className="text-sm font-bold">Track your meal now</p>
             </div>
          </div>
        )}
      </header>

      {activeOrder && !selectedStore && (
        <section className="mb-12">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden p-8 grid md:grid-cols-2 gap-10">
            <div>
               <h3 className="text-2xl font-black mb-2">Tracking Order {activeOrder.id}</h3>
               <p className="text-gray-500 text-sm mb-8">Estimated Delivery: 15-20 mins</p>
               
               <div className="space-y-6 relative">
                  <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-100"></div>
                  
                  <TrackingStep 
                    status="Pending" 
                    currentStatus={activeOrder.status} 
                    icon="fa-clock" 
                    label="Order Received" 
                  />
                  <TrackingStep 
                    status="Preparing" 
                    currentStatus={activeOrder.status} 
                    icon="fa-fire-burner" 
                    label="Chef is cooking" 
                  />
                  <TrackingStep 
                    status="Out for Delivery" 
                    currentStatus={activeOrder.status} 
                    icon="fa-motorcycle" 
                    label="Rider is on the way" 
                  />
                  <TrackingStep 
                    status="Delivered" 
                    currentStatus={activeOrder.status} 
                    icon="fa-house-circle-check" 
                    label="Enjoy your meal!" 
                  />
               </div>
            </div>

            <div className="bg-gray-50 rounded-3xl border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
               <div className="w-full h-48 bg-gray-200 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                  <i className="fa-solid fa-map-location-dot text-4xl text-gray-400"></i>
                  {riderLocation && activeOrder.status === OrderStatus.OUT_FOR_DELIVERY && (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-10 h-10 bg-[#FF5F00] text-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
                         <i className="fa-solid fa-motorcycle"></i>
                       </div>
                    </div>
                  )}
               </div>
               <div className="space-y-2">
                 <p className="font-black text-gray-900">Rider Location Simulation</p>
                 {riderLocation ? (
                   <p className="font-mono text-[10px] text-[#FF5F00] uppercase font-bold tracking-widest">
                     GPS: {riderLocation.lat.toFixed(4)}, {riderLocation.lng.toFixed(4)}
                   </p>
                 ) : (
                   <p className="text-sm text-gray-400">Waiting for rider to start shift...</p>
                 )}
               </div>
            </div>
          </div>
        </section>
      )}

      {!selectedStore ? (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Partner Restaurants</h2>
            <div className="flex gap-2">
               <button className="w-10 h-10 rounded-full border flex items-center justify-center text-gray-400 hover:text-gray-900"><i className="fa-solid fa-chevron-left"></i></button>
               <button className="w-10 h-10 rounded-full border flex items-center justify-center text-gray-400 hover:text-gray-900"><i className="fa-solid fa-chevron-right"></i></button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_STORES.map(store => (
              <div 
                key={store.id} 
                onClick={() => handleStoreClick(store)}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="h-48 overflow-hidden relative">
                  <img src={store.image} alt={store.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    15-20 min
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-lg">{store.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                      <i className="fa-solid fa-star"></i> {store.rating}
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm font-medium">{store.cuisine}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="animate-in fade-in zoom-in-95 duration-500">
          <button 
            onClick={() => setSelectedStore(null)}
            className="mb-8 flex items-center gap-2 text-gray-500 hover:text-[#FF5F00] transition-colors font-bold group"
          >
            <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Back to Exploration
          </button>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-end gap-6 mb-10">
                <img src={selectedStore.image} className="w-32 h-32 rounded-[2rem] object-cover shadow-2xl border-4 border-white" alt={selectedStore.name} />
                <div className="pb-2">
                  <h2 className="text-4xl font-black text-gray-900">{selectedStore.name}</h2>
                  <div className="mt-2 flex items-center gap-4 text-sm font-bold text-gray-500">
                     <span className="flex items-center gap-1 text-yellow-500"><i className="fa-solid fa-star"></i> {selectedStore.rating}</span>
                     <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                     <span>{selectedStore.cuisine}</span>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-[#FF5F00]/5 rounded-[2.5rem] border border-[#FF5F00]/10 mb-10 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#FF5F00]/10 rounded-full blur-2xl"></div>
                <p className="text-[10px] font-black text-[#FF5F00] uppercase tracking-widest mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-wand-magic-sparkles"></i> AI Recommendation
                </p>
                <p className="text-gray-800 leading-relaxed italic text-lg font-medium">"{summary}"</p>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-black">Today's Specials</h3>
                {MOCK_MENU.map(item => (
                  <div key={item.id} className="flex items-center gap-6 p-6 rounded-3xl border bg-white hover:border-[#FF5F00]/30 hover:shadow-lg transition-all group">
                    <img src={item.image} className="w-24 h-24 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt={item.name} />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500 leading-snug">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-xl text-gray-900 mb-3">${item.price}</p>
                      <button 
                        onClick={() => addToCart(item)}
                        className="px-6 py-2 bg-[#FF5F00] text-white rounded-xl font-bold text-sm hover:shadow-xl hover:scale-110 active:scale-95 transition-all"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sticky top-6 h-fit">
              <div className="bg-gray-900 text-white rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative">
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF5F00]/30 rounded-full blur-3xl"></div>
                 <h3 className="text-xl font-black mb-8 relative z-10">Checkout Cart</h3>
                 {cart.length === 0 ? (
                    <div className="text-center py-10 relative z-10">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-white/20">
                        <i className="fa-solid fa-cart-shopping text-3xl"></i>
                      </div>
                      <p className="text-gray-400 font-bold">Your cart is empty</p>
                      <p className="text-xs text-gray-500 mt-2">Hungry? Let's fix that.</p>
                    </div>
                 ) : (
                   <div className="relative z-10">
                     <div className="space-y-5 mb-8">
                       {cart.map((item, idx) => (
                         <div key={idx} className="flex justify-between items-center text-sm">
                           <span className="font-medium text-gray-300">{item.name}</span>
                           <span className="font-bold">${item.price}</span>
                         </div>
                       ))}
                     </div>
                     <div className="pt-6 border-t border-white/10 flex justify-between font-black text-2xl mb-8">
                        <span className="text-gray-400 text-lg">Total</span>
                        <span>${cart.reduce((s, i) => s + i.price, 0).toFixed(2)}</span>
                     </div>
                     <button 
                       onClick={handleCheckout}
                       className="w-full py-5 bg-[#FF5F00] text-white rounded-2xl font-black text-lg shadow-xl hover:bg-[#e05400] transition-colors active:scale-95"
                     >
                        Place My Order
                     </button>
                   </div>
                 )}
              </div>
              <p className="mt-4 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">Secure Checkout Powered by FASTgo</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const TrackingStep = ({ status, currentStatus, icon, label }: any) => {
  const getStatusColor = () => {
    const states = ["Pending", "Preparing", "Out for Delivery", "Delivered"];
    const currentIndex = states.indexOf(currentStatus);
    const stepIndex = states.indexOf(status);

    if (currentIndex === stepIndex) return "text-[#FF5F00]";
    if (currentIndex > stepIndex) return "text-green-500";
    return "text-gray-300";
  };

  const isActive = status === currentStatus;
  const isCompleted = ["Pending", "Preparing", "Out for Delivery", "Delivered"].indexOf(currentStatus) > ["Pending", "Preparing", "Out for Delivery", "Delivered"].indexOf(status);

  return (
    <div className="flex items-center gap-6 relative z-10">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] shadow-sm transition-colors ${
        isActive ? 'bg-[#FF5F00] text-white scale-110 ring-4 ring-[#FF5F00]/20' : 
        isCompleted ? 'bg-green-500 text-white' : 'bg-white border text-gray-300'
      }`}>
        <i className={`fa-solid ${isCompleted ? 'fa-check' : icon}`}></i>
      </div>
      <div>
        <p className={`text-sm font-black uppercase tracking-tight ${getStatusColor()}`}>{label}</p>
        {isActive && <p className="text-[10px] text-gray-400 font-bold animate-pulse">Processing...</p>}
      </div>
    </div>
  );
};

export default DashboardCustomer;