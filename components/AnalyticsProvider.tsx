"use client";

import React, { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { analytics } from "@/lib/analytics";
import { GA_MEASUREMENT_ID } from "@/lib/analytics/ga4";
import { GTM_ID, getGtmScript } from "@/lib/analytics/gtm";

export default function AnalyticsProvider({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Automatic SPA PageView tracking on route changes
  useEffect(() => {
    if (pathname) {
      const url = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
      analytics.pageView(url, document.title);
    }
  }, [pathname, searchParams]);

  return (
    <>
      {/* GA4 Script Injection */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* GTM Script Injection */}
      {GTM_ID && (
        <Script id="gtm-init" strategy="afterInteractive">
          {getGtmScript()}
        </Script>
      )}

      {children}
    </>
  );
}
