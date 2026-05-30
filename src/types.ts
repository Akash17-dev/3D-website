export interface ChatMessage {
  id: string;
  sender: 'user' | 'core';
  text: string;
  timestamp: string;
  category?: 'general' | 'roadmap' | 'skill' | 'startup';
}

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  phase: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface RoadmapData {
  topic: string;
  overview: string;
  steps: RoadmapNode[];
}

export interface SkillNode {
  name: string;
  level: number; // 0-100%
  marketDemand: 'High' | 'Medium' | 'Critical';
  projectsRecommended: string[];
}

export interface CareerPathData {
  roleName: string;
  jobReadinessScore: number;
  skills: SkillNode[];
  forecast: string;
}

export interface StartupIdea {
  title: string;
  concept: string;
  revenueProjections: string;
  marketSize: string;
  actionItems: string[];
}

export interface StartupUniverseData {
  planetName: string;
  ideas: StartupIdea[];
}

export type SceneChapter = 'hero' | 'awakening' | 'learning' | 'career' | 'startup' | 'command';
