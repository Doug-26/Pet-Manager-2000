# Pet Manager 2000

A full-stack web application for managing a pet store queue, built with **Angular** and **.NET**.

## Tech Stack

- **Frontend:** Angular (v21, standalone components, signals)
- **Backend:** .NET (C#)
- **Styling:** Tailwind CSS

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Angular CLI](https://angular.io/cli)
- [.NET SDK](https://dotnet.microsoft.com/download) (6.0 or later)

## Getting Started

### Backend (.NET)

1. Navigate to the backend project directory:
    ```bash
    cd <backend-folder>
    ```
2. Restore dependencies and run:
    ```bash
    dotnet restore
    dotnet run
    ```

### Frontend (Angular)

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

- **Kanban-style queue board** with three columns: *Listed Pets*, *Examining*, and *Back to Hooman*
- **Add pets to the queue** with pet name and owner name via a validated form
- **Move pets through statuses** — advance a pet from *Listed* → *Examining* → *Done* with a single click
- **Dismiss completed pets** from the board with a remove/delete action (with confirmation)
- **Live waiting time display** showing how long each pet has been in its current status (auto-refreshes every 30 seconds)
- **Real-time pet count** displayed in the header badge
- **Queue position numbering** for listed pets
- **Responsive layout** — adapts from single-column on mobile to a three-column grid on desktop
- **Accessible UI** with ARIA labels, roles, live regions, and screen-reader-only headings

## Project Structure

```
Pet Manager 2000/
├── PM2000.Angular/          # Angular application
│   └── src/app/
│       ├── features/queue/  # Queue board & pet card components
│       ├── layouts/         # Main layout with header + router outlet
│       ├── models/          # Pet model & status types
│       ├── services/        # Pet queue state management (signals)
│       └── shared/header/   # Reusable header component
├── <backend-folder>/        # .NET Web API
└── README.md
```

## License

This project is for educational/personal use.