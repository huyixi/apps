import type { LayoutLoad } from './$types';
import { defaultLocale, getDictionary, isLocale } from '$lib/i18n';

export const load: LayoutLoad = async ({ url }) => {
	const langParam = url.searchParams.get('lang');
	const locale = isLocale(langParam) ? langParam : defaultLocale;
	const dictionary = getDictionary(locale);

	return {
		siteTitle: dictionary.siteTitle,
		siteDescription: dictionary.siteDescription,
		locale,
		dictionary
	};
};
