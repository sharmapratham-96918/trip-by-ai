import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// 🟢 Define schemas
const activitySchema = z.object({
  day: z.number(),
  title: z.string(),
  description: z.string(),
});

const travelPlanSchema = z.object({
  destination: z.string(),
  duration: z.string(),
  estimated_cost_in_inr: z.number(),
  itinerary: z.array(activitySchema),
  tips: z.array(z.string()),
});

// 🟢 Initialize AI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 🧠 Generate travel plan
async function requestGeneration(from, to, budget) {
  const travelPrompt = `
You are an AI travel planner that creates personalized itineraries for Indian travelers.

The user will provide:
- Travel dates (From, To)
- Budget (in INR)

Your goal:
1. Suggest a travel destination that fits within the budget and date range.
2. Include day-wise activities and estimated cost.
3. Include short travel tips.
4. Respond in **pure JSON only** (no markdown, no code block, no quotes).

Example Input:
From: 10th Dec 2025
To: 15th Dec 2025
Budget: ₹20000

Example JSON Output:
{
  "destination": "Goa",
  "duration": "6 Days / 5 Nights",
  "estimated_cost_in_inr": 19500,
  "itinerary": [
    { "day": 1, "title": "Arrival & Beach Walk", "description": "Arrive in Goa and enjoy the evening at Baga Beach." }
  ],
  "tips": ["Carry sunscreen", "Book bikes early"]
}

Now generate for:
From: ${from}
To: ${to}
Budget: ₹${budget}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: travelPrompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(travelPlanSchema),
    },
  });

  let rawText = response.text || response.output_text;
  // console.log("🔍 Raw AI Response:", rawText);

  if (!rawText) return { error: "Empty response from Gemini" };

  // 🧩 Clean text
  let cleaned = rawText.trim();

  // Remove wrapping quotes
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1);
  }

  // Replace escaped quotes and slashes
  cleaned = cleaned.replace(/\\"/g, '"').replace(/\\\\\//g, "/");

  let parsed;
  try {
    parsed = JSON.parse(cleaned);

    // 🧠 If the result contains another JSON string (double-encoded), parse again
    if (typeof parsed === "string") {
      parsed = JSON.parse(parsed);
    }

    // 🧠 If 'plan.rawText' contains nested JSON, parse that too
    if (parsed.rawText && typeof parsed.rawText === "string") {
      const inner = parsed.rawText.trim();
      if (inner.startsWith("{") && inner.endsWith("}")) {
        parsed = JSON.parse(inner);
      }
    }

  } catch (err) {
    console.warn("⚠️ Could not parse JSON. Returning fallback text.", err);
    return { rawText: cleaned };
  }

  // ✅ Validate JSON
  try {
    const travelPlan = travelPlanSchema.parse(parsed);
    return travelPlan;
  } catch (zerr) {
    console.warn("⚠️ Schema validation failed. Returning fallback text.", zerr);
    return parsed;
  }
}

// 🟢 Controller
export const genratePlan = async (req, res) => {
  try {
    const { from, to, budget } = req.body;
    const plan = await requestGeneration(from, to, budget);

    res.status(200).json({
      message: "Travel plan generated successfully",
      plan,
    });
  } catch (error) {
    console.error("❌ Error generating plan:", error);
    res.status(500).json({
      message: "Error generating plan",
      error: error.message || error,
    });
  }
};
