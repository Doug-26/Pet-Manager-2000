# Pet Manager 2000

A pet store queue management web application built with **Angular** and styled with **Tailwind CSS**. Staff manage a kanban-style board to track pets through the queue, while a separate customer-facing display keeps pet owners informed in real time.

> **Note:** The backend (.NET) has **not been implemented yet** — localStorage is sufficient for a single-store, single-machine deployment. See the [Planned Backend](#planned-backend-net) section below for the intended architecture if multi-device support is ever needed.

## Live Demo

**[https://doug-26.github.io/Pet-Manager-2000/](https://doug-26.github.io/Pet-Manager-2000/)**

## Tech Stack

- **Frontend:** Angular v21 (standalone components, signals, reactive forms, `@angular/animations`)
- **Styling:** Tailwind CSS v4
- **Drag & Drop:** Angular CDK (`@angular/cdk/drag-drop`)
- **Persistence:** Browser localStorage (with cross-tab sync)
- **Deployment:** GitHub Pages via GitHub Actions
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
- **Add Pet form** with validated fields: Pet Name (required), Owner Name (required), Species selector (Dog 🐶, Cat 🐱), Visit Reason dropdown, and optional Notes
- **Sticky header & form** — the app header and add-pet form stay pinned at the top as you scroll
- **Move pets through statuses** — advance from *Listed* → *Examining* → *Done* with a single click
- **Drag and drop** — drag pet cards between columns using Angular CDK; drop zone highlights with a blue dashed outline when dragging over
- **Examining column limit** — maximum of 3 pets examined simultaneously; the "Next" button is disabled when at capacity, and a red warning banner appears
- **Inline editing** — click the pencil icon on any card to edit name, owner, species, visit reason, and notes in place
- **Dismiss pets** from the board with a reusable confirmation modal
- **Clear all completed** — bulk-remove all "Back to Hooman" pets with one click (also uses the confirmation modal)
- **Undo last action** — a floating toast with a progress bar allows undoing the most recent add, move, edit, remove, or clear; auto-dismisses after 10 seconds; hover to pause the timer
- **Browser notifications** — desktop notification when a pet moves to "Done" (requests permission on first trigger)
- **Inline form validation** — red borders and error messages on touched invalid fields

### Pet Cards

- **Species emoji icon** next to the pet name
- **Visit reason badge** — colored tag showing checkup, vaccination, grooming, etc.
- **Notes** — optional italic text displayed below the visit reason
- **Live waiting time** — relative timestamp ("Just now", "5m ago", "1h 20m ago") auto-refreshes every 30 seconds; hidden for completed pets
- **Queue position badge** for listed pets (1, 2, 3…)
- **Owner name** displayed as secondary text
- **Color-coded backgrounds** — blue (listed), amber (examining), emerald (done)

### UI Polish

- **Card enter animation** — cards fade + slide in using `@angular/animations` (`@cardEnter` trigger)
- **Hover lift** — cards raise with a subtle shadow on hover (`hover:shadow-md hover:-translate-y-0.5`)
- **Press animation** — all buttons shrink on click (`active:scale-95`)
- **Drop zone highlight** — columns glow with a blue dashed outline when receiving a drag
- **Drag preview** — lifted card shows elevated shadow and grabbing cursor
- **Toast auto-dismiss** — progress bar shrinks over 10 seconds; pauses on hover

### Customer Display

- **Dedicated read-only route** (`/display`) opened via the **Open Display** button in the header
- **Pop-out window** — staff drags it to a second monitor for customers to see
- **Open/Hide Display toggle** — the header button switches between opening and closing the display window; auto-detects if the window is closed manually
- **Three-column layout** mirroring the staff board, with larger text and cards for readability from a distance
- **Scrollable columns** — columns scroll independently with fixed headers when pets exceed the visible area
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

### Deployment

- **GitHub Pages** via GitHub Actions workflow — automatically builds and deploys on push to `main`
- **SPA routing support** — `404.html` redirect ensures client-side routes like `/display` work on GitHub Pages
- **Base href aware** — display window URL adapts to any deployment subpath

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
| `PATCH` | `/api/pets/{id}` | Edit pet details |
| `DELETE` | `/api/pets/{id}` | Remove pet |

### Planned DynamoDB Schema

| Attribute | Type | Key |
|---|---|---|
| `Id` | String (UUID) | Partition Key |
| `Name` | String | — |
| `OwnerName` | String | — |
| `Species` | String | — |
| `VisitReason` | String | — |
| `Notes` | String | — |
| `Status` | String | — |
| `StatusChangedAt` | Number (epoch ms) | — |

Once the backend is implemented, the Angular frontend will switch from localStorage to HTTP calls via an Angular service, with environment-based API URL configuration.

## Project Structure

```
Pet Manager 2000/
├── .github/workflows/           # GitHub Actions deploy workflow
├── PM2000.Angular/              # Angular application
│   └── src/app/
│       ├── features/
│       │   ├── queue/           # Staff queue board + pet card components
│       │   └── display/         # Customer-facing display board
│       ├── layouts/             # Main layout (header + router outlet)
│       ├── models/              # Pet model, species, visit reason & status types
│       ├── services/            # Pet queue state management (signals + localStorage)
│       └── shared/
│           ├── header/          # Header component (branding, pet count, display toggle)
│           └── confirm-modal/   # Reusable confirmation dialog
└── README.md
```

## License

This project is for educational/personal use.