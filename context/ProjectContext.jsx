"use client";

import { createContext, useContext, useState } from "react";

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const [projectId, setProjectId] = useState(null);

  return (
    <ProjectContext.Provider
      value={{
        projectId,
        setProjectId, // ✅ MUST BE HERE
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error("useProject must be used inside ProjectProvider");
  }
  return ctx;
}
