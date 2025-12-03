import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const titleVariants = cva("", {
    variants: {
        variant: {
            h1: "scroll-m-20 text-4xl font-extrabold tracking-tight text-balance",
            h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
            h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
            h4: "scroll-m-20 text-xl font-semibold tracking-tight",
        },
    },
})

function Title({
  className,
  variant,
  tag,
  asChild = false,
  ...props
}: React.ComponentProps<"h1"> &
  VariantProps<typeof titleVariants> & {
    asChild?: boolean
    tag?: VariantProps<typeof titleVariants>['variant']
  }) {
  const Comp = asChild ? Slot : tag ? tag : variant ? variant : "h1"

  return (
    <Comp
      data-slot="title"
      className={cn(titleVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Title, titleVariants }
