"use client"

import { Star } from "lucide-react"

interface RatingProps {
  value: number
  onChange?: (value: number) => void
  readonly?: boolean
  size?: "sm" | "md" | "lg"
  showValue?: boolean
}

export default function Rating({
  value,
  onChange,
  readonly = false,
  size = "md",
  showValue = false,
}: RatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          disabled={readonly}
          className={`${readonly ? "cursor-default" : "cursor-pointer transition-transform hover:scale-110"}`}
        >
          <Star
            className={`${sizeClasses[size]} ${
              star <= value
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted-foreground"
            }`}
          />
        </button>
      ))}
      {showValue && (
        <span className="ml-2 text-sm font-medium text-foreground">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  )
}
