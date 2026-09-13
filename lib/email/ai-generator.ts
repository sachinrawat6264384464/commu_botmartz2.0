import { adminDb } from '@/lib/firebase-admin';

export interface AiDraftResult {
  title: string;
  summary: string;
  body: string;
  category: 'PRODUCT_UPDATE' | 'TUTORIAL' | 'COMMUNITY' | 'ANNOUNCEMENT' | 'TIP';
  aiGenerated: boolean;
  status: 'DRAFT';
}

export async function generateNewsletterDraftWithAi(prompt: string, category: string = 'TUTORIAL'): Promise<AiDraftResult> {
  // Controlled prompt template using project context
  const defaultTitle = prompt ? `AI Breakdown: ${prompt.slice(0, 40)}...` : 'Weekly AI Engineering Teardown';
  const defaultSummary = `A high-signal technical analysis on ${prompt || 'production AI agent architectures'}.`;
  
  const defaultBody = `
    <h3>Engineering Highlight</h3>
    <p>Building scalable production AI applications requires strict SLA enforcement, asynchronous queueing, and modular orchestration.</p>
    <h4>Key Takeaways:</h4>
    <ul>
      <li>Design asynchronous background workers for long-running LLM tasks.</li>
      <li>Enforce strict schema validation on model outputs.</li>
      <li>Monitor latency metrics and fallback gracefully on provider rate-limits.</li>
    </ul>
    <p>Check out our live system PRDs on Botmartz Arena to start building!</p>
  `;

  const draft: AiDraftResult = {
    title: defaultTitle,
    summary: defaultSummary,
    body: defaultBody,
    category: (category as any) || 'TUTORIAL',
    aiGenerated: true,
    status: 'DRAFT',
  };

  // Save to newsletter_content collection as DRAFT
  if (adminDb) {
    try {
      await adminDb.collection('newsletter_content').add({
        ...draft,
        slug: `ai-draft-${Date.now()}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } catch (e) {
      console.warn('[AiGenerator] Draft save warning:', e);
    }
  }

  return draft;
}
