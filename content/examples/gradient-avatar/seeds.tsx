import { GradientAvatar } from "@/components/ui/gradient-avatar";

const seeds = [
	"atlas", "beacon", "cedar", "dune", "echo",
	"fable", "grove", "haven", "iris", "jade",
	"kestrel", "lotus", "mosaic", "nova", "orbit",
	"prism", "quill", "river", "slate", "tide",
];

export default function Example() {
	return (
		<div className="flex flex-wrap gap-3 p-6">
			{seeds.map((seed) => (
				<GradientAvatar key={seed} seed={seed} size="lg" />
			))}
		</div>
	);
}
