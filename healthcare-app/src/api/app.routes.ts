/**
 * app.routes.ts
 *
 * This file is intended to outline the conceptual API routes for the application.
 * In a React Native + Expo setup with Supabase, direct API endpoint exposure like in a traditional
 * backend (e.g., Express.js) is handled differently.
 *
 * Primary Interactions:
 * 1. Client-Side Service Calls: Most "API calls" will be functions within your
 *    `src/modules/<service>/service.ts` files that directly interact with Supabase
 *    (or other third-party services). These are called from your UI components/controllers.
 * 2. Supabase Edge Functions: For more complex backend logic, secure operations, or
 *    integrations that shouldn't live client-side, you would use Supabase Edge Functions.
 *    These functions ARE actual API endpoints.
 *
 * This file will serve as a conceptual map for:
 *  - Documenting the kinds of operations each service module will handle.
 *  - Defining the "shape" of requests and responses, even if they are Supabase function calls.
 *  - Planning for future Supabase Edge Functions.
 *
 * For now, it will mostly contain comments and type definitions as placeholders.
 */

// ================= AUTHENTICATION (Managed by Supabase Auth) =================
// These are not custom routes but interactions with Supabase Auth service.
// Path: Handled by Supabase client library calls (e.g., supabase.auth.signUp)
// Client Service (src/modules/client/service.ts) will wrap these calls.

/**
 * @POST /auth/signup
 * Description: User registration.
 * Body: { email, password, options: { data: { full_name, role? } } }
 * Response: { user, session, error }
 */

/**
 * @POST /auth/login
 * Description: User login.
 * Body: { email, password }
 * Response: { user, session, error }
 */

/**
 * @POST /auth/logout
 * Description: User logout.
 * Response: { error }
 */

/**
 * @GET /auth/user
 * Description: Get current authenticated user.
 * Response: { user, error }
 */

/**
 * @PUT /auth/user
 * Description: Update user attributes (e.g., email, password - handled by Supabase).
 * Body: { email?, password? }
 * Response: { user, error }
 */


// ================= CLIENT SERVICE =================
// Interactions primarily via Supabase client library.
// Example of how you might structure Edge Functions if needed.

/**
 * @GET /profiles/:userId
 * Description: Get a user's public profile.
 * Access: Authenticated users.
 * Supabase Equivalent: Direct SELECT from 'profiles' table with RLS.
 * Controller: src/modules/client/controller.ts -> getProfile()
 * Service: src/modules/client/service.ts -> fetchProfileById()
 */

/**
 * @PUT /profiles/:userId
 * Description: Update a user's own profile.
 * Access: Owner only (enforced by RLS).
 * Supabase Equivalent: Direct UPDATE on 'profiles' table with RLS.
 * Controller: src/modules/client/controller.ts -> updateProfile()
 * Service: src/modules/client/service.ts -> updateUserProfile()
 * Body: { username?, full_name?, avatar_url?, website?, medical_history_summary? }
 */

/**
 * @POST /appointments
 * Description: Client books an appointment.
 * Access: Authenticated 'Client' role.
 * Potential Edge Function: if complex validation or multi-step logic is needed.
 * Body: { doctor_id, hospital_id?, appointment_slot_id, reason?, notes? }
 * Response: Appointment details.
 * Controller: src/modules/client/controller.ts -> bookAppointment()
 * Service: src/modules/client/service.ts -> createAppointment()
 */

/**
 * @GET /appointments/my
 * Description: Client views their appointments.
 * Access: Authenticated 'Client' role.
 * Supabase Equivalent: Direct SELECT from 'appointments' table with RLS.
 * Controller: src/modules/client/controller.ts -> getMyAppointments()
 * Service: src/modules/client/service.ts -> fetchMyAppointments()
 */

/**
 * @GET /medical-records/my
 * Description: Client views their medical records.
 * Access: Authenticated 'Client' role.
 * Supabase Equivalent: Direct SELECT from 'medical_records' table with RLS.
 */

/**
 * @GET /prescriptions/my
 * Description: Client views their prescriptions.
 * Access: Authenticated 'Client' role.
 * Supabase Equivalent: Direct SELECT from 'prescriptions' table with RLS.
 */


// ================= DOCTOR SERVICE =================

/**
 * @PUT /doctors/availability
 * Description: Doctor manages their availability.
 * Access: Authenticated 'Doctor' role.
 * Body: [{ day_of_week, start_time, end_time, is_available }]
 */

/**
 * @GET /doctors/appointments
 * Description: Doctor views their appointments.
 * Access: Authenticated 'Doctor' role.
 */

/**
 * @POST /prescriptions
 * Description: Doctor creates a prescription.
 * Access: Authenticated 'Doctor' role.
 * Body: { client_id, medication_name, dosage, frequency, duration, notes? }
 */


// ================= PHARMACY SERVICE =================

/**
 * @GET /pharmacy/prescriptions/:prescriptionId
 * Description: Pharmacy verifies a prescription.
 * Access: Authenticated 'Pharmacy' role.
 */

/**
 * @POST /pharmacy/orders
 * Description: Pharmacy fulfills an order (based on verified prescription).
 * Access: Authenticated 'Pharmacy' role.
 */


// ================= HOSPITAL SERVICE =================

/**
 * @GET /hospitals/:hospitalId/bed-availability
 * Description: View bed availability for a hospital.
 * Access: Authenticated users (e.g., 'Client', 'Doctor', 'Admin').
 */

/**
 * @POST /hospitals/admissions
 * Description: Hospital admits a patient.
 * Access: Authenticated 'Hospital' staff role.
 */


// ================= ADMIN SERVICE =================

/**
 * @POST /admin/verify-service
 * Description: Admin verifies a Doctor, Pharmacy, or Hospital.
 * Access: Authenticated 'Admin' role.
 * Body: { service_type: ('Doctor' | 'Pharmacy' | 'Hospital'), service_id, is_verified: boolean }
 */

/**
 * @GET /admin/users
 * Description: Admin manages users (view, update role, deactivate).
 * Access: Authenticated 'Admin' role.
 */

/**
 * @GET /admin/reports/appointments
 * Description: Admin views appointment reports.
 * Access: Authenticated 'Admin' role.
 */


// ================= NOTIFICATION SERVICE =================
// Typically triggered by other service actions, often via database triggers or Edge Functions.
// Example: A new appointment booking could trigger a notification.
// No direct client-callable "routes" in the same way, but represents functionality.

/**
 * @EVENT appointment_booked
 * Action: Send notification to Client and Doctor.
 */

/**
 * @EVENT prescription_ready_for_pickup
 * Action: Send notification to Client.
 */

// This file will evolve as the application grows and specific needs for Supabase Edge Functions arise.
// For now, it provides a good overview of the intended service interactions.

export {}; // This makes the file a module, avoiding global scope issues.
// No actual code to export yet, as it's conceptual.
// Types for request/response bodies could be defined here or in respective module types.ts files.

/*
Example Type Definition (could live in src/modules/client/types.ts or a global types file)

export interface AppointmentBookingRequest {
  doctor_id: string; // UUID
  hospital_id?: string | null; // UUID
  appointment_slot_id: string; // UUID or specific identifier for a time slot
  reason?: string | null;
  notes?: string | null;
}

export interface Appointment {
  id: string; // UUID
  client_id: string; // UUID
  doctor_id: string; // UUID
  hospital_id?: string | null; // UUID
  appointment_time: string; // ISO Timestamp
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  reason?: string | null;
  notes?: string | null;
  created_at: string; // ISO Timestamp
}
*/
