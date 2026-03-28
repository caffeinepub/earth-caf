import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MenuItem {
    name: string;
    description: string;
    available: boolean;
    blobId: string;
    category: string;
    price: string;
}
export interface GalleryImage {
    title: string;
    blobId: string;
    category: string;
}
export interface Booking {
    status: string;
    date: string;
    createdAt: bigint;
    fullName: string;
    email: string;
    phone: string;
    guests: bigint;
    timeSlot: string;
}
export interface DashboardStats {
    pendingBookings: bigint;
    totalBookings: bigint;
    confirmedBookings: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addGalleryImage(title: string, category: string, blobId: string): Promise<GalleryImage>;
    addMenuItem(name: string, description: string, price: string, category: string, blobId: string, available: boolean): Promise<MenuItem>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBooking(fullName: string, phone: string, email: string, guests: bigint, date: string, timeSlot: string): Promise<Booking>;
    deleteGalleryImage(id: string): Promise<void>;
    deleteMenuItem(id: string): Promise<void>;
    getAllBookings(): Promise<Array<Booking>>;
    getAvailableSlots(date: string): Promise<Array<string>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardStats(): Promise<DashboardStats>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listGalleryImages(): Promise<Array<GalleryImage>>;
    listMenuItems(): Promise<Array<MenuItem>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBookingStatus(id: string, status: string): Promise<Booking>;
    updateGalleryImage(id: string, title: string, category: string, blobId: string): Promise<GalleryImage>;
    updateMenuItem(id: string, name: string, description: string, price: string, category: string, blobId: string, available: boolean): Promise<MenuItem>;
}
