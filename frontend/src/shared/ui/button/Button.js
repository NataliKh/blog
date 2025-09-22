import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import clsx from 'clsx';
export const Button = forwardRef(({ className, variant = 'primary', ...props }, ref) => {
    return (_jsx("button", { ref: ref, className: clsx('btn', `btn--${variant}`, className), ...props }));
});
Button.displayName = 'Button';
