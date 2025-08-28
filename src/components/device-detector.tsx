"use client";

import { useEffect } from "react";

export default function DeviceDetector() {
  useEffect(() => {
    const isMobile = String(window.matchMedia("(max-width: 768px)").matches);

    const currentCookie = document.cookie
      .split(";")
      .find((row) => row.trimStart().startsWith("is-mobile"))
      ?.split("=")[1];

    if (isMobile !== currentCookie) {
      // biome-ignore lint/suspicious/noDocumentCookie: Don't sweat it.
      document.cookie = `is-mobile=${isMobile}; path=/; max-age=${60 * 60 * 24 * 30}`;
      window.location.reload();
    }
  }, []);

  return null;
}
