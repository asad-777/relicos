"use client";
import React, { useState } from "react"

import { cn } from "@/lib/utils"

/**
 * The InteractiveGridPattern component.
 *
 * @see InteractiveGridPatternProps for the props interface.
 * @returns A React component.
 */
export function InteractiveGridPattern({
  width = 40,
  height = 40,
  squares = [24, 24],
  className,
  squaresClassName,
  ...props
}) {
  const [horizontal, vertical] = squares
  const [activeSquares, setActiveSquares] = useState(new Set())

  // Constantly moving/twinkling effect requested by user
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveSquares((prev) => {
        const next = new Set(prev)
        // Add a random square
        const randomSquare = Math.floor(Math.random() * (horizontal * vertical))
        next.add(randomSquare)
        
        // Remove a random square to keep it sparse
        if (next.size > 15) {
          const items = Array.from(next)
          next.delete(items[Math.floor(Math.random() * items.length)])
        }
        return next
      })
    }, 150)
    return () => clearInterval(interval)
  }, [horizontal, vertical])

  return (
    <svg
      width={width * horizontal}
      height={height * vertical}
      className={cn("absolute inset-0 h-full w-full border border-base-content/10", className)}
      {...props}>
      {Array.from({ length: horizontal * vertical }).map((_, index) => {
        const x = (index % horizontal) * width
        const y = Math.floor(index / horizontal) * height
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={width}
            height={height}
            className={cn(
              "stroke-base-content/10 transition-all duration-300 ease-in-out not-[&:hover]:duration-1000",
              activeSquares.has(index) ? "fill-base-content/20" : "fill-transparent",
              squaresClassName
            )}
            onMouseEnter={() => setActiveSquares(prev => new Set(prev).add(index))}
            onMouseLeave={() => {}} />
        );
      })}
    </svg>
  );
}
