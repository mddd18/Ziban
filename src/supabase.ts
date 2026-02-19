// NPM emas, to'g'ridan-to'g'ri internetdan (ESM) chaqiramiz
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

// Pastdagi ikkita yozuv o'rniga Supabase'dan olgan o'zingizning URL va KEY'ingizni qo'ying!
const supabaseUrl = 'https://taqtucuqmpjxiprmumgt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhcXR1Y3VxbXBqeGlwcm11bWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMTY4NzUsImV4cCI6MjA4Njg5Mjg3NX0.P0LIIbt6HT2l6P0PlDkz5wOdVY71M6CCSVsGuUGDcnw';

export const supabase = createClient(supabaseUrl, supabaseKey);
