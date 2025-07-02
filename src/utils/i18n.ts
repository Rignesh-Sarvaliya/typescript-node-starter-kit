import i18next from "i18next";

export async function loadLocales() {
  if (!i18next.isInitialized) {
    await i18next.init({
      lng: "en",
      fallbackLng: "en",
      resources: {
        en: {
          translation: {
            // Add your default translations here
            greeting: "Hello",
          },
        },
      },
    });
  }
  return i18next;
}
