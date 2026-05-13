import mongoose from "mongoose";
import slugify from "slugify";
import config from "./env.js";
import Product from "./models/product.js";

const cloudinaryUrls = [
  "https://res.cloudinary.com/dsref69qh/image/upload/v1778668950/casque_noir_m3ar1j.jpg",
  "https://res.cloudinary.com/dsref69qh/image/upload/v1778668950/clavier_mecanique_tn9iuu.jpg",
  "https://res.cloudinary.com/dsref69qh/image/upload/v1778668950/aroma_diffuser_nemkau.png",
  "https://res.cloudinary.com/dsref69qh/image/upload/v1778668950/backpack_pxcudq.png",
  "https://res.cloudinary.com/dsref69qh/image/upload/v1778668950/basket_ball_ooeenf.png",
  "https://res.cloudinary.com/dsref69qh/image/upload/v1778668951/lampe-led_dqtav8.jpg",
  "https://res.cloudinary.com/dsref69qh/image/upload/v1778668951/facial_cleaning_voahgg.png",
  "https://res.cloudinary.com/dsref69qh/image/upload/v1778668951/face_moisturizer_baofut.png",
  "https://res.cloudinary.com/dsref69qh/image/upload/v1778668951/hex_dumbbells_tlsnxi.png",
  "https://res.cloudinary.com/dsref69qh/image/upload/v1778668951/lightwieght_jacket_c467xq.png",
  "https://res.cloudinary.com/dsref69qh/image/upload/v1778668952/office_chair_etotxu.png",
  "https://res.cloudinary.com/dsref69qh/image/upload/v1778668952/PLAIN_cotton_tshirt_ififaj.png",
  "https://res.cloudinary.com/dsref69qh/image/upload/v1778668952/set_notebooks_hicb27.png",
  "https://res.cloudinary.com/dsref69qh/image/upload/v1778668953/sourisergo_h6rklt.png",
  "https://res.cloudinary.com/dsref69qh/image/upload/v1778668953/sneakers_romek0.png",
  "https://res.cloudinary.com/dsref69qh/image/upload/v1778668954/steel_watch_axghdu.png",
  "https://res.cloudinary.com/dsref69qh/image/upload/v1778668953/stainless_bootle_llsepj.png",
  "https://res.cloudinary.com/dsref69qh/image/upload/v1778668954/vitamine_c_gnzww2.png",
];

const productContextByKey = {
  casque_noir: {
    name: "Casque audio noir",
    category: "electronics",
    price: 89.99,
    shortDesc: "Casque sans fil confortable pour le bureau et les trajets.",
    description:
      "Casque audio noir avec coussinets enveloppants, autonomie confortable et rendu sonore equilibre. Un produit ideal pour tester une fiche electronique avec image, prix et categorie.",
  },
  clavier_mecanique: {
    name: "Clavier mecanique RGB",
    category: "electronics",
    price: 119.99,
    shortDesc: "Clavier mecanique compact avec retroeclairage RGB.",
    description:
      "Clavier mecanique pense pour la productivite et le gaming leger. Les touches reactives, le format bureau et le style lumineux permettent de tester un produit high-tech plus premium.",
  },
  aroma_diffuser: {
    name: "Diffuseur d'aromes",
    category: "home",
    price: 34.99,
    shortDesc: "Diffuseur discret pour une ambiance interieure plus calme.",
    description:
      "Diffuseur d'aromes avec design minimal et reservoir adapte a une utilisation quotidienne. Il sert de produit maison simple pour verifier les filtres de categorie et les visuels lifestyle.",
  },
  backpack: {
    name: "Sac a dos urbain",
    category: "fashion",
    price: 59.99,
    shortDesc: "Sac a dos sobre pour ordinateur et usage quotidien.",
    description:
      "Sac a dos urbain avec volume pratique, compartiments essentiels et style neutre. Un bon exemple de produit mode fonctionnel pour alimenter le catalogue.",
  },
  basket_ball: {
    name: "Ballon de basket",
    category: "sports",
    price: 24.99,
    shortDesc: "Ballon de basket polyvalent pour entrainement indoor/outdoor.",
    description:
      "Ballon de basket avec grip marque et format standard. Il permet de representer une categorie sport claire avec un prix accessible dans les donnees de demonstration.",
  },
  "lampe-led": {
    name: "Lampe LED de bureau",
    category: "office",
    price: 44.99,
    shortDesc: "Lampe de bureau fine avec eclairage LED directionnel.",
    description:
      "Lampe LED moderne pour poste de travail, lecture ou setup compact. Son design simple aide a tester les produits office et maison dans l'interface publique.",
  },
  facial_cleaning: {
    name: "Kit nettoyage visage",
    category: "beauty",
    price: 29.99,
    shortDesc: "Set de soin visage pour routine quotidienne.",
    description:
      "Kit de nettoyage visage compose d'accessoires doux et faciles a utiliser. Un produit beaute utile pour verifier les filtres et les fiches avec descriptions courtes.",
  },
  face_moisturizer: {
    name: "Creme hydratante visage",
    category: "beauty",
    price: 18.99,
    shortDesc: "Creme hydratante legere pour usage quotidien.",
    description:
      "Creme hydratante visage avec presentation propre et premium. Elle ajoute un produit beaute a faible prix pour diversifier le catalogue de test.",
  },
  hex_dumbbells: {
    name: "Halteres hexagonaux",
    category: "sports",
    price: 49.99,
    shortDesc: "Paire d'halteres stables pour entrainement a domicile.",
    description:
      "Halteres hexagonaux avec prise confortable et base stable. Ce produit complete la categorie sport avec un article de fitness plus robuste.",
  },
  lightwieght_jacket: {
    name: "Veste legere",
    category: "clothes",
    price: 74.99,
    shortDesc: "Veste legere pour mi-saison et sorties urbaines.",
    description:
      "Veste legere avec coupe simple et style casual. Elle permet de tester la categorie vetements avec un produit plus visuel que les accessoires.",
  },
  office_chair: {
    name: "Chaise de bureau ergonomique",
    category: "office",
    price: 159.99,
    shortDesc: "Chaise de bureau confortable pour longues sessions.",
    description:
      "Chaise de bureau ergonomique avec dossier haut et assise adaptee au travail prolonge. Produit ideal pour tester une fourchette de prix plus elevee.",
  },
  PLAIN_cotton_tshirt: {
    name: "T-shirt coton uni",
    category: "clothes",
    price: 19.99,
    shortDesc: "T-shirt basique en coton pour tenue quotidienne.",
    description:
      "T-shirt coton uni avec coupe simple et couleur neutre. Un produit textile basique pour remplir la categorie vetements sans complexite inutile.",
  },
  set_notebooks: {
    name: "Set de carnets",
    category: "office",
    price: 14.99,
    shortDesc: "Lot de carnets pour notes, idees et organisation.",
    description:
      "Set de carnets avec presentation sobre, utile pour la prise de notes ou l'organisation personnelle. Produit office simple pour varier les prix bas.",
  },
  sourisergo: {
    name: "Souris ergonomique",
    category: "electronics",
    price: 39.99,
    shortDesc: "Souris ergonomique pour un setup de travail confortable.",
    description:
      "Souris ergonomique avec forme adaptee a une utilisation prolongee. Elle enrichit la categorie electronique avec un accessoire de bureau courant.",
  },
  sneakers: {
    name: "Sneakers blanches",
    category: "fashion",
    price: 69.99,
    shortDesc: "Sneakers blanches polyvalentes au style minimal.",
    description:
      "Paire de sneakers blanches adaptee a un usage quotidien. Ce produit ajoute une entree mode claire avec une image facilement identifiable.",
  },
  steel_watch: {
    name: "Montre acier",
    category: "fashion",
    price: 129.99,
    shortDesc: "Montre en acier au style classique.",
    description:
      "Montre en acier avec cadran elegant et bracelet metallique. Produit premium leger pour tester les tris par prix et les fiches accessoires.",
  },
  stainless_bootle: {
    name: "Gourde inox",
    category: "sports",
    price: 22.99,
    shortDesc: "Gourde en inox reutilisable pour sport et bureau.",
    description:
      "Gourde en inox avec format pratique pour les deplacements, le bureau ou l'entrainement. Produit polyvalent classe dans la categorie sport.",
  },
  vitamine_c: {
    name: "Serum vitamine C",
    category: "beauty",
    price: 26.99,
    shortDesc: "Serum visage a la vitamine C pour routine eclat.",
    description:
      "Serum vitamine C avec presentation lumineuse et usage cosmetique quotidien. Il complete les produits beaute avec une fiche courte et lisible.",
  },
};

function extractPublicId(url) {
  const pathname = new URL(url).pathname;
  const withoutLeadingSlash = pathname.replace(/^\/+/, "");
  const withoutResourceType = withoutLeadingSlash.replace(/^image\/upload\//, "");
  const withoutVersion = withoutResourceType.replace(/^v\d+\//, "");

  return withoutVersion.replace(/\.[^.]+$/, "");
}

function extractProductKey(publicId) {
  const filename = publicId.split("/").at(-1);
  return filename.replace(/_[a-z0-9]{6}$/, "");
}

function buildSlug(name) {
  return slugify(name, { lower: true, strict: true, locale: "fr" });
}

function buildProducts() {
  return cloudinaryUrls.map((url) => {
    const publicId = extractPublicId(url);
    const productKey = extractProductKey(publicId);
    const context = productContextByKey[productKey];

    if (!context) {
      throw new Error(`[seed:products] contexte manquant pour ${productKey}`);
    }

    const slug = buildSlug(context.name);

    return {
      ...context,
      slug,
      isActive: true,
      images: [
        {
          public_id: publicId,
          url,
          alt: context.name,
        },
      ],
    };
  });
}

async function main() {
  const mongoUrl = process.env.MONGO_Url || config.MONGO.Url;
  if (!mongoUrl) throw new Error("[seed:products] MONGO_Url manquant");

  await mongoose.connect(mongoUrl);

  const products = buildProducts();
  let created = 0;
  let updated = 0;

  for (const product of products) {
    const existing = await Product.findOne({ slug: product.slug });

    if (existing) {
      existing.set(product);
      await existing.save();
      updated += 1;
      console.log(`[seed:products] updated ${product.slug}`);
      continue;
    }

    await Product.create(product);
    created += 1;
    console.log(`[seed:products] created ${product.slug}`);
  }

  console.log(`[seed:products] done: ${created} created, ${updated} updated`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
