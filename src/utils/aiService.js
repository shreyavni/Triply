import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateRealItinerary = async (destination, days, budget, companion) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert travel guide. Generate a ${days}-day exploration itinerary for ${destination}.
      Budget: ${budget}. Traveling as: ${companion}.

      STRICT RULES — follow every single one:
      1. ONLY include "activity" type. NEVER include "hotel" or "meal" types. No restaurants, cafes, or accommodations.
      2. Every single "title" must be a DIFFERENT, UNIQUE real-world place. No title can repeat across ANY day.
      3. "activity" titles must be specific landmarks, museums, temples, parks, or experiences (not generic like "City Tour").
      4. Each day must have 3 to 5 tourist activities.
      5. The 'title' must be the EXACT real-world searchable name so it works on Google Maps.

      Return ONLY a raw JSON array. No markdown, no explanation, no code blocks.

      Example format:
      [
        {
          "day": 1,
          "activities": [
            { "type": "activity", "time": "10:00 AM", "title": "Amber Fort, Jaipur",              "desc": "Explore the stunning hilltop Rajput fort.",                         "icon": "🏰" },
            { "type": "activity", "time": "12:30 PM", "title": "Jal Mahal, Jaipur",               "desc": "Admire the Water Palace situated in the middle of Man Sagar Lake.", "icon": "🌊" },
            { "type": "activity", "time": "03:00 PM", "title": "Hawa Mahal, Jaipur",             "desc": "The iconic Palace of Winds with 953 small windows.",                "icon": "🌬️" },
            { "type": "activity", "time": "06:00 PM", "title": "Johri Bazaar, Jaipur",           "desc": "Browse the vibrant local market for jewellery and textiles.",       "icon": "🛍️" }
          ]
        }
      ]

      Generate exactly ${days} days. Every place must be unique across all days.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Strip any accidental markdown code fences
    const cleanJson = responseText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(cleanJson);

  } catch (error) {
    console.error("Error generating trip with AI:", error);
    throw new Error("Failed to generate itinerary. Please try again.");
  }
};