import Link from "next/link";

export default function Home() {
  return (
    <main className="theme-shell min-h-screen px-6 py-14 text-zinc-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <span className="theme-kicker">Discovery Commerce Demo</span>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
          Black Business Discovery Box
        </h1>
        <p className="max-w-3xl text-zinc-700">
          A curated marketplace flow inspired by BLK OWNED styling. Creators
          list products, admins build genre-based bento boxes, and subscribers
          place monthly delivery orders.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="theme-card p-4">
            <p className="text-2xl font-semibold">5</p>
            <p className="text-sm text-zinc-600">Box sections per order</p>
          </div>
          <div className="theme-card p-4">
            <p className="text-2xl font-semibold">3</p>
            <p className="text-sm text-zinc-600">Role-based dashboards</p>
          </div>
          <div className="theme-card p-4">
            <p className="text-2xl font-semibold">Frontend</p>
            <p className="text-sm text-zinc-600">No backend, demo only</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/creator"
            className="theme-card p-5 transition hover:-translate-y-0.5"
          >
            <h2 className="mb-2 text-xl font-medium">Creator Page</h2>
            <p className="text-sm text-zinc-700">
              List items under your business for admin curation.
            </p>
          </Link>
          <Link
            href="/admin"
            className="theme-card p-5 transition hover:-translate-y-0.5"
          >
            <h2 className="mb-2 text-xl font-medium">Admin Page</h2>
            <p className="text-sm text-zinc-700">
              Drag and drop products into a discovery box (max 5 items).
            </p>
          </Link>
          <Link
            href="/shopper"
            className="theme-card p-5 transition hover:-translate-y-0.5"
          >
            <h2 className="mb-2 text-xl font-medium">Shopper Page</h2>
            <p className="text-sm text-zinc-700">
              Select category preferences and submit a box purchase request.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
