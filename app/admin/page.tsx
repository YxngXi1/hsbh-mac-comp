"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CATEGORY_OPTIONS,
  type CreatorItem,
  type DiscoveryOrder,
  useDiscovery,
} from "../discovery-context";

type PopupData = {
  orderId: string;
  lines: string[];
};

export default function AdminPage() {
  const {
    items,
    orders,
    assignItemToOrderSection,
    completeOrder,
    deleteOrder,
    resetOrders,
    resetDemoData,
  } = useDiscovery();
  const [activeDropKey, setActiveDropKey] = useState<string | null>(null);
  const [popup, setPopup] = useState<PopupData | null>(null);

  const itemsByCategory = useMemo(() => {
    return CATEGORY_OPTIONS.reduce<Record<string, CreatorItem[]>>((acc, category) => {
      acc[category] = items.filter((item) => item.category === category);
      return acc;
    }, {});
  }, [items]);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      if (a.status === b.status) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.status === "pending" ? -1 : 1;
    });
  }, [orders]);

  function onDropItem(
    order: DiscoveryOrder,
    sectionIndex: number,
    requestedCategory: string,
    event: React.DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    setActiveDropKey(null);
    if (order.status === "completed") return;

    const itemId = event.dataTransfer.getData("text/item-id");
    const itemCategory = event.dataTransfer.getData("text/item-category");
    if (!itemId) return;

    const isAllowed =
      requestedCategory === "Surprise" || itemCategory === requestedCategory;
    if (!isAllowed) return;

    assignItemToOrderSection(order.id, sectionIndex, itemId);
  }

  function handleComplete(order: DiscoveryOrder) {
    const allAssigned = order.sections.every((section) => section.selectedItemId);
    if (!allAssigned) return;

    completeOrder(order.id);

    const lines = order.sections.map((section, index) => {
      const selectedItem = items.find((item) => item.id === section.selectedItemId);
      return `Section ${index + 1} (${section.requestedCategory}): ${
        selectedItem ? `${selectedItem.name} - ${selectedItem.business}` : "Unassigned"
      }`;
    });

    setPopup({ orderId: order.id, lines });
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-10 text-zinc-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold">Discovery Box Admin</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (confirm("Reset only orders? Creator items will be kept.")) {
                  resetOrders();
                  setPopup(null);
                }
              }}
              className="rounded-lg border border-zinc-400 bg-white px-3 py-2 text-sm"
            >
              Reset Orders Only
            </button>
            <button
              onClick={() => {
                if (
                  confirm(
                    "Reset all demo data? This deletes all creator items and all orders."
                  )
                ) {
                  resetDemoData();
                }
              }}
              className="rounded-lg border border-zinc-400 bg-white px-3 py-2 text-sm"
            >
              Reset Demo Data
            </button>
            <Link href="/" className="text-sm underline">
              Back home
            </Link>
          </div>
        </div>
        <p className="text-sm text-zinc-600">
          Drag products into each bento section. A section only accepts matching
          categories, except Surprise which accepts any item.
        </p>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_1.95fr]">
          <div className="rounded-xl border border-zinc-300 bg-white p-4">
            <h2 className="mb-4 text-xl font-medium">Items by Genre</h2>
            <div className="space-y-4">
              {CATEGORY_OPTIONS.map((category) => {
                const categoryItems = itemsByCategory[category] ?? [];
                return (
                  <article
                    key={category}
                    className="rounded-lg border border-zinc-200 p-3"
                  >
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-700">
                      {category}
                    </h3>
                    {categoryItems.length === 0 && (
                      <p className="text-xs text-zinc-500">
                        No items in this category.
                      </p>
                    )}
                    <div className="space-y-2">
                      {categoryItems.map((item) => (
                        <div
                          key={item.id}
                          draggable
                          onDragStart={(event) => {
                            event.dataTransfer.setData("text/item-id", item.id);
                            event.dataTransfer.setData(
                              "text/item-category",
                              item.category
                            );
                          }}
                          className="cursor-grab rounded-md border border-zinc-300 bg-zinc-50 p-2 active:cursor-grabbing"
                        >
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-zinc-600">{item.business}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-300 bg-white p-4">
            <h2 className="mb-4 text-xl font-medium">Orders to Build</h2>
            {sortedOrders.length === 0 && (
              <p className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-600">
                No orders yet. Place one from the shopper page.
              </p>
            )}
            <div className="space-y-5">
              {sortedOrders.map((order) => {
                const allAssigned = order.sections.every(
                  (section) => section.selectedItemId
                );
                return (
                  <article
                    key={order.id}
                    className="rounded-xl border border-zinc-200 bg-zinc-50 p-3"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-base font-semibold">
                          Order {order.id.slice(0, 8)}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          order.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {order.sections.map((section, sectionIndex) => {
                        const assigned = items.find(
                          (item) => item.id === section.selectedItemId
                        );
                        const dropKey = `${order.id}-${sectionIndex}`;
                        const active = activeDropKey === dropKey;
                        return (
                          <div
                            key={dropKey}
                            onDragOver={(event) => {
                              event.preventDefault();
                              setActiveDropKey(dropKey);
                            }}
                            onDragLeave={() => setActiveDropKey(null)}
                            onDrop={(event) =>
                              onDropItem(
                                order,
                                sectionIndex,
                                section.requestedCategory,
                                event
                              )
                            }
                            className={`rounded-lg border-2 p-3 ${
                              active
                                ? "border-zinc-900 bg-white"
                                : "border-dashed border-zinc-400 bg-white"
                            }`}
                          >
                            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-700">
                              Section {sectionIndex + 1}
                            </p>
                            <p className="text-sm font-medium">
                              {section.requestedCategory}
                            </p>
                            {section.requestedCategory === "Surprise" && (
                              <p className="text-xs text-zinc-500">
                                Accepts any item
                              </p>
                            )}

                            <div className="mt-2 rounded-md border border-zinc-200 bg-zinc-50 p-2">
                              {assigned ? (
                                <>
                                  <p className="text-sm font-medium">
                                    {assigned.name}
                                  </p>
                                  <p className="text-xs text-zinc-600">
                                    {assigned.business}
                                  </p>
                                </>
                              ) : (
                                <p className="text-xs text-zinc-500">
                                  Drop matching item here
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handleComplete(order)}
                      disabled={!allAssigned || order.status === "completed"}
                      className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
                    >
                      Submit Finished Box
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this order?")) {
                          deleteOrder(order.id);
                        }
                      }}
                      className="ml-2 mt-4 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium"
                    >
                      Delete Order
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {popup && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-zinc-900/40 px-6">
          <div className="w-full max-w-xl rounded-xl bg-white p-5 shadow-xl">
            <h2 className="text-xl font-semibold">Purchased Box (Demo Popup)</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Order {popup.orderId.slice(0, 8)} has been packaged.
            </p>
            <ul className="mt-4 list-inside list-decimal space-y-1 text-sm">
              {popup.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <button
              onClick={() => setPopup(null)}
              className="mt-5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
