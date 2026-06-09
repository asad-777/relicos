import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-none border-2 border-base-content bg-clip-padding font-heading text-sm uppercase whitespace-nowrap transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-[4px_4px_0px_var(--color-base-content)] outline-none select-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-content hover:bg-primary/80",
        outline:
          "bg-base-100 hover:bg-base-200 text-base-content",
        secondary:
          "bg-secondary text-secondary-content hover:bg-secondary/80",
        ghost:
          "border-transparent shadow-none hover:border-base-content hover:shadow-[4px_4px_0px_var(--color-base-content)] hover:bg-base-200",
        destructive:
          "bg-error text-error-content hover:bg-error/80",
        link: "border-transparent shadow-none underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
