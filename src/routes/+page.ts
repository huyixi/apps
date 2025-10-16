import { error } from '@sveltejs/kit';
import { collectTags, fetchApps, parsePlatform } from '$lib/data/apps';
import type { AppItem } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url, parent }) => {
	const parentData = await parent();
	let allApps: AppItem[];
	try {
		allApps = await fetchApps(fetch);
	} catch (exception) {
		const message = exception instanceof Error ? exception.message : 'Unable to load apps catalogue.';
		throw error(500, message);
	}

	const platform = parsePlatform(url.searchParams.get('platform'));
	const apps = platform ? allApps.filter((app) => app.platforms.includes(platform)) : allApps;

	const tags = collectTags(allApps, parentData.locale);

	return {
		apps,
		selectedPlatform: platform,
		tags,
		meta: {
			title: parentData.siteTitle,
			description: parentData.siteDescription
		}
	};
};
