"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CalculatorSchema {
  title: string;
  description?: string;
  fields: {
    name: string;
    label: string;
    type: 'number' | 'select' | 'text';
    unit?: string;
    options?: string[];
    defaultValue?: string | number;
  }[];
  formulas: {
    materialName: string;
    formula: string; // JavaScript expression
    unit: string;
    description?: string;
  }[];
}

export interface CalculationResult {
  material: string;
  quantity: number;
  unit: string;
  cost?: number;
  description?: string;
}

export interface Calculation {
  id: string;
  title: string;
  date: string;
  inputs: Record<string, string | number>;
  results: CalculationResult[];
  aiSchema: CalculatorSchema;
}

interface CalculationContextType {
  calculations: Calculation[];
  addCalculation: (calculation: Omit<Calculation, 'id'>) => void;
  deleteCalculation: (id: string) => void;
  getCalculationById: (id: string) => Calculation | undefined;
  clearCalculations: () => void;
}

const CalculationContext = createContext<CalculationContextType | undefined>(undefined);

export const useCalculations = () => {
  const context = useContext(CalculationContext);
  if (context === undefined) {
    throw new Error('useCalculations must be used within a CalculationProvider');
  }
  return context;
};

interface CalculationProviderProps {
  children: ReactNode;
}

export const CalculationProvider: React.FC<CalculationProviderProps> = ({ children }) => {
  const [calculations, setCalculations] = useState<Calculation[]>([]);

  // Load calculations from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('faktix-calculations');
      if (saved) {
        try {
          setCalculations(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading calculations:', error);
        }
      }
    }
  }, []);

  // Save calculations to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && calculations.length > 0) {
      localStorage.setItem('faktix-calculations', JSON.stringify(calculations));
    }
  }, [calculations]);

  const addCalculation = (calculation: Omit<Calculation, 'id'>) => {
    const newCalculation: Calculation = {
      ...calculation,
      id: `calc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setCalculations(prev => [newCalculation, ...prev]);
  };

  const deleteCalculation = (id: string) => {
    setCalculations(prev => prev.filter(calc => calc.id !== id));
  };

  const getCalculationById = (id: string) => {
    return calculations.find(calc => calc.id === id);
  };

  const clearCalculations = () => {
    setCalculations([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('faktix-calculations');
    }
  };

  const value: CalculationContextType = {
    calculations,
    addCalculation,
    deleteCalculation,
    getCalculationById,
    clearCalculations,
  };

  return (
    <CalculationContext.Provider value={value}>
      {children}
    </CalculationContext.Provider>
  );
};

