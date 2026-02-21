import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-14 text-zinc-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <h1 className="text-4xl font-semibold">Black Business Discovery Box</h1>
        <p className="max-w-3xl text-zinc-300">
          Demo workflow with three role-based pages. Creators list products,
          admins curate 5-item discovery boxes, and shoppers customize a box
          purchase preference.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/creator"
            className="rounded-xl border border-zinc-700 bg-zinc-900 p-5 transition hover:border-zinc-500"
          >
            <h2 className="mb-2 text-xl font-medium">Creator Page</h2>
            <p className="text-sm text-zinc-300">
              List items under your business for admin curation.
            </p>
          </Link>
          <Link
            href="/admin"
            className="rounded-xl border border-zinc-700 bg-zinc-900 p-5 transition hover:border-zinc-500"
          >
            <h2 className="mb-2 text-xl font-medium">Admin Page</h2>
            <p className="text-sm text-zinc-300">
              Drag and drop products into a discovery box (max 5 items).
            </p>
          </Link>
          <Link
            href="/shopper"
            className="rounded-xl border border-zinc-700 bg-zinc-900 p-5 transition hover:border-zinc-500"
          >
            <h2 className="mb-2 text-xl font-medium">Shopper Page</h2>
            <p className="text-sm text-zinc-300">
              Select category preferences and submit a box purchase request.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
