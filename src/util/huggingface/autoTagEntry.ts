import {PrismaClient} from "@prisma/client";
import {InferenceClient} from "@huggingface/inference";

const prisma = new PrismaClient();
const hfClient = new InferenceClient(process.env.HUGGINGFACE_API_TOKEN as string); // Store API key in .env

export async function autoTagEntry(entry: { id: string; title: string; content: string; tags: { name: string }[] }) {
    // Get existing tags from the entry
    const entryTags = entry.tags.map(tag => tag.name);

    // Fetch all available tags from the database
    const dbTags = await prisma.tag.findMany();
    console.log(dbTags, "dbTags))))");

    let tagNames = [...new Set([...dbTags.map(tag => tag.name), ...entryTags])]; // Merge and remove duplicates
    console.log(tagNames, "tagNames))))");

    if (tagNames.length === 0) {
        tagNames.push("General"); // Default tag if no tags exist
    }

    try {
        const response = await hfClient.zeroShotClassification({
            model: "facebook/bart-large-mnli",
            inputs: `${entry.title} ${entry.content}`,
            parameters: {candidate_labels: tagNames},
            provider: "hf-inference",
        });

        console.log(response, "Hugging Face response");

        // Assign tags with confidence > 0.5
        let tagsToAssign = response[0].labels.filter((label: string, index: number) => response[0].scores[index] > 0.5);
        console.log(tagsToAssign, "tagsToAssign");

        if (tagsToAssign.length === 0) {
            tagsToAssign.push("General"); // Assign "General" if no confident tags
        }

        // Ensure only tags in the database are assigned
        await prisma.tag.createMany({
            data: tagsToAssign.map(tagName => ({name: tagName})),
            skipDuplicates: true, // Avoids error if tag already exists
        });

        // Fetch the final saved tags from the database
        const savedTags = await prisma.tag.findMany({
            where: {name: {in: tagsToAssign}}
        });

        return savedTags; // Return actual saved tag objects
    } catch (error) {
        console.error("Auto-tagging error:", error);
        throw new Error("Tag classification failed");
    }
}
