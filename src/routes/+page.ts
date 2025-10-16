import { error } from '@sveltejs/kit';
import { fetchApps } from '$lib/data/apps';
import type { AppItem } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent, url }) => {
	const parentData = await parent();
	const category = url.searchParams.get('category');

	let allApps: AppItem[];
	try {
		allApps = await fetchApps(fetch);
	} catch (exception) {
		const message =
			exception instanceof Error ? exception.message : 'Unable to load apps catalogue.';
		throw error(500, message);
	}

	const apps = allApps.filter((app) => {
		if (!category) return true;
		if (category === 'Mobile apps') {
			return app.platforms.includes('iOS apps') || app.platforms.includes('android apps');
		}
		return app.platforms.includes(category as any);
	});

	return {
		apps,
		meta: {
			title: parentData.siteTitle,
			description: parentData.siteDescription
		}
	};
};
