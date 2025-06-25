import React from 'react';
import AppNavigator from './src/navigation/AppNavigator'; // Adjust path as necessary
import { supabase } from './src/services/supabaseClient'; // For potential direct use or config

// Optional: You can import global styles or context providers here if needed
// import './src/styles/global.css'; // Example for web global styles if you add them

export default function App() {
  // Initialize Supabase client if needed (though it's usually done in supabaseClient.ts)
  // You could also set up any global listeners or context providers here.

  return (
    <AppNavigator />
  );
}

// Note: The original styles from the template are removed as AppNavigator now controls the UI.
// If you need a root container with styles, you can wrap AppNavigator in a View.
