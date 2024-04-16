declare global {
    interface Math {
        lerp(a: number, b: number, alpha: number): number;
    }
}
export declare function useUtils(): void;
export declare function sleep(ms: number): Promise<unknown>;
