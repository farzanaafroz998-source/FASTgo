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

  // Robust mapper to ensure Frontend types match DB schema
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

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) setOrders(data.map(mapOrder));
    };

    fetchOrders();

    // Listen for Order changes
    const orderChannel = supabase.channel('order-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newOrder = mapOrder(payload.new);
          setOrders(prev => [newOrder, ...prev]);
          setNotifications(prev => [`New Order: ${newOrder.id.slice(0,8)}`, ...prev].slice(0, 10));
        } else if (payload.eventType === 'UPDATE') {
          const updated = mapOrder(payload.new);
          setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
          setNotifications(prev => [`Order updated: ${updated.status}`, ...prev].slice(0, 10));
        }
      })
      .subscribe();

    // Listen for Rider Location changes
    const locationChannel = supabase.channel('rider-tracking')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rider_locations' }, (payload) => {
        setRiderLocation({ lat: parseFloat(payload.new.lat), lng: parseFloat(payload.new.lng) });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(locationChannel);
    };
  }, []);

  const placeOrder = async (order: any) => {
    if (!supabase) {
      setOrders(prev => [{...order, id: 'MOCK-'+Date.now()}, ...prev]);
      return;
    }
    const { error } = await supabase.from('orders').insert([{
      customer_id: order.customerId,
      store_id: order.storeId,
      status: order.status,
      total: order.total,
      items: order.items,
      delivery_lat: order.location.lat,
      delivery_lng: order.location.lng
    }]);
    if (error) console.error("Place Order Error:", error);
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    if (!supabase) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      return;
    }
    await supabase.from('orders').update({ status }).eq('id', orderId);
  };

  const assignRider = async (orderId: string, riderId: string) => {
    if (!supabase) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, riderId, status: OrderStatus.PREPARING } : o));
      return;
    }
    await supabase.from('orders').update({ 
      rider_id: riderId, 
      status: OrderStatus.PREPARING 
    }).eq('id', orderId);
  };

  const updateRiderLocation = async (lat: number, lng: number) => {
    setRiderLocation({ lat, lng });
    if (!supabase) return;

    // Use a hardcoded or session-based rider ID
    await supabase.from('rider_locations').upsert({ 
      rider_id: 'RIDER-01', 
      lat, 
      lng, 
      updated_at: new Date() 
    });
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
  if (!context) throw new Error('useGlobalState error');
  return context;
};