import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateRealItinerary = async (destination, days, budget, companion) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `
      You are an expert travel agent. Generate a ${days}-day itinerary for a trip to ${destination}.
      Budget level: ${budget}. Traveling as: ${companion}.
      
      Return the itinerary STRICTLY as a JSON array. 
      The 'title' MUST be the exact real-world name of the place, restaurant, or hotel so it can be searched on Google Maps.
      
      Structure:
      [
        {
          "day": 1,
          "activities": [
            { "type": "hotel", "time": "08:00 AM", "title": "Exact Hotel Name, City", "desc": "Check-in and rest", "icon": "🛏️" },
            { "type": "meal", "time": "09:00 AM", "title": "Exact Cafe Name, City", "desc": "Breakfast", "icon": "🥐" },
            { "type": "activity", "time": "10:30 AM", "title": "Exact Landmark Name, City", "desc": "Sightseeing", "icon": "📸" }
          ]
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanJsonString);

  } catch (error) {
    console.error("Error generating trip with AI:", error);
    throw new Error("Failed to generate itinerary.");
  }
};