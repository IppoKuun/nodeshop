"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Plus,
  RotateCcw,
  Search,
  ShoppingCart,
  SlidersHorizontal,
} from "lucide-react";
import api from "./lib/api";

const getCategories = (products, selectedCategory) => {
  const categories = products.map((p) => p.category).filter(Boolean);
  if (selectedCategory && selectedCategory !== "toutes") {
    categories.push(selectedCategory);
  }
  return ["toutes", ...Array.from(new Set(categories)).sort()];
};

const formatCategory = (category) => {
  if (!category || category === "toutes") return "All Categories";
  return category.charAt(0).toUpperCase() + category.slice(1);
};

export default function Home() {
  const [products, setAllproducts] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("toutes");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [meta, setMeta] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const currency = useMemo(
    () =>
      new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2,
      }),
    []
  );

  const params = useMemo(() => {
    const p = {};
    if (category && category !== "toutes") p.category = category;
    if (minPrice !== "") p["price[min]"] = Number(minPrice);
    if (maxPrice !== "") p["price[max]"] = Number(maxPrice);
    if (sort === "asc" || sort === "desc") {
      p.sortBy = "price";
      p.order = sort;
    }
    p.page = page;
    p.limit = limit;
    return p;
  }, [category, minPrice, maxPrice, page, limit, sort]);

  useEffect(() => {
    setPage(1);
  }, [category, minPrice, maxPrice, sort]);

  useEffect(() => {
    const controller = new AbortController();
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await api.get("/products", {
          params,
          signal: controller.signal,
        });
        setMeta(res?.meta || res?.pagination || null);
        const safeItems = (res?.items ?? []).map((i) => ({
          id: i.id || i._id,
          shortDesc: i.shortDesc,
          slug: i.slug,
          image: i.images?.[0]?.url ?? null,
          category: i.category,
          price: i.price,
          name: i.name,
          isActive: i.isActive,
        }));
        setAllproducts(safeItems);
      } catch (e) {
        if (e?.canceled) return;
        const msg = e?.msg || e?.message || e?.data?.error || "Network error";
        setErr(msg);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(t);
    };
  }, [params]);

  const categories = useMemo(
    () => getCategories(products, category),
    [products, category]
  );

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.category, p.shortDesc]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(q))
    );
  }, [products, searchTerm]);

  const totalProducts = meta?.total ?? products.length;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const currentPage = meta?.page ?? page;
  const pageNumbers = useMemo(() => {
    return Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1);
  }, [totalPages]);

  const resetFilter = () => {
    setMinPrice("");
    setMaxPrice("");
    setCategory("toutes");
    setSort("default");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <label className="relative flex min-h-12 w-full max-w-xl items-center">
            <Search className="pointer-events-none absolute left-4 h-5 w-5 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="search"
              placeholder="Search products..."
              className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
            />
          </label>

          <div className="flex items-center justify-end gap-5">
            <button
              type="button"
              className="relative grid h-11 w-11 place-items-center rounded-lg text-slate-700 transition hover:bg-slate-50"
              aria-label="Panier"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute right-1.5 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold leading-none text-white">
                {Math.min(products.length, 9)}
              </span>
            </button>

            <Link
              href="/login"
              className="inline-flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-slate-400 text-xs font-bold text-white">
                AD
              </span>
              <span>Admin</span>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                Products
              </h1>
              <p className="mt-2 text-sm font-medium text-slate-500">
                {totalProducts} products
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
                aria-label="Afficher les filtres"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </button>
              <div
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
              >
                <Plus className="h-4 w-4" />
                New Product
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[1.05fr_1.05fr_0.75fr_0.75fr_auto]">
            <label className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-12 w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {formatCategory(c)}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </label>

            <label className="relative">
              <select
                className="h-12 w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="default">All Status</option>
                <option value="asc">Price ascending</option>
                <option value="desc">Price descending</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </label>

            <input
              type="number"
              min={0}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min Price"
              className="h-12 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
            />

            <input
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max Price"
              className="h-12 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
            />

            <button
              type="button"
              onClick={resetFilter}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-800"
            >
              <RotateCcw className="h-4 w-4" />
              Clear
            </button>
          </div>
        </section>

        {err && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">
            API indisponible pour le moment. Lance le backend pour charger le catalogue.
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-[360px] animate-pulse rounded-lg border border-slate-200 bg-slate-100"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center">
            <p className="text-sm font-semibold text-slate-800">
              {err ? "Catalogue indisponible." : "Aucun produit disponible."}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {err
                ? "Le frontend reste consultable, mais les produits dépendent de l’API."
                : "Ajuste les filtres ou recharge les données de démonstration."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
              >
                <article className="flex h-full flex-col">
                  <div className="relative aspect-[1.18] bg-white">
                    <span
                      className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-800"
                      aria-label="Options produit"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </span>
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-6 text-center text-sm font-medium text-slate-400">
                        Image indisponible
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <div className="min-w-0">
                      <h2 className="line-clamp-2 text-base font-bold leading-5 text-slate-950">
                        {product.name}
                      </h2>
                      {product.category && (
                        <p className="mt-2 text-sm font-medium text-slate-500">
                          {formatCategory(product.category)}
                        </p>
                      )}
                    </div>

                    <p className="mt-4 text-base font-bold text-slate-950">
                      {currency.format(Number(product.price ?? 0))}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs font-semibold">
                      <span className="inline-flex items-center gap-1.5 text-slate-600">
                        <span className="h-2 w-2 rounded-full bg-brand-600" />
                        Product
                      </span>
                      <span
                        className={
                          product.isActive === false
                            ? "inline-flex items-center gap-1.5 text-slate-400"
                            : "inline-flex items-center gap-1.5 text-brand-700"
                        }
                      >
                        <span
                          className={
                            product.isActive === false
                              ? "h-2 w-2 rounded-full bg-slate-300"
                              : "h-2 w-2 rounded-full bg-brand-600"
                          }
                        />
                        {product.isActive === false ? "Inactive" : "In stock"}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {products.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta?.hasPrev === false || page <= 1 || loading}
              aria-label="Page précédente"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={
                  pageNumber === currentPage
                    ? "grid h-11 min-w-11 place-items-center rounded-lg bg-brand-50 px-4 text-sm font-bold text-brand-700"
                    : "grid h-11 min-w-11 place-items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
                }
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => setPage((p) => p + 1)}
              disabled={
                loading ||
                meta?.hasNext === false ||
                (meta?.totalPages ? page >= meta.totalPages : false)
              }
              aria-label="Page suivante"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
