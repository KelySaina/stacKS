import { create } from 'zustand';
export const useUiStore = create((set) => ({
    documentView: 'grid',
    setDocumentView: (documentView) => set({ documentView }),
}));
