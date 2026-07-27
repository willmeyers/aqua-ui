import { Base } from "./base.js";
export declare class AquaWindow extends Base {
    static observedAttributes: string[];
    label: string | null;
    status: string | null;
    inactive: boolean;
    metal: boolean;
    sheet: boolean;
    noControls: boolean;
    render(): void;
    update(): void;
    get body(): HTMLElement | null;
    toggleToolbar(show?: boolean): void;
}
