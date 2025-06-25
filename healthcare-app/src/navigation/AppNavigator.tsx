import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient'; // Adjust path

// Screens
import LoginScreen from '../screens/client/LoginScreen'; // Adjust path
import RegisterScreen from '../screens/client/RegisterScreen'; // Adjust path
// Screens
import LoginScreen from '../screens/client/LoginScreen'; // Adjust path
import RegisterScreen from '../screens/client/RegisterScreen'; // Adjust path
import ProfileScreen from '../screens/client/ProfileScreen'; // Import ProfileScreen
// import ClientDashboardScreen from '../screens/client/ClientDashboardScreen'; // Example placeholder

// Define your stack navigator
const Stack = createStackNavigator();

// Example Placeholder for a screen after login - We'll replace this with ProfileScreen or a real dashboard
// const PlaceholderClientDashboard = () => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//     <Text>Client Dashboard</Text>
//     <Button title="Logout" onPress={async () => await supabase.auth.signOut()} />
//   </View>
// );

// React Native components (if not already imported elsewhere)
// We can remove these if not used directly here, ProfileScreen and Login/Register handle their own
import { View, Text, Button } from 'react-native';


const AppNavigator = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      // Proper cleanup of the listener
      if (authListener && typeof authListener.subscription?.unsubscribe === 'function') {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  if (loading) {
    // You might want to show a loading spinner here
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {session && session.user ? (
          // User is signed in
          // TODO: Add role-based navigation here. For now, default to ProfileScreen.
          // Later, this could be a TabNavigator or a switch based on user.role
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: 'My Profile' }}
          />
          // Add other authenticated screens here, e.g.,
          // <Stack.Screen name="ClientAppointments" component={ClientAppointmentsScreen} />
        ) : (
          // No user signed in
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: 'Create Account' }}
            />
          </>
        )}
        {/* Add other screens/navigators here as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
