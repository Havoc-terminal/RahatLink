# RahatLink - Smart Disaster Relief Inventory Optimizer

> **Connecting Relief, Saving Lives**  
> An intelligent disaster relief platform connecting relief warehouses and NGOs through real-time geospatial data, verified disaster information, and greedy priority allocation logic.

---

##  Project Overview

During natural disasters and humanitarian crises, relief efforts often suffer from severe logistics bottlenecks: lack of coordination between stakeholders, delayed supply deliveries, imbalanced inventory distribution, and unverified rumors causing misallocation.

**RahatLink** solves these core challenges by providing a unified platform where:
- **Warehouses** manage, track, and dispatch real-time stocks of essential supplies (food, water, medical kits, essentials).
- **NGOs & Relief Camps** register field locations, declare urgent resource requirements, and monitor fulfillment.
- **Victims & Citizens** can request emergency help directly from affected zones.
- **Smart Allocation Engine** optimizes supply routing from nearest warehouses to highest-urgency camps using the Haversine distance formula and priority-ranking algorithms.

---

##  Key Features

1. **Greedy Nearest-Neighbor Resource Optimizer**
   - Automatically matches pending relief camp needs with available inventory in neighboring warehouses.
   - Urgency prioritization: `Critical` > `High` > `Medium` > `Low` with disaster zone weighting.
   - Calculates real-time geographical distance using the Haversine metric.

2. **Interactive Geospatial Disaster Map**
   - Live Leaflet map displaying active relief camps, warehouses, and reported emergency incidents.
   - Visual status markers and cluster visualization for rapid situational awareness.

3. **Warehouse Inventory Management**
   - Real-time stock dashboard for tracking food packs, clean water rations, trauma/medical kits, and emergency shelters.
   - Quick restock and dispatch logs.

4. **NGO & Relief Camp Portal**
   - Rapid registration of relief camps with GPS coordinates.
   - On-demand resource requests with severity tags and live fulfillment progress.

5. **Citizen / Victim Emergency Assistance**
   - Simple, low-friction emergency request portal for affected citizens.
   - Direct broadcast of urgent medical, food, or rescue requirements.

6. **Verified Disaster News & Alerts**
   - Real-time news feed categorized by verified disaster incident reports and weather alerts to counter misinformation.

7. **Multi-Language Accessibility**
   - Built-in internationalization and regional language support (English, Hindi, etc.) to ensure accessibility during ground operations.

---

##  Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS
- **Mapping:** Leaflet & React-Leaflet
- **Icons & UI:** Lucide React, Radix UI
- **Data Visualization:** Chart.js / Recharts
- **HTTP Client:** Axios / Fetch API

### Backend
- **Framework:** FastAPI (Python 3.10+)
- **Server:** Uvicorn ASGI
- **ORM / Database:** SQLAlchemy + SQLite (production-ready for PostgreSQL)
- **Data Validation:** Pydantic
- **Geospatial Computation:** Haversine algorithm

---

##  Project Structure

```text
RahatLink/
├── backend/
│   ├── routes/
│   │   ├── allocations.py       # Supply allocation endpoints
│   │   ├── analytics.py         # Summary analytics and stats
│   │   ├── auth.py              # User authentication
│   │   ├── camps.py             # Relief camps & needs management
│   │   ├── chat.py              # Relief support assistant
│   │   ├── map_entities.py      # Map coordinates and points of interest
│   │   ├── news.py              # Disaster alerts and verified news
│   │   ├── request_help.py      # Citizen emergency request routes
│   │   └── warehouses.py        # Warehouse inventory routes
│   ├── services/
│   │   └── optimization.py      # Haversine distance and greedy allocation algorithm
│   ├── database.py              # Database engine & session setup
│   ├── main.py                  # FastAPI application entry point
│   ├── models.py                # SQLAlchemy ORM models
│   ├── schemas.py               # Pydantic schemas
│   ├── requirements.txt         # Python dependencies
│   └── rahatlink.db             # SQLite database
│
├── frontend/
│   ├── public/                  # Static assets and icons
│   ├── src/
│   │   ├── api/                 # Axios API client
│   │   ├── assets/              # Graphics and hero illustrations
│   │   ├── components/          # Reusable UI components (Layout, ChatBox)
│   │   ├── context/             # Global application state
│   │   ├── pages/               # 11 core application views
│   │   │   ├── LandingPage.jsx
│   │   │   ├── RoleSelection.jsx
│   │   │   ├── LocationSetup.jsx
│   │   │   ├── VictimPortal.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MapPage.jsx
│   │   │   ├── WarehousePanel.jsx
│   │   │   ├── NGOPanel.jsx
│   │   │   ├── Distribution.jsx
│   │   │   ├── Optimization.jsx
│   │   │   ├── NewsPage.jsx
│   │   │   └── Analytics.jsx
│   │   ├── translations.js      # Multi-language translations dictionary
│   │   ├── App.jsx              # Application router
│   │   └── main.jsx             # React entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── RahatLink_Hackathon.pdf      # Hackathon project presentation & specification
└── README.md
```

---

##  Getting Started

### Prerequisites
- Node.js (v18 or higher) & npm
- Python (v3.10 or higher)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment (optional but recommended)
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

The API will be live at `http://localhost:8000`.  
Interactive API documentation (Swagger UI) is accessible at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Start the Vite development server
npm run dev
```

The web application will be available at `http://localhost:5173`.

---

##  Optimization Algorithm

The allocation engine solves the supply dispatch problem using a prioritized greedy matching approach:

1. **Classification:** Gathers all active relief camps with pending resource requirements.
2. **Priority Ordering:** Orders camps by severity (`is_disaster_zone` flag and urgency weighting: `Critical` > `High` > `Medium` > `Low`).
3. **Proximity Search:** For each item requirement, identifies all warehouses with stock and calculates distance via the spherical Haversine formula:
   $$\Delta\sigma = 2 \arcsin \left( \sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)} \right)$$
4. **Greedy Allocation:** Fulfills requirements from the nearest warehouse first, decrementing inventory and updating request status (`Pending` $\rightarrow$ `Partial` $\rightarrow$ `Fulfilled`).

---

## 👨‍💻 Author

**Saksham Thakur**  
- GitHub: [@Havoc-terminal](https://github.com/Havoc-terminal)  
