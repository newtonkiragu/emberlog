import { Mood } from "@prisma/client";

const moodStyles: Record<Mood, { color: string; icon: string }> = {
  TERRIBLE: { color: "#8B0000", icon: "😡" },
  BAD: { color: "#D32F2F", icon: "😠" },
  SAD: { color: "#1976D2", icon: "😢" },
  MEH: { color: "#808080", icon: "😑" },
  NEUTRAL: { color: "#757575", icon: "😐" },
  OKAY: { color: "#388E3C", icon: "🙂" },
  GOOD: { color: "#2E7D32", icon: "😊" },
  GREAT: { color: "#1B5E20", icon: "😁" },
  HAPPY: { color: "#FFD700", icon: "😃" },
};

export default moodStyles;