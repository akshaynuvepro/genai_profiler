import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { cn } from '@/lib/utils';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

// Initialize mermaid with custom config
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#3b82f6',
    primaryTextColor: '#1e293b',
    primaryBorderColor: '#2563eb',
    lineColor: '#64748b',
    secondaryColor: '#10b981',
    tertiaryColor: '#f59e0b',
    background: '#ffffff',
    mainBkg: '#f8fafc',
    secondBkg: '#f1f5f9',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif'
  },
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
    padding: 20
  },
  securityLevel: 'loose'
});

export function MermaidDiagram({ chart, className }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current || renderedRef.current) return;

      try {
        // Generate unique ID for the diagram
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

        // Clear previous content
        containerRef.current.innerHTML = '';

        // Render mermaid diagram
        const { svg } = await mermaid.render(id, chart);

        // Inject the SVG
        containerRef.current.innerHTML = svg;

        renderedRef.current = true;
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full p-4 text-sm text-muted-foreground">
              <p>Unable to render diagram</p>
            </div>
          `;
        }
      }
    };

    renderDiagram();

    // Reset rendered flag when chart changes
    return () => {
      renderedRef.current = false;
    };
  }, [chart]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex items-center justify-center w-full overflow-auto bg-muted/20 rounded-lg border border-border p-4",
        className
      )}
    />
  );
}
