export const BACKUP_LIST_KEY = "decho:backups:list";

export function getBackupKey(id: string): string {
    return `decho:backups:${id}`;
}
