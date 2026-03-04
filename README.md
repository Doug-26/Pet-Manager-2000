# Pet Manager 2000

A pet store queue management web application built with **Angular** and styled with **Tailwind CSS**. Staff manage a kanban-style board to track pets through the queue, while a separate customer-facing display keeps pet owners informed in real time.

> **Note:** The backend (.NET) has **not been implemented yet**. See the [Planned Backend](#planned-backend-net) section below for the intended architecture.

## Tech Stack

- **Frontend:** Angular v21 (standalone components, signals, reactive forms)
- **Styling:** Tailwind CSS v4
- **Persistence:** Browser localStorage (with cross-tab sync)
- **Backend (planned):** .NET 8 Minimal API on AWS Lambda + DynamoDB

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Angular CLI](https://angular.io/cli)

## Getting Started

1. Navigate to the Angular project directory:
    ```bash
    cd PM2000.Angular
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    ng serve
    ```
4. Open your browser and navigate to `http://localhost:4200`.

## Features

### Queue Board (Staff View)

- **Kanban-style queue board** with three columns: *Listed Pets* → *Examining* → *Back to Hooman*
- **Add Pet form** with validated fields: Pet Name (required), Owner Name (required), and Species selector (Dog 🐶, Cat 🐱)
- **Move pets through statuses** — advance from *Listed* → *Examining* → *Done* with a single click
- **Examining column limit** — maximum of 3 pets examined simultaneously; the "Next" button is disabled when at capacity, and a red warning banner appears
- **Dismiss completed pets** from the board with a confirmation dialog
- **Undo last action** — a floating toast allows undoing the most recent add, move, or remove
- **Browser notifications** — desktop notification when a pet moves to "Done" (requests permission on first trigger)
- **Inline form validation** — red borders and error messages on touched invalid fields

### Pet Cards

- **Species emoji icon** next to the pet name
- **Live waiting time** — relative timestamp ("Just now", "5m ago", "1h 20m ago") auto-refreshes every 30 seconds; hidden for completed pets
- **Queue position badge** for listed pets (1, 2, 3…)
- **Owner name** displayed as secondary text
- **Color-coded backgrounds** — blue (listed), amber (examining), emerald (done)

### Customer Display

- **Dedicated read-only route** (`/display`) opened via the **Open Display** button in the header
- **Pop-out window** — staff drags it to a second monitor for customers to see
- **Open/Hide Display toggle** — the header button switches between opening and closing the display window; auto-detects if the window is closed manually
- **Three-column layout** mirroring the staff board, with larger text and cards for readability from a distance
- **Real-time sync** — updates automatically via the browser `storage` event whenever staff make changes (no polling, no refresh needed)
- **Animated ping indicator** on the Examining column header
- **Light, clean theme** with soft gradients and colored column panels
- **No action buttons** — customers can only view, not interact

### Persistence & Sync

- **localStorage persistence** — queue data survives page refresh and browser restart
- **Cross-tab / cross-window sync** — when the staff window writes to localStorage, the display window receives updates instantly via the `storage` event

### Accessibility

- ARIA labels, roles, and `aria-live` regions throughout
- Screen-reader-friendly action labels (dynamic based on state)
- `aria-invalid` on form fields
- Keyboard-navigable controls

### General

- **Responsive layout** — single column on mobile, three-column grid on desktop
- **OnPush change detection** on all components
- **Lazy-loaded routes** via `loadComponent` for code-splitting
- **Signal-based state management** — no external state libraries

## Planned Backend (.NET)

The backend has not been implemented yet. The planned architecture:

| Layer | Technology | Purpose |
|---|---|---|
| API | ASP.NET Core 8 Minimal API | REST endpoints for pet CRUD + status transitions |
| Hosting | AWS Lambda + API Gateway (HTTP API) | Serverless, near-zero cost |
| Database | Amazon DynamoDB | Single table, serverless NoSQL |
| IaC | AWS SAM | `template.yaml` defining all resources |
| Frontend Hosting | GitHub Pages | Static SPA deployment |

### Planned API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/pets` | List all pets |
| `POST` | `/api/pets` | Add a pet |
| `PATCH` | `/api/pets/{id}/status` | Move pet to next status |
| `DELETE` | `/api/pets/{id}` | Remove pet |

### Planned DynamoDB Schema

| Attribute | Type | Key |
|---|---|---|
| `Id` | String (UUID) | Partition Key |
| `Name` | String | — |
| `OwnerName` | String | — |
| `Species` | String | — |
| `Status` | String | — |
| `StatusChangedAt` | Number (epoch ms) | — |

Once the backend is implemented, the Angular frontend will switch from localStorage to HTTP calls via an Angular service, with environment-based API URL configuration.

## Project Structure

```
Pet Manager 2000/
├── PM2000.Angular/              # Angular application
│   └── src/app/
│       ├── features/
│       │   ├── queue/           # Staff queue board + pet card components
│       │   └── display/         # Customer-facing display board
│       ├── layouts/             # Main layout (header + router outlet)
│       ├── models/              # Pet model, species & status types
│       ├── services/            # Pet queue state management (signals + localStorage)
│       └── shared/header/       # Header component (branding, pet count, display toggle)
└── README.md
```

## License

This project is for educational/personal use.