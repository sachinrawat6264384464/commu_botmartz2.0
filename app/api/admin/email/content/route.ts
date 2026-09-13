import { NextRequest, NextResponse } from 'next/server';
import { adminDb, hasAdminCredentials } from '@/lib/firebase-admin';
import { generateNewsletterDraftWithAi } from '@/lib/email/ai-generator';
import { getApprovedFeature, getApprovedNewsletterArticles } from '@/lib/email/dynamic-content';

export async function GET(req: NextRequest) {
  try {
    let features: any[] = [];
    let articles: any[] = [];

    if (adminDb && hasAdminCredentials) {
      try {
        const featSnap = await adminDb.collection('features').get();
        if (featSnap && featSnap.docs) {
          features = featSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        }

        const artSnap = await adminDb.collection('newsletter_content').orderBy('createdAt', 'desc').limit(20).get();
        if (artSnap && artSnap.docs) {
          articles = artSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        }
      } catch (dbErr) {}
    }

    // Default fallback features & articles if DB empty
    if (features.length === 0) {
      const fallbackFeat = await getApprovedFeature('ai-arena');
      if (fallbackFeat) features = [fallbackFeat];
    }
    if (articles.length === 0) {
      articles = await getApprovedNewsletterArticles(5);
    }

    return NextResponse.json({
      success: true,
      features,
      articles,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, prompt, category, articleId, featureData } = body || {};

    if (action === 'GENERATE_AI_DRAFT') {
      const draft = await generateNewsletterDraftWithAi(prompt || 'AI Engineering Best Practices', category);
      return NextResponse.json({
        success: true,
        message: 'AI Draft generated successfully and saved for Admin Review.',
        draft,
      });
    }

    if (action === 'APPROVE_CONTENT') {
      if (!articleId) {
        return NextResponse.json({ success: false, error: 'articleId required' }, { status: 400 });
      }

      if (adminDb && hasAdminCredentials) {
        await adminDb.collection('newsletter_content').doc(articleId).set(
          {
            status: 'APPROVED',
            approvedAt: Date.now(),
            updatedAt: Date.now(),
          },
          { merge: true }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Content ${articleId} approved for distribution.`,
      });
    }

    if (action === 'CREATE_FEATURE') {
      if (!featureData || !featureData.name || !featureData.slug) {
        return NextResponse.json({ success: false, error: 'Feature name and slug required' }, { status: 400 });
      }

      if (adminDb && hasAdminCredentials) {
        await adminDb.collection('features').doc(featureData.slug).set(
          {
            ...featureData,
            status: 'APPROVED',
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          { merge: true }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Feature ${featureData.name} saved to CMS catalog.`,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
