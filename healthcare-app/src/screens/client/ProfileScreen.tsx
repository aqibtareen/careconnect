import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../services/supabaseClient'; // Adjust path
import { Session, User } from '@supabase/supabase-js';

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null); // Using any for now, define a type later

  // Form fields
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [website, setWebsite] = useState('');
  // Add more fields as per your 'profiles' table: medical history summary, contact, etc.

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        setUser(authUser);
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*') // Select all or specific fields: 'username, full_name, website, role'
          .eq('id', authUser.id)
          .single();

        if (error && error.message !== 'JSON object requested, multiple (or no) rows returned') {
          Alert.alert('Error fetching profile', error.message);
        } else if (profileData) {
          setProfile(profileData);
          setUsername(profileData.username || '');
          setFullName(profileData.full_name || '');
          setWebsite(profileData.website || '');
          // Set other fields from profileData
        } else {
          // No profile found, could be a new user who hasn't completed profile setup
          // Or if the handle_new_user trigger didn't include all fields
          Alert.alert('Profile not found', 'You might need to complete your profile setup.');
        }
      } else {
        // Should not happen if navigation is guarded, but good to handle
        Alert.alert('Not authenticated');
        navigation.navigate('Login'); // Or appropriate auth screen
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleUpdateProfile = async () => {
    if (!user) {
      Alert.alert('Error', 'No user session found.');
      return;
    }
    setLoading(true);
    const updates = {
      id: user.id, // Ensure the ID is part of the update for RLS
      username,
      full_name: fullName,
      website,
      updated_at: new Date(),
      // Add other fields to update
    };

    const { error } = await supabase.from('profiles').upsert(updates, {
      // returning: 'minimal', // Don't return the updated record
    });

    setLoading(false);
    if (error) {
      Alert.alert('Error updating profile', error.message);
    } else {
      Alert.alert('Success', 'Profile updated successfully.');
      // Optionally, refresh profile data or assume it's consistent
      setProfile((prev: any) => ({ ...prev, ...updates }));
    }
  };

  if (loading && !profile) { // Show loader only on initial load
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading Profile...</Text>
      </View>
    );
  }

  if (!user) {
     return (
      <View style={styles.centered}>
        <Text>User not found. Please login again.</Text>
        <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
      </View>
    );
  }

  // Only show "Profile not fully set up" if there's no profile data after loading and user is present
  if (!profile && !loading) {
    return (
      <View style={styles.centered}>
        <Text>Your profile is not fully set up yet.</Text>
        <Text>User ID: {user.id}</Text>
        <Text>Email: {user.email}</Text>
        {/* Allow initial profile creation if desired, or guide user */}
        <TextInput
          style={styles.input}
          placeholder="Username (min 3 chars)"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
        <Button title={loading ? "Saving..." : "Save Initial Profile"} onPress={handleUpdateProfile} disabled={loading} />
        <Button title="Logout" onPress={async () => {
            await supabase.auth.signOut();
            // Navigation to Login is handled by AppNavigator's auth state listener
        }} />
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Client Profile</Text>
      {profile && <Text style={styles.emailText}>Email: {user.email}</Text>}
      {profile && <Text style={styles.emailText}>Role: {profile.role || 'Not set'}</Text>}

      <Text style={styles.label}>Username:</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <Text style={styles.label}>Full Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <Text style={styles.label}>Website (Optional):</Text>
      <TextInput
        style={styles.input}
        placeholder="Website"
        value={website}
        onChangeText={setWebsite}
        autoCapitalize="none"
      />
      {/* Add more fields here */}
      <Button title={loading ? "Saving..." : "Update Profile"} onPress={handleUpdateProfile} disabled={loading} />
      <View style={styles.spacer} />
      <Button title="Logout" onPress={async () => {
          setLoading(true);
          await supabase.auth.signOut();
          // AppNavigator will handle redirecting to Login due to auth state change
          // setLoading(false); // Not strictly needed if navigating away
      }} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  emailText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: 'gray',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  spacer: {
    height: 20,
  }
});

export default ProfileScreen;
