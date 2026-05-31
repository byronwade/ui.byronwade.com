import { GradientAvatar } from "@/components/ui/gradient-avatar";

export default function Example() {
	return (
		<div className="flex items-end gap-4 p-6">
			<div className="flex flex-col items-center gap-2">
				<GradientAvatar seed="cosmos" size="sm" />
				<span className="text-xs text-muted-foreground">sm</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<GradientAvatar seed="cosmos" size="md" />
				<span className="text-xs text-muted-foreground">md</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<GradientAvatar seed="cosmos" size="lg" />
				<span className="text-xs text-muted-foreground">lg</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<GradientAvatar seed="cosmos" size="xl" />
				<span className="text-xs text-muted-foreground">xl</span>
			</div>
		</div>
	);
}
