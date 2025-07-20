import { usePage } from '@inertiajs/react';

export const usePermission = () => {
    const {
        props: {
            auth: { permissions },
        },
    } = usePage();

    const hasPermission = permission => permissions.includes(permission);

    return { hasPermission };
};
