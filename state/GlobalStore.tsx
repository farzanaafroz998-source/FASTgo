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

  // Maps database snake_case to frontend camelCase
  const mapOrder = (db: any): Order => ({
    id: db.id,
    customerId: db.customer_id,
    storeId: db.store_id,
    riderId: db.rider_id || undefined,
    status: db.status as OrderStatus,
    total: parseFloat(db.total || 0),
    items: Array.isArray(db.items) ? db.items : [],
    timestamp: new Date(db.created_at || Date.now()),
    location: { 
      lat: parseFloat(db.delivery_lat || 0), 
      lng: parseFloat(db.delivery_lng || 0) 
    }
  });

  useEffect(() => {
    if (!supabase) return;

    const fetchInitialData = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        if (data) setOrders(data.map(mapOrder));
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
      }
    };

    fetchInitialData();

    // Set up Realtime Subscriptions
    const orderChannel = supabase.channel('order-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newOrder = mapOrder(payload.new);
          setOrders(prev => [newOrder, ...prev]);
          setNotifications(prev => [`New Order! ID: ${newOrder.id.slice(0,8)}`, ...prev].slice(0, 10));
        } else if (payload.eventType === 'UPDATE') {
          const updated = mapOrder(payload.new);
          setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
          setNotifications(prev => [`Order ${updated.id.slice(0,4)} status: ${updated.status}`, ...prev].slice(0, 10));
        }
      })
      .subscribe();

    const locationChannel = supabase.channel('rider-locations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rider_locations' }, (payload) => {
        if (payload.new && payload.new.lat && payload.new.lng) {
          setRiderLocation({ 
            lat: parseFloat(payload.new.lat), 
            lng: parseFloat(payload.new.lng) 
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(locationChannel);
    };
  }, []);

  const placeOrder = async (order: any) => {
    if (!supabase) {
      // Mock mode fallback
      const mockOrder = { ...order, id: 'MOCK-' + Math.random().toString(36).substr(2, 9) };
      setOrders(prev => [mockOrder, ...prev]);
      return;
    }

    try {
      const { error } = await supabase.from('orders').insert([{
        customer_id: order.customerId,
        store_id: order.storeId,
        status: order.status,
        total: order.total,
        items: order.items,
        delivery_lat: order.location.lat,
        delivery_lng: order.location.lng
      }]);
      if (error) throw error;
    } catch (err) {
      console.error("Error placing order:", err);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    if (!supabase) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      return;
    }

    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
      if (error) throw error;
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const assignRider = async (orderId: string, riderId: string) => {
    if (!supabase) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, riderId, status: OrderStatus.PREPARING } : o));
      return;
    }

    try {
      const { error } = await supabase.from('orders').update({ 
        rider_id: riderId, 
        status: OrderStatus.PREPARING 
      }).eq('id', orderId);
      if (error) throw error;
    } catch (err) {
      console.error("Error assigning rider:", err);
    }
  };

  const updateRiderLocation = async (lat: number, lng: number) => {
    // Optimistic local update
    setRiderLocation({ lat, lng });
    
    if (!supabase) return;

    try {
      await supabase.from('rider_locations').upsert({ 
        rider_id: 'RIDER-01', // Simulation of current authenticated rider
        lat, 
        lng, 
        updated_at: new Date() 
      });
    } catch (err) {
      console.warn("Location upsert failed:", err);
    }
  };

  return (
    <GlobalContext.Provider value={{ 
      orders, placeOrder, updateOrderStatus, assignRider,
      riderLocation, updateRiderLocation, notifications
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