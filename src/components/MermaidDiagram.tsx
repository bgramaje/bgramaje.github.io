import { useEffect, useRef, useState } from "react";

interface MermaidDiagramProps {
  chart: string;
}

let mermaidInitialized = false;

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    if (!chart) return;

    const renderMermaid = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const mermaid = (await import("mermaid")).default;

        // Initialize only once globally
        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            theme: "dark",
            themeVariables: {
              primaryColor: "#5b9bd1",
              primaryTextColor: "#d4d4e4",
              primaryBorderColor: "#4a6fa5",
              lineColor: "#4a6fa5",
              secondaryColor: "#151a25",
              tertiaryColor: "#0a0f1a",
              background: "#151a25",
              mainBkg: "#151a25",
              secondBkg: "#0a0f1a",
              textColor: "#d4d4e4",
            },
          });
          mermaidInitialized = true;
        }

        // Use render function to get SVG directly
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const { svg: renderedSvg } = await mermaid.render(id, chart.trim());
        
        setSvg(renderedSvg);
        setError(null);
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError("Failed to render diagram");
        setSvg(null);
      }
    };

    setError(null);
    setSvg(null);
    renderMermaid();
  }, [chart]);

  if (error) {
    return (
      <div className="my-4 p-4 border-2 border-terminal-border rounded bg-terminal-bg">
        <p className="text-terminal-error text-sm">{error}</p>
        <pre className="text-terminal-muted text-xs mt-2 overflow-x-auto whitespace-pre-wrap">{chart}</pre>
      </div>
    );
  }

  return (
    <div className="my-4 overflow-x-auto flex justify-center">
      {svg ? (
        <div 
          ref={mermaidRef} 
          className="mermaid"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="text-terminal-muted text-xs">Loading diagram...</div>
      )}
    </div>
  );
}

