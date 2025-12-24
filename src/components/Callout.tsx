import { ReactNode } from "react";
import { Info, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface CalloutProps {
  title?: string;
  type?: "info" | "warning" | "error" | "success";
  children: ReactNode;
  className?: string;
}

export function Callout({ title, type = "info", className, children }: CalloutProps) {
  const iconMap = {
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
    success: CheckCircle,
  };

  // Map type to Alert variant
  const variantMap: Record<string, "default" | "destructive" | "warning" | "success" | "info"> = {
    info: "info",
    warning: "warning",
    error: "destructive",
    success: "success",
  };

  // Ensure type is valid, fallback to "info" if not
  const validType = type && type in iconMap ? type : "info";
  const Icon = iconMap[validType];
  const variant = variantMap[validType] || "info";

  return (
    <Alert variant={variant} className={cn("my-2 p-2 px-3 pb-1 flex items-center", className)}>
        <Icon size={18} />
        <div className="flex flex-col gap-1 ml-2">
            {title && <AlertTitle className="mb-0">{title}</AlertTitle>}
            <AlertDescription className="!mb-0 !pb-0">{children}</AlertDescription>
        </div>
    </Alert>
  );
}

