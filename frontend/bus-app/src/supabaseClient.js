import { createClient } from '@supabase/supabase-js';

// Replace these values with your actual Supabase URL and public API key
const supabaseUrl = 'https://mtjpsvvtuzhiopwuufri.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10anBzdnZ0dXpoaW9wd3V1ZnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgyMDc3NzIsImV4cCI6MjAzMzc4Mzc3Mn0.Nl-7D-ZTkrquyvhXTTburYd8Z1rkwx-BQJrX2rvJ5QQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
