export const BUTTON_TYPES = Object.freeze({
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    TERTIARY: 'tertiary',
    DANGER: 'danger',
    SUCCESS: 'success',
});

export const BUTTON_SIZES = Object.freeze({
    SMALL: 'sm',
    MEDIUM: 'md',
    LARGE: 'lg',
});

export const COMMON_BUTTON_STYLES = Object.freeze({
    base: 'inline-flex items-center justify-center rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto transition-all duration-250',
    rounded:
        'flex items-center justify-center w-7 h-7 rounded-full ease-in-out shadow-sm border outline-none focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-250 disabled:opacity-40 disabled:cursor-not-allowed',
    sizes: {
        [BUTTON_SIZES.SMALL]: 'px-3 py-1.5 text-sm font-medium',
        [BUTTON_SIZES.MEDIUM]: 'px-4 py-2 text-sm sm:text-base font-medium',
        [BUTTON_SIZES.LARGE]: 'px-6 py-2.5 text-base sm:text-lg font-medium',
    },
    variants: {
        [BUTTON_TYPES.PRIMARY]: {
            solid: 'bg-brand text-white border-transparent hover:bg-brand/80 focus:ring-brand',
            outline:
                'bg-transparent text-brand border-brand hover:bg-brand hover:text-white focus:ring-brand',
        },
        [BUTTON_TYPES.SECONDARY]: {
            solid: 'bg-slate-900 text-gray-100 border-gray-300 hover:bg-slate-800 focus:ring-slate-800',
            outline:
                'bg-transparent text-slate-900 border-slate-800 hover:bg-slate-800 hover:text-gray-100 focus:ring-gray-800',
        },
        [BUTTON_TYPES.DANGER]: {
            solid: 'bg-red-500 text-white border-transparent hover:bg-red-400 focus:ring-red-400',
            outline:
                'bg-transparent text-red-500 border-red-600 hover:bg-red-500 hover:text-white focus:ring-red-400',
        },
        [BUTTON_TYPES.SUCCESS]: {
            solid: 'bg-green-500 text-white border-transparent hover:bg-green-400 focus:ring-green-400',
            outline:
                'bg-transparent text-green-500 border-green-600 hover:bg-green-500 hover:text-white focus:ring-green-400',
        },
    },
    disabled: 'bg-gray-400 text-white cursor-not-allowed opacity-80',
});
