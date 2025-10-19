import { error } from '@sveltejs/kit';
import { fetchApps, findBySlug } from '$lib/data/apps';
import type { AppItem } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params, parent }) => {
	const parentData = await parent();
	let allApps: AppItem[];

	try {
		allApps = await fetchApps(fetch);
	} catch (exception) {
		const message =
			exception instanceof Error ? exception.message : 'Unable to load apps catalogue.';
		throw error(500, message);
	}

	const app = findBySlug(allApps, params.slug);
	if (!app) {
		throw error(404, 'App not found.');
	}

	return {
		app,
		meta: {
			title: `${app.name} · ${parentData.siteTitle}`,
			description: app.summary
		}
	};
};
