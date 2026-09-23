function readEnv(value: string | undefined): string {
  return (value ?? '').trim();
}

export const googleAdsId = readEnv(import.meta.env.PUBLIC_GOOGLE_ADS_ID);

/** Lead label, with a fallback for the previous single-label variable. */
export const googleAdsLeadLabel = readEnv(
  import.meta.env.PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_LABEL ||
    import.meta.env.PUBLIC_GOOGLE_ADS_CONVERSION_LABEL,
);

export const googleAdsPhoneLabel = readEnv(
  import.meta.env.PUBLIC_GOOGLE_ADS_PHONE_CONVERSION_LABEL,
);

export const ga4MeasurementId = readEnv(import.meta.env.PUBLIC_GA4_MEASUREMENT_ID);

/** True when a Google tag should be offered. Missing IDs leave tracking off. */
export const googleTrackingEnabled = Boolean(googleAdsId || ga4MeasurementId);
