import * as React from "react";
export declare function wrap<E extends HTMLElement, P extends object>(tag: string): React.ForwardRefExoticComponent<React.PropsWithoutRef<P & BaseProps> & React.RefAttributes<E>>;
export interface BaseProps {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    [dataOrAria: `data-${string}`]: unknown;
}
export type AquaEvent<T = unknown> = CustomEvent<T>;
export type AquaEventHandler<T = unknown> = (e: AquaEvent<T>) => void;
