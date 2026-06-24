export const SAVE_LIST_KEY = "decho:saves:list";

export function getSaveKey(id: string): string {
    return `decho:saves:${id}`;
}
