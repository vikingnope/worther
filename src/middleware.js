// This middleware handles cookie settings for Vercel deployments
// particularly the __vercel_live_token cookie SameSite issues

export function setupCookieMiddleware(req, res, next) {
  // Add SameSite=None; Secure attributes to cookies
  res.setHeader('Set-Cookie', [
    '__vercel_live_token=*; SameSite=None; Secure'
  ]);
  
  if (next) {
    next();
  }
}

export default setupCookieMiddleware;