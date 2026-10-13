import type { Project } from "@/features/content/types";
import { ContourArt } from "./ContourArt";
import { FlowArt } from "./FlowArt";
import { MazeArt } from "./MazeArt";
import { VoxelArt } from "./VoxelArt";

// Hand-drawn pieces for specific projects. Anything else gets its own contour map, or its uploaded image.
const drawings: Record<string, { art: () => React.ReactNode; caption: string; shape: string }> = {
  casfyre: { art: () => <FlowArt />, caption: "from the first message to the final delivery", shape: "wide" },
  casmine: { art: () => <VoxelArt />, caption: "a floating island, eight blocks across", shape: "tall" },
  mazec: { art: () => <MazeArt seed="mazec" />, caption: "17 × 10, generated, one way through", shape: "wide" },
};

export function ProjectArt({ project, number, preferImage = false, priority = false }: { project: Project; number: number; preferImage?: boolean; priority?: boolean }) {
  const drawing = drawings[project.slug];
  const useImage = project.thumbnail_url && (preferImage || !drawing);
  const caption = useImage ? project.thumbnail_alt || project.title : drawing?.caption ?? `contours of ${project.category.toLowerCase()}`;
  return <figure className="project-art" data-shape={useImage ? "image" : drawing?.shape ?? "contour"}>
    {useImage
      ? <div className="pinned-print"><img src={project.thumbnail_url!} alt={project.thumbnail_alt || project.title} loading={priority ? "eager" : "lazy"} decoding="async" /></div>
      : drawing ? drawing.art() : <ContourArt seed={project.slug} label={`A contour map drawn for ${project.title}`} />}
    <figcaption><span>fig. {String(number).padStart(2, "0")}</span>{caption}</figcaption>
  </figure>;
}
