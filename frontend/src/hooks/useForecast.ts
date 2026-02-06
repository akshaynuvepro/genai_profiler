import { useState, useMemo, useCallback } from 'react';
import { ForecastParams, ForecastResult } from '@/types/dashboard';
import { calculateROI } from '@/data/mockData';

const DEFAULT_PARAMS: ForecastParams = {
  trafficVolume: 100000,
  implementationPercentage: 100,
  improvementFactor: 1.0
};

export function useForecast(initialParams: Partial<ForecastParams> = {}) {
  const [params, setParams] = useState<ForecastParams>({
    ...DEFAULT_PARAMS,
    ...initialParams
  });

  const updateParam = useCallback(<K extends keyof ForecastParams>(
    key: K,
    value: ForecastParams[K]
  ) => {
    setParams(prev => ({ ...prev, [key]: value }));
  }, []);

  const results = useMemo(() => {
    const roi = calculateROI(params);
    
    return {
      best: {
        monthlySavings: roi.bestCase,
        qualityImprovement: roi.qualityImprovement * 1.3,
        roiMonths: Math.max(0.5, roi.roiMonths * 0.7),
        scenario: 'best' as const
      },
      expected: {
        monthlySavings: roi.expectedCase,
        qualityImprovement: roi.qualityImprovement,
        roiMonths: roi.roiMonths,
        scenario: 'expected' as const
      },
      worst: {
        monthlySavings: roi.worstCase,
        qualityImprovement: roi.qualityImprovement * 0.7,
        roiMonths: Math.min(24, roi.roiMonths * 1.5),
        scenario: 'worst' as const
      }
    };
  }, [params]);

  const projectionData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const implementationCost = 15000;
    
    return months.map(month => ({
      month,
      best: month * results.best.monthlySavings - implementationCost,
      expected: month * results.expected.monthlySavings - implementationCost,
      worst: month * results.worst.monthlySavings - implementationCost
    }));
  }, [results]);

  return {
    params,
    setParams,
    updateParam,
    results,
    projectionData
  };
}

export type UseForecastReturn = ReturnType<typeof useForecast>;
