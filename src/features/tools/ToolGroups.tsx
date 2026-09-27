import { ChevronDown } from "lucide-react";
import type { Tool, ToolGroupWithTools } from "@/features/content/types";

function ToolContents({ tool }: { tool: Tool }) {
  const icon = tool.icon_url || (tool.icon_slug ? `/icons/${tool.icon_slug}.svg` : null);
  return <><span className="tool-icon">{icon ? <img src={icon} alt="" loading="lazy" width={17} height={17} /> : <span aria-hidden="true">{tool.name.slice(0, 1)}</span>}</span>{tool.name}</>;
}

function ToolLinks({ group, detailed }: { group: ToolGroupWithTools; detailed: boolean }) {
  return <div className="tool-links">{group.tools.map((tool) => <div className="tool-entry" key={tool.id}>
    {tool.url ? <a className="tool-link" href={tool.url} target="_blank" rel="noreferrer" title={tool.notes || undefined}><ToolContents tool={tool} /></a> : <span className="tool-link"><ToolContents tool={tool} /></span>}
    {detailed && tool.notes && <span className="tool-notes">{tool.notes}</span>}
  </div>)}</div>;
}

export function ToolGroups({ groups, detailed = false }: { groups: ToolGroupWithTools[]; detailed?: boolean }) {
  const visible = groups.filter((group) => group.tools.length);
  if (!visible.length) return <p className="empty-note">A list is taking shape.</p>;
  return <div className={detailed ? "tool-groups tool-groups-detailed" : "tool-groups"}>{visible.map((group) => {
    const label = <div className="tool-group-label"><h3 id={`group-${group.id}`}>{group.label}{detailed && <ChevronDown className="disclose-mark" size={15} aria-hidden="true" />}</h3>{detailed && group.description && <p>{group.description}</p>}</div>;
    const links = <ToolLinks group={group} detailed={detailed} />;
    return detailed
      ? <details className="tool-group" key={group.id} open><summary>{label}</summary>{links}</details>
      : <section className="tool-group" key={group.id} aria-labelledby={`group-${group.id}`}>{label}{links}</section>;
  })}</div>;
}
