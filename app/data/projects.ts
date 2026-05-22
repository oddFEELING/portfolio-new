/**
 * Project content.
 *
 * Nubia's metadata and write-up are REAL (provided by the user). The
 * Feature Adoption Analyser write-up is PLACEHOLDER — search this file for
 * `PLACEHOLDER` to find the content that must be tailored later.
 */

export type WriteUpSection = {
  heading?: string;
  paragraphs: string[];
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  name: string;
  period: string;
  context: string;
  summary: string;
  links: ProjectLink[];
  writeUp: WriteUpSection[];
};

export const projects: Project[] = [
  {
    slug: "nubia",
    name: "Nubia",
    period: "2022 — Present",
    context: "Dataphyte",
    summary:
      "Building AI for African data journalism means solving problems the mainstream AI conversation ignores.",
    links: [
      {
        label: "LSE Polis write-up",
        href: "https://blogs.lse.ac.uk/polis/2022/10/04/nubia-the-call-the-crawl-and-the-counsels/",
      },
      { label: "nubia.ai", href: "https://nubia.ai/" },
    ],
    writeUp: [
      {
        paragraphs: [
          `In 2022, during a Journalism AI Fellowship at Polis, I partnered with Joshua Olufemi to begin building Nubia, an AI platform for African data journalism. What began as conditional algorithms and SpaCy NLP routines wired into a templating engine has grown, over four years, into a production system in partnerships with Archivi.ng, Daily Trust, and Business Day, training on corpora that very little of the dominant AI tooling has ever seen.`,
          `I designed and built its technical foundation: a Next.js frontend on a microservice backend running an agentic architecture, a hosted LLM service, and a vector store designed around how journalists actually use sources. The first dataset we tried to load was a procurement filing from a Nigerian state government, a 200-page scanned PDF in which the numbers we needed sat inside a table printed, signed and rescanned enough times that the digits had started to bleed into each other.`,
          `The dominant AI-for-journalism conversation, then and now, is largely about generation. The implicit assumption is that you have structured data, or at minimum, clean text. For the newsrooms we were building for, that assumption was almost never true. The hard problems were upstream of generation, and they stayed upstream no matter the generative model used.`,
        ],
      },
      {
        heading: "Ingestion is the actual hard problem",
        paragraphs: [
          `In Nubia's architecture, the model is one service among several, and one that took the most engineering thought. The real product is the orchestration that happens before the model is put to work.`,
          `The Archivi.ng partnership meant working with Nigerian newspaper archives back to 1960; varying scan quality, columns that break across pages, body text interleaved with images. Day-to-day inputs were no kinder: budget tables photographed at press conferences, audio testimonies in native dialect, election results exported from systems built in the early 2000s.`,
          `Fine-tuning an open-source model on the historical corpus was a serious option, but continuous fine-tuning meant continuous infrastructural upkeep in a field where the methodologies changed faster than we could re-train. We chose a knowledge base path instead; keep the corpus stable, swap the model behind it as the field moves. The cost was Optical Character Recognition's (OCR) blind spot. In newsprint, paragraphs are often held together contextually by the images alongside them, and OCR strips that out.`,
          `Documents pass through a sequential transformation pipeline before they reach the vector store. Each chunk gets a context extractor, a title, a summary, keywords and entities, and a set of questions the chunk could answer. All of it gets embedded with the chunk, so retrieval is not just semantic similarity against raw text but a query against meaning the pipeline has already drawn out.`,
          `The deeper lesson is about posture. The temptation, when you're solving a problem the wider industry isn't looking at, is to branch off and build everything yourself. That path is a trap. Industry's innovation wave is the most powerful tailwind you have. Ride it for what it gives you, and spend your engineering only where it doesn't reach. For Nubia, that meant ingestion.`,
        ],
      },
      {
        heading: "Generation has to earn its place in the newsroom",
        paragraphs: [
          `The default voice of every major language model is North American business English. It's polite, it's even, and it's wrong for a Lagos investigative desk, a Nairobi data team, or a Kampala radio newsroom. Generic LLM prose doesn't just fail because it's bland; it fails because the register is culturally located somewhere else. And the journalist on the receiving end has to write the draft into a voice their readers actually trust.`,
          `The temptation is to solve this with longer prompts. We tried, and prompts don't carry the weight. What works better is treating the newsroom's existing archive as the source of truth for voice, retrieving from it not just for facts but for tone, sentence rhythm, framing conventions, the local register that makes a piece sound like it belongs in that paper. Nubia draws on the same corpus for voice as for content, which is why the Archivi.ng, Daily Trust, and Business Day partnerships matter beyond their value as historical or factual sources, they're also training the model in how Nigerian journalism actually sounds.`,
          `"Newsroom-grade" is not a single thing. The dominant AI conversation treats voice as a styling problem solved by a system prompt. For newsrooms outside the anglophone-Western mainstream, voice is closer to a retrieval problem, and the data you train on shapes it more than the instructions you give.`,
        ],
      },
      {
        heading: "Architecture follows infrastructure",
        paragraphs: [
          `Building for African newsrooms is not building for Western newsrooms scaled down. The constraints are different, and they push back on every architectural decision.`,
          `Routing every query through a paid frontier model was not survivable at the cost structure our newsrooms could bear, particularly for smaller and grassroots outlets where Nubia's value proposition depends on producing data stories at a fraction of traditional cost. So Nubia runs a hosted Llama 4 series model for the majority of quick AI tasks, with the frontier model reserved for the work that genuinely needs it. The distributed-systems split is as much about cost control as it is about scaling; keep the expensive operations behind queues, run the cheap ones close to the user. The architecture is the budget.`,
          `Latency matters in ways the dominant conversation underestimates. A journalist working in the field, often on a phone, on intermittent connectivity, cannot wait through a thirty-second round-trip to a model provider on another continent. So inference has to live close enough to be usable, retrieval has to degrade gracefully, and the system has to assume the connection will drop mid-query and the user will resume later from a different device.`,
          `Infrastructure is not a deployment detail you sort out at the end. It is an upstream design constraint that determines which models you can use, which features you can offer, and which journalists you can actually serve. A system designed on the assumption of cheap tokens, fast networks, and uninterrupted sessions will quietly exclude the newsrooms that need it most. The teams that build for these contexts don't get to choose between good architecture and accessible architecture; they have to make the architectural choices that make accessibility possible.`,
        ],
      },
      {
        heading: "The data isn't just messy, it's contested",
        paragraphs: [
          `Beneficial ownership records, procurement filings, election results — the data African investigative journalism actually runs on — exist in fragmented and often disputed form. A procurement filing may be authentic, leaked, redacted, or fabricated. A government dataset may be the official version or the one published before a quiet correction. Sources disagree, portals disappear, records get released, retracted, or never published at all.`,
          `For an AI tool expected to produce defensible journalism on top of these sources, this changes the design problem. The risk isn't generic hallucination, it's the model confidently asserting something the underlying source doesn't actually support, in a context where that assertion goes to print under the publication's name. The cost of being wrong here is a correction at best, a retraction at worst, and a story that misleads the public in the cases that don't get caught.`,
          `We made provenance a first-class part of retrieval, not a feature bolted on later. Every claim Nubia surfaces is traceable to the chunk that supports it, and the journalist using it can verify the chunk against the original source before anything goes to publication. The model is allowed to draft. It is not allowed to assert. The boundary is enforced in the architecture, not just the prompt, because boundaries enforced only in prompts are boundaries that fail under pressure.`,
          `Responsible AI for journalism in this context cannot be a question of model behaviour alone. It has to be a question of what the surrounding system makes verifiable, and what it makes the journalist confirm before anything leaves the building.`,
        ],
      },
      {
        heading: "What's missing from the conversation",
        paragraphs: [
          `The AI-in-journalism conversation has become a conversation about prompts and models. For the newsrooms most of the world's journalists work in, the harder questions are about the data on the way in, the voice that comes out, the infrastructure underneath, and the verification that surrounds it. Four years of Nubia have not made me less interested in generation. They have made me certain that for AI to genuinely serve African newsrooms, the work that matters most is the work that nobody is writing marketing copy about.`,
        ],
      },
    ],
  },
  {
    slug: "feature-adoption-analyser",
    name: "Feature Adoption Analyser",
    period: "2025",
    context: "Zenning AI",
    summary:
      "A tool that analyses feature-adoption rates and recommends actions to improve uptake across the product.",
    links: [],
    writeUp: [
      {
        // PLACEHOLDER: Feature Adoption Analyser write-up — replace with real detail
        paragraphs: [
          "Placeholder: a full write-up for the Feature Adoption Analyser is coming soon. It will cover how the tool measures feature adoption, the recommendation system behind its suggested actions, and the impact it had on product uptake at Zenning AI.",
        ],
      },
    ],
  },
];
