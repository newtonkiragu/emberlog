import {pipeline} from "@huggingface/transformers";
import {Mood} from "@prisma/client"

export async function analyzeSentiment(entry: { title: string; content: string }) {
    const sentimentAnalyzer = await pipeline("sentiment-analysis");
    const result = await sentimentAnalyzer(`${entry.title} ${entry.content}`);

    const score = result[0].score * (result[0].label === "POSITIVE" ? 1 : -1);

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
}
