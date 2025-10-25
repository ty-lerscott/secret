🔐 ID Generator — Next.js + TypeScript

A simple yet extensible web app for generating unique identifiers — UUID, GUID, CUID2, Unicode, and UUID_WILD.
Built with Next.js and TypeScript, it offers both a browser interface and a backend API for programmatic access.

✨ Features

Multiple ID Types
Generate one of the following formats:

uuid – Standard UUID v4

uuid_wild – Variant of UUID with a random “version” digit

guid – Classic GUID structure

cuid2 – Collision-resistant CUID2

unicode – Custom Unicode-based identifier

Web Interface
Generate one ID at a time directly in the browser.
Optionally download a generated list as a text file.

API Endpoint
Use the /api route to generate IDs via query parameters:

GET /api?type={type}&count={count}


type: one of uuid, uuid_wild, guid, cuid2, or unicode

count: number of IDs to generate (default: 1)

Example:

/api?type=uuid&count=10


Returns a JSON array of 10 UUIDs.

🧱 Tech Stack

Framework: Next.js (App Router)

Language: TypeScript

Styling: Tailwind CSS (optional)

Build Tool: Vercel / Node 18+

⚙️ Setup
# 1. Clone the repo
git clone https://github.com/yourusername/id-generator.git
cd id-generator

# 2. Install dependencies
npm install

# 3. Run the dev server
npm run dev


Visit http://localhost:3000
 to open the app.

🧩 API Reference
GET /api

Generate IDs dynamically.

| Query Param | Type | Description | 
|-------------|------|-------------|
|type | string | One of uuid, uuid_wild, guid, |cuid2, unicode|
|count| number| Optional. Defaults to 1.|

Example Response:
```
{
  "type": "uuid",
  "count": 3,
  "ids": [
    "dd1e492a-82cb-4b99-b2cc-d45c78f77c5b",
    "519c25e7-4ad8-4edb-9aa2-9836b15ec239",
    "7f0842cb-28e2-4fc7-baf3-75df81540a77"
  ]
}
```
📦 Build & Deploy
# Production build
npm run build

# Start server
npm start


Deploy easily on Vercel
 or any Node.js-compatible host.

🧠 Future Ideas

Add expiration logic for temporary IDs

Support bulk export (CSV, JSON, TXT)

API authentication for rate-limiting or private use

Extend with custom ID “recipes”

🪶 License

MIT © 2025 Your Name