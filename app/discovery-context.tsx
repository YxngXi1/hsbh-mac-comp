"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ItemCategory =
  | "Genre"
  | "Accessories"
  | "Fashion"
  | "Food"
  | "Lifestyle"
  | "Art/Entertainment"
  | "Surprise";

export type CreatorItem = {
  id: string;
  name: string;
  business: string;
  category: ItemCategory;
  description: string;
};

export type DiscoveryOrderSection = {
  requestedCategory: ItemCategory;
  selectedItemId: string | null;
};

export type DiscoveryOrder = {
  id: string;
  status: "pending" | "completed";
  createdAt: string;
  sections: DiscoveryOrderSection[];
};

type DiscoveryContextValue = {
  items: CreatorItem[];
  orders: DiscoveryOrder[];
  addItem: (item: Omit<CreatorItem, "id">) => void;
  removeItem: (itemId: string) => void;
  submitOrder: (categories: ItemCategory[]) => string;
  deleteOrder: (orderId: string) => void;
  resetOrders: () => void;
  assignItemToOrderSection: (
    orderId: string,
    sectionIndex: number,
    itemId: string
  ) => void;
  completeOrder: (orderId: string) => void;
  resetDemoData: () => void;
};

const ITEMS_STORAGE_KEY = "discovery-items-v1";
const ORDERS_STORAGE_KEY = "discovery-orders-v1";

const starterItems: CreatorItem[] = [
  {
    id: "starter-1",
    name: "Shea Glow Body Butter",
    business: "Melanin Bloom Naturals",
    category: "Lifestyle",
    description: "Hydrating whipped shea butter with citrus scent.",
  },
  {
    id: "starter-2",
    name: "Kente Street Tote",
    business: "Rooted Thread Co.",
    category: "Fashion",
    description: "Everyday tote made with Ghana-inspired print details.",
  },
  {
    id: "starter-3",
    name: "Jollof Spice Blend",
    business: "Savor Diaspora Kitchen",
    category: "Food",
    description: "A mild spice mix to season rice, stews, and proteins.",
  },
];

const DiscoveryContext = createContext<DiscoveryContextValue | undefined>(
  undefined
);

export function DiscoveryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CreatorItem[]>(() => {
    if (typeof window === "undefined") return starterItems;
    try {
      const raw = localStorage.getItem(ITEMS_STORAGE_KEY);
      if (!raw) return starterItems;
      const parsed = JSON.parse(raw) as CreatorItem[];
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : starterItems;
    } catch {
      return starterItems;
    }
  });

  const [orders, setOrders] = useState<DiscoveryOrder[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as DiscoveryOrder[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore localStorage write errors.
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // Ignore localStorage write errors.
    }
  }, [orders]);

  const value = useMemo<DiscoveryContextValue>(() => {
    return {
      items,
      orders,
      addItem: (item) => {
        const id =
          globalThis.crypto?.randomUUID?.() ??
          `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        setItems((current) => [
          ...current,
          { ...item, id },
        ]);
      },
      removeItem: (itemId) => {
        setItems((current) => current.filter((item) => item.id !== itemId));
        setOrders((current) =>
          current.map((order) => ({
            ...order,
            sections: order.sections.map((section) =>
              section.selectedItemId === itemId
                ? { ...section, selectedItemId: null }
                : section
            ),
          }))
        );
      },
      submitOrder: (categories) => {
        const id =
          globalThis.crypto?.randomUUID?.() ??
          `${Date.now()}-${Math.random().toString(36).slice(2)}`;

        const newOrder: DiscoveryOrder = {
          id,
          status: "pending",
          createdAt: new Date().toISOString(),
          sections: categories.map((category) => ({
            requestedCategory: category,
            selectedItemId: null,
          })),
        };

        setOrders((current) => [newOrder, ...current]);
        return id;
      },
      deleteOrder: (orderId) => {
        setOrders((current) => current.filter((order) => order.id !== orderId));
      },
      resetOrders: () => {
        setOrders([]);
        try {
          localStorage.removeItem(ORDERS_STORAGE_KEY);
        } catch {
          // Ignore localStorage errors.
        }
      },
      assignItemToOrderSection: (orderId, sectionIndex, itemId) => {
        setOrders((current) =>
          current.map((order) => {
            if (order.id !== orderId) return order;
            return {
              ...order,
              sections: order.sections.map((section, index) =>
                index === sectionIndex
                  ? { ...section, selectedItemId: itemId }
                  : section
              ),
            };
          })
        );
      },
      completeOrder: (orderId) => {
        setOrders((current) =>
          current.map((order) => {
            if (order.id !== orderId) return order;
            const allAssigned = order.sections.every(
              (section) => section.selectedItemId !== null
            );
            return allAssigned ? { ...order, status: "completed" } : order;
          })
        );
      },
      resetDemoData: () => {
        setItems([]);
        setOrders([]);
        try {
          localStorage.removeItem(ITEMS_STORAGE_KEY);
          localStorage.removeItem(ORDERS_STORAGE_KEY);
        } catch {
          // Ignore localStorage errors.
        }
      },
    };
  }, [items, orders]);

  return (
    <DiscoveryContext.Provider value={value}>
      {children}
    </DiscoveryContext.Provider>
  );
}

export function useDiscovery() {
  const context = useContext(DiscoveryContext);
  if (!context) {
    throw new Error("useDiscovery must be used inside DiscoveryProvider.");
  }
  return context;
}

export const CATEGORY_OPTIONS: ItemCategory[] = [
  "Genre",
  "Accessories",
  "Fashion",
  "Food",
  "Lifestyle",
  "Art/Entertainment",
  "Surprise",
];

export const CREATOR_CATEGORY_OPTIONS = CATEGORY_OPTIONS.filter(
  (category) => category !== "Surprise"
) as Exclude<ItemCategory, "Surprise">[];
