/**
 * Stylish hack to add delays between calls without resorting to setTimeout throughout the code
 * @param ms
 */
export function delay(ms: number) {
    return new Promise( (resolve) => setTimeout(resolve, ms) );
}
