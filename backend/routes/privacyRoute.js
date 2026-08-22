import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const router = express.Router();

// Create __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------------------------------
// 1️⃣ Option A – Serve the static HTML file
// -------------------------------------------------
router.get("/privacy", (req, res) => {
  // The file lives at ./public/privacy.html
  res.sendFile(path.join(__dirname, "..", "config", "privacy.html"));
});
router.get("/landingpage", (req, res) => {
  // The file lives at ./public/privacy.html
  res.sendFile(path.join(__dirname, "..", "config", "landingpage.html"));
});
router.get("/childsafety", (req, res) => {
  // The file lives at ./public/privacy.html
  res.sendFile(path.join(__dirname, "..", "config", "childsafety.html"));
});

export default router;






// import express from "express"

// import path from 'path';
// const router = express.Router()
// // -------------------------------------------------
// // 1️⃣ Option A – Serve the static HTML file
// // -------------------------------------------------
// router.get('/privacy', (req, res) => {
//     // The file lives at ./public/privacy.html
//     res.sendFile(path.join(__dirname, '..', 'public', 'privacy.html'));
// });

// /* -------------------------------------------------
//    2️⃣ Option B – Inline HTML (no separate file)
//    Uncomment the block below and comment out the
//    Option A handler if you prefer this approach.
// ------------------------------------------------- */
// // router.get('/privacy', (req, res) => {
// //     const html = `<!DOCTYPE html>
// // <html lang="en">
// // <head>
// //     <meta charset="UTF-8">
// //     <title>Privacy Policy – [APP NAME]</title>
// //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
// //     <link rel="stylesheet" href="/css/privacy.css">
// // </head>
// // <body>
// //     <header class="hero">
// //         <h1>Privacy Policy</h1>
// //         <p>Effective date: <strong>[INSERT DATE]</strong></p>
// //     </header>
// //     <main class="content">
// //         <!-- Paste the policy markup (same as in privacy.html) here -->
// //         <section><h2>1. Information We Collect</h2>…</section>
// //         <!-- …other sections… -->
// //         <section class="disclaimer"><p><strong>Disclaimer:</strong> …</p></section>
// //     </main>
// //     <footer class="footer">
// //         <p>&copy; <span id="year"></span> [APP NAME]. All rights reserved.</p>
// //     </footer>
// //     <script>document.getElementById('year').textContent = new Date().getFullYear();</script>
// // </body>
// // </html>`;
// //     res.type('html').send(html);
// // });

// export default router;