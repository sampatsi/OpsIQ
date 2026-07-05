"use client";

import { Move, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  applyCustomPositions,
  CHAT_MAIN_SEQUENCE,
  CHAT_STEPS,
  clearLayoutForMode,
  computeGraphLayout,
  edgePath,
  edgesForMode,
  GRAPH_LAYERS,
  INGEST_SEQUENCE,
  INGEST_STEPS,
  LAYOUT_PAD,
  layerClassName,
  layerFill,
  layerStroke,
  loadSavedLayouts,
  NODE_H,
  NODE_META,
  NODE_W,
  positionsFromLayout,
  saveLayoutForMode,
  type FlowMode,
  type GraphLayer,
  type GraphLayoutNode,
  type NodePositions,
} from "@/lib/knowledge-graph";

const MODES: { id: FlowMode; label: string }[] = [
  { id: "chat", label: "Chat query path" },
  { id: "ingest", label: "Document ingest path" },
  { id: "all", label: "Combined view" },
];

const ZOOM_PRESETS = [
  { id: "fit", label: "Fit page" },
  { id: 0.75, label: "75%" },
  { id: 1, label: "100%" },
  { id: 1.25, label: "125%" },
  { id: 1.5, label: "150%" },
] as const;

type ZoomPreset = (typeof ZOOM_PRESETS)[number]["id"];

type DragState = {
  nodeId: string;
  offsetX: number;
  offsetY: number;
};

export function KnowledgeGraphView() {
  const [mode, setMode] = useState<FlowMode>("chat");
  const [selectedId, setSelectedId] = useState<string>("supervisor");
  const [editMode, setEditMode] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [zoom, setZoom] = useState<ZoomPreset>("fit");
  const [fitScale, setFitScale] = useState(1);
  const [customByMode, setCustomByMode] = useState<Partial<Record<FlowMode, NodePositions>>>(
    () => loadSavedLayouts()
  );
  const [dragging, setDragging] = useState<DragState | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const movedRef = useRef(false);

  const edges = useMemo(() => edgesForMode(mode), [mode]);
  const baseLayout = useMemo(() => computeGraphLayout(mode), [mode]);
  const chatSectionHeight = useMemo(() => computeGraphLayout("chat").height, []);
  const layout = useMemo(
    () => applyCustomPositions(baseLayout, customByMode[mode]),
    [baseLayout, customByMode, mode]
  );

  const effectiveScale = zoom === "fit" ? fitScale : zoom;
  const scaledWidth = layout.width * effectiveScale;
  const scaledHeight = layout.height * effectiveScale;

  const selected = NODE_META[selectedId];
  const steps = mode === "ingest" ? INGEST_STEPS : CHAT_STEPS;
  const stepsTitle =
    mode === "ingest" ? "Ingest path" : mode === "all" ? "Primary chat path" : "Chat path";
  const hasCustomLayout = Boolean(customByMode[mode] && Object.keys(customByMode[mode]!).length);

  const stepIndex = useMemo(() => {
    const seq = mode === "ingest" ? [...INGEST_SEQUENCE] : [...CHAT_MAIN_SEQUENCE];
    return Object.fromEntries(seq.map((id, index) => [id, index + 1]));
  }, [mode]);

  const nodeMap = useMemo(
    () => Object.fromEntries(layout.nodes.map((node) => [node.id, node])),
    [layout.nodes]
  );

  const recomputeFitScale = useCallback(() => {
    const el = canvasRef.current;
    if (!el) return;
    const padding = 24;
    const availableWidth = el.clientWidth - padding;
    const availableHeight = el.clientHeight - padding;
    if (availableWidth <= 0 || availableHeight <= 0) return;
    const scaleX = availableWidth / layout.width;
    const scaleY = availableHeight / layout.height;
    setFitScale(Math.min(scaleX, scaleY));
  }, [layout.height, layout.width]);

  useLayoutEffect(() => {
    recomputeFitScale();
    const el = canvasRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => recomputeFitScale());
    observer.observe(el);
    return () => observer.disconnect();
  }, [recomputeFitScale]);

  const updateNodePosition = useCallback(
    (nodeId: string, x: number, y: number, persist = false) => {
      setCustomByMode((prev) => {
        const current = { ...(prev[mode] ?? positionsFromLayout(baseLayout.nodes)) };
        current[nodeId] = { x, y };
        if (persist) saveLayoutForMode(mode, current);
        return { ...prev, [mode]: current };
      });
    },
    [baseLayout.nodes, mode]
  );

  const handleResetLayout = () => {
    clearLayoutForMode(mode);
    setCustomByMode((prev) => {
      const next = { ...prev };
      delete next[mode];
      return next;
    });
    setZoom("fit");
  };

  const clientToSvg = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current;
      if (!svg) return { x: 0, y: 0 };
      const rect = svg.getBoundingClientRect();
      const scaleX = layout.width / rect.width;
      const scaleY = layout.height / rect.height;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    },
    [layout.height, layout.width]
  );

  const onPointerDown = (event: React.PointerEvent, node: GraphLayoutNode) => {
    if (!editMode) return;
    event.preventDefault();
    event.stopPropagation();
    movedRef.current = false;
    const point = clientToSvg(event.clientX, event.clientY);
    setDragging({
      nodeId: node.id,
      offsetX: point.x - node.x,
      offsetY: point.y - node.y,
    });
    (event.currentTarget as Element).setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!dragging) return;
    movedRef.current = true;
    const point = clientToSvg(event.clientX, event.clientY);
    updateNodePosition(
      dragging.nodeId,
      Math.max(0, point.x - dragging.offsetX),
      Math.max(0, point.y - dragging.offsetY)
    );
  };

  const onPointerUp = (event: React.PointerEvent, nodeId: string) => {
    if (dragging?.nodeId === nodeId) {
      const node = nodeMap[nodeId];
      if (node) updateNodePosition(nodeId, node.x, node.y, true);
      setDragging(null);
      if (!movedRef.current) setSelectedId(nodeId);
    }
    try {
      (event.currentTarget as Element).releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
  };

  const onNodeClick = (nodeId: string) => {
    if (!editMode) setSelectedId(nodeId);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 px-3 pb-3 pt-2 md:px-4 md:pb-4">
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {MODES.map(({ id, label }) => (
          <Button
            key={id}
            type="button"
            size="sm"
            variant={mode === id ? "default" : "outline"}
            onClick={() => {
              setMode(id);
              setZoom("fit");
            }}
          >
            {label}
          </Button>
        ))}
        <span className="mx-1 hidden h-5 w-px bg-[var(--line)] sm:inline-block" aria-hidden />
        <Button
          type="button"
          size="sm"
          variant={editMode ? "default" : "outline"}
          onClick={() => setEditMode((value) => !value)}
        >
          <Move className="h-3.5 w-3.5" aria-hidden />
          {editMode ? "Done rearranging" : "Rearrange nodes"}
        </Button>
        {hasCustomLayout && (
          <Button type="button" size="sm" variant="ghost" onClick={handleResetLayout}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Reset layout
          </Button>
        )}
        <span className="mx-1 hidden h-5 w-px bg-[var(--line)] lg:inline-block" aria-hidden />
        <div className="flex items-center gap-1">
          <ZoomOut className="h-3.5 w-3.5 text-[var(--text-2)]" aria-hidden />
          {ZOOM_PRESETS.map((preset) => (
            <Button
              key={String(preset.id)}
              type="button"
              size="sm"
              variant={zoom === preset.id ? "secondary" : "ghost"}
              className="h-8 px-2.5 text-xs"
              onClick={() => setZoom(preset.id)}
            >
              {preset.label}
            </Button>
          ))}
          <ZoomIn className="h-3.5 w-3.5 text-[var(--text-2)]" aria-hidden />
        </div>
        <Button
          type="button"
          size="sm"
          variant={showSteps ? "secondary" : "ghost"}
          className="ml-auto"
          onClick={() => setShowSteps((value) => !value)}
        >
          {showSteps ? "Hide steps" : "Show steps"}
        </Button>
      </div>

      {editMode && (
        <p className="shrink-0 rounded-lg border border-[var(--teal)]/25 bg-[var(--teal-bg)] px-3 py-2 text-[12px] text-[var(--teal)]">
          Drag nodes to rearrange. Positions are saved per view in your browser.
        </p>
      )}

      <div className="hidden shrink-0 flex-wrap gap-x-5 gap-y-2 lg:flex">
        {GRAPH_LAYERS.map((layer) => (
          <span key={layer} className="inline-flex items-center gap-1.5 text-[11px] text-[var(--text-2)]">
            <span
              className={cn("h-2.5 w-2.5 rounded-sm border", layerClassName(layer as GraphLayer))}
              aria-hidden
            />
            {layer}
          </span>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
        <section className="console-card flex min-h-0 min-w-0 flex-col overflow-hidden">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] px-3 py-2 md:px-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-2)]">
              {editMode ? "Drag to rearrange" : "End-to-end flow"}
            </span>
            <span className="font-mono text-[10px] text-[var(--text-2)]">
              {Math.round(effectiveScale * 100)}% · click node for notes
            </span>
          </div>
          <div
            ref={canvasRef}
            className="architecture-graph-scroll min-h-[calc(100dvh-15rem)] flex-1 bg-[var(--paper)] p-3 md:min-h-[calc(100dvh-13rem)]"
          >
            <div
              className="touch-none"
              style={{ width: scaledWidth, height: scaledHeight, minWidth: scaledWidth }}
            >
              <svg
                ref={svgRef}
                viewBox={`0 0 ${layout.width} ${layout.height}`}
                width={scaledWidth}
                height={scaledHeight}
                className="block"
                role="img"
                aria-label="OpsIQ application knowledge graph"
                onPointerMove={onPointerMove}
                onPointerUp={() => setDragging(null)}
              >
                <defs>
                  <marker
                    id="kg-arrow-main"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="4"
                    orient="auto"
                  >
                    <path d="M0,0 L8,4 L0,8 Z" fill="var(--teal)" opacity="0.7" />
                  </marker>
                  <marker
                    id="kg-arrow-branch"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="4"
                    orient="auto"
                  >
                    <path d="M0,0 L8,4 L0,8 Z" fill="var(--amber)" opacity="0.8" />
                  </marker>
                </defs>

                {mode === "all" && (
                  <>
                    <text
                      x={LAYOUT_PAD}
                      y={20}
                      className="fill-[var(--text-2)] font-mono text-[10px] uppercase tracking-widest"
                    >
                      Chat query path
                    </text>
                    <line
                      x1={LAYOUT_PAD}
                      y1={chatSectionHeight - 20}
                      x2={layout.width - LAYOUT_PAD}
                      y2={chatSectionHeight - 20}
                      stroke="var(--line)"
                      strokeDasharray="6 4"
                    />
                    <text
                      x={LAYOUT_PAD}
                      y={chatSectionHeight + 4}
                      className="fill-[var(--text-2)] font-mono text-[10px] uppercase tracking-widest"
                    >
                      Document ingest path
                    </text>
                  </>
                )}

                {edges.map((edge) => {
                  const from = nodeMap[edge.from];
                  const to = nodeMap[edge.to];
                  if (!from || !to) return null;
                  const isBranch = edge.kind === "branch";
                  return (
                    <path
                      key={`${edge.from}-${edge.to}`}
                      d={edgePath(from, to, edge.kind)}
                      fill="none"
                      stroke={isBranch ? "var(--amber)" : "var(--teal)"}
                      strokeWidth={isBranch ? 1.25 : 1.75}
                      strokeDasharray={isBranch ? "5 3" : undefined}
                      opacity={isBranch ? 0.75 : 0.55}
                      markerEnd={isBranch ? "url(#kg-arrow-branch)" : "url(#kg-arrow-main)"}
                    />
                  );
                })}

                {layout.nodes.map((node) => {
                  const meta = NODE_META[node.id];
                  if (!meta) return null;
                  const isSelected = selectedId === node.id;
                  const isDragging = dragging?.nodeId === node.id;
                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      className={cn(
                        editMode ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
                        isDragging && "opacity-90"
                      )}
                      onPointerDown={(event) => onPointerDown(event, node)}
                      onPointerUp={(event) => onPointerUp(event, node.id)}
                      onClick={() => onNodeClick(node.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`${meta.label}, ${meta.layer}`}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedId(node.id);
                        }
                      }}
                    >
                      <rect
                        width={NODE_W}
                        height={NODE_H}
                        rx={8}
                        fill={layerFill(meta.layer)}
                        stroke={isSelected ? "var(--teal)" : layerStroke(meta.layer)}
                        strokeWidth={isSelected ? 2 : 1}
                      />
                      {stepIndex[node.id] != null && (
                        <text
                          x={10}
                          y={14}
                          className="fill-[var(--teal)] font-mono text-[8px] font-medium"
                        >
                          {stepIndex[node.id]}
                        </text>
                      )}
                      <text
                        x={NODE_W / 2}
                        y={22}
                        textAnchor="middle"
                        className="fill-[var(--text)] font-mono text-[11px] font-medium"
                      >
                        {meta.label.length > 18 ? `${meta.label.slice(0, 16)}…` : meta.label}
                      </text>
                      <text
                        x={NODE_W / 2}
                        y={38}
                        textAnchor="middle"
                        className="fill-[var(--text-2)] font-mono text-[9px]"
                      >
                        {meta.layer}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </section>

        <aside className="console-card flex max-h-[40vh] min-h-[220px] flex-col overflow-hidden xl:max-h-none xl:min-h-0">
          <div className="border-b border-[var(--line)] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-2)]">
            Node detail
          </div>
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            {selected ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex w-fit rounded-full border border-[var(--teal)]/30 bg-[var(--teal-bg)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-[var(--teal)]">
                    {selected.layer}
                  </span>
                  {stepIndex[selectedId] != null && (
                    <span className="font-mono text-[10px] text-[var(--text-2)]">
                      Step {stepIndex[selectedId]}
                    </span>
                  )}
                </div>
                <h2 className="font-display text-lg font-semibold text-[var(--text)]">{selected.label}</h2>
                <p className="text-sm text-[var(--text-2)]">{selected.summary}</p>
                <p className="text-sm leading-relaxed text-[var(--text)]">{selected.detail}</p>
                {selected.notes && selected.notes.length > 0 && (
                  <div className="rounded-lg border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5">
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-2)]">
                      Notes
                    </p>
                    <ul className="space-y-1 font-mono text-[11px] leading-relaxed text-[var(--text-2)]">
                      {selected.notes.map((note, index) => (
                        <li key={`note-${index}`} className={note ? undefined : "list-none h-1"}>
                          {note || "\u00A0"}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="break-all font-mono text-[11px] text-[var(--text-2)]">{selected.path}</p>
              </>
            ) : (
              <p className="text-sm text-[var(--text-2)]">Select a node in the graph.</p>
            )}
          </div>
        </aside>
      </div>

      {showSteps && (
        <section className="console-card max-h-48 shrink-0 overflow-y-auto p-4 md:max-h-56">
          <h3 className="font-display text-sm font-semibold text-[var(--text)]">{stepsTitle}</h3>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed text-[var(--text-2)]">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
