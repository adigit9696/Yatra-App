YATRA — offline-installable app (deploy package)
================================================

Is folder me kya hai
  index.html            poori app (ek hi file)
  sw.js                 service worker — app ko offline chalata hai
  manifest.webmanifest  naam, icon, full-screen setting (install ke liye)
  icons/                app icons (normal, maskable, iPhone)
  vercel.json, _headers hosting ki cache settings (Vercel / Netlify)

1) Deploy karo (HTTPS zaroori hai — install aur offline sirf HTTPS par chalte hain)
  Vercel:   folder me terminal kholo ->  vercel --prod
            (ya vercel.com -> Add New -> Project -> folder drag & drop)
  Netlify:  app.netlify.com/drop par poora folder drop kar do.
  Koi build command nahi chahiye. "Output directory" = ye folder, "Framework" = Other.

2) Install karo
  Android (Chrome): link kholo -> app ke andar "App install karo" ya Chrome menu -> Install app.
  iPhone (Safari):  Share -> Add to Home Screen. (Chrome se nahi hota)
  Pehli baar INTERNET ON rakhna — tabhi app aur fonts phone me save hote hain.
  Uske baad internet ke bina bhi chalegi (train / Konkan route par bhi).

3) Bhai ke saath share karo
  Bas link bhej do — usko koi Claude account nahi chahiye.
  Dhyan rakho: har phone ka data usi phone me rehta hai. Tumhari ticks bhai ke phone me
  nahi dikhengi. Ek jaisi trip chahiye toh: Home page ke neeche "Backup download karo",
  file bhai ko bhejo, uske phone me "Backup wapas lao".
  (Live sync — jahan dono ki ticks ek saath dikhein — ke liye Firebase chahiye;
   wo alag step hai.)

4) Update kaise karein
  Naya index.html daal ke dobara deploy karo (sw.js ko badalne ki zaroorat nahi — usme
  version apne aap badalta hai jab files badalti hain, ye build ke time hota hai).
  Kholne par app ko naya version mil jaata hai; agar app pehle se khuli ho toh
  "Naya version aaya — Refresh" ka message aata hai.

5) Naam / icon badalna
  Naam: manifest.webmanifest me "name" aur "short_name", aur index.html me
  <title>, apple-mobile-web-app-title, application-name.
  Icon: icons/ ke PNG badal do (192, 512, maskable-512, apple-touch-icon).
  Badalne ke baad phone par app ek baar hata kar dobara install karo (icon naya dikhega).

Kuch cheezein jo ISSE bahar kaam nahi karti
  - AI itinerary / mausam-tips wale buttons (wo Claude ke andar hi chalte hain) — apne aap chhup jaate hain.
  - Journal photos is phone me hi save hoti hain (backup file me photo nahi jaati, sirf caption).

Build id: b8ff65490f
