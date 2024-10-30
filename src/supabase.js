import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://daphbptdeaaitcwnnely.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcGhicHRkZWFhaXRjd25uZWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyMTYwNjMsImV4cCI6MjA0NTc5MjA2M30.vVIjJcAtfSnXNa1aYV1S6K7AyjpKoxIwrRyIdspBMZs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
