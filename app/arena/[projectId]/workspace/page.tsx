import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ARENA_PROJECTS } from "@/lib/arena-projects";
import { getArenaProjectByIdOrSlugFromDb } from "@/lib/arena-projects-server";
import ProjectWorkspaceClient from "./ProjectWorkspaceClient";

export const dynamic = "force-dynamic";

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
  const project = await getArenaProjectByIdOrSlugFromDb(projectId);

  if (!project) {
    return {
      title: "Project Agile Workspace | Botmartz Arena",
    };
  }

  return {
    title: `${project.title} — Agile Workspace & QA Test Suite`,
    description: `Agile project management, Sprint Kanban board, and QA test-case logging suite for ${project.title}.`,
  };
}

export default async function ProjectWorkspacePage({ params }: Props) {
  const { projectId } = await params;
  const project = await getArenaProjectByIdOrSlugFromDb(projectId);

  if (!project) {
    notFound();
  }

  return <ProjectWorkspaceClient project={project} />;
}
