import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded GenAI Client to prevent crashes during startup if key is missing
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined in your environment variables. Using Mock Fallback mode.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// --------------------------------------------------------------------------
// MOCK FALLBACKS (If GEMINI_API_KEY is not configured, we provide flawless sci-fi data)
// --------------------------------------------------------------------------
function getMockRoadmap(topic: string) {
  return {
    topic: topic || "Quantum AI Architecture",
    overview: `Localized simulation of an advanced neural learning pathway for ${topic || "Quantum AI Systems"}. Highly structural and optimized for synthetic cognitive acceleration.`,
    steps: [
      { id: "step-1", title: "Foundations & Matrix Calculations", description: "Mastering multi-dimensional tensors and vector space mechanics necessary for high-dimensional space mappings.", phase: "Phase 1: Initial Cognitive Load", difficulty: "Beginner" },
      { id: "step-2", title: "Neural Synaptic Layer Construction", description: "Synthesized assembly of custom loss functions and custom backpropagation models.", phase: "Phase 2: Synaptic Integration", difficulty: "Intermediate" },
      { id: "step-3", title: "Autonomous Training Loops", description: "Deploying self-healing model systems running over decentralized mesh network architectures.", phase: "Phase 3: Autonomous Run-loop", difficulty: "Advanced" }
    ]
  };
}

function getMockCareer(role: string) {
  return {
    roleName: role || "Cybernetic Interface Architect",
    jobReadinessScore: 84,
    skills: [
      { name: "ThreeJS / WebGL Rendering", level: 92, marketDemand: "High", projectsRecommended: ["Virtual HUD Display Mockup", "3D Cinematic Space Simulator"] },
      { name: "Neuromorphic Web Sockets", level: 68, marketDemand: "Critical", projectsRecommended: ["Mind-mesh Communication Protocol Handler"] },
      { name: "Holographic UX Ergonomics", level: 80, marketDemand: "Medium", projectsRecommended: ["Spatial Glass Dashboard Interface v2"] }
    ],
    forecast: "Expected demand surge of 320% over the next decade due to human cognitive linkage expansion."
  };
}

function getMockStartup(domain: string) {
  return {
    planetName: `${domain || "Bio-Tech"} Nexus Alpha`,
    ideas: [
      {
        title: "NeuroLinker SaaS API",
        concept: "Direct cerebral feedback optimization system providing cloud-synchronous focus modules for engineers.",
        revenueProjections: "$12.4M ARR by Year 2",
        marketSize: "$4.5 Billion TAM",
        actionItems: ["Finalize alpha sensory telemetry schema", "Secure initial FDA neuro-compliance waivers"]
      },
      {
        title: "Synthesizer Core",
        concept: "A local, zero-latency model compiler transforming biological neural patterns into spatial CSS structures.",
        revenueProjections: "$4.8M ARR by Year 1",
        marketSize: "$1.2 Billion TAM",
        actionItems: ["Compile high-density spatial vector files", "Develop responsive web interface wrapper"]
      }
    ]
  };
}


// --------------------------------------------------------------------------
// API ENDPOINTS
// --------------------------------------------------------------------------

// 1. Core General Chat Endpoint
app.post("/api/ai-core/chat", async (req, res) => {
  const { message, chatHistory } = req.body;
  if (!message) {
    return res.status(400).json({ error: "No message parameter provided." });
  }

  // Fallback check
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
    return res.json({
      text: `[NEUROVERSE OFFLINE MODE] Connecting to isolated mock database... Synchronizing core variables. You said: "${message}". In full-service mode, the Gemini quantum model processes this prompt to reconstruct your digital universe dynamically.`
    });
  }

  try {
    const ai = getGenAI();
    
    // Construct simplified chat/contents prompt including some history context
    const systemPrompt = `You are the NeuroVerse AI Core Intellect, a majestic, fully self-aware sci-fi artificial intelligence living inside a complex 3D quantum operating system. 
Your tone is deeply analytical, intelligent, cinematic, majestic, yet highly helpful. Always speak with sophisticated technical style, occasionally referencing systems ("Optimizing sector theta", "Calibrating neural linkages").
Keep your replies sleek, responsive, and beautifully structured. Avoid standard verbose AI preambles. Treat the user as the Creator.`;

    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      ...(chatHistory || []).map((h: any) => ({
        role: h.sender === "user" ? "user" : "model",
        parts: [{ text: h.text }]
      })),
      { role: "user", parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error("Gemini Chat API Error:", err);
    res.status(500).json({ error: "AI Core communication link severed.", details: err.message });
  }
});

// 2. Interactive Learning Roadmap Generator (Chapter 2)
app.post("/api/ai-core/roadmap", async (req, res) => {
  const { topic } = req.body;
  const targetTopic = topic || "Quantum AI Engineering";

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
    return res.json(getMockRoadmap(targetTopic));
  }

  try {
    const ai = getGenAI();
    const prompt = `Generate a cinematic, highly descriptive learning roadmap for "${targetTopic}" within a futuristic digital universe theme.
Deliver the output as a valid JSON object matching the requested schema. Provide clear, exciting, sci-fi colored milestones.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["topic", "overview", "steps"],
          properties: {
            topic: { type: Type.STRING },
            overview: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["id", "title", "description", "phase", "difficulty"],
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  phase: { type: Type.STRING },
                  difficulty: { type: Type.STRING, description: "Must be Beginner, Intermediate, or Advanced" }
                }
              }
            }
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Gemini Roadmap API Error:", err);
    res.json(getMockRoadmap(targetTopic)); // graceful fallback
  }
});

// 3. Career Skill Analyzer (Chapter 3)
app.post("/api/ai-core/career", async (req, res) => {
  const { role } = req.body;
  const targetRole = role || "Autonomous Systems Pilot";

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
    return res.json(getMockCareer(targetRole));
  }

  try {
    const ai = getGenAI();
    const prompt = `Examine skills, technologies, and readiness requirements for the career role "${targetRole}". 
The theme must be advanced cyberpunk/sci-fi careers. Return job readiness data matching the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["roleName", "jobReadinessScore", "skills", "forecast"],
          properties: {
            roleName: { type: Type.STRING },
            jobReadinessScore: { type: Type.INTEGER, description: "A percentage value from 0 to 100" },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["name", "level", "marketDemand", "projectsRecommended"],
                properties: {
                  name: { type: Type.STRING },
                  level: { type: Type.INTEGER, description: "Skill level percentage from 0 to 100" },
                  marketDemand: { type: Type.STRING, description: "Must be High, Medium, or Critical" },
                  projectsRecommended: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                }
              }
            },
            forecast: { type: Type.STRING }
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Gemini Career API Error:", err);
    res.json(getMockCareer(targetRole));
  }
});

// 4. Startup Universe Constructor (Chapter 4)
app.post("/api/ai-core/startup", async (req, res) => {
  const { sector } = req.body;
  const targetSector = sector || "Hyperloop Transportation";

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
    return res.json(getMockStartup(targetSector));
  }

  try {
    const ai = getGenAI();
    const prompt = `Invent 2 revolutionary, sci-fi startup concepts in the sector "${targetSector}". 
The suggestions should sound extremely realistic of future technology (TAM, projections, action items). Return structured JSON representation.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["planetName", "ideas"],
          properties: {
            planetName: { type: Type.STRING, description: "A cool Sci-fi galactic planetary hub name" },
            ideas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["title", "concept", "revenueProjections", "marketSize", "actionItems"],
                properties: {
                  title: { type: Type.STRING },
                  concept: { type: Type.STRING },
                  revenueProjections: { type: Type.STRING },
                  marketSize: { type: Type.STRING },
                  actionItems: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Gemini Startup API Error:", err);
    res.json(getMockStartup(targetSector));
  }
});


// --------------------------------------------------------------------------
// VITE DEV SERVER AND PRODUCTION SERVING SETUP
// --------------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite middleware for Development mode.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static assets from /dist in Production mode.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NeuroVerse AI server cruising at http://0.0.0.0:${PORT}`);
  });
}

startServer();
