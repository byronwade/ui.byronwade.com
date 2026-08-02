import { CinemaTile, CinemaLink } from "@/components/cinematic/tile"
import { cinemaStills } from "@/lib/media"

function TileFocus() {
  return (
    <CinemaTile
      id="focus"
      tone="theater"
      align="center"
      image={{
        src: cinemaStills.focus.src,
        alt: cinemaStills.focus.alt,
        veil: "soft",
        objectPosition: "center center",
      }}
    >
      <p className="text-[21px] font-medium tracking-tight text-dock-foreground">
        Accent
      </p>
      <h2 className="mt-2 text-[clamp(2.25rem,6vw,4.25rem)] font-medium leading-[1.06] tracking-[-0.04em] text-dock-foreground">
        One color that leads.
      </h2>
      <p className="mx-auto mt-4 max-w-sm text-[19px] leading-snug tracking-tight text-dock-foreground/70 md:text-[21px]">
        Deep ink-teal for action and selection. Everything else stays neutral.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <CinemaLink href="/theme" className="text-dock-foreground">
          See the brand
        </CinemaLink>
        <CinemaLink href="#agents" className="text-dock-foreground">
          For agents
        </CinemaLink>
      </div>
    </CinemaTile>
  )
}

export { TileFocus }
