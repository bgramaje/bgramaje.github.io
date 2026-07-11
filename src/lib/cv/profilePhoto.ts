/** Misma ruta que `ContactOutput` — coloca el archivo en `public/images/pic3.png`. */
export const PROFILE_PHOTO_PATH = "/images/pic3.png";

/** URL absoluta para @react-pdf/renderer (solo en el navegador al generar el PDF). */
export function getProfilePhotoSrcForPdf(): string {
  const base = import.meta.env.BASE_URL ?? "/";
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const path =
    normalizedBase === ""
      ? PROFILE_PHOTO_PATH
      : `${normalizedBase}${PROFILE_PHOTO_PATH}`;

  if (typeof window === "undefined") {
    return path;
  }
  return new URL(path, window.location.origin).href;
}
