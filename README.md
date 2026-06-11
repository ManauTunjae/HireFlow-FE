# 💼 HireFlow – Applicant Tracking System (ATS)

HireFlow är ett fullstack-baserat rekryteringssystem (Applicant Tracking System) utvecklat för att strömlinjeforma processen mellan jobbannonsering och kandidathantering. Systemet är byggt med ett strikt rollbaserat behörighetssystem (RBAC) där arbetsgivare (HR/Recruiters) och arbetssökande (Candidates) har helt separerade och skräddarsydda realtids-dashboards.

---

## 🚀 Huvudfunktioner & Arkitektur

### 🔑 Rollbaserad Säkerhet & Autentisering (RBAC)
* **JWT-skyddad Backend:** All datakommunikation sker via säkra middleware-kontroller som validerar unika JSON Web Tokens.
* **Isolerade Vy-rättigheter:** En HR-användare kan *endast* se och hantera kandidater samt jobb som är kopplade till deras unika konto. Systemet nekar automatiskt cross-access (403 Forbidden). Kandidater kan i sin tur endast spåra sina egna inskickade ansökningar.

### 📊 Kandidat-dashboard (CareerHub)
* **Realtidsanalys:** Automatisk uträkning av ansökningsstatistik live från MongoDB (Totalt antal ansökningar, intervjuer, godkända och avslag).
* **Visuella Framstegsindikatorer:** Dynamiska distributionsmätare för jobbstatus samt tidslinje-grafer för månatliga insikter.
* **Historiktabell:** Komplett översikt över inskickade ansökningar med formaterade datum och status-taggar (`Applied`, `Interviewing`, `Hired`, `Declined`) synkade live med HR:s Kanban-aktiviteter.

### 🏢 Rekryterings-dashboard (Recruiter Workspace)
* **Kanban-vy för Talanger:** Ett responsivt kolumnflöde (Applied ⏳ ➔ Interviewing 📈 ➔ Hired 🎉 ➔ Rejected ❌) för effektiv gallring av sökande.
* **Sömlös Statusflytt (Live State-Sync):** Integrerad inline-hantering av kandidatsteg via strömlinjeformade `PATCH`-anrop som omedelbart flyttar kandidatkorten på skärmen och uppdaterar kandidatens personliga vy i realtid.
* **Dynamiska Jobbkort med Redigeringsläge:** Live-räknare (`X Cand`) visar exakt hur många unika profiler som är kopplade till varje enskild annons. Kortet har en hovringskänslig **Edit-knapp** som öppnar en administrations-modal för att förifylla fält, göra finjusteringar eller flytta jobbets övergripande status.

### 📱 100 % Mobilresponsiv Design
* Hela applikationen är mobiloptimerad med **Tailwind CSS** via ett fluid-layout-koncept (`flex-col lg:flex-row`), testat och verifierat live på moderna enheter (t.ex. iPhone 17 Pro-emulatorer) för optimal skärpa utan layout-krockar.

---

## 🛠️ Teknisk Stack

**Frontend:**
* React.js (Vite)
* Tailwind CSS
* Axios (Centraliserad API-instans med Token-interceptors och global hantering av `PUT`/`PATCH`/`POST`)
* React Context API (Global Auth- och sessionshantering)

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose (NoSQL-databas med unika sammansatta indexguards mot dubbelansökningar)
* Cloudinary API & Multer (Säker molnlagring och uppladdning av CV/resumes)
* Zod / Joi (Sträng validering av inkommande payload i middleware)

---

## 🗺️ Databasstruktur (Mongoose Schemas)

### Candidate Schema
```javascript
{
  userRef: { type: ObjectId, ref: 'User', required: true },
  jobId: { type: ObjectId, ref: 'Job', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  status: { type: String, enum: ['applied', 'interview', 'hired', 'rejected'], default: 'applied' },
  LinkedIn: { type: String },
  Github: { type: String }
}
// Unikt index skyddar mot att en kandidat ansöker till samma tjänst två gånger
candidateSchema.index({ email: 1, jobId: 1 }, { unique: true });
```

### Job Schema
```javascript
{
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['open', 'closed', 'draft'], default: 'open' },
  createdBy: { type: ObjectId, ref: 'User', required: true },
  salary: { type: String, required: true },
  requirements: [String]
}
```
**Klona repositoriet**
*   git clone https://github.com/ManauTunjae/HireFlow-FE.git
*   cd HireFlow-FE

**Installera beroenden**
* npm install

**Miljövariabler (.env)**
*   PORT=5000
*   MONGO_URI=your_mongodb_connection_string
*   JWT_SECRET=your_super_secret_jwt_key
*   CLOUDINARY_NAME=your_cloudinary_name
*   CLOUDINARY_API_KEY=your_api_key
*   CLOUDINARY_API_SECRET=your_api_secret

**Bash**
*   npm run dev
