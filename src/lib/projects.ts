import "server-only";

import type { Project } from "@/constants/site";
import { projects as fallbackProjects } from "@/constants/site";

const HYGRAPH_ENDPOINT =
  process.env.HYGRAPH_ENDPOINT ||
  "https://ap-south-1.cdn.hygraph.com/content/cmp3d5io300e007w3571himy5/master";

const PROJECTS_QUERY = `
  query MyQuery {
    projects(first: 100) {
      nameProject
      imageProject {
        url
      }
      categoriesProject
    }
  }
`;

type HygraphProject = {
  nameProject?: string | null;
  imageProject?: {
    url?: string | null;
  } | null;
  categoriesProject?: string | string[] | null;
};

type HygraphProjectsResponse = {
  data?: {
    projects?: HygraphProject[];
  };
  errors?: Array<{
    message?: string;
  }>;
};

export async function getProjects(): Promise<Project[]> {
  try {
    const response = await fetch(HYGRAPH_ENDPOINT, {
      method: "POST",
      headers: getHygraphHeaders(),
      body: JSON.stringify({ query: PROJECTS_QUERY }),
      next: {
        revalidate: 300,
      },
    });

    if (!response.ok) {
      throw new Error(`Hygraph request failed with status ${response.status}`);
    }

    const result = (await response.json()) as HygraphProjectsResponse;

    if (result.errors?.length) {
      throw new Error(
        result.errors.map((error) => error.message).filter(Boolean).join(", "),
      );
    }

    const projects = (result.data?.projects || [])
      .map(mapHygraphProject)
      .filter((project): project is Project => Boolean(project));

    return projects.length > 0 ? projects : fallbackProjects;
  } catch (error) {
    console.error("Failed to fetch Hygraph projects:", error);
    return fallbackProjects;
  }
}

function getHygraphHeaders() {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (process.env.HYGRAPH_TOKEN) {
    headers.Authorization = `Bearer ${process.env.HYGRAPH_TOKEN}`;
  }

  return headers;
}

function mapHygraphProject(project: HygraphProject): Project | null {
  const title = project.nameProject?.trim();

  if (!title) {
    return null;
  }

  return {
    title,
    category: normalizeCategory(project.categoriesProject),
    location: "",
    image: project.imageProject?.url || undefined,
  };
}

function normalizeCategory(category?: string | string[] | null) {
  if (Array.isArray(category)) {
    return (
      category
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean)
        .join(", ") || "project"
    );
  }

  return category?.trim().toLowerCase() || "project";
}
