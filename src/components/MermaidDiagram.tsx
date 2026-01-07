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
              primaryColor: "#cccccc",
              primaryTextColor: "#ffffff",
              primaryBorderColor: "#666666",
              lineColor: "#666666",
              secondaryColor: "#1a1a1a",
              tertiaryColor: "#000000",
              background: "#1a1a1a",
              mainBkg: "#1a1a1a",
              secondBkg: "#000000",
              textColor: "#ffffff",
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
      <div className="my-4 p-4 border-2 border-terminal-border rounded-lg bg-terminal-bg">
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

