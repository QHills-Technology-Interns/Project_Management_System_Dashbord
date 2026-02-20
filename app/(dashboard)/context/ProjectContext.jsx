"use client";

import { createContext, useContext, useState } from "react";

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <ProjectContext.Provider
      value={{ searchTerm, setSearchTerm }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}
