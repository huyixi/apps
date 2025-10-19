import type { Platform } from './types';

export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];

export interface UiDictionary {
	locale: Locale;
	siteTitle: string;
	siteDescription: string;
	tagline: string;
	nav: {
		menu: string;
		closeMenu: string;
		about: string;
		rss: string;
		rssDescription: string;
		bookmark: string;
		bookmarkDescription: string;
		bookmarkNotice: string;
		bookmarkFallback: string;
		themeToggle: string;
		language: string;
		languageNames: Record<Locale, string>;
		skipToContent: string;
	};
	sidebar: {
		title: string;
		filtersHeading: string;
		linksHeading: string;
		platformFilters: Record<'all' | Platform, string>;
		about: string;
		github: string;
	};
	card: {
		openDetail: string;
		website: string;
		repository: string;
		updatedPrefix: string;
	};
	list: {
		empty: string;
		countLabel: string;
		filteredBy: string;
		allPlatforms: string;
	};
	detail: {
		summary: string;
		platforms: string;
		tags: string;
		website: string;
		repo: string;
		similar: string;
		similarEmpty: string;
		share: string;
		shareCopy: string;
		shareCopied: string;
		shareFailed: string;
	};
	tagsPage: {
		heading: string;
		description: string;
	};
	aboutPage: {
		title: string;
		intro: string;
		sections: Array<{
			title: string;
			points: string[];
		}>;
	};
	platformLabels: Record<Platform, string>;
}

const dictionaries: Record<Locale, UiDictionary> = {
	en: {
		locale: 'en',
		siteTitle: "huyixi's Apps",
		siteDescription:
			'Curated app stack featuring minimalist, high-signal tools for building digital products.',
		tagline: 'Minimalist catalogue of app building blocks and product stacks.',
		nav: {
			menu: 'Menu',
			closeMenu: 'Close menu',
			about: 'About',
			rss: 'RSS',
			rssDescription: 'Subscribe via RSS',
			bookmark: '⌘+D to Bookmark',
			bookmarkDescription: 'Save this catalogue for quick reference',
			bookmarkNotice: 'Link copied — press Ctrl + D (⌘ + D on macOS) to bookmark.',
			bookmarkFallback: 'Press Ctrl + D (⌘ + D on macOS) to add a bookmark manually.',
			themeToggle: 'Toggle theme',
			language: 'Language',
			languageNames: {
				en: 'EN',
				zh: '中文'
			},
			skipToContent: 'Skip to content'
		},
		sidebar: {
			title: 'Stacks',
			filtersHeading: 'Platforms',
			linksHeading: 'Links',
			platformFilters: {
				all: 'All',
				'Web apps': 'Web',
				'iOS apps': 'iOS',
				'android apps': 'Android',
				'desktop apps': 'Desktop'
			},
			about: 'About the project',
			github: 'GitHub'
		},
		card: {
			openDetail: 'View details',
			website: 'Website',
			repository: 'Repository',
			updatedPrefix: 'Updated'
		},
		list: {
			empty: 'No apps match this view yet.',
			countLabel: 'apps',
			filteredBy: 'Filtered by',
			allPlatforms: 'All platforms'
		},
		detail: {
			summary: 'Overview',
			platforms: 'Platforms',
			tags: 'Tags',
			website: 'Website',
			repo: 'Repository',
			similar: 'Similar apps',
			similarEmpty: 'No similar apps surfaced yet.',
			share: 'Share',
			shareCopy: 'Copy link',
			shareCopied: 'Link copied to clipboard.',
			shareFailed: 'Sharing is not supported in this browser.'
		},
		tagsPage: {
			heading: 'Apps tagged',
			description: 'Curated tools filed under'
		},
		aboutPage: {
			title: 'About this catalogue',
			intro:
				'This showcase follows the App Stacks format — pairing a left-hand platform filter with a right-hand catalogue so you can scan quickly and dive deeper when something resonates.',
			sections: [
				{
					title: 'Principles',
					points: [
						'Border-first interface: segments use lines, not shadows.',
						'Minimal typography: small type sizes with clear hierarchy.',
						'Accessible by default: keyboard, focus styles, and semantic regions.'
					]
				},
				{
					title: 'Why it exists',
					points: [
						'Help founders compare lightweight tools across platforms.',
						'Showcase product stacks with just enough context.',
						'Provide a starting point for future API-backed catalogues.'
					]
				}
			]
		},
		platformLabels: {
			'Web apps': 'Web apps',
			'iOS apps': 'iOS apps',
			'android apps': 'Android apps',
			'desktop apps': 'Desktop apps'
		}
	},
	zh: {
		locale: 'zh',
		siteTitle: 'huyixi 的应用栈',
		siteDescription: '面向产品团队的精选工具清单，聚焦极简而高价值的数字产品组件。',
		tagline: '极简「应用栈」陈列：快速筛选、深入了解每个工具的独特之处。',
		nav: {
			menu: '菜单',
			closeMenu: '关闭菜单',
			about: '关于',
			rss: 'RSS',
			rssDescription: '订阅 RSS',
			bookmark: '收藏',
			bookmarkDescription: '把这个清单加入浏览器书签',
			bookmarkNotice: '链接已复制 —— 按 Ctrl + D（macOS 上按 ⌘ + D）收藏。',
			bookmarkFallback: '请手动按 Ctrl + D 或 ⌘ + D 来添加书签。',
			themeToggle: '切换主题',
			language: '语言',
			languageNames: {
				en: 'EN',
				zh: '中文'
			},
			skipToContent: '跳转到正文'
		},
		sidebar: {
			title: '应用栈',
			filtersHeading: '平台筛选',
			linksHeading: '更多',
			platformFilters: {
				all: '全部',
				'Web apps': 'Web',
				'iOS apps': 'iOS',
				'android apps': 'Android',
				'desktop apps': '桌面端'
			},
			about: '项目简介',
			github: 'GitHub'
		},
		card: {
			openDetail: '查看详情',
			website: '官网',
			repository: '仓库',
			updatedPrefix: '更新'
		},
		list: {
			empty: '暂无符合条件的应用。',
			countLabel: '个应用',
			filteredBy: '筛选',
			allPlatforms: '全部平台'
		},
		detail: {
			summary: '概要',
			platforms: '平台',
			tags: '标签',
			website: '官网',
			repo: '仓库',
			similar: '相似应用',
			similarEmpty: '还没有找到相似的应用。',
			share: '分享',
			shareCopy: '复制链接',
			shareCopied: '链接已复制到剪贴板。',
			shareFailed: '当前浏览器暂不支持分享功能。'
		},
		tagsPage: {
			heading: '标签',
			description: '属于此标签的工具'
		},
		aboutPage: {
			title: '关于本项目',
			intro:
				'站点遵循 App Stacks 展示方式：左栏即时筛选，右栏按“线框分割”风格陈列，便于快速横向比较。',
			sections: [
				{
					title: '设计原则',
					points: [
						'以边框和留白建立层级，尽量避免阴影。',
						'紧凑的排版比例，强调重要信息的对比。',
						'默认可访问：语义标签、键盘焦点状态、无障碍支持。'
					]
				},
				{
					title: '项目意义',
					points: [
						'帮助团队查找轻量级应用组合。',
						'为未来接入 API 数据的目录做基础。',
						'展示多语言界面与 SvelteKit + Tailwind 的结合。'
					]
				}
			]
		},
		platformLabels: {
			'Web apps': 'Web 应用',
			'iOS apps': 'iOS 应用',
			'android apps': 'Android 应用',
			'desktop apps': '桌面应用'
		}
	}
};

const dateFormatters: Record<Locale, Intl.DateTimeFormat> = {
	en: new Intl.DateTimeFormat('en', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	}),
	zh: new Intl.DateTimeFormat('zh-CN', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric'
	})
};

export const defaultLocale: Locale = 'en';

export const isLocale = (value: string | null | undefined): value is Locale =>
	!!value && locales.includes(value as Locale);

export const getDictionary = (locale: Locale): UiDictionary =>
	dictionaries[locale] ?? dictionaries.en;

export const formatUpdatedAt = (locale: Locale, iso?: string) => {
	if (!iso) return '';
	try {
		const date = new Date(iso);
		if (Number.isNaN(date.getTime())) return iso;
		const formatted = dateFormatters[locale]?.format(date) ?? date.toISOString().slice(0, 10);
		const prefix = dictionaries[locale]?.card.updatedPrefix ?? dictionaries.en.card.updatedPrefix;
		return `${prefix} ${formatted}`;
	} catch {
		return iso;
	}
};
