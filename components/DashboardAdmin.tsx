
import React, { useState, useEffect } from 'react';
import { getAdminInsights } from '../services/geminiService';
import { OrderStatus } from '../types';
import { useGlobalState } from '../state/GlobalStore';

const DashboardAdmin: React.FC = () => {
  const [insight, setInsight] = useState<string>("Analyzing current system flow...");
  const { orders, notifications } = useGlobalState();

  const stats = {
    activeOrders: orders.filter(o => o.status !== OrderStatus.DELIVERED).length,
    onlineRiders: 12,
    todayRevenue: orders.reduce((sum, o) => sum + o.total, 0)
  };

  useEffect(() => {
    getAdminInsights(stats).then(setInsight);
  }, [orders.length]);

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">System Command</h1>
          <p className="text-gray-500">Live view of ecosystem operations</p>
        </div>
        <div className="bg-[#FF5F00]/10 p-4 rounded-2xl border border-[#FF5F00]/20 flex items-center gap-3 max-w-md">
           <i className="fa-solid fa-wand-magic-sparkles text-[#FF5F00]"></i>
           <p className="text-sm font-medium text-[#FF5F00]">{insight}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Orders" value={orders.length} icon="fa-shopping-cart" color="blue" />
        <StatCard title="Active Now" value={stats.activeOrders} icon="fa-motorcycle" color="green" />
        <StatCard title="Revenue" value={`$${stats.todayRevenue.toFixed(2)}`} icon="fa-dollar-sign" color="orange" />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white rounded-3xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b font-bold">Recent Order History</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase font-bold text-gray-400">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold">{order.id}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-700' :
                        order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold">${order.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3xl border p-6">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <i className="fa-solid fa-bolt text-[#FF5F00]"></i> Real-time Activity Log
          </h3>
          <div className="space-y-4">
             {notifications.map((n, i) => (
               <div key={i} className="flex gap-3 text-sm animate-in slide-in-from-right-2">
                 <div className="w-1 h-10 bg-[#FF5F00] rounded-full"></div>
                 <div className="py-1">
                   <p className="font-medium text-gray-800">{n}</p>
                   <p className="text-[10px] text-gray-400 uppercase">Just now</p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => {
  const colors: any = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    orange: 'text-[#FF5F00] bg-orange-50',
  };
  return (
    <div className="bg-white p-8 rounded-3xl border shadow-sm flex items-center gap-6">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${colors[color]}`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{title}</p>
        <p className="text-2xl font-black">{value}</p>
      </div>
    </div>
  );
};

export default DashboardAdmin;
