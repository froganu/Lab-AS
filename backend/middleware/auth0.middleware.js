import { auth } from "express-oauth2-jwt-bearer";

export const auth0Middleware = auth({
  audience: "https://forum-api",
  issuerBaseURL: "https://dev-x3c6gh35e5ezqobl.eu.auth0.com/",
  tokenSigningAlg: "RS256"
});
