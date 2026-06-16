"use client";

import React, { createContext, useContext, useState } from "react";

interface WorkspaceContextType {
  selectedEmail: any | null;
  setSelectedEmail: (email: any | null) => void;
  selectedEvent: any | null;
  setSelectedEvent: (event: any | null) => void;
  rightPanelContent: React.ReactNode | null;
  setRightPanelContent: (content: React.ReactNode | null) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [rightPanelContent, setRightPanelContent] = useState<React.ReactNode | null>(null);

  const handleSetEmail = (email: any | null) => {
    setSelectedEmail(email);
    if (email) setSelectedEvent(null);
  };

  const handleSetEvent = (event: any | null) => {
    setSelectedEvent(event);
    if (event) setSelectedEmail(null);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        selectedEmail,
        setSelectedEmail: handleSetEmail,
        selectedEvent,
        setSelectedEvent: handleSetEvent,
        rightPanelContent,
        setRightPanelContent,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
