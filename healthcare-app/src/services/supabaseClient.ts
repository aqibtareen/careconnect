import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your actual Supabase URL and anon key
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL') {
  console.warn('Supabase URL is not configured. Please update src/services/supabaseClient.ts');
}

if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.warn('Supabase anon key is not configured. Please update src/services/supabaseClient.ts');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // It's recommended to store the session in a secure place,
    // like AsyncStorage for React Native. For web, localStorage is used by default.
    // autoRefreshToken: true, // Default is true
    // persistSession: true, // Default is true
    // detectSessionInUrl: true // Default is true for client-side, false for server-side
  },
});

// Example of how user roles could be defined in your database schema (e.g., in a 'profiles' table or using custom claims)
// This is for informational purposes and needs to be implemented in your Supabase project's database schema.

/*
-- SQL Schema for User Roles (Example)

-- Create a table for public profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  updated_at TIMESTAMPTZ,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  -- Define an enum for user roles
  -- Ensure this enum is created in your Supabase SQL editor:
  -- CREATE TYPE user_role AS ENUM ('Client', 'Doctor', 'Pharmacy', 'Hospital', 'Admin');
  role user_role DEFAULT 'Client' NOT NULL,

  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.

-- Function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'Client') -- Default to 'Client' if not specified
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function upon new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- To assign roles during sign-up, you might pass the role in the `options.data` field:
// supabase.auth.signUp({
//   email: 'example@email.com',
//   password: 'example-password',
//   options: {
//     data: {
//       full_name: 'Test User',
//       role: 'Doctor' // This would be 'Client', 'Doctor', 'Pharmacy', 'Hospital', or 'Admin'
//     }
//   }
// })

-- For managing custom claims for roles (alternative to table-based roles):
-- You might use Supabase Edge Functions to set custom claims when a user signs up or their role changes.
-- See: https://supabase.com/docs/guides/auth/custom-claims

*/

// Helper function to get user profile including role
export const getUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`username, full_name, avatar_url, website, role`)
      .eq('id', user.id)
      .single();

    if (error && error.message !== 'JSON object requested, multiple (or no) rows returned') {
      console.error('Error fetching profile:', error);
      return null;
    }
    return profile;
  }
  return null;
};
*/
