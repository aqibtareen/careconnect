import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../../services/supabaseClient'; // Adjust path as necessary

const RegisterScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [fullName, setFullName] = useState(''); // Example for additional data
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    setLoading(true);

    // Example of passing additional user data (like role or full_name)
    // Ensure your Supabase `handle_new_user` trigger and `profiles` table are set up to handle this.
    // const role = 'Client'; // Default role for client registration

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      // options: {
      //   data: {
      //     full_name: fullName, // This would be collected from another TextInput
      //     role: role,        // Assigning role at sign-up
      //   }
      // }
    });

    setLoading(false);
    if (error) {
      Alert.alert('Registration Error', error.message);
    } else if (data.session) {
      // User is signed up and session is active
      Alert.alert('Registration Successful', 'Please check your email to confirm your registration. Then you can login.');
      // You might want to navigate to login or a confirmation pending screen
      navigation.navigate('Login');
    } else if (data.user && !data.session) {
        // User exists but is not confirmed / needs to confirm email
        Alert.alert('Registration Successful', 'Please check your email to confirm your registration. Then you can login.');
        navigation.navigate('Login');
    }
     else {
      Alert.alert('Registration Failed', 'An unknown error occurred during registration.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Client Registration</Text>
      {/* <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      /> */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button title={loading ? "Registering..." : "Register"} onPress={handleRegister} disabled={loading} />
      <Button title="Back to Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default RegisterScreen;
