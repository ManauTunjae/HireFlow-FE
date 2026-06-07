# 💼 HireFlow – Applicant Tracking System (ATS)

HireFlow är ett fullstack-baserat rekryteringssystem (Applicant Tracking System) utvecklat för att strömlinjeforma processen mellan jobbannonsering och kandidathantering. Systemet är byggt med ett strikt rollbaserat behörighetssystem (RBAC) där arbetsgivare (HR/Recruiters) och arbetssökande (Candidates) har helt separerade och skräddarsydda realtids-dashboards.

## 🚀 Huvudfunktioner & Arkitektur

### 🔑 Rollbaserad Säkerhet & Autentisering (RBAC)
*   **JWT-skyddad Backend:** All datakommunikation sker via säkra middleware-kontroller som validerar unika JSON Web Tokens.
*   **Isolerade Vy-rättigheter:** En HR-användare kan *endast* se kandidater som sökt deras specifika jobb. Systemet nekar automatiskt cross-access (403 Forbidden). Kandidater kan i sin tur endast spåra sina egna ansökningar.

### 📊 Kandidat-dashboard (CareerHub)
*   **Realtidsanalys:** Automatisk uträkning av ansökningsstatistik live från MongoDB (Total antal ansökningar, intervjuer, godkända och avslag).
*   **Visuella Framstegsindikatorer:** Dynamiska distributionsmätare för jobbstatus samt tidslinje-grafer för månatliga insikter.
*   **Historiktabell:** Komplett översikt över inskickade ansökningar med formaterade datum och status-taggar.

### 🏢 Rekryterings-dashboard (Recruiter Workspace)
*   **Kanban-vy för Talanger:** Ett responsivt kolumnflöde (Applied ⏳ -> Interviewing 📈 -> Hired 🎉) för effektiv gallring av sökande.
*   **Dynamiska Jobbkort:** Live-räknare (`X Cand`) som visar exakt hur många unika profiler som är kopplade till varje enskild annons.

### 📱 100 % Mobilresponsiv Design
*   Hela applikationen är mobiloptimerad med **Tailwind CSS** via ett fluid-layout-koncept (`flex-col lg:flex-row`), testat och verifierat live på moderna enheter (t.ex. iPhone 17 Pro-emulatorer) för optimal skärpa utan layout-krockar.

---

## 🛠️ Teknisk Stack

**Frontend:**
*   React.js (Vite)
*   Tailwind CSS
*   Axios (Centraliserad API-instans med Token-interceptors)
*   React Context API (Global Auth-hantering)

**Backend:**
*   Node.js & Express.js
*   MongoDB & Mongoose (NoSQL-databas med unika indexguards mot dubbelansökningar)
*   Cloudinary API & Multer (Säker molnlagring och uppladdning av CV/resumes)
*   Zod / Joi (Sträng validering av inkommande data)

---

## 🗺️ Databasstruktur (Mongoose Schemas)

### Candidate Schema
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
candidateSchema.index({ email: 1, jobId: 1 }, { unique: true });

### Job Schema
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
