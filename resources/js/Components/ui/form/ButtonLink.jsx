import { Link } from '@inertiajs/react';
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
    BUTTON_SIZES,
    BUTTON_TYPES,
    COMMON_BUTTON_STYLES,
} from '@/Components/Constants/buttons';

const ButtonLink = ({
    href,
    buttonType = BUTTON_TYPES.PRIMARY,
    children,
    icon,
    size = BUTTON_SIZES.MEDIUM,
    className,
    outline = false,
    ...props
}) => {
    const buttonClasses = clsx(
        COMMON_BUTTON_STYLES.base,
        COMMON_BUTTON_STYLES.sizes[size],
        COMMON_BUTTON_STYLES.variants[buttonType][
            outline ? 'outline' : 'solid'
        ],
        className
    );

    return (
        <Link href={href} className={buttonClasses} {...props}>
            {icon && <span className="me-2 text-xl">{icon}</span>}
            {children}
        </Link>
    );
};

ButtonLink.propTypes = {
    href: PropTypes.string.isRequired,
    buttonType: PropTypes.oneOf(Object.values(BUTTON_TYPES)),
    children: PropTypes.node,
    icon: PropTypes.node,
    size: PropTypes.oneOf(Object.values(BUTTON_SIZES)),
    className: PropTypes.string,
    outline: PropTypes.bool,
};

export default ButtonLink;
