<script lang="ts">
	const props = $props<{ images?: string[]; interval?: number; autoplay?: boolean }>();
	const slides = $derived(
		(props.images ?? []).filter(
			(source: string | undefined): source is string => Boolean(source)
		)
	);
	const interval = $derived(props.interval ?? 4000);
	const autoplay = $derived(props.autoplay ?? true);
	let index = $state(0);
	let timer: ReturnType<typeof setInterval> | null = null;

	const clearTimer = () => {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	};

	const goTo = (next: number) => {
		if (!slides.length) return;
		index = (next + slides.length) % slides.length;
	};

	const goPrevious = () => {
		goTo(index - 1);
	};

	const goNext = () => {
		goTo(index + 1);
	};

	$effect(() => {
		if (!slides.length) {
			index = 0;
			clearTimer();
			return;
		}

		if (index >= slides.length) {
			index = 0;
		}
	});

	$effect(() => {
		clearTimer();
		const shouldAutoplay = autoplay && slides.length > 1;
		if (!shouldAutoplay) return;

		timer = setInterval(() => {
			goNext();
		}, interval);

		return () => {
			clearTimer();
		};
	});

	const slideLabel = (position: number) => `Slide ${position} of ${slides.length}`;
</script>

<div class="relative overflow-hidden rounded-sm border border-border bg-white dark:border-border-dark dark:bg-neutral-950/40">
	{#if slides.length}
		<div class="aspect-[16/9]">
			<div
				class="flex h-full w-full transition-transform duration-500 ease-out"
				style={`transform: translateX(-${index * 100}%);`}
			>
				{#each slides as source, slideIndex}
					<div
						class="flex h-full w-full flex-shrink-0 items-center justify-center bg-neutral-100 dark:bg-neutral-900/60"
					>
						<img
							src={source}
							alt={slideLabel(slideIndex + 1)}
							class="h-full w-full object-cover"
							loading="lazy"
							decoding="async"
						/>
					</div>
				{/each}
			</div>
		</div>

		{#if slides.length > 1}
			<button
				type="button"
				class="group absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white/80 text-neutral-600 transition-colors hover:text-accent focus-visible:outline-hidden dark:border-border-dark dark:bg-neutral-950/80 dark:text-neutral-300"
				onclick={goPrevious}
				aria-label="Previous slide"
			>
				<span aria-hidden="true">‹</span>
			</button>
			<button
				type="button"
				class="group absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white/80 text-neutral-600 transition-colors hover:text-accent focus-visible:outline-hidden dark:border-border-dark dark:bg-neutral-950/80 dark:text-neutral-300"
				onclick={goNext}
				aria-label="Next slide"
			>
				<span aria-hidden="true">›</span>
			</button>
			<div class="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
				{#each slides as _, dotIndex}
					<button
						type="button"
						class={`h-2.5 w-2.5 rounded-full border border-transparent transition-colors ${
							dotIndex === index
								? 'bg-neutral-700 dark:bg-neutral-200'
								: 'bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-600'
						}`}
						onclick={() => goTo(dotIndex)}
						aria-label={slideLabel(dotIndex + 1)}
						aria-pressed={dotIndex === index}
					></button>
				{/each}
			</div>
		{/if}
	{:else}
		<div
			class="flex aspect-[16/9] w-full items-center justify-center bg-neutral-100 text-xs text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400"
			aria-label="No preview images"
		>
			No previews available
		</div>
	{/if}
</div>
