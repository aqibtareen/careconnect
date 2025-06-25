# Healthcare Application MVP

This is a multi-service, Practo-like Healthcare Application MVP built with React Native + Expo, targeting web first, then Android and iOS. It uses Supabase for the backend (database, authentication, storage).

## Project Overview

The application aims to connect clients, doctors, pharmacies, and hospitals through a unified platform.

**Core Services:**
*   **Client Service:** Registration, Login, Profile, Medical History, Book Appointments, View Medical Records & Prescriptions, Chat/Video Consultations.
*   **Doctor Service:** Registration, Availability Management, Appointment Viewing, EMR Access, Prescription Creation.
*   **Pharmacy Service:** Registration, Inventory Management, Prescription Verification, Order Fulfillment.
*   **Hospital Service:** Registration, Bed Availability Management, Admissions, Medical Records, Doctor/Staff Management.
*   **Admin Service:** Registration/Verification of Services, User Management, Dashboards.
*   **Notification Service:** Push Notifications, Alerts.

## Tech Stack

*   **Frontend:** React Native with Expo (Web, Android, iOS)
*   **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
*   **State Management:** Zustand (or React Context for simpler cases)
*   **Navigation:** React Navigation

## Directory Structure

```
healthcare-app/
├── src/
│   ├── api/                 # Conceptual API route definitions (app.routes.ts)
│   ├── assets/              # Images, fonts, etc.
│   ├── components/          # Shared UI components
│   │   ├── common/
│   │   ├── forms/
│   │   └── navigation/
│   ├── modules/             # Core service modules
│   │   ├── admin/
│   │   ├── client/
│   │   ├── doctor/
│   │   ├── hospital/
│   │   ├── notification/
│   │   └── pharmacy/
│   │       ├── controller.ts  # Business logic
│   │       ├── service.ts     # DB/external service integration
│   │       └── repository.ts  # Data access layer (if needed separately)
│   ├── navigation/          # Navigators (AppNavigator.tsx)
│   ├── screens/             # Top-level screen components per service
│   │   ├── admin/
│   │   ├── client/          # (e.g., LoginScreen.tsx, ProfileScreen.tsx)
│   │   ├── doctor/
│   │   ├── hospital/
│   │   └── pharmacy/
│   ├── services/            # Shared services (e.g., supabaseClient.ts)
│   ├── store/               # Global state management (Zustand stores)
│   └── utils/               # Utility functions
├── App.js                   # Main app entry point
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or yarn
*   Expo CLI: `npm install -g expo-cli`
*   A Supabase project.

### Setup

1.  **Clone the repository (if applicable):**
    ```bash
    git clone <repository-url>
    cd healthcare-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # OR
    yarn install
    ```

3.  **Configure Supabase Client:**
    *   Rename or copy `src/services/supabaseClient.ts.example` to `src/services/supabaseClient.ts` (if an example file is provided - currently, placeholders are directly in `supabaseClient.ts`).
    *   Open `src/services/supabaseClient.ts`.
    *   Replace `'YOUR_SUPABASE_URL'` and `'YOUR_SUPABASE_ANON_KEY'` with your actual Supabase project URL and anon key.
    *   **Important:** Set up the required database schema and RLS policies in your Supabase project. Refer to comments in `src/services/supabaseClient.ts` and service module files for guidance on tables like `profiles`, user roles, etc. Ensure email authentication is enabled in Supabase.

### Running the Application

*   **For Web:**
    ```bash
    npx expo start --web
    # OR
    npm run web
    # OR
    yarn web
    ```
    Then press `w` in the terminal if it doesn't open automatically.

*   **For Android:**
    ```bash
    npx expo start --android
    # OR
    npm run android
    # OR
    yarn android
    ```
    (Requires Android development environment setup or an Android device with the Expo Go app).

*   **For iOS:**
    ```bash
    npx expo start --ios
    # OR
    npm run ios
    # OR
    yarn ios
    ```
    (Requires macOS and Xcode, or an iOS device with the Expo Go app).

### Available Scripts (in `package.json`)

*   `npm start` or `yarn start`: Starts the Expo development server.
*   `npm run android` or `yarn android`: Starts the app on a connected Android device/emulator.
*   `npm run ios` or `yarn ios`: Starts the app on an iOS simulator/device (macOS only).
*   `npm run web` or `yarn web`: Starts the app in a web browser.
*   `npm run build:web` or `yarn build:web` (To be added): `npx expo export:web` - Bundles the app for web deployment.
*   `npm test` or `yarn test` (To be added/configured): Runs tests.


## Supabase Setup Notes

*   **Authentication:**
    *   Ensure Email provider is enabled.
    *   Consider enabling/disabling "Confirm email" based on your development/production needs. The current `RegisterScreen.tsx` informs the user to check their email.
*   **Database:**
    *   Create a `profiles` table as per the schema suggested in `src/services/supabaseClient.ts` or your own design. It should at least include `id (UUID, FK to auth.users)`, `role (TEXT or ENUM)`, `full_name (TEXT)`, `username (TEXT)`.
    *   Implement the `handle_new_user` trigger (see `supabaseClient.ts` comments) to automatically create a profile when a new user signs up.
    *   Set up Row Level Security (RLS) policies for all tables, especially `profiles`, to ensure users can only access/modify their own data unless permitted.
*   **Storage:**
    *   Create buckets as needed (e.g., `avatars`, `medical_files`) and configure RLS policies for them.

## Future Development

*   Implement remaining features for all core services.
*   Flesh out Role-Based Access Control (RBAC) in navigation and service logic.
*   Integrate Push Notifications via Expo Push Tokens and Supabase Edge Functions.
*   Develop comprehensive testing (unit, integration, E2E).
*   Set up CI/CD pipelines for automated builds and deployments.
*   Extend to native mobile builds for Android and iOS beyond Expo Go.

## Contributing

(Guidelines for contributing if this were an open project)

---

This README provides a starting point. It should be updated as the project progresses.
