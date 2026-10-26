# 🌱 Kisan Nova — Smart Agriculture Operating System

> **"स्मार्ट खेती, खुशहाल किसान"** (Smart Agriculture, Prosperous Farmer)  
> An intuitive, production-grade agricultural web application designed to empower smallholder and marginal farmers with data-driven decision tools, visual analytics, clinical disease diagnosis, and vernacular accessibility.

---

## 📌 Overview

**Kisan Nova** bridges the critical digital divide in Indian agriculture. Farmers often suffer crop losses and debt due to unscientific seed choices, improper chemical spray concentrations, volatile market prices, and a lack of formal accounting for Kisan Credit Card (KCC) loan disbursements.

Kisan Nova integrates full-stack web technologies with agronomic algorithms to deliver an all-in-one farm management cockpit—accessible in **English**, **हिन्दी (Hindi)**, and **বাংলা (Bengali)**.

---

## 🚀 Key Features

### 1. 🌐 Trilingual Accessibility Engine
- Instant, zero-reload switching between **English**, **हिन्दी**, and **বাংলা**.
- Complete localization across farm metrics, chart legends, disease diagnostics, and financial calculators.

### 2. 📊 Interactive Farm Analytics & Dashboard
- **Plot Acreage Distribution (Doughnut Chart):** Real-time breakdown of current cultivated acreage (e.g., Wheat 2.1 Ac, Mustard 0.9 Ac, Potato 0.5 Ac).
- **Seasonal Cashflow Balance (Bar Chart):** Month-by-month input expenditure tracking against harvest sales revenue.
- **Root Zone Soil Moisture (Line Chart):** 7-day soil moisture tracking with agronomic alerts when levels fall below the critical 50% threshold.

### 3. 📅 REST-Driven Field Task Calendar
- Full CRUD operational scheduler for sowing, basal dressing, weeding, and irrigation cycles.
- Priority labeling (`High`, `Medium`, `Low`), inline task completion toggles, and deletion controls.
- Powered by an Express REST API with an active zero-downtime fallback store.

### 4. 🚜 Agronomic Decision Tools & Simulators
- **Tank Mix & Spray Dosage Calculator:** Eliminates leaf scalding by computing precise chemical quantities (e.g., Mancozeb 75 WP, Propiconazole) for standard 16L and 20L knapsack sprayers.
- **Plant Disease Clinic:** Actionable chemical formulas and organic treatments for devastating crop pathogens like Wheat Yellow Rust and Early Blight.
- **Mandi Price Watch:** Real-time APMC wholesale mandi rates across major regional trade hubs.
- **Crop Decision Simulator:** Side-by-side comparison of water demand, input costs, and net margins (e.g., Wheat vs. Mustard).
- **Cost & Profit Scenario Calculator:** Evaluates net farm income across Low (-15%), Expected, and Peak harvest price realizations.
- **📄 Printable Kisan Farm Passbook:** Formatted 1-page financial ledger summarizing farm acreage, input costs, and yield margins—ready for 1-click browser printing (`window.print()`) for KCC bank loan verifications.

### 5. 🤖 Kisan Mitra AI Assistant
- Floating AI drawer equipped with agronomic quick-prompt chips (`Yellow Rust`, `Wheat Fertilizer Dose`, `Irrigation Timing`).
- Delivers rapid, practical farming remedies without overwhelming technical jargon.

---

## 🛠️ Architecture & Tech Stack

```text
 ┌────────────────────────────────────────────────────────┐
 │           FRONTEND (React 18 + Vite - Port 5173)       │
 │  • Multilingual Localization (EN / HI / BN)            │
 │  • Chart.js Visualizations (Doughnut, Bar, Line)       │
 │  • Kisan Mitra AI Drawer & Operational Calculators     │
 └──────────────────────────┬─────────────────────────────┘
                            │ Axios HTTP Requests
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │          BACKEND API (Node.js + Express - Port 5000)   │
 │  • CORS, JSON Body Parser, Dotenv                      │
 │  • REST Endpoints: /api/tasks (CRUD), /api/crops       │
 │  • Health Check: /api/health                           │
 └──────────────────────────┬─────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
 ┌──────────────────────┐        ┌──────────────────────┐
 │    MongoDB Cloud     │        │ In-Memory Fallback   │
 │ (Persistent Cluster) │        │ (Zero-Downtime Mode) │
 └──────────────────────┘        └──────────────────────┘
