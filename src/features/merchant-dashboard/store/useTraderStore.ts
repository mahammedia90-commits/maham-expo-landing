import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Types ───────────────────────────────────────────────────────────────────

export type KYCStatus = "none" | "pending" | "verified" | "rejected";

export interface TraderProfile {
  phone: string;
  name: string;
  companyName: string;
  activity: string;
  region: string;
  kycStatus: KYCStatus;
  documentsUploaded: boolean;
  accountVerified: boolean;
  registeredAt: string;
}

export interface KYCData {
  fullName: string;
  idNumber: string;
  phone: string;
  email: string;
  dob: string;
  nationality: string;
  city: string;
  address: string;
  companyName: string;
  crNumber: string;
  businessType: string;
  founded: string;
  employees: string;
  website: string;
  vatNumber: string;
  nationalAddress: string;
  bankName: string;
  iban: string;
  accountHolder: string;
  accountNumber: string;
}

export interface BookingRecord {
  id: string;
  expoId: string;
  expoNameAr: string;
  expoNameEn: string;
  unitAr: string;
  unitEn: string;
  zone: string;
  boothType: string;
  boothSize: string;
  price: number;
  deposit: number;
  paidAmount: number;
  remainingAmount: number;
  status:
    | "pending_review"
    | "approved"
    | "pending_payment"
    | "confirmed"
    | "active"
    | "cancelled"
    | "rejected";
  paymentStatus: "unpaid" | "deposit_paid" | "fully_paid";
  contractGenerated: boolean;
  contractId: string | null;
  createdAt: string;
  services: string[];
  location: string;
}

export interface PaymentRecord {
  id: string;
  bookingId: string;
  amount: number;
  method: string;
  status: "completed" | "pending" | "failed";
  type: "deposit" | "installment" | "full_payment";
  date: string;
  descAr: string;
  descEn: string;
}

export interface ContractRecord {
  id: string;
  bookingId: string;
  paymentId: string;
  expoName: string;
  expoNameAr: string;
  boothNumber: string;
  boothSize: string;
  totalValue: number;
  deposit: number;
  remaining: number;
  status: "signed" | "pending_signature" | "draft";
  createdAt: string;
  expiresAt: string;
  sentVia: string[];
}

export interface Notification {
  id: string;
  type: "booking" | "payment" | "contract" | "system";
  titleAr: string;
  titleEn: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

// ─── Store Interface ─────────────────────────────────────────────────────────

interface TraderState {
  // State
  isAuthenticated: boolean;
  trader: TraderProfile | null;
  kycData: KYCData | null;
  bookings: BookingRecord[];
  payments: PaymentRecord[];
  contracts: ContractRecord[];
  notifications: Notification[];
  unreadCount: number;
  pendingBookingsCount: number;

  // Actions
  saveKYCData: (data: KYCData) => void;
  addBooking: (booking: BookingRecord) => void;
  updateBookingPayment: (
    bookingId: string,
    paidAmount: number,
    paymentStatus: BookingRecord["paymentStatus"]
  ) => void;
  updateBookingStatus: (
    bookingId: string,
    status: BookingRecord["status"]
  ) => void;
  addPayment: (payment: PaymentRecord) => void;
  addContract: (contract: ContractRecord) => void;
  markContractSent: (contractId: string, method: string) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllRead: () => void;
  addPendingBooking: (booking: BookingRecord) => void;
  completeKYC: () => void;
  logout: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function generateId(prefix: string): string {
  const year = new Date().getFullYear();
  const random = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${year}-${random}`;
}

// ─── Initial State ───────────────────────────────────────────────────────────

const initialState = {
  isAuthenticated: false,
  trader: null,
  kycData: null,
  bookings: [],
  payments: [],
  contracts: [],
  notifications: [],
  unreadCount: 0,
  pendingBookingsCount: 0,
};

// ─── Store ───────────────────────────────────────────────────────────────────

export const useTraderStore = create<TraderState>()(
  persist(
    (set, get) => ({
      ...initialState,

      saveKYCData: (data: KYCData) => {
        set({
          kycData: data,
          trader: get().trader
            ? { ...get().trader!, kycStatus: "pending", documentsUploaded: true }
            : null,
        });
      },

      addBooking: (booking: BookingRecord) => {
        set((state) => ({
          bookings: [...state.bookings, booking],
        }));
      },

      updateBookingPayment: (
        bookingId: string,
        paidAmount: number,
        paymentStatus: BookingRecord["paymentStatus"]
      ) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId
              ? {
                  ...b,
                  paidAmount: b.paidAmount + paidAmount,
                  remainingAmount: b.remainingAmount - paidAmount,
                  paymentStatus,
                }
              : b
          ),
        }));
      },

      updateBookingStatus: (
        bookingId: string,
        status: BookingRecord["status"]
      ) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status } : b
          ),
          pendingBookingsCount:
            status !== "pending_review"
              ? state.pendingBookingsCount - 1
              : state.pendingBookingsCount,
        }));
      },

      addPayment: (payment: PaymentRecord) => {
        set((state) => ({
          payments: [...state.payments, payment],
        }));
      },

      addContract: (contract: ContractRecord) => {
        set((state) => ({
          contracts: [...state.contracts, contract],
          bookings: state.bookings.map((b) =>
            b.id === contract.bookingId
              ? { ...b, contractGenerated: true, contractId: contract.id }
              : b
          ),
        }));
      },

      markContractSent: (contractId: string, method: string) => {
        set((state) => ({
          contracts: state.contracts.map((c) =>
            c.id === contractId
              ? { ...c, sentVia: [...c.sentVia, method] }
              : c
          ),
        }));
      },

      addNotification: (notification: Notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },

      markNotificationRead: (notificationId: string) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },

      markAllRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            read: true,
          })),
          unreadCount: 0,
        }));
      },

      addPendingBooking: (booking: BookingRecord) => {
        set((state) => ({
          bookings: [
            ...state.bookings,
            { ...booking, status: "pending_review" as const },
          ],
          pendingBookingsCount: state.pendingBookingsCount + 1,
        }));
      },

      completeKYC: () => {
        set({
          trader: get().trader
            ? {
                ...get().trader!,
                kycStatus: "verified" as const,
                accountVerified: true,
              }
            : null,
        });
      },

      logout: () => {
        set(initialState);
      },
    }),
    {
      name: "maham-trader-store",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        trader: state.trader,
        kycData: state.kycData,
        bookings: state.bookings,
        payments: state.payments,
        contracts: state.contracts,
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        pendingBookingsCount: state.pendingBookingsCount,
      }),
    }
  )
);
