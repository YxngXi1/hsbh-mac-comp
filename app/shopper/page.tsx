"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CATEGORY_OPTIONS,
  type ItemCategory,
  useDiscovery,
} from "../discovery-context";

const BOX_SLOTS = 5;
type BoxSlot = { id: string; category: ItemCategory };

export default function ShopperPage() {
  const { submitOrder } = useDiscovery();
  const [slots, setSlots] = useState<BoxSlot[]>(
    Array.from({ length: BOX_SLOTS }, (_, index) => ({
      id: `slot-${index + 1}`,
      category: "Genre",
    }))
  );

  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(true);
  const [showSubscribedPopup, setShowSubscribedPopup] = useState(false);

  function updateSlot(slotId: string, value: ItemCategory) {
    setSlots((current) =>
      current.map((slot) =>
        slot.id === slotId ? { ...slot, category: value } : slot
      )
    );
  }

  function placeOrder() {
    if (!isSubscribed) {
      setShowPaymentPopup(true);
      return;
    }
    const orderId = submitOrder(slots.map((slot) => slot.category));
    setSubmittedOrderId(orderId);
  }

  function confirmPayment() {
    setShowPaymentPopup(false);
    setShowSubscribedPopup(true);
  }

  function completeSubscription() {
    setIsSubscribed(true);
    setShowSubscribedPopup(false);
  }

  function startNewOrder() {
    setSlots(
      Array.from({ length: BOX_SLOTS }, (_, index) => ({
        id: `slot-${index + 1}`,
        category: "Genre",
      }))
    );
    setSubmittedOrderId(null);
    setShowPaymentPopup(!isSubscribed);
    setShowSubscribedPopup(false);
  }

  return (
    <main className="min-h-screen bg-amber-50 px-6 py-10 text-zinc-900">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Shop Discovery Boxes</h1>
          <Link href="/" className="text-sm underline">
            Back home
          </Link>
        </div>

        <p className="text-sm text-zinc-700">
          Customize your 5-section discovery box and submit your order to the
          admin team for curation.
        </p>

        <section className="rounded-xl border border-amber-200 bg-white p-5">
            <h2 className="mb-4 text-xl font-medium">Choose 5 Box Sections</h2>
            <p className="mb-3 text-sm text-zinc-600">
              {isSubscribed
                ? "Subscription active. Choose sections for your next delivery."
                : "Subscription required before ordering your first box."}
            </p>
          <div className="grid gap-3">
            {slots.map((slot, index) => (
              <label
                key={slot.id}
                htmlFor={slot.id}
                className="grid gap-1 text-sm"
              >
                Section {index + 1}
                <select
                  id={slot.id}
                  name={slot.id}
                  value={slot.category}
                  onChange={(event) =>
                    updateSlot(slot.id, event.target.value as ItemCategory)
                  }
                  className="rounded-md border border-zinc-300 px-3 py-2"
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <button
            onClick={placeOrder}
            className="mt-5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
          >
            {isSubscribed ? "Order Next Delivery Box" : "Subscribe To Continue"}
          </button>
        </section>

        {submittedOrderId && (
          <section className="rounded-xl border border-zinc-300 bg-white p-5">
            <h2 className="mb-2 text-xl font-medium">
              This Is Your Order For Your Next Delivery
            </h2>
            <p className="mb-3 text-sm text-zinc-600">
              Demo subscription active. This monthly order was sent to the admin
              panel for curation.
            </p>
            <p className="mb-3 text-sm">
              Order ID: <span className="font-medium">{submittedOrderId}</span>
            </p>
            <ul className="list-inside list-decimal space-y-1 text-sm">
              {slots.map((slot, index) => (
                <li key={`preview-${slot.id}`}>
                  Section {index + 1}: {slot.category}
                </li>
              ))}
            </ul>
            <button
              onClick={startNewOrder}
              className="mt-4 rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 text-sm font-medium"
            >
              Start New Order
            </button>
          </section>
        )}
      </div>

      {showPaymentPopup && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-zinc-900/40 px-6">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <h2 className="text-xl font-semibold">Payment Required</h2>
            <p className="mt-2 text-sm text-zinc-600">
              You must pay for a monthly subscription before ordering discovery
              boxes.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowPaymentPopup(false)}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmPayment}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
              >
                Subscribe (Demo)
              </button>
            </div>
          </div>
        </div>
      )}

      {showSubscribedPopup && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-zinc-900/40 px-6">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <h2 className="text-xl font-semibold">Subscription Started</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Pretend payment succeeded. The shopper is now subscribed monthly.
              Next step: place the first delivery order.
            </p>
            <button
              onClick={completeSubscription}
              className="mt-5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
