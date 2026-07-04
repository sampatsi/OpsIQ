export const ABOUT_AGENTS = [
  {
    icon: "IN",
    glyphClass: "g-int",
    name: "Internal Assistant",
    description:
      "Answers employee questions about policies, SOPs and procedures instantly.",
  },
  {
    icon: "SU",
    glyphClass: "g-sup",
    name: "Support Agent",
    description:
      "Handles customer queries with automatic escalation when confidence is low.",
  },
  {
    icon: "RE",
    glyphClass: "g-rep",
    name: "Report Generator",
    description:
      "Produces structured business reports with human approval before finalizing.",
  },
  {
    icon: "ON",
    glyphClass: "g-onb",
    name: "Onboarding Guide",
    description:
      "Personalized day-by-day guidance for new hires, remembers progress across sessions.",
  },
  {
    icon: "CO",
    glyphClass: "g-con",
    name: "Contract Analyzer",
    description:
      "Extracts risks, key dates and obligations. Flags high-risk clauses for human review.",
  },
] as const;

export const ABOUT_FEATURES = [
  {
    icon: "📄",
    title: "Document Intelligence",
    body: "Ingests PDF, Word, Excel, CSV and plain text. Understands tables, headers and structure.",
  },
  {
    icon: "🔍",
    title: "Semantic AI Search",
    body: "Finds answers by meaning not keywords. Powered by Cohere embeddings and hybrid BM25 fusion.",
  },
  {
    icon: "🧠",
    title: "Conversation Memory",
    body: "Agents remember context across messages. Follow-up questions work naturally.",
  },
  {
    icon: "✋",
    title: "Human-in-the-Loop",
    body: "Reports and contracts pause for manager approval before finalizing. AI proposes, humans decide.",
  },
  {
    icon: "🔒",
    title: "Department Filtering",
    body: "Every document tagged by department and type. Right information to the right person.",
  },
  {
    icon: "📊",
    title: "Knowledge Dashboard",
    body: "Live view of all ingested documents, chunk counts and department breakdowns.",
  },
] as const;

export const ABOUT_BENEFITS = [
  ["🧑‍💼 Founders", "Answers to legal, HR and vendor questions in seconds instead of hours"],
  ["👥 HR Teams", "New hires self-serve 80% of onboarding questions from Day 1"],
  ["🎧 Support Staff", "Handle 3× more customer queries with cited, policy-grounded answers"],
  ["⚖️ Finance & Legal", "Contract risks surfaced automatically before signing"],
  ["🏠 All Employees", "Stop asking colleagues — get accurate answers instantly"],
] as const;

export const ABOUT_METRICS = [
  { number: "3–4 hrs", label: "recovered per employee per week" },
  { number: "<$50", label: "per month total running cost" },
  { number: "3×", label: "more support queries handled" },
  { number: "80%", label: "onboarding questions self-served" },
] as const;

export const ABOUT_STACK = [
  "Python",
  "FastAPI",
  "LangGraph",
  "pgvector",
  "Cohere embed-v3",
  "pdfplumber",
  "spaCy",
  "BM25 + Semantic RRF",
  "RAGAS",
  "Next.js",
] as const;
