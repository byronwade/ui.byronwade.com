import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { animalName } from "@/lib/identity";

const seeds = ["cardinal-1", "mosaic-2", "tidal-3", "vortex-4"];

export default function Example() {
	return (
		<div className="flex flex-col gap-3 p-6">
			<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Anonymous visitors</p>
			<div className="flex flex-wrap gap-3">
				{seeds.map((seed) => (
					<div
						key={seed}
						className="flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1.5"
					>
						<GradientAvatar seed={seed} size="sm" />
						<span className="text-sm font-medium">{animalName(seed)}</span>
					</div>
				))}
			</div>
		</div>
	);
}
