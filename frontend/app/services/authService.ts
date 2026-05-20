// ─────────────────────────────────────────────────────────────────────────────
//  services/authService.ts
//
//  All Supabase Auth + database operations in one place.
//  Screens never touch Supabase directly — they call these functions.
// ─────────────────────────────────────────────────────────────────────────────

import { supabase } from '../config/supabase';
import { UserRole } from '../types/Roles';

// ── User profile shape (matches your 'users' table in Supabase) ───────────────
export interface UserDocument {
  id:         string;
  first_name: string;
  last_name:  string;
  email:      string;
  username:   string;
  role:       UserRole;
  created_at: string;
}

// ── Register ──────────────────────────────────────────────────────────────────
/**
 * 1. Creates a Supabase Auth user (email + password)
 * 2. Inserts a row into the 'users' table with profile info + role
 * Returns the full UserDocument so AuthContext can hydrate immediately.
 */
export async function registerUser(
  firstName: string,
  lastName:  string,
  email:     string,
  username:  string,
  password:  string,
  role:      UserRole,
): Promise<UserDocument> {
  // Step 1 — create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email:    email.trim().toLowerCase(),
    password,
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('Registration failed. Please try again.');

  const uid = authData.user.id;

  // Step 2 — insert profile row into 'users' table
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

// ── Login ─────────────────────────────────────────────────────────────────────
/**
 * 1. Signs in with Supabase Auth (email + password)
 * 2. Fetches the profile row to get role + all user data
 * Returns the UserDocument.
 */
export async function loginUser(
  email:    string,
  password: string,
): Promise<UserDocument> {
  // Step 1 — sign in
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email:    email.trim().toLowerCase(),
    password,
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('Login failed. Please try again.');

  const uid = authData.user.id;

  // Step 2 — fetch profile
  const { data, error: dbError } = await supabase
    .from('users')
    .select('*')
    .eq('id', uid)
    .single();

  if (dbError) throw dbError;

  return data as UserDocument;
}

// ── Logout ────────────────────────────────────────────────────────────────────
export async function logoutUser(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ── Fetch user profile (used on app restart) ──────────────────────────────────
export async function fetchUserDocument(uid: string): Promise<UserDocument | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', uid)
    .single();

  if (error) return null;
  return data as UserDocument;
}