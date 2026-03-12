const MESSAGES = {
  en: {
    INTERNAL_ERROR: "Internal Server Error",
    VALIDATION_ERROR: "Validation failed",
    NOT_FOUND: "Resource not found",
    UNAUTHORIZED: "Unauthorized",
    FORBIDDEN: "Forbidden",
    CONFLICT: "Resource already exists",
    INVALID_CURSOR: "Invalid cursor",
    INVALID_UUID: "Invalid resource identifier",
    IDEMPOTENCY_KEY_REUSE: "Idempotency key was used with a different request payload",
    RATE_LIMIT: "Too many requests, please try again later.",
    AUTH_RATE_LIMIT: "Too many authentication attempts, please try again later.",
    SERVICE_UNAVAILABLE: "Service unavailable",
  },
  fr: {
    INTERNAL_ERROR: "Erreur interne du serveur",
    VALIDATION_ERROR: "Échec de la validation",
    NOT_FOUND: "Ressource introuvable",
    UNAUTHORIZED: "Non autorisé",
    FORBIDDEN: "Interdit",
    CONFLICT: "La ressource existe déjà",
    INVALID_CURSOR: "Curseur invalide",
    INVALID_UUID: "Identifiant de ressource invalide",
    IDEMPOTENCY_KEY_REUSE: "La clé d'idempotence a été utilisée avec une autre requête",
    RATE_LIMIT: "Trop de requêtes, veuillez réessayer plus tard.",
    AUTH_RATE_LIMIT: "Trop de tentatives d'authentification, veuillez réessayer plus tard.",
    SERVICE_UNAVAILABLE: "Service indisponible",
  },
};

export function resolveLocale(acceptLanguage) {
  if (!acceptLanguage || typeof acceptLanguage !== "string") return "en";
  const first = acceptLanguage.split(",")[0]?.trim().split("-")[0]?.toLowerCase();
  if (first === "fr") return "fr";
  return "en";
}

export function translate(code, locale) {
  const loc = locale === "fr" ? "fr" : "en";
  return MESSAGES[loc][code] ?? MESSAGES.en[code] ?? MESSAGES.en.INTERNAL_ERROR;
}

export function hasTranslatedCode(code) {
  return Boolean(MESSAGES.en[code]);
}
