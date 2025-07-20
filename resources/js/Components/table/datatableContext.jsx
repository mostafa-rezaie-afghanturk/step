import { useState, createContext, useContext } from 'react';
export const DatatableContext = createContext();
export function useDatatable() {
    return useContext(DatatableContext);
}
