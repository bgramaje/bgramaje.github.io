"use client";

import { useEffect, useRef } from "react";
import type React from "react";
import { useInView } from "motion/react";
import { annotate } from "rough-notation";

type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket";

interface HighlighterProps {
  children: React.ReactNode;
  action?: AnnotationAction;
  color?: string;
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number;
  multiline?: boolean;
  isView?: boolean;
}

export function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc",
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const annotationRef = useRef<ReturnType<typeof annotate> | null>(null);
  const showTimeoutRef = useRef<number | undefined>(undefined);

  const isInView = useInView(elementRef, {
    once: true,
    margin: "-10%",
  });

  const shouldShow = !isView || isInView;

  useEffect(() => {
    if (!shouldShow) return;

    const element = elementRef.current;
    if (!element) return;

    const annotation = annotate(element, {
      type: action,
      color,
      strokeWidth,
      animationDuration,
      iterations,
      padding,
      multiline,
    });
    annotationRef.current = annotation;

    // Esperar a que el layout esté resuelto antes de medir y dibujar
    let cancelled = false;
    let timeoutId: number | undefined;
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;
        timeoutId = window.setTimeout(() => {
          if (cancelled) return;
          if (elementRef.current) annotation.show();
        }, 80);
      });
    });

    // Ocultar el highlight cuando el texto sale de la vista; mostrarlo cuando vuelve.
    // Así el SVG no se queda visible/arrastrado por todo el overflow.
    // Al volver a mostrar, esperamos un frame para que el layout/scroll esté estable
    // y rough-notation mida la posición correcta de la palabra.
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const ann = annotationRef.current;
        if (!entry || !ann) return;
        if (entry.isIntersecting) {
          if (showTimeoutRef.current != null) window.clearTimeout(showTimeoutRef.current);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              showTimeoutRef.current = window.setTimeout(() => {
                showTimeoutRef.current = undefined;
                if (annotationRef.current) annotationRef.current.show();
              }, 50);
            });
          });
        } else {
          if (showTimeoutRef.current != null) {
            window.clearTimeout(showTimeoutRef.current);
            showTimeoutRef.current = undefined;
          }
          ann.hide();
        }
      },
      { root: null, rootMargin: "0px", threshold: 0 }
    );
    intersectionObserver.observe(element);

    const resizeObserver = new ResizeObserver(() => {
      if (annotationRef.current) {
        annotationRef.current.hide();
        annotationRef.current.show();
      }
    });
    resizeObserver.observe(element);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      if (timeoutId != null) window.clearTimeout(timeoutId);
      if (showTimeoutRef.current != null) window.clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = undefined;
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      annotation.remove();
      annotationRef.current = null;
    };
  }, [
    shouldShow,
    action,
    color,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
  ]);

  return (
    <span
      ref={elementRef}
      className="relative inline-block w-fit max-w-full bg-transparent"
    >
      {children}
    </span>
  );
}
