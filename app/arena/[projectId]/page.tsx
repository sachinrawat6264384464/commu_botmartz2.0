import React from "react";
import { notFound } from "next/navigation";
import { ARENA_PROJECTS } from "@/lib/arena-projects";
import ProjectPRDClient from "./ProjectPRDClient";

interface Props {
  params: Promise<{ projectId: string }>;
}

export async function generateStaticParams() {
  return ARENA_PROJECTS.map((p) => ({
    projectId: p.slug,
  }));
}

export default async function ProjectDetailPage({ params }: Props) {
  const { projectId } = await params;
  const project = ARENA_PROJECTS.find(
    (p) => p.slug === projectId || p.id === projectId
  );

  if (!project) {
    notFound();
  }

  return <ProjectPRDClient project={project} />;
}
