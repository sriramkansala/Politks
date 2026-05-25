// Map of state / UT codes used across the MP + MLA datasets to their
// human-readable names. Centralised so any UI surface (filter dropdowns,
// pills, search results) can render full names without each call site
// hard-coding the mapping.
//
// Codes follow the PRS / ECI shorthand seen in lib/db/staticMps.generated.ts
// — note that Jammu & Kashmir appears under both JA and JK in upstream data.

export const STATE_NAMES: Record<string, string> = {
  AN: "Andaman & Nicobar Islands",
  AP: "Andhra Pradesh",
  AR: "Arunachal Pradesh",
  AS: "Assam",
  BR: "Bihar",
  CG: "Chhattisgarh",
  CH: "Chandigarh",
  DA: "Dadra & Nagar Haveli and Daman & Diu",
  DL: "Delhi",
  GA: "Goa",
  GJ: "Gujarat",
  HP: "Himachal Pradesh",
  HR: "Haryana",
  JA: "Jammu & Kashmir",
  JH: "Jharkhand",
  JK: "Jammu & Kashmir",
  KA: "Karnataka",
  KL: "Kerala",
  LA: "Ladakh",
  LD: "Lakshadweep",
  MH: "Maharashtra",
  ML: "Meghalaya",
  MN: "Manipur",
  MP: "Madhya Pradesh",
  MZ: "Mizoram",
  NL: "Nagaland",
  OD: "Odisha",
  PB: "Punjab",
  PY: "Puducherry",
  RJ: "Rajasthan",
  SK: "Sikkim",
  TG: "Telangana",
  TN: "Tamil Nadu",
  TR: "Tripura",
  UK: "Uttarakhand",
  UP: "Uttar Pradesh",
  WB: "West Bengal",
}

/** Look up a state code's full name. Falls back to the raw code if unknown. */
export function stateName(code: string | null | undefined): string {
  if (!code) return ""
  return STATE_NAMES[code] ?? code
}
