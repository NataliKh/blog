import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import clsx from 'clsx';
export const Input = forwardRef(({ className, ...props }, ref) => _jsx("input", { ref: ref, className: clsx('input', className), ...props }));
Input.displayName = 'Input';
