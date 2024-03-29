/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
/**
 * Generated by pullcode v1.2.1.
 * Don't edit!
 *
 * @module types
 */

export interface Order {
  id: number;
  petId: number;
  quantity: number;
  shipDate: string;
  /**
   * Order Status
   */
  status: OrderStatusEnum;
  complete: boolean;
}

export enum OrderStatusEnum {
  PLACED = "placed",
  APPROVED = "approved",
  DELIVERED = "delivered",
}
export interface Customer {
  id: number;
  username: string;
  address: Address[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  /**
   * User Status
   */
  userStatus: number;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Pet {
  id?: number;
  name: string;
  category?: Category;
  photoUrls: string[];
  tags?: Tag[];
  /**
   * pet status in the store
   */
  status?: PetStatusEnum;
}

export enum PetStatusEnum {
  AVAILABLE = "available",
  PENDING = "pending",
  SOLD = "sold",
}
export interface ApiResponse {
  code: number;
  type: string;
  message: string;
}
