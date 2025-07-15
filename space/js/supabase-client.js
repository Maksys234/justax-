// js/supabase-client.js

// ИСПРАВЛЕНИЕ: Используем CDN, который корректно работает с ES-модулями (import/export)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://yefycpbjwlwsaudqhjbq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZnljcGJqd2x3c2F1ZHFoamJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMDgxNTQsImV4cCI6MjA2NjY4NDE1NH0.OZkdxE-om9B-_BngpB4FzmEa9K_Vfs5bJYoQpxmhLQU';

// Экспортируем готовый к использованию клиент Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);