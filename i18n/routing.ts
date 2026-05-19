import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: [
    "en", "hi", "bn", "te", "mr", "ta", "ur", "gu", "kn",
    "ml", "or", "pa", "as", "mai", "kok", "sat", "mni",
    "ne", "doi", "brx", "ks", "sd", "sa",
  ],
  defaultLocale: "en",
  localePrefix: "as-needed", // /en → / ; /hi → /hi
})

export const RTL_LOCALES = ["ur", "ks", "sd"] as const
