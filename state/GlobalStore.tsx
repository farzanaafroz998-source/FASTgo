import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { supabase } from '../services/supabaseClient';

interface GlobalState {
  orders: Order[];
  placeOrder: (order: any) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  assignRider: (orderId: string, riderId: string) => Promise<void>;
  riderLocation: { lat: number; lng: number } | null;
  updateRiderLocation: (lat: number, lng: number) => Promise<void>;
  notifications: string[];
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [riderLocation, setRiderLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);

  // 1. Initial Data Fetch & Realtime
  useEffect(() => {
    if (!supabase) return;

    const fetchInitialData = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Fetch Error:", error);
      } else if (data) {
        setOrders(data);
      }
    };

    fetchInitialData();

    const orderSubscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setOrders(prev => [payload.new as Order, ...prev]);
          setNotifications(prev => [`New Order received!`, ...prev].slice(0, 10));
        } else if (payload.eventType === 'UPDATE') {
          setOrders(prev => prev.map(o => o.id === payload.new.id ? (payload.new as Order) : o));
          setNotifications(prev => [`Order status updated to ${payload.new.status}`, ...prev].slice(0, 10));
        }
      })
      .subscribe();

    const riderSubscription = supabase
      .channel('public:rider_locations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rider_locations' }, (payload) => {
        setRiderLocation({ lat: payload.new.lat, lng: payload.new.lng });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(orderSubscription);
      supabase.removeChannel(riderSubscription);
    };
  }, []);

  const placeOrder = async (order: any) => {
    if (!supabase) {
      // Mock Mode
      const mockOrder = { ...order, id: `MOCK-${Date.now()}` };
      setOrders(prev => [mockOrder, ...prev]);
      setNotifications(prev => ["Order placed (Mock Mode)", ...prev].slice(0, 10));
      return;
    }
    await supabase.from('orders').insert([order]);
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    if (!supabase) {
      // Mock Mode
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      setNotifications(prev => [`Status updated to ${status} (Mock Mode)`, ...prev].slice(0, 10));
      return;
    }
    await supabase.from('orders').update({ status }).eq('id', orderId);
  };

  const assignRider = async (orderId: string, riderId: string) => {
    if (!supabase) {
      // Mock Mode
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, riderId, status: OrderStatus.PREPARING } : o));
      setNotifications(prev => [`Rider ${riderId} assigned to order (Mock Mode)`, ...prev].slice(0, 10));
      return;
    }
    await supabase.from('orders').update({ rider_id: riderId, status: OrderStatus.PREPARING }).eq('id', orderId);
  };

  const updateRiderLocation = async (lat: number, lng: number) => {
    setRiderLocation({ lat, lng });
    
    if (!supabase) return;

    // Optional: Only update if user is authenticated and is a rider
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('rider_locations').upsert({ 
        rider_id: user.id, 
        lat, 
        lng, 
        updated_at: new Date() 
      });
    }
  };

  return (
    <GlobalContext.Provider value={{ 
      orders, placeOrder, updateOrderStatus, assignRider,
      riderLocation, updateRiderLocation,
      notifications
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error('useGlobalState must be used within GlobalProvider');
  return context;
};