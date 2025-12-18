
export enum UserRole {
  CUSTOMER = 'customer',
  RIDER = 'rider',
  STORE = 'store_owner',
  ADMIN = 'admin'
}

export enum OrderStatus {
  PENDING = 'Pending',
  PREPARING = 'Preparing',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export interface Store {
  id: string;
  name: string;
  rating: number;
  image: string;
  cuisine: string;
}

export interface Order {
  id: string;
  customerId: string;
  storeId: string;
  riderId?: string;
  status: OrderStatus;
  total: number;
  items: { name: string; quantity: number; price: number }[];
  timestamp: Date;
  location: { lat: number; lng: number };
}

export interface RiderLocation {
  riderId: string;
  lat: number;
  lng: number;
}
