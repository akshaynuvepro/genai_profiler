import { useState, useCallback, useMemo } from 'react';
import { Persona } from '@/types/dashboard';
import { personaEmphasis } from '@/data/mockData';

export function usePersona(defaultPersona: Persona = 'cto') {
  const [persona, setPersona] = useState<Persona>(defaultPersona);

  const togglePersona = useCallback((newPersona: Persona) => {
    setPersona(newPersona);
  }, []);

  const emphasis = useMemo(() => personaEmphasis[persona], [persona]);

  const isPrimarySectionfor = useCallback((sectionId: string) => {
    return emphasis.primarySections.includes(sectionId);
  }, [emphasis]);

  const isHiddenSection = useCallback((sectionId: string) => {
    return emphasis.hiddenSections.includes(sectionId);
  }, [emphasis]);

  const getMetricPriority = useCallback((metricName: string): 'high' | 'medium' | 'low' => {
    if (emphasis.metricFocus.includes(metricName)) return 'high';
    return 'medium';
  }, [emphasis]);

  return {
    persona,
    setPersona: togglePersona,
    emphasis,
    isPrimarySection: isPrimarySectionfor,
    isHiddenSection,
    getMetricPriority,
    highlightColor: emphasis.highlightColor
  };
}

export type UsePersonaReturn = ReturnType<typeof usePersona>;
