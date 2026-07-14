import { Canvas } from "@/components/ai-elements/canvas";
import { Connection } from "@/components/ai-elements/connection";
import { Controls } from "@/components/ai-elements/controls";
import { Edge } from "@/components/ai-elements/edge";
import {
  Node,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
} from "@/components/ai-elements/node";
import { Panel } from "@/components/ai-elements/panel";
import { Toolbar } from "@/components/ai-elements/toolbar";
import { Button } from "@/components/ui/button";
import { buildMeta } from "@/lib/seo";
import { format } from "date-fns";

export function meta() {
  return buildMeta({
    title: "Operating System",
    description: "Experimental desktop playground on Emmanuel Alawode's portfolio.",
    path: "/operating-system",
    noindex: true,
  });
}

const OperatingStatyemPage = () => (
  <div className="flex h-dvh w-full flex-col">
    <div className="flex w-full items-center justify-between gap-3 border-b p-4">
      <div />

      <div>
        <span className="smooth-transition cursor-pointer text-muted-foreground text-sm hover:text-foreground">
          {format(new Date(), "EEE MMM dd, HH:mm")}
        </span>
      </div>
    </div>

    <Canvas
      className="w-full flex-1"
      connectionLineComponent={Connection}
      edges={edges}
      edgeTypes={edgeTypes}
      fitView
      nodes={nodes}
      nodeTypes={nodeTypes}
    >
      <Controls />
      <Panel>
        <Button>Export </Button>
      </Panel>
    </Canvas>
  </div>
);

export default OperatingStatyemPage;

// ~ =============================================>
// ~ ======= Data
// ~ =============================================>
const nodeIds = {
  myComputer: "My Computer",
  documents: "Documents",
  pictures: "Pictures",
  downloads: "Downloads",
  music: "Music",
  videos: "Videos",
  desktop: "Desktop",
  trash: "Trash",
  recycleBin: "Recycle Bin",
  system: "System",
  settings: "Settings",
};

const nodes = [
  {
    id: nodeIds.desktop,
    type: "workflow",
    position: { x: 0, y: 100 },
    data: {
      label: nodeIds.desktop,
      description: "The desktop is the main workspace for your computer.",
      handles: { target: true, source: true },
      content: "<p>The desktop is the main workspace for your computer.</p>",
      footer: "Status: ready",
    },
  },
];

const edges = [];

const nodeTypes = {
  workflow: ({
    data,
  }: {
    data: {
      label: string;
      description: string;
      handles: { target: boolean; source: boolean };
      content: string;
      footer: string;
    };
  }) => (
    <Node handles={data.handles}>
      <NodeHeader>
        <NodeTitle>{data.label}</NodeTitle>
        <NodeDescription>{data.description}</NodeDescription>
      </NodeHeader>
      <NodeContent>
        <p className="text-sm">{data.content}</p>
      </NodeContent>
      <NodeFooter>
        <p className="text-muted-foreground text-xs">{data.footer}</p>
      </NodeFooter>
      <Toolbar>
        <Button size="sm" variant="ghost">
          Edit
        </Button>
        <Button size="sm" variant="ghost">
          Delete
        </Button>
      </Toolbar>
    </Node>
  ),
};

const edgeTypes = {
  animated: Edge.Animated,
  temporary: Edge.Temporary,
};
