import { supabase } from '../config/supabase';
import { UserRole } from '../types/roles';

export interface UserDocument {
  id:               string;
  first_name:       string;
  last_name:        string;
  email:            string;
  username:         string;
  role:             UserRole;
  created_at:       string;
    country_of_origin?: string;
  country_flag?:      string;
  tribe?:             string;
  current_location?:  string;
}

export async function registerUser(
  firstName: string,
  lastName:  string,
  email:     string,
  username:  string,
  password:  string,
  role:      UserRole,
): Promise<UserDocument> {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email:    email.trim().toLowerCase(),
    password,
  });
  if (authError) throw authError;
  if (!authData.user) throw new Error('Registration failed. Please try again.');

  const uid = authData.user.id;

  const { data, error: dbError } = await supabase
    .from('users')
    .insert({
      id:         uid,
      first_name: firstName.trim(),
      last_name:  lastName.trim(),
      email:      email.trim().toLowerCase(),
      username:   username.trim(),
      role,
    })
    .select()
    .single();

  if (dbError) throw dbError;
  return data as UserDocument;
}

export async function loginUser(
  email:    string,
  password: string,
): Promise<UserDocument> {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email:    email.trim().toLowerCase(),
    password,
  });
  if (authError) throw authError;
  if (!authData.user) throw new Error('Login failed. Please try again.');

  const { data, error: dbError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (dbError) throw dbError;
  return data as UserDocument;
}

export async function logoutUser(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function fetchUserDocument(uid: string): Promise<UserDocument | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', uid)
    .single();
  if (error) return null;
  return data as UserDocument;
}