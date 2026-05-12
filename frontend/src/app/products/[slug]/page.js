import Link from "next/link";
import { ArrowLeft, CheckCircle2, Package, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import GalleryClient from "@/app/products/[slug]/galerryClients.js";
import { API_BASE_URL } from "@/app/lib/api-base-url";

export const revalidate = 60;

async function getProductBySlug(slug) {
  const res = await fetch(
    `${API_BASE_URL}/products/slug/${encodeURIComponent(slug)}`,
    { next: { revalidate: 60 } }
  );

  if (res.status === 404) return notFound();
  if (!res.ok) throw new Error(`Erreur backend: ${res.status}`);

  const data = await res.json();
  return data?.data ?? data;
}

function formatPrice(price, currency = "EUR", locale = "fr-FR") {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(price ?? 0);
  } catch {
    return `${price ?? 0} ${currency}`;
  }
}

function toUrls(images) {
  if (!images) return [];
  return images
    .map((x) => {
      if (typeof x === "string") return x;
      return x?.url || x?.secure_url || null;
    })
    .filter(Boolean);
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const {
    name = "",
    images = [],
    category = "",
    price = 0,
    shortDesc = "",
    description = "",
    isActive = true,
  } = product || {};

  const imageUrls = toUrls(images);

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="container mx-auto px-4 py-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-slate-600 hover:bg-white hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au catalogue
          </Link>
        </div>
      </section>

      <section className="container mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-12">
        <GalleryClient images={imageUrls} alt={name || "Produit"} />

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              {category && (
                <p className="mb-3 inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 ring-1 ring-brand-100">
                  {category}
                </p>
              )}
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                {name}
              </h1>
              {shortDesc && (
                <p className="mt-4 text-base leading-7 text-slate-600">
                  {shortDesc}
                </p>
              )}
            </div>

            <div className="flex items-end justify-between gap-4 border-y border-slate-200 py-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Prix
                </p>
                <p className="mt-1 text-3xl font-semibold text-slate-950">
                  {formatPrice(price)}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-brand-600" />
                {isActive ? "Disponible" : "Inactif"}
              </span>
            </div>

            <button
              type="button"
              className="w-full rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 active:bg-brand-800"
              aria-label="Ajouter au panier"
            >
              Ajouter au panier
            </button>

          </div>
        </aside>
      </section>

      {description && (
        <section className="container mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              Description
            </h2>
            <p className="mt-4 max-w-3xl whitespace-pre-line text-base leading-7 text-slate-600">
              {description}
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
