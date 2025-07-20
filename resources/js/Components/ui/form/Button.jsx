import { Button as AppButton } from '@headlessui/react';
import React from 'react';
import clsx from 'clsx';
import ReactLoading from 'react-loading';
import {
    BUTTON_SIZES,
    BUTTON_TYPES,
    COMMON_BUTTON_STYLES,
} from '@/Components/Constants/buttons';

const Button = ({
    buttonType = BUTTON_TYPES.PRIMARY,
    children,
    icon,
    disabled = false,
    size = BUTTON_SIZES.MEDIUM,
    className,
    outline = false,
    loading = false,
    ...props
}) => {
    const buttonClasses = clsx(
        COMMON_BUTTON_STYLES.base,
        COMMON_BUTTON_STYLES.sizes[size],
        {
            [COMMON_BUTTON_STYLES.disabled]: disabled,
            [COMMON_BUTTON_STYLES.variants[buttonType][
                outline ? 'outline' : 'solid'
            ]]: !disabled && buttonType,
        },
        className
    );

    return (
        <AppButton
            className={`${buttonClasses}`}
            disabled={disabled}
            {...props}
        >
            {loading ? (
                <ReactLoading
                    color={'#fff'}
                    type="bars"
                    height={20}
                    width={20}
                />
            ) : (
                <>
                    {icon && <span className="me-2 text-xl">{icon}</span>}
                    {children}
                </>
            )}
        </AppButton>
    );
};

// Button.propTypes = {
//     buttonType: PropTypes.oneOf(Object.values(BUTTON_TYPES)),
//     children: PropTypes.node,
//     icon: PropTypes.node,
//     disabled: PropTypes.bool,
//     size: PropTypes.oneOf(Object.values(BUTTON_SIZES)),
//     className: PropTypes.string,
//     outline: PropTypes.bool,
//     loading: PropTypes.bool,
// };

export default Button;
