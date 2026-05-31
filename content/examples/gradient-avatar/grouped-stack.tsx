import { GradientAvatar } from "@/components/ui/gradient-avatar";

const participants = ["atlas-a", "beacon-b", "cedar-c", "dune-d", "echo-e"];
const overflow = 8;

export default function Example() {
	return (
		<div className="flex flex-col gap-6 p-6">
			{/* Overlapping avatar stack */}
			<div>
				<p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Collaborators</p>
				<div className="flex items-center">
					{participants.map((seed, i) => (
						<span
							key={seed}
							className="inline-block rounded-full ring-2 ring-background"
							style={{ marginLeft: i === 0 ? 0 : "-8px", zIndex: participants.length - i }}
						>
							<GradientAvatar seed={seed} size="md" />
						</span>
					))}
					<span
						className="inline-flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold ring-2 ring-background"
						style={{ marginLeft: "-8px" }}
					>
						+{overflow}
					</span>
				</div>
			</div>

			{/* Flat row with names */}
			<div>
				<p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Recently Active</p>
				<div className="flex gap-4">
					{participants.slice(0, 3).map((seed) => (
						<div key={seed} className="flex flex-col items-center gap-1.5">
							<GradientAvatar seed={seed} size="lg" />
							<span className="text-xs text-muted-foreground capitalize">{seed.split("-")[0]}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
