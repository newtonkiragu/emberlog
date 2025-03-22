import {PrismaClient} from "@prisma/client";
import {InferenceClient} from "@huggingface/inference";

const prisma = new PrismaClient();
const hfClient = new InferenceClient(process.env.HUGGINGFACE_API_TOKEN as string);

const TIMEOUT_MS = 8000; // Set a timeout (8 seconds)

export async function autoTagEntry(entry: { id: string; title: string; content: string; tags: { name: string }[] }) {
    try {
        // Fetch predefined tags from the database
        const dbTags = await prisma.tag.findMany();
        const existingTagNames = dbTags.map(tag => tag.name);

        // Use predefined categories or provide a better list
        const categories_list = [
            "Personal", "Work", "Health", "Travel", "Finance", "Technology", "Education",
            "Family", "Fitness", "Hobbies", "Shopping", "Social", "Projects", "Entertainment",
            "Home", "Self-Care", "Events", "Pets", "Creative", "Business", "Volunteer",
            "Learning", "Recipes", "Goals", "Errands", "Inspiration", "Urgent", "Low Priority",
            "Recurring", "Ideas", "Journal", "Research", "Gratitude", "Reflection", "Stress",
            "Happiness", "Sadness", "Anger", "Anxiety", "Motivation", "Memories", "Milestones",
            "Dreams", "Challenges", "Adventures", "Affirmations", "Habits", "Meditation",
            "Spirituality", "Self-Discovery", "Friendship", "Love", "Conflict", "Support",
            "Poetry", "Art", "Music", "Books", "Movies/TV", "Plans", "Daily Log", "Bucket List",
            "Wishlist", "Sleep", "Nutrition", "Exercise", "Recovery", "Quotes", "Lessons",
            "Rants", "Wins", "Regrets", "Code Snippets"
        ];

        // Merge and deduplicate tags
        const candidateLabels = [...new Set([...existingTagNames, ...categories_list])];

        // Truncate input (limit to 512 characters)
        const inputText = `${entry.title} ${entry.content}`.slice(0, 512);

        // Split candidateLabels into batches of 10
        const batchSize = 10;
        const batches: string[][] = [];
        for (let i = 0; i < candidateLabels.length; i += batchSize) {
            batches.push(candidateLabels.slice(i, i + batchSize));
        }

        // Function to add a timeout
        const withTimeout = <T>(promise: Promise<T>, timeout: number) => {
            return Promise.race([
                promise,
                new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Request timed out")), timeout)),
            ]);
        };

        // Run classification for each batch with a timeout
        const allResponses = await Promise.all(
            batches.map(batch =>
                withTimeout(
                    hfClient.zeroShotClassification({
                        model: "facebook/bart-large-mnli",
                        inputs: inputText,
                        parameters: {candidate_labels: batch},
                        provider: "hf-inference",
                    }),
                    TIMEOUT_MS
                ).catch(error => {
                    console.error("Batch failed:", error);
                    return null;
                })
            )
        );

        // Filter out failed requests
        const validResponses = allResponses.filter(response => response !== null) as any[];

        // Aggregate results
        const tagsToAssign: string[] = [];
        validResponses.forEach(response => {
            response[0].labels.forEach((label: string, index: number) => {
                if (response[0].scores[index] > 0.5) {
                    tagsToAssign.push(label);
                }
            });
        });

        // If no tags are assigned, default to "General"
        if (tagsToAssign.length === 0) {
            tagsToAssign.push("General");
        }

        // Save tags in the database if they don’t exist
        await prisma.tag.createMany({
            data: tagsToAssign.map(tagName => ({name: tagName})),
            skipDuplicates: true,
        });

        // Fetch saved tags (ensure we get their IDs)
        const savedTags = await prisma.tag.findMany({
            where: {name: {in: tagsToAssign}},
        });

        // Link tags to the entry
        await prisma.entry.update({
            where: {id: entry.id},
            data: {
                tags: {
                    connect: savedTags.map(tag => ({id: tag.id})),
                },
            },
        });

        return savedTags; // Return actual saved tag objects
    } catch (error) {
        console.error("Auto-tagging error:", error);
        throw new Error("Tag classification failed");
    }
}
