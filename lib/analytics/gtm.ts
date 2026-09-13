export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

export function pushToDataLayer(eventPayload: Record<string, any>): void {
  if (typeof window === 'undefined') return;

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      timestamp: Date.now(),
      ...eventPayload,
    });
  } catch (err) {
    console.warn('[GTM] Failed to push to dataLayer:', err);
  }
}

export function getGtmScript(): string {
  if (!GTM_ID) return '';
  return `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`;
}
