import { PrismaClient } from "@prisma/client";
import { pipeline } from "@huggingface/transformers";

const prisma = new PrismaClient();

export async function autoTagEntry(entry: { id: string; title: string; content: string; tags: { name: string }[] }) {
  // Get entry tags
  const entryTags = entry.tags.map(tag => tag.name);

  // Fetch all available tags from DB
  const dbTags = await prisma.tag.findMany();
  const tagNames = [...new Set([...dbTags.map(tag => tag.name), ...entryTags])]; // Merge and remove duplicates

  // Use Hugging Face zero-shot-classification model
  const tagClassifier = await pipeline("zero-shot-classification");
  const result = await tagClassifier(`${entry.title} ${entry.content}`, tagNames);

  // Assign tags with confidence > 0.5
  let tagsToAssign = result.labels.filter((label, index) => result.scores[index] > 0.5);

  // Create a new tag if none match
  if (tagsToAssign.length === 0) {
    const newTag = await prisma.tag.create({
      data: { name: result.labels[0], score: result.scores[0] }
    });
    tagsToAssign.push(newTag);
  }

  return tagsToAssign;
}
