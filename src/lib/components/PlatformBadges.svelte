<script lang="ts">
	import type { Platform } from '$lib/types';

	export let platforms: Platform[] = [];
	export let labels: Record<Platform, string> = {
		'Web apps': 'Web apps',
		'iOS apps': 'iOS apps',
		'android apps': 'android apps',
		'desktop apps': 'desktop apps'
	};
</script>

{#if platforms?.length}
	<ul class="flex flex-wrap gap-1">
		{#each platforms as platform}
			<li class="chip" data-platform={platform}>
				<span>{labels[platform] ?? platform}</span>
			</li>
		{/each}
	</ul>
{/if}
