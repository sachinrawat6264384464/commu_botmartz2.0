"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductTourPage from "@/app/product-tour/page";

export default function AntigravityGuideRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/product-tour");
  }, [router]);

  return <ProductTourPage />;
}
