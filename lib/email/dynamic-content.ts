import { adminDb } from '@/lib/firebase-admin';

export interface FeatureContentItem {
  id?: string;
  featureId: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  howItWorks: string;
  useCases: string[];
  ctaText?: string;
  ctaUrl?: string;
  imageUrl?: string;
  status: 'APPROVED' | 'DRAFT' | 'ARCHIVED';
}

export interface NewsletterArticleItem {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  category: 'PRODUCT_UPDATE' | 'TUTORIAL' | 'COMMUNITY' | 'ANNOUNCEMENT' | 'EVENT' | 'TIP';
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  status: 'DRAFT' | 'APPROVED' | 'SCHEDULED' | 'PUBLISHED';
  publishAt?: number;
  expiresAt?: number;
}

export async function getApprovedFeature(slugOrId: string): Promise<FeatureContentItem | null> {
  if (!adminDb) return getFallbackFeature(slugOrId);

  try {
    const snap = await adminDb
      .collection('features')
      .where('slug', '==', slugOrId)
      .limit(1)
      .get();

    if (!snap.empty) {
      const doc = snap.docs[0];
      return { id: doc.id, ...doc.data() } as FeatureContentItem;
    }

    const docSnap = await adminDb.collection('features').doc(slugOrId).get();
    if (docSnap.exists) {
      return { id: docSnap.id, ...docSnap.data() } as FeatureContentItem;
    }
  } catch (err) {
    console.warn(`[DynamicContent] Error fetching feature ${slugOrId}:`, err);
  }

  return getFallbackFeature(slugOrId);
}

export async function getApprovedNewsletterArticles(limit: number = 3): Promise<NewsletterArticleItem[]> {
  if (!adminDb) return getFallbackNewsletterArticles();

  try {
    const snap = await adminDb
      .collection('newsletter_content')
      .where('status', 'in', ['APPROVED', 'PUBLISHED'])
      .orderBy('publishAt', 'desc')
      .limit(limit)
      .get();

    if (!snap.empty) {
      return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as NewsletterArticleItem[];
    }
  } catch (err) {
    console.warn('[DynamicContent] Error fetching newsletter articles:', err);
  }

  return getFallbackNewsletterArticles();
}

function getFallbackFeature(slug: string): FeatureContentItem {
  switch (slug) {
    case 'ai-arena':
    default:
      return {
        featureId: 'ai-arena',
        name: 'Botmartz Builders Arena',
        slug: 'ai-arena',
        shortDescription: 'Build real-world production AI & Systems projects.',
        fullDescription: 'Botmartz Arena provides 50 detailed system architecture PRDs in Generative AI, RAG, Multi-Agent Systems, and Distributed Computing with automated SLA benchmarking.',
        benefits: [
          'Production-grade PRDs & system blueprints',
          'Automated code audit & latency SLA checking',
          'Daily standup heatmap tracking for GitHub proof of work',
        ],
        howItWorks: 'Pick a system blueprint, initialize your repo, push daily commits, and track your streak on your public profile.',
        useCases: ['Portfolio building', 'Virtual AI Internship', 'Hiring partner referrals'],
        ctaText: 'Explore Arena Blueprints',
        ctaUrl: 'https://community.botmartz.com/arena',
        status: 'APPROVED',
      };
  }
}

function getFallbackNewsletterArticles(): NewsletterArticleItem[] {
  return [
    {
      title: 'Generative AI System Design: Multi-Agent RAG Architectures',
      slug: 'multi-agent-rag',
      summary: 'Deep dive into building fault-tolerant multi-agent RAG pipelines with LangGraph and Vector DBs.',
      body: 'In this edition, we explore how production teams structure agentic orchestration for high-throughput RAG apps...',
      category: 'TUTORIAL',
      ctaText: 'Read Full Technical Breakdown',
      ctaUrl: 'https://community.botmartz.com/magazine',
      status: 'PUBLISHED',
    },
  ];
}
