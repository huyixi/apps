export const radii = {
	xs: 'rounded-xs',
	sm: 'rounded-sm',
	md: 'rounded-md',
	lg: 'rounded-lg',
	xl: 'rounded-xl',
	pill: 'rounded-full',
	panel: 'rounded-2xl'
} as const;

export const spacing = {
	xs: 'p-2',
	sm: 'p-3',
	md: 'p-4',
	lg: 'p-6',
	xl: 'p-8'
} as const;

export const shadows = {
	soft: 'shadow-sm',
	floating: 'shadow-[0_25px_65px_-25px_rgba(15,23,42,0.45)]'
} as const;

export const surface = {
	primary: 'bg-white text-neutral-800',
	muted: 'bg-neutral-50/80 text-neutral-500'
} as const;

export const border = {
	base: 'border border-border',
	subtle: 'border border-border/70'
} as const;

export const transitions = {
	soft: 'transition duration-200 ease-out'
} as const;

export type RadiusToken = keyof typeof radii;
export type SpacingToken = keyof typeof spacing;
export type ShadowToken = keyof typeof shadows;
