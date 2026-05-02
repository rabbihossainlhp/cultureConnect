declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

let analyticsLoaded = false;

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

export const loadGoogleAnalytics = () => {
  if (!measurementId || analyticsLoaded || typeof document === "undefined") {
    return;
  }

  analyticsLoaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    page_path: window.location.pathname + window.location.search,
  });
};

export const trackPageView = (pagePath: string) => {
  if (!measurementId || typeof window === "undefined" || !window.gtag) {
    return;
  }

  window.gtag("config", measurementId, {
    page_path: pagePath,
  });
};

export const trackEvent = (action: string, params: Record<string, string | number | boolean | null | undefined> = {}) => {
  if (!measurementId || typeof window === "undefined" || !window.gtag) {
    return;
  }

  window.gtag("event", action, params);
};