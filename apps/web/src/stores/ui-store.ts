import { create } from 'zustand';

interface UiState {
  documentView: 'grid' | 'list';
  setDocumentView: (view: 'grid' | 'list') => void;
}

export const useUiStore = create<UiState>((set) => ({
  documentView: 'grid',
  setDocumentView: (documentView) => set({ documentView }),
}));