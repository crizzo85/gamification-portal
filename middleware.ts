export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    /*
     * Corrisponde a tutte le rotte tranne quelle che iniziano con:
     * - api (rotte API)
     * - _next/static (file statici)
     * - _next/image (immagini ottimizzate)
     * - favicon.ico (icona)
     * - login (pagina di login)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
};
