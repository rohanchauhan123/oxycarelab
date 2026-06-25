/**
 * Vercel Serverless Function Entry Point
 * 
 * Vercel automatically routes /api/* requests to files in the /api/ directory.
 * This file re-exports the Express app from server.js as the default handler.
 * Vercel will use this as a serverless function (no need for app.listen()).
 */
import app from '../server.js';

export default app;
