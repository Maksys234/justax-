// supabase/functions/call-gemini/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
serve(async (req) => {
  // Обработка CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("--- Начало обработки POST-запроса ---");
    
    // Шаг 1: Получаем ключ API
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      console.error("КРИТИЧЕСКАЯ ОШИБКА: Секрет GEMINI_API_KEY не найден!");
      throw new Error("Секретный ключ API для Gemini не настроен на сервере.");
    }
    console.log("Шаг 1: Ключ API успешно получен.");

    // Шаг 2: Получаем промпт от пользователя
    const { prompt } = await req.json();
    if (!prompt) {
      console.error("ОШИБКА: В теле запроса отсутствует 'prompt'.");
      throw new Error("Не был предоставлен промпт (вопрос).");
    }
    console.log(`Шаг 2: Получен промпт: "${prompt}"`);

    // Шаг 3: Выполняем запрос к Gemini
    console.log("Шаг 3: Отправка запроса к Gemini API...");
    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${geminiApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });
    console.log(`Шаг 3.1: Получен ответ от Gemini со статусом: ${geminiResponse.status}`);

    // Шаг 4: Анализируем ответ от Gemini
    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error("ОШИБКА ОТ GEMINI API:", JSON.stringify(errorData, null, 2));
      throw new Error(errorData.error.message || "Неизвестная ошибка от Gemini API.");
    }
    
    const geminiData = await geminiResponse.json();
    console.log("Шаг 4: Ответ от Gemini успешно получен и разобран.");
    
    const generatedText = geminiData.candidates[0].content.parts[0].text;

    // Шаг 5: Отправляем успешный ответ пользователю
    console.log("--- Успешное завершение ---");
    return new Response(JSON.stringify({ text: generatedText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("--- КРИТИЧЕСКАЯ ОШИБКА В БЛОКЕ CATCH ---");
    console.error("Сообщение об ошибке:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});