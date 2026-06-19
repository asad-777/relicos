"use client";
import React, { useRef } from "react";
import { cva } from "class-variance-authority";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

import { cn } from "@/lib/utils"

const DEFAULT_SIZE = 60
const DEFAULT_MAGNIFICATION = 80
const DEFAULT_DISTANCE = 150
const DEFAULT_DISABLEMAGNIFICATION = false

const dockVariants = cva(
  "supports-backdrop-blur:bg-base-content/10 supports-backdrop-blur:dark:bg-base-content/10 mx-auto mt-8 flex h-[58px] w-max items-center justify-center gap-4 rounded-[var(--radius-widget)] border p-2 px-4 backdrop-blur-md"
)

const Dock = React.forwardRef((
  {
    className,
    children,
    iconSize = DEFAULT_SIZE,
    iconMagnification = DEFAULT_MAGNIFICATION,
    disableMagnification = DEFAULT_DISABLEMAGNIFICATION,
    iconDistance = DEFAULT_DISTANCE,
    direction = "middle",
    ...props
  },
  ref
) => {
  const localRef = useRef(null);
  React.useImperativeHandle(ref, () => localRef.current);

  const mouseX = useMotionValue(Infinity);
  const mouseY = useMotionValue(Infinity);

  const dockX = useTransform(mouseX, (val) => {
    if (val === Infinity) return 0;
    const bounds = localRef.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    const center = bounds.x + bounds.width / 2;
    const dist = val - center;
    if (Math.abs(dist) > 400) return 0;
    return (dist / 400) * 30;
  });

  const dockY = useTransform(mouseY, (val) => {
    if (val === Infinity) return 0;
    const bounds = localRef.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    const center = bounds.y + bounds.height / 2;
    const dist = val - center;
    // Check total distance to mouse to drop magnetism entirely if mouse is far
    if (Math.abs(dist) > 300) return 0;
    return (dist / 300) * 20;
  });

  const springX = useSpring(dockX, { stiffness: 150, damping: 15 });
  const springY = useSpring(dockY, { stiffness: 150, damping: 15 });

  const renderChildren = () => {
    return React.Children.map(children, (child) => {
      if (
        React.isValidElement(child) &&
        child.type === DockIcon
      ) {
        return React.cloneElement(child, {
          ...child.props,
          mouseX: mouseX,
          size: iconSize,
          magnification: iconMagnification,
          disableMagnification: disableMagnification,
          distance: iconDistance,
        });
      }
      return child
    });
  }

  return (
    <motion.div
      ref={localRef}
      style={{ x: springX, y: springY }}
      onMouseMove={(e) => { mouseX.set(e.pageX); mouseY.set(e.pageY); }}
      onMouseLeave={() => { mouseX.set(Infinity); mouseY.set(Infinity); }}
      {...props}
      className={cn(dockVariants({ className }), {
        "items-start": direction === "top",
        "items-center": direction === "middle",
        "items-end": direction === "bottom",
      })}>
      {renderChildren()}
    </motion.div>
  );
})

Dock.displayName = "Dock"

const DockIcon = ({
  size = DEFAULT_SIZE,
  magnification = DEFAULT_MAGNIFICATION,
  disableMagnification,
  distance = DEFAULT_DISTANCE,
  mouseX,
  className,
  children,
  ...props
}) => {
  const ref = useRef(null)
  const padding = 0
  const defaultMouseX = useMotionValue(Infinity)

  const distanceCalc = useTransform(mouseX ?? defaultMouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const targetSize = disableMagnification ? size : magnification

  const sizeTransform = useTransform(
    distanceCalc, 
    [-distance, -size, 0, size, distance], 
    [size, size * 1, targetSize, size * 1, size]
  )

  const scaleSize = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  return (
    <motion.div
      ref={ref}
      style={{ height: scaleSize, minWidth: scaleSize, padding }}
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-[var(--radius-widget)]",
        disableMagnification && "hover:bg-muted-foreground transition-colors",
        className
      )}
      {...props}>
      <div className="w-full h-full flex items-center justify-center">{children}</div>
    </motion.div>
  );
}

DockIcon.displayName = "DockIcon"

export { Dock, DockIcon, dockVariants }
