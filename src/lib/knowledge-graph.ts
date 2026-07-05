export type FlowMode = "chat" | "ingest" | "all";

export type GraphLayer =
  | "UI"
  | "API"
  | "Auth"
  | "Guardrails"
  | "Agents"
  | "Retrieval"
  | "Storage"
  | "Output";

export interface GraphNodeMeta {
  label: string;
  layer: GraphLayer;
  path: string;
  summary: string;
  detail: string;
  notes?: string[];
  step?: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  kind?: "main" | "branch";
}

export interface GraphLayoutNode {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface GraphLayout {
  nodes: GraphLayoutNode[];
  edges: GraphEdge[];
  width: number;
  height: number;
}

export type NodePositions = Record<string, { x: number; y: number }>;

export const NODE_W = 148;
export const NODE_H = 52;
export const NODE_GAP_X = 36;
export const NODE_GAP_Y = 56;
export const LAYOUT_PAD = 28;

export const GRAPH_LAYERS: GraphLayer[] = [
  "UI",
  "API",
  "Auth",
  "Guardrails",
  "Agents",
  "Retrieval",
  "Storage",
  "Output",
];

export const NODE_META: Record<string, GraphNodeMeta> = {
  "ui-app": {
    label: "opsiq-ui",
    layer: "UI",
    path: "src/app/",
    summary: "Next.js console (Vercel)",
    detail:
      "App Router pages: /chat, /sessions, /knowledge-base, /quality, /architecture. Proxies /api/v1 to FastAPI.",
    step: 1,
  },
  "ui-agent-selector": {
    label: "AgentSelector",
    layer: "UI",
    path: "src/components/AgentSelector.tsx",
    summary: "Sidebar — pick one of 5 agents",
    detail: "User picks the agent before chatting. Selection drives POST /agents/{id}/query.",
    notes: [
      "Internal · Support · Report · Onboarding · Contract",
      "Saved to localStorage key opsiq_selected_agent (default: internal)",
      "Selecting an agent navigates to /chat if needed",
      "Report and Contract show a GATED badge (human approval required)",
    ],
    step: 2,
  },
  "ui-chat": {
    label: "ChatWindow",
    layer: "UI",
    path: "src/components/ChatWindow.tsx",
    summary: "Primary chat surface",
    detail:
      "useChat sends queries; MessageBubble renders turns; GuardrailIntercept on block/hold; ApprovalPanel for HITL.",
    step: 3,
  },
  "ui-proxy": {
    label: "Next.js proxy",
    layer: "UI",
    path: "next.config.mjs",
    summary: "Rewrites to backend",
    detail: "Browser calls /api/v1/* → BACKEND_URL with JWT Bearer from login.",
    step: 4,
  },
  fastapi: {
    label: "FastAPI app",
    layer: "API",
    path: "opsiq-service/main.py",
    summary: "HTTP entry point",
    detail: "Routers under /api/v1, CORS, slowapi rate limits, OTel middleware.",
    step: 5,
  },
  auth: {
    label: "JWT auth",
    layer: "Auth",
    path: "opsiq-service/auth/deps.py",
    summary: "Bearer token + session ownership",
    detail: "POST /auth/token issues JWT. require_session() prevents IDOR on session_id.",
    step: 6,
  },
  "chat-endpoint": {
    label: "Chat endpoints",
    layer: "API",
    path: "api/routes.py · platform_routes.py",
    summary: "POST /agents/{id}/query",
    detail: "Platform route validates agent id, runs guardrails → orchestrator → output checks.",
    notes: [
      "Primary path: POST /api/v1/agents/{id}/query",
      "Legacy: POST /api/v1/agent/chat (optional context.agent)",
      "Rate limit: 30 req/min per user",
    ],
    step: 7,
  },
  "input-guard": {
    label: "Input guardrails",
    layer: "Guardrails",
    path: "guardrails/pipeline.py · input.py",
    summary: "Heuristics then NeMo",
    detail:
      "Length cap, injection regex, PII-request block. NeMo self_check_input blocks before the agent runs.",
    step: 8,
  },
  supervisor: {
    label: "Agent orchestrator",
    layer: "Agents",
    path: "agents/supervisor.py",
    summary: "Routes to one of 5 LangGraph agents",
    detail:
      "AgentSupervisor delegates to a specialist LangGraph graph (understand → retrieve → answer). One agent runs per request.",
    notes: [
      "Specialist agents:",
      "  · internal — HR policies, SOPs, team knowledge",
      "  · support — customer-facing help, escalation on low confidence",
      "  · report — executive summaries (GATED — ApprovalPanel before ship)",
      "  · onboarding — new-hire guides and first-week tasks",
      "  · contract — vendor clause review (GATED — human sign-off)",
      "",
      "How the agent is chosen:",
      "  1. Sidebar selection (normal) — UI sends /agents/{id}/query; supervisor uses context.agent",
      "  2. LLM fallback — if context.agent is missing, classifier picks from query text; default internal",
      "",
      "Each agent: LangGraph StateGraph + Postgres checkpointer for multi-turn memory.",
    ],
    step: 9,
  },
  "rag-tool": {
    label: "search_knowledge_base",
    layer: "Retrieval",
    path: "agents/tools.py",
    summary: "Agent RAG tool",
    detail: "OpsIQQueryEngine with HyDE, hybrid search, rerank. Returns formatted context + citations.",
  },
  "query-engine": {
    label: "OpsIQQueryEngine",
    layer: "Retrieval",
    path: "retrieval/query_engine.py",
    summary: "Full RAG pipeline",
    detail: "Optional decompose → HyDE → hybrid search → Cohere rerank → grounded LLM answer.",
  },
  "hybrid-search": {
    label: "HybridSearch",
    layer: "Retrieval",
    path: "retrieval/hybrid_search.py",
    summary: "pgvector + BM25 + RRF",
    detail: "Cohere embed-v3 fused with BM25 via reciprocal rank fusion. Department/doc_type filters.",
  },
  pgvector: {
    label: "pgvector Postgres",
    layer: "Storage",
    path: "ingestion/store.py",
    summary: "Chunks, sessions, audit",
    detail: "Embeddings, sessions, guardrail_events, LangGraph checkpoints, analytics.",
  },
  "output-guard": {
    label: "Output guardrails",
    layer: "Guardrails",
    path: "guardrails/output.py · pipeline.py",
    summary: "NeMo + faithfulness + PII",
    detail:
      "NeMo self_check_output. Faithfulness score vs contexts (threshold 0.70). PII redaction. held withholds answer.",
    step: 10,
  },
  response: {
    label: "ChatResponse",
    layer: "Output",
    path: "api/chat_helpers.py · models/schemas.py",
    summary: "Structured API payload",
    detail: "answer, guardrail status, grounding score, source citations.",
    step: 11,
  },
  "ui-bubble": {
    label: "MessageBubble",
    layer: "UI",
    path: "src/components/MessageBubble.tsx",
    summary: "Rendered assistant turn",
    detail: "Grounding meter, source chips, GuardrailIntercept on block/hold.",
    step: 12,
  },
  "ui-upload": {
    label: "FileUpload",
    layer: "UI",
    path: "src/components/FileUpload.tsx",
    summary: "Knowledge base upload",
    detail: "Multipart POST /ingest with department and doc_type.",
    step: 2,
  },
  "ingest-endpoint": {
    label: "POST /ingest",
    layer: "API",
    path: "api/routes.py",
    summary: "Document upload API",
    detail: "10 req/min. validate_upload → IngestionPipeline.",
    step: 6,
  },
  "ingest-pipeline": {
    label: "IngestionPipeline",
    layer: "Storage",
    path: "ingestion/pipeline.py",
    summary: "Extract → chunk → embed",
    detail: "Unstructured extract, spaCy chunk, Cohere embed, sanitize quarantine.",
    step: 7,
  },
};

/** Main chat path — single top row. */
export const CHAT_MAIN_SEQUENCE = [
  "ui-app",
  "ui-agent-selector",
  "ui-chat",
  "ui-proxy",
  "fastapi",
  "auth",
  "chat-endpoint",
  "input-guard",
  "supervisor",
  "output-guard",
  "response",
  "ui-bubble",
] as const;

export const CHAT_RAG_SEQUENCE = [
  "rag-tool",
  "query-engine",
  "hybrid-search",
  "pgvector",
] as const;

export const INGEST_SEQUENCE = [
  "ui-app",
  "ui-upload",
  "ui-proxy",
  "fastapi",
  "auth",
  "ingest-endpoint",
  "ingest-pipeline",
  "pgvector",
] as const;

export const CHAT_STEPS = [
  "Sidebar AgentSelector — user picks one of five agents",
  "useChat → POST /api/v1/agents/{id}/query",
  "Proxy → FastAPI → JWT + session check → input guardrails",
  "Agent orchestrator runs the selected specialist LangGraph agent",
  "Agent calls search_knowledge_base → hybrid RAG → pgvector",
  "Output guardrails → ChatResponse → MessageBubble",
];

export const INGEST_STEPS = [
  "FileUpload → POST /api/v1/ingest",
  "Extract → chunk → embed → sanitize",
  "Quarantined spans logged as DOC_INJECTION_SUSPECT",
  "Chunks stored in pgvector for all RAG paths",
];

export const LAYOUT_STORAGE_KEY = "opsiq-architecture-layout-v3";

function chainEdges(ids: readonly string[], kind: GraphEdge["kind"] = "main"): GraphEdge[] {
  const edges: GraphEdge[] = [];
  for (let i = 0; i < ids.length - 1; i++) {
    edges.push({ from: ids[i], to: ids[i + 1], kind });
  }
  return edges;
}

export function edgesForMode(mode: FlowMode): GraphEdge[] {
  if (mode === "chat") {
    return [
      ...chainEdges(CHAT_MAIN_SEQUENCE, "main"),
      { from: "supervisor", to: "rag-tool", kind: "branch" },
      ...chainEdges(CHAT_RAG_SEQUENCE, "branch"),
    ];
  }
  if (mode === "ingest") {
    return chainEdges(INGEST_SEQUENCE, "main");
  }
  const chatEdges = edgesForMode("chat");
  const ingestEdges = edgesForMode("ingest");
  return [
    ...chatEdges,
    ...ingestEdges.filter(
      (edge) => !chatEdges.some((c) => c.from === edge.from && c.to === edge.to)
    ),
  ];
}

function layoutSequence(
  ids: readonly string[],
  originX: number,
  originY: number
): GraphLayoutNode[] {
  return ids.map((id, index) => ({
    id,
    x: originX + index * (NODE_W + NODE_GAP_X),
    y: originY,
    w: NODE_W,
    h: NODE_H,
  }));
}

function bounds(nodes: GraphLayoutNode[]): { width: number; height: number } {
  let maxX = LAYOUT_PAD;
  let maxY = LAYOUT_PAD;
  nodes.forEach((node) => {
    maxX = Math.max(maxX, node.x + node.w + LAYOUT_PAD);
    maxY = Math.max(maxY, node.y + node.h + LAYOUT_PAD);
  });
  return { width: maxX, height: maxY };
}

function layoutChatFlow(originY = LAYOUT_PAD): GraphLayout {
  const mainY = originY;
  const branchY = originY + NODE_H + NODE_GAP_Y;
  const mainNodes = layoutSequence(CHAT_MAIN_SEQUENCE, LAYOUT_PAD, mainY);

  const orchestratorNode = mainNodes.find((node) => node.id === "supervisor");
  const branchStartX = orchestratorNode?.x ?? LAYOUT_PAD;
  const branchNodes = layoutSequence(CHAT_RAG_SEQUENCE, branchStartX, branchY);

  const nodes = [...mainNodes, ...branchNodes];
  const { width, height } = bounds(nodes);
  return { nodes, edges: edgesForMode("chat"), width, height };
}

function layoutIngestFlow(originY = LAYOUT_PAD): GraphLayout {
  const nodes = layoutSequence(INGEST_SEQUENCE, LAYOUT_PAD, originY);
  const { width, height } = bounds(nodes);
  return { nodes, edges: edgesForMode("ingest"), width, height };
}

export function computeGraphLayout(mode: FlowMode): GraphLayout {
  if (mode === "chat") return layoutChatFlow();
  if (mode === "ingest") return layoutIngestFlow();

  const chat = layoutChatFlow(LAYOUT_PAD);
  const ingest = layoutIngestFlow(chat.height + 48);
  const nodes = [...chat.nodes, ...ingest.nodes];
  const { width, height } = bounds(nodes);
  return { nodes, edges: edgesForMode("all"), width, height };
}

export function applyCustomPositions(
  layout: GraphLayout,
  custom: NodePositions | undefined
): GraphLayout {
  if (!custom || Object.keys(custom).length === 0) return layout;

  const nodes = layout.nodes.map((node) => {
    const override = custom[node.id];
    if (!override) return node;
    return { ...node, x: override.x, y: override.y };
  });

  const { width, height } = bounds(nodes);
  return { ...layout, nodes, width, height };
}

export function loadSavedLayouts(): Partial<Record<FlowMode, NodePositions>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<Record<FlowMode, NodePositions>>;
  } catch {
    return {};
  }
}

export function saveLayoutForMode(mode: FlowMode, positions: NodePositions): void {
  if (typeof window === "undefined") return;
  const all = loadSavedLayouts();
  all[mode] = positions;
  window.localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(all));
}

export function clearLayoutForMode(mode: FlowMode): void {
  if (typeof window === "undefined") return;
  const all = loadSavedLayouts();
  delete all[mode];
  window.localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(all));
}

export function positionsFromLayout(nodes: GraphLayoutNode[]): NodePositions {
  return Object.fromEntries(nodes.map((node) => [node.id, { x: node.x, y: node.y }]));
}

export function edgePath(from: GraphLayoutNode, to: GraphLayoutNode, kind?: GraphEdge["kind"]): string {
  const sx = from.x + from.w;
  const sy = from.y + from.h / 2;
  const tx = to.x;
  const ty = to.y + to.h / 2;

  if (kind === "branch" && to.y > from.y + 8) {
    const bendX = sx + 28;
    return `M ${sx} ${sy} C ${bendX} ${sy}, ${bendX} ${ty}, ${tx} ${ty}`;
  }

  if (to.x < from.x) {
    const midY = (sy + ty) / 2 + 24;
    return `M ${sx} ${sy} C ${sx + 40} ${sy}, ${tx - 40} ${midY}, ${tx} ${ty}`;
  }

  return `M ${sx} ${sy} L ${tx} ${ty}`;
}

export function layerClassName(layer: GraphLayer): string {
  const map: Record<GraphLayer, string> = {
    UI: "bg-[var(--teal-bg)] border-[var(--teal)]/30",
    API: "bg-[var(--card)] border-[var(--line)]",
    Auth: "bg-[#eef2fb] border-[var(--blue)]/25",
    Guardrails: "bg-[var(--teal-bg)] border-[var(--teal)]/50",
    Agents: "bg-[#e8f5f3] border-[var(--teal)]/35",
    Retrieval: "bg-[var(--amber-bg)] border-[var(--amber)]/30",
    Storage: "bg-[var(--paper)] border-[var(--line)]",
    Output: "bg-[var(--teal-bg)] border-[var(--teal)]/40",
  };
  return map[layer];
}

export function layerFill(layer: GraphLayer): string {
  const map: Record<GraphLayer, string> = {
    UI: "var(--teal-bg)",
    API: "var(--card)",
    Auth: "#eef2fb",
    Guardrails: "var(--teal-bg)",
    Agents: "#e8f5f3",
    Retrieval: "var(--amber-bg)",
    Storage: "var(--paper)",
    Output: "var(--teal-bg)",
  };
  return map[layer];
}

export function layerStroke(layer: GraphLayer): string {
  const map: Record<GraphLayer, string> = {
    UI: "rgba(14, 140, 127, 0.3)",
    API: "var(--line)",
    Auth: "rgba(46, 95, 163, 0.25)",
    Guardrails: "rgba(14, 140, 127, 0.5)",
    Agents: "rgba(14, 140, 127, 0.35)",
    Retrieval: "rgba(196, 136, 26, 0.3)",
    Storage: "var(--line)",
    Output: "rgba(14, 140, 127, 0.4)",
  };
  return map[layer];
}
