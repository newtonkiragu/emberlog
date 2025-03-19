import {InferenceClient} from "@huggingface/inference";
import {Mood} from "@prisma/client";

const hfClient = new InferenceClient(process.env.HUGGINGFACE_API_TOKEN as string); // Store API key in .env

export async function analyzeSentiment(entry: { title: string; content: string }) {
    const text = `${entry.title} ${entry.content}`;

    try {
        const response = await hfClient.textClassification({
            model: "nlptown/bert-base-multilingual-uncased-sentiment",
            inputs: text,
            provider: "hf-inference",
        });

        if (!response || response.length === 0) {
            throw new Error("Empty response from sentiment analysis");
        }

        // Extract score (normalize 1-5 rating to a -1 to 1 scale)
        const label = response[0].label;
        const rating = parseInt(label.split(" ")[0], 10); // Extracts the number from "5 stars", "4 stars", etc.
        const score = (rating - 3) / 2; // Maps 1-5 to -1 to 1 scale

        const moods = [
            {name: Mood.TERRIBLE, min: -1, max: -0.8},
            {name: Mood.BAD, min: -0.79, max: -0.5},
            {name: Mood.SAD, min: -0.49, max: -0.2},
            {name: Mood.MEH, min: -0.19, max: -0.1},
            {name: Mood.NEUTRAL, min: -0.09, max: 0.09},
            {name: Mood.OKAY, min: 0.1, max: 0.3},
            {name: Mood.GOOD, min: 0.31, max: 0.6},
            {name: Mood.GREAT, min: 0.61, max: 0.8},
            {name: Mood.HAPPY, min: 0.81, max: 1}
        ];

        const assignedMood = moods.find(m => score >= m.min && score <= m.max)?.name || Mood.NEUTRAL;

        return {mood: assignedMood, score};
    } catch (error) {
        console.error("Sentiment analysis error:", error);
        throw new Error("Sentiment analysis failed");
    }
}
