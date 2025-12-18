import React from 'react';
import { MOCK_MENU } from '../constants';
import { useGlobalState } from '../state/GlobalStore';
import { OrderStatus } from '../types';

const DashboardStore: React.FC = () => {
  const { orders, updateOrderStatus } = useGlobalState();
  
  // Filter orders that belong to this store (using mock ID 's1')
  const storeOrders = orders.filter(o => o.storeId === 's1' && o.status !== OrderStatus.DELIVERED);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black">Burger King Management</h1>
          <p className="text-gray-500">Live Dashboard • Store ID: s1</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full border border-green-100">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <span className="text-xs font-bold uppercase">Online</span>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
           <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="font-bold text-lg text-gray-900">Incoming Orders</h2>
                <span className="bg-[#FF5F00] text-white text-[10px] px-2 py-1 rounded-full font-black">
                  {storeOrders.length} ACTIVE
                </span>
              </div>
              
              {storeOrders.length === 0 ? (
                <div className="p-20 text-center text-gray-400">
                   <i className="fa-solid fa-receipt text-5xl mb-4 opacity-10"></i>
                   <p className="font-medium">All caught up!</p>
                   <p className="text-sm">New orders will appear here automatically.</p>
                </div>
              ) : (
                <div className="divide-y">
                  {storeOrders.map(order => (
                    <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-black text-gray-900">{order.id}</p>
                          <p className="text-xs text-gray-500 uppercase font-bold tracking-tight">
                            {new Date(order.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="space-y-1 mb-6">
                        {order.items.map((item, i) => (
                          <p key={i} className="text-sm text-gray-600">
                            <span className="font-bold">{item.quantity}x</span> {item.name}
                          </p>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        {order.status === OrderStatus.PENDING && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, OrderStatus.PREPARING)}
                            className="flex-1 py-3 bg-[#FF5F00] text-white rounded-xl font-bold text-sm shadow-md hover:scale-[1.02] transition-transform"
                          >
                            Start Preparing
                          </button>
                        )}
                        {order.status === OrderStatus.PREPARING && (
                          <button 
                            className="flex-1 py-3 bg-gray-100 text-gray-400 rounded-xl font-bold text-sm cursor-not-allowed"
                            disabled
                          >
                            Waiting for Rider...
                          </button>
                        )}
                        <button className="px-4 py-3 bg-gray-50 text-gray-500 rounded-xl border font-bold text-sm">
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
           </div>

           <div className="mt-8 bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-6 border-b font-bold text-lg">Menu Management</div>
              <div className="divide-y">
                {MOCK_MENU.map(item => (
                  <div key={item.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={item.image} className="w-16 h-16 rounded-xl object-cover" alt="" />
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-sm text-gray-500">${item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="flex items-center gap-2">
                         <span className="text-[10px] font-black uppercase text-green-500">Live</span>
                         <div className="w-10 h-5 bg-green-500 rounded-full relative shadow-inner">
                            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                         </div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5F00]/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Today's Performance</p>
              <h2 className="text-4xl font-black mb-6">$842.10</h2>
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Total Sales</span>
                  <span className="font-bold">24 Orders</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Completion</span>
                  <span className="font-bold text-green-400">98%</span>
                </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-6">Quick Settings</h3>
              <div className="space-y-4">
                 <button className="w-full p-4 bg-gray-50 rounded-2xl flex items-center justify-between hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-clock text-[#FF5F00]"></i>
                      <span className="text-sm font-bold">Store Hours</span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-xs text-gray-300"></i>
                 </button>
                 <button className="w-full p-4 bg-gray-50 rounded-2xl flex items-center justify-between hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-bullhorn text-[#FF5F00]"></i>
                      <span className="text-sm font-bold">Promotion</span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-xs text-gray-300"></i>
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStore;