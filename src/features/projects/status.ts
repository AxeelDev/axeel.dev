import type { Project } from "@/features/content/types";

export const statusLabel: Record<Project["status"], string> = {
  active: "In progress",
  experiment: "Experiment",
  archived: "Archived",
};
