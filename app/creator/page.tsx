"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CREATOR_CATEGORY_OPTIONS,
  type ItemCategory,
  useDiscovery,
} from "../discovery-context";

export default function CreatorPage() {
  const { items, addItem, removeItem } = useDiscovery();
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [category, setCategory] =
    useState<Exclude<ItemCategory, "Surprise">>("Fashion");
  const [description, setDescription] = useState("");

  const businesses = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.business))).sort();
  }, [items]);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !business.trim() || !description.trim()) return;

    addItem({
      name: name.trim(),
      business: business.trim(),
      category,
      description: description.trim(),
    });

    setName("");
    setDescription("");
  }

  return (
    <main className="min-h-screen bg-zinc-900 px-6 py-10 text-zinc-100">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Creator Item Listing</h1>
          <Link href="/" className="text-sm underline">
            Back home
          </Link>
        </div>

        <p className="text-sm text-zinc-300">
          List an item so discovery box admins can drag it into curated boxes.
        </p>

        <form
          onSubmit={onSubmit}
          className="grid gap-4 rounded-xl border border-zinc-700 bg-zinc-950 p-5"
        >
          <label className="grid gap-1 text-sm">
            Item Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2"
              placeholder="Ex: Golden Adinkra Candle"
              required
            />
          </label>

          <label className="grid gap-1 text-sm">
            Business Name
            <input
              value={business}
              onChange={(event) => setBusiness(event.target.value)}
              className="rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2"
              placeholder="Ex: House of Sankofa"
              list="business-suggestions"
              required
            />
            <datalist id="business-suggestions">
              {businesses.map((businessName) => (
                <option key={businessName} value={businessName} />
              ))}
            </datalist>
          </label>

          <label className="grid gap-1 text-sm">
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as ItemCategory)}
              className="rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2"
            >
              {CREATOR_CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm">
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-24 rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2"
              placeholder="Tell admins what makes this product special."
              required
            />
          </label>

          <button
            type="submit"
            className="rounded-lg bg-amber-300 px-4 py-2 font-medium text-zinc-900"
          >
            List Item
          </button>
        </form>

        <section className="rounded-xl border border-zinc-700 bg-zinc-950 p-5">
          <h2 className="mb-3 text-xl font-medium">Current Listed Items</h2>
          <div className="space-y-2">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-lg border border-zinc-700 bg-zinc-900 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{item.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-300">{item.category}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="text-sm text-zinc-400">{item.business}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
