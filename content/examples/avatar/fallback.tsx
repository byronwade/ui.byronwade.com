import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function Example() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <p className="text-sm text-muted-foreground">
        When the image fails to load, the fallback content is shown.
      </p>

      <div className="flex items-center gap-4">
        {/* Broken image URL, fallback with initials */}
        <Avatar>
          <AvatarImage src="/this-image-does-not-exist.jpg" alt="Alex Reed" />
          <AvatarFallback>AR</AvatarFallback>
        </Avatar>

        {/* No image at all, fallback only */}
        <Avatar>
          <AvatarFallback>MJ</AvatarFallback>
        </Avatar>

        {/* Single initial */}
        <Avatar>
          <AvatarFallback>T</AvatarFallback>
        </Avatar>

        {/* Custom fallback with an icon */}
        <Avatar>
          <AvatarFallback>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
