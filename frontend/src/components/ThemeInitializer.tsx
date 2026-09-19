"use client";

import { useServerInsertedHTML } from "next/navigation";

export default function ThemeInitializer() {
  useServerInsertedHTML(() => {
    return (
      <script
        id="theme-initializer"
        dangerouslySetInnerHTML={{
          __html: `
            try {
              var stored = localStorage.getItem('theme');
              if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
              var storedLang = localStorage.getItem('language');
              if (storedLang) {
                document.documentElement.lang = storedLang;
                if (storedLang === 'ar') {
                  document.documentElement.dir = 'rtl';
                }
              }
            } catch (_) {}
          `,
        }}
      />
    );
  });

  return null;
}
