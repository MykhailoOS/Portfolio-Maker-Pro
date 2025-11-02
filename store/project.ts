import { create } from 'zustand';
import type { Portfolio, Section } from '../types';
import { getByPath, setByPath } from '../utils/dotPath';

interface HistoryState {
  past: Portfolio[];
  present: Portfolio;
  future: Portfolio[];
}

interface ProjectStore extends HistoryState {
  getValue: (path: string) => any;
  setValue: (path: string, value: any) => void;
  patch: (obj: Partial<Portfolio>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  updateSection: (sectionId: string, data: any) => void;
  addSection: (section: Section) => void;
  removeSection: (sectionId: string) => void;
  reorderSections: (startIndex: number, endIndex: number) => void;
  setPortfolio: (portfolio: Portfolio) => void;
}

const MAX_HISTORY = 50;

export const useProjectStore = create<ProjectStore>((set, get) => ({
  past: [],
  present: {} as Portfolio, // Will be initialized from App
  future: [],

  getValue: (path: string) => {
    const state = get();
    return getByPath(state.present, path);
  },

  setValue: (path: string, value: any) => {
    set((state) => {
      const newPresent = JSON.parse(JSON.stringify(state.present));
      setByPath(newPresent, path, value);
      
      return {
        past: [...state.past, state.present].slice(-MAX_HISTORY),
        present: newPresent,
        future: [], // Clear future on new change
      };
    });
  },

  patch: (obj: Partial<Portfolio>) => {
    set((state) => ({
      past: [...state.past, state.present].slice(-MAX_HISTORY),
      present: { ...state.present, ...obj },
      future: [],
    }));
  },

  undo: () => {
    set((state) => {
      if (state.past.length === 0) return state;
      
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      
      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
      };
    });
  },

  redo: () => {
    set((state) => {
      if (state.future.length === 0) return state;
      
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      
      return {
        past: [...state.past, state.present],
        present: next,
        future: newFuture,
      };
    });
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,

  updateSection: (sectionId: string, data: any) => {
    set((state) => {
      const newPresent = JSON.parse(JSON.stringify(state.present));
      const sectionIndex = newPresent.sections.findIndex((s: Section) => s.id === sectionId);
      
      if (sectionIndex !== -1) {
        newPresent.sections[sectionIndex].data = {
          ...newPresent.sections[sectionIndex].data,
          ...data,
        };
      }
      
      return {
        past: [...state.past, state.present].slice(-MAX_HISTORY),
        present: newPresent,
        future: [],
      };
    });
  },

  addSection: (section: Section) => {
    set((state) => ({
      past: [...state.past, state.present].slice(-MAX_HISTORY),
      present: {
        ...state.present,
        sections: [...state.present.sections, section],
      },
      future: [],
    }));
  },

  removeSection: (sectionId: string) => {
    set((state) => ({
      past: [...state.past, state.present].slice(-MAX_HISTORY),
      present: {
        ...state.present,
        sections: state.present.sections.filter((s) => s.id !== sectionId),
      },
      future: [],
    }));
  },

  reorderSections: (startIndex: number, endIndex: number) => {
    set((state) => {
      const newSections = Array.from(state.present.sections);
      const [removed] = newSections.splice(startIndex, 1);
      newSections.splice(endIndex, 0, removed);
      
      return {
        past: [...state.past, state.present].slice(-MAX_HISTORY),
        present: {
          ...state.present,
          sections: newSections,
        },
        future: [],
      };
    });
  },

  setPortfolio: (portfolio: Portfolio) => {
    set({
      past: [],
      present: portfolio,
      future: [],
    });
  },
}));
