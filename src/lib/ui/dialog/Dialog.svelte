<script lang="ts">
	const props = $props<{
		open: boolean;
		label: string;
		panelClass?: string;
		onClose?: () => void;
	}>();

	const handleBackdropClick = () => {
		props.onClose?.();
	};
</script>

{#if props.open}
	<div class="fixed inset-0 z-40 flex items-center justify-center bg-neutral-950/60 backdrop-blur-sm">
		<div class="absolute inset-0" role="presentation" onclick={handleBackdropClick}></div>
		<div
			role="dialog"
			aria-modal="true"
			aria-label={props.label}
			class={`relative z-10 flex max-h-[calc(100vh-3rem)] w-[min(26rem,_calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border/70 bg-white shadow-[0_25px_65px_-25px_rgba(15,23,42,0.45)] ${props.panelClass ?? ''}`}
		>
			<slot />
		</div>
	</div>
{/if}
