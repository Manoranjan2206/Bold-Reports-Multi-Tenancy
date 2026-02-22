# Application Architecture - Hosted Deployment

## System Architecture

### Development Environment
```
┌─────────────────────────────────────────────────────────┐
│                    Developer Machine                     │
│                                                           │
│  npm start (runs concurrently)                           │
│  ├─ Vite Dev Server (Port 5173/5174)                    │
│  │  └─ HMR (Hot Module Replacement) enabled             │
│  │  └─ React components hot reload                      │
│  │                                                       │
│  └─ Express Backend (Port 3001)                         │
│     └─ /api/token endpoint                              │
│     └─ Serves API only                                  │
│                                                           │
│  Vite Proxy Routes:                                      │
│  /api/* → http://localhost:3001/api/*                   │
└─────────────────────────────────────────────────────────┘
       ↓
┌─────────────────────────────────────────────────────────┐
│              Bold Reports Cloud API                      │
│                                                           │
│  https://cloud.boldreports.com/reporting/api/           │
│  - Token endpoint                                        │
│  - Report viewer service                                │
└─────────────────────────────────────────────────────────┘
```

### Production Environment (After Build)
```
┌──────────────────────────────────────────────────────────────┐
│                    Internet / Users                          │
│                                                              │
│            https://your-domain.com                           │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────┐
│                  Nginx Reverse Proxy                         │
│                                                              │
│  - HTTPS/SSL termination                                    │
│  - Static asset caching                                     │
│  - Gzip compression                                         │
│  - Rate limiting (optional)                                 │
│                                                              │
│  Forwards to: http://localhost:3001                         │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────┐
│              Node.js Express Server                          │
│                       (Port 3001)                            │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │          Middleware Stack                          │    │
│  ├─ CORS configuration                                │    │
│  ├─ JSON parsing                                      │    │
│  ├─ Static file serving (dist/)                       │    │
│  └─ Error handling                                    │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │       Route Handlers                               │    │
│  ├─ POST /api/token → Bold Reports API                │    │
│  ├─ GET /* → React index.html (SPA fallback)         │    │
│  └─ Static assets (.js, .css, etc.)                  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │       Configuration (from .env)                    │    │
│  ├─ PORT=3001                                         │    │
│  ├─ NODE_ENV=production                              │    │
│  ├─ REPORT_USER=...                                   │    │
│  ├─ REPORT_PASSWORD=...                              │    │
│  ├─ EMBED_SECRET=...                                 │    │
│  └─ Bold Reports API endpoints                       │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────┐
│              Bold Reports Cloud API                         │
│                                                              │
│  https://cloud.boldreports.com/reporting/api/               │
│  - Generate embed tokens                                    │
│  - Serve report viewer                                      │
│  - Report data processing                                   │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow

### Token Generation Flow
```
1. User selects Tenant/User in UI
                ↓
2. React component calls fetch('/api/token', {tenantId, userId})
                ↓
3. Vite Proxy routes to Node.js server (dev)
   OR Direct call to Express (prod)
                ↓
4. /api/token handler receives request
                ↓
5. Constructs token request with:
   - Bold Reports credentials
   - Tenant ID
   - User ID
                ↓
6. Sends to Bold Reports Token API
                ↓
7. Bold Reports validates and returns embed token
                ↓
8. Node.js returns token to React
                ↓
9. React uses token to initialize Report Viewer
                ↓
10. Report Viewer calls Bold Reports API with token
                ↓
11. User sees embedded report
```

### File Serving Flow (Production)
```
User Request: GET https://your-domain.com/
        ↓
Nginx routes to localhost:3001
        ↓
Express receives request
        ↓
Is it /api/* route?
  ├─ YES → Handle API request
  └─ NO → Check dist/ folder
          ├─ .js/.css found? → Serve from dist/
          └─ Not found? → Serve dist/index.html (SPA)
```

## Configuration Hierarchy

```
┌─────────────────────────────────────────┐
│    Production Environment               │
│    (Linux server)                       │
│                                         │
│  .env file (highest priority)           │
│  ├─ REPORT_USER=...                    │
│  ├─ REPORT_PASSWORD=...                │
│  └─ NODE_ENV=production                │
└─────────────────────────────────────────┘
        ↓ Loaded by dotenv package
┌─────────────────────────────────────────┐
│    server/config.js                     │
│                                         │
│  export const config = {                │
│    reportServerUrl: process.env.X||Y    │
│    credentials: {                       │
│      user: process.env.REPORT_USER,     │
│      password: process.env.REPORT_PASSWORD
│    }                                    │
│  }                                      │
└─────────────────────────────────────────┘
        ↓ Imported by server.js
┌─────────────────────────────────────────┐
│    server/server.js                     │
│                                         │
│  Uses config for:                       │
│  - Bold Reports API calls               │
│  - Server port                          │
│  - Environment detection                │
└─────────────────────────────────────────┘

Legend:
  process.env.X = Value from .env file
  Y = Fallback default value
```

## Component Interaction

```
┌────────────────────────────────────────────────────────────┐
│                    React Components                        │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ App.tsx (Main Application)                           │ │
│  │ ├─ Manages tenant/user selection                     │ │
│  │ └─ Passes tenantId, userId to ReportViewer          │ │
│  └──────────────────────────────────────────────────────┘ │
│                            ↓                               │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ ReportViewer.tsx (Report Display)                    │ │
│  │ ├─ Calls /api/token with tenantId, userId           │ │
│  │ ├─ Receives authorizationToken                       │ │
│  │ └─ Initializes Bold Report Viewer component         │ │
│  └──────────────────────────────────────────────────────┘ │
│                            ↓                               │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ BoldReportViewerComponent (External Library)         │ │
│  │ ├─ Displays interactive report                       │ │
│  │ └─ Communicates with Bold Reports API               │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

## Deployment Models

### Option 1: Single Server (Recommended for small deployments)
```
One Linux VM
├─ Nginx (HTTPS)
├─ Node.js + Express
└─ Bold Reports Cloud (external)
```

### Option 2: Multi-server (For scalability)
```
Load Balancer
├─ Node.js Server 1
├─ Node.js Server 2
└─ Node.js Server N

+ Shared .env or environment service
+ Database for session storage
+ Nginx reverse proxy with multiple backends
```

### Option 3: Containerized (Docker)
```
Docker Container
├─ Node.js + Express
├─ React Frontend (dist/)
└─ Bold Reports Cloud connection

Can be orchestrated with Kubernetes for auto-scaling
```

## Environment Variable Resolution

```
At startup:

1. dotenv loads .env file
   ├─ REPORT_USER = "value from .env"
   └─ Process.env.REPORT_USER is set

2. server/config.js reads process.env
   ├─ reportUser = process.env.REPORT_USER || 'default'
   └─ If env var exists → use it
   └─ If env var missing → use default

3. server.js imports config
   └─ Uses config values throughout application

4. All config centralized in one place
   └─ Easy to update production values
   └─ No code changes needed
```

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                  Layer 1: Network Security               │
│  - HTTPS/SSL (Nginx)                                    │
│  - Firewall rules                                       │
│  - Rate limiting                                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                Layer 2: Application Security            │
│  - CORS policy                                          │
│  - Input validation                                     │
│  - Error handling (no stack traces)                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Layer 3: Credential Security               │
│  - Environment variables (.env)                         │
│  - Never in source code                                 │
│  - Git ignored                                          │
│  - File permissions (chmod 600)                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│            Layer 4: Bold Reports Integration            │
│  - Embed token authentication                           │
│  - Secure token transfer                                │
│  - Cloud API authentication                             │
└─────────────────────────────────────────────────────────┘
```

## Performance Optimizations

```
Frontend:
├─ Code splitting via Vite
├─ Lazy loading of routes
├─ CSS/JS minification
└─ Tree-shaking unused code

Backend:
├─ Static file caching (Nginx)
├─ Gzip compression
├─ Connection pooling
└─ Error recovery

Infrastructure:
├─ CDN for static assets
├─ Database indexing
├─ Monitoring and alerts
└─ Auto-scaling (if containerized)
```

---

This architecture ensures:
- ✅ Separation of concerns
- ✅ Security best practices
- ✅ Easy maintenance
- ✅ Horizontal scalability
- ✅ Production readiness
