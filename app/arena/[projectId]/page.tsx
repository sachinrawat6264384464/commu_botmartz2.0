import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ARENA_PROJECTS } from "@/lib/arena-projects";
import ProjectPRDClient from "./ProjectPRDClient";

interface Props {
  params: Promise<{ projectId: string }>;
}

export async function generateStaticParams() {
  const paramsList: { projectId: string }[] = [];
  
  for (const p of ARENA_PROJECTS) {
    if (p.slug) {
      paramsList.push({ projectId: p.slug });
    }
    if (p.id && p.id !== p.slug) {
      paramsList.push({ projectId: p.id });
    }
  }

  return paramsList;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projectId } = await params;
  const project = ARENA_PROJECTS.find(
    (p) => p.slug === projectId || p.id === projectId
  );

  if (!project) {
    return {
      title: "Project Specification | Botmartz Arena",
    };
  }

  return {
    title: `${project.title} — Production PRD Specification`,
    description: `${project.tagline || project.overview.slice(0, 160)} Build this ${project.domain} system in the 45-day virtual AI internship. Tech: ${project.techStack.join(", ")}.`,
    keywords: [
      project.title,
      project.domain,
      ...project.keywords,
      ...project.techStack,
      "AI project PRD",
      "production AI engineering project",
      "Botmartz virtual internship",
    ],
    alternates: {
      canonical: `/arena/${project.slug || project.id}`,
    },
    openGraph: {
      title: `${project.title} | Botmartz AI Arena PRD`,
      description: project.tagline || project.overview,
      url: `https://community.botmartz.com/arena/${project.slug || project.id}`,
      type: "article",
      images: [{ url: "/logo.png", width: 1200, height: 630 }],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { projectId } = await params;
  const project = ARENA_PROJECTS.find(
    (p) => p.slug === projectId || p.id === projectId
  );

  if (!project) {
    notFound();
  }

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: project.title,
    description: project.overview,
    proficiencyLevel: project.difficulty,
    dependencies: project.techStack.join(", "),
    author: {
      "@type": "Organization",
      name: "Botmartz AI Solution Pvt Ltd",
      url: "https://community.botmartz.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Botmartz AI Solution",
      logo: "https://community.botmartz.com/logo.png",
    },
    about: {
      "@type": "Thing",
      name: project.domain,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <ProjectPRDClient project={project} />
    </>
  );
}

