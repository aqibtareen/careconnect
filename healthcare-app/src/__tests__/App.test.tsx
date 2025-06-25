import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import App from '../../App'; // Assuming App.js is at the root

// Mock Supabase client to avoid errors during tests if App.js imports it directly or indirectly
jest.mock('../services/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(() => Promise.resolve({ data: { session: null } })),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
      // Add other Supabase methods if they are called during app initialization
    },
    // Add other Supabase modules if needed
  },
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
    const inset = { top: 0, right: 0, bottom: 0, left: 0 }
    return {
        SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
        SafeAreaConsumer: jest.fn().mockImplementation(({ children }) => children(inset)),
        useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
        useSafeAreaFrame: jest.fn().mockImplementation(() => ({ x: 0, y: 0, width: 390, height: 844 })),
    }
})


describe('<App />', () => {
  it('renders login screen initially when no session exists', async () => {
    render(<App />);
    // AppNavigator initially shows LoginScreen if no session.
    // Wait for elements to appear, as there might be async operations.
    const loginButton = await screen.findByText(/Login/i); // Look for a button or text unique to LoginScreen
    expect(loginButton).toBeTruthy();

    // Check if Register button/link is also present
    const registerButton = await screen.findByText(/Go to Register/i);
    expect(registerButton).toBeTruthy();
  });

  // Add more tests later, e.g., for navigation, registration, specific component rendering.
});
