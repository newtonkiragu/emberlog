import {InferenceClient} from "@huggingface/inference";
import {Mood} from "@prisma/client";

const hfClient = new InferenceClient(process.env.HUGGINGFACE_API_TOKEN as string);

// Helper function to split text into chunks of maxLength tokens
function splitTextIntoChunks(text: string, maxLength: number): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += maxLength) {
        chunks.push(text.slice(i, i + maxLength));
    }
    return chunks;
}

export async function analyzeSentiment(entry: { title: string; content: string }) {
    const text = `${entry.title} ${entry.content}`;

    // Split the text into chunks of 512 tokens
    const chunks = splitTextIntoChunks(text, 512);

    try {
        const responses = await Promise.all(
            chunks.map(chunk =>
                hfClient.textClassification({
                    model: "cardiffnlp/twitter-roberta-base-sentiment-latest",
                    inputs: chunk,
                    provider: "hf-inference",
                })
            )
        );

        if (!responses || responses.length === 0) {
            throw new Error("Empty response from sentiment analysis");
        }

        // Aggregate scores from all chunks
        let totalScore = 0;
        for (const response of responses) {
            const label = response[0].label;
            const rating = parseInt(label.split(" ")[0], 10); // Extracts the number from "5 stars", "4 stars", etc.
            const score = (rating - 3) / 2; // Maps 1-5 to -1 to 1 scale
            totalScore += score;
        }

        const averageScore = totalScore / responses.length;

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

        const assignedMood = moods.find(m => averageScore >= m.min && averageScore <= m.max)?.name || Mood.NEUTRAL;

        return {mood: assignedMood, score: averageScore};
    } catch (error) {
        console.error("Sentiment analysis error:", error);
        throw new Error("Sentiment analysis failed");
    }
}