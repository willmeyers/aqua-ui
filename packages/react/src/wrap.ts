import * as React from "react";

type Props = Record<string, unknown>;

const PASS = new Set(["children", "className", "style", "id", "key", "ref"]);

const eventName = (prop: string): string => prop.slice(2).toLowerCase();

export function wrap<E extends HTMLElement, P extends object>(
  tag: string,
): React.ForwardRefExoticComponent<React.PropsWithoutRef<P & BaseProps> & React.RefAttributes<E>> {
  const Component = React.forwardRef<E, P & BaseProps>((props, outer) => {
    const inner = React.useRef<E | null>(null);
    const ref = (node: E | null): void => {
      inner.current = node;
      if (typeof outer === "function") outer(node);
      else if (outer) (outer as React.MutableRefObject<E | null>).current = node;
    };

    const dom: Props = {};
    const fields: [string, unknown][] = [];
    const handlers: [string, unknown][] = [];
    for (const [k, v] of Object.entries(props as Props)) {
      if (PASS.has(k) || k.startsWith("data-") || k.startsWith("aria-")) dom[k] = v;
      else if (/^on[A-Z]/.test(k)) handlers.push([eventName(k), v]);
      else if (typeof v === "string") dom[k] = v;   // strings go as attributes
      else fields.push([k, v]);                     // the rest as properties
    }

    React.useEffect(() => {
      const node = inner.current;
      if (!node) return;
      for (const [k, v] of fields) {
        (node as unknown as Props)[k] = v;
      }
    });

    React.useEffect(() => {
      const node = inner.current;
      if (!node) return;
      const subs = handlers.map(([type, fn]) => {
        const h = fn as EventListener;
        node.addEventListener(type, h);
        return () => node.removeEventListener(type, h);
      });
      return () => subs.forEach((off) => off());
    }, handlers.flat());

    return React.createElement(tag, { ...dom, ref });
  });
  Component.displayName = tag;
  return Component as React.ForwardRefExoticComponent<
    React.PropsWithoutRef<P & BaseProps> & React.RefAttributes<E>>;
}

export interface BaseProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  [dataOrAria: `data-${string}`]: unknown;
}

export type AquaEvent<T = unknown> = CustomEvent<T>;
export type AquaEventHandler<T = unknown> = (e: AquaEvent<T>) => void;
