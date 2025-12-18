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

  // Helper to map DB snake_case to Frontend camelCase
  const mapOrder = (dbOrder: any): Order => ({
    id: dbOrder.id,
    customerId: dbOrder.customer_id,
    storeId: dbOrder.store_id,
    riderId: dbOrder.rider_id,
    status: dbOrder.status as OrderStatus,
    total: parseFloat(dbOrder.total),
    items: dbOrder.items,
    timestamp: new Date(dbOrder.created_at),
    location: { lat: dbOrder.delivery_lat, lng: dbOrder.delivery_lng }
  });

  // 1. Initial Data Fetch & Realtime
  useEffect(() => {
    if (!supabase) {
        console.warn("GlobalStore: Supabase client is null. Realtime disabled.");
        return;
    }

    const fetchInitialData = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("FASTgo Fetch Error:", error.message);
      } else if (data) {
        setOrders(data.map(mapOrder));
      }
    };

    fetchInitialData();

    // Subscribe to Orders
    const orderSubscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        console.log('Order Change Received:', payload);
        if (payload.eventType === 'INSERT') {
          const newOrder = mapOrder(payload.new);
          setOrders(prev => [newOrder, ...prev]);
          setNotifications(prev => [`New Order: ${newOrder.id}`, ...prev].slice(0, 10));
        } else if (payload.eventType === 'UPDATE') {
          const updatedOrder = mapOrder(payload.new);
          setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
          setNotifications(prev => [`Order ${updatedOrder.id} is now ${updatedOrder.status}`, ...prev].slice(0, 10));
        }
      })
      .subscribe();

    // Subscribe to Rider Locations
    const riderSubscription = supabase
      .channel('public:rider_locations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rider_locations' }, (payload) => {
        console.log('Location update received:', payload.new);
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
      const mockOrder = { ...order, id: `MOCK-${Date.now()}` };
      setOrders(prev => [mockOrder, ...prev]);
      setNotifications(prev => ["Order placed (Mock Mode)", ...prev].slice(0, 10));
      return;
    }

    const dbPayload = {
        customer_id: order.customerId,
        store_id: order.storeId,
        status: order.status,
        total: order.total,
        items: order.items,
        delivery_lat: order.location.lat,
        delivery_lng: order.location.lng
    };

    const { error } = await supabase.from('orders').insert([dbPayload]);
    if (error) console.error("Place Order Error:", error.message);
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    if (!supabase) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      setNotifications(prev => [`Status updated to ${status} (Mock Mode)`, ...prev].slice(0, 10));
      return;
    }
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) console.error("Update Status Error:", error.message);
  };

  const assignRider = async (orderId: string, riderId: string) => {
    if (!supabase) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, riderId, status: OrderStatus.PREPARING } : o));
      setNotifications(prev => [`Rider ${riderId} assigned (Mock Mode)`, ...prev].slice(0, 10));
      return;
    }
    // Note: In a real app, riderId would be a UUID from auth
    const { error } = await supabase.from('orders').update({ 
        rider_id: riderId, 
        status: OrderStatus.PREPARING 
    }).eq('id', orderId);
    if (error) console.error("Assign Rider Error:", error.message);
  };

  const updateRiderLocation = async (lat: number, lng: number) => {
    setRiderLocation({ lat, lng });
    
    if (!supabase) return;

    // Fetch session to get current rider's ID
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('rider_locations').upsert({ 
        rider_id: session.user.id, 
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