import { dialog } from "electron"
const fs = require('fs').promises;
const path = require('path');

export function selectFolder(): string {
    const result: string[] | undefined = dialog.showOpenDialogSync({ properties: ['openDirectory'] })
    if (result === undefined) return ""
    return result![0]
}

async function findFolderRecursively(baseDir, folderName): Promise<string | null> {
    async function searchDirectory(currentDir) {
        const entries = await fs.readdir(currentDir, { withFileTypes: true });

        for (const entry of entries) {
            const entryPath = path.join(currentDir, entry.name);

            if (entry.isDirectory()) {
                if (entry.name === folderName) {
                    return entryPath; // Found the folder
                }
                const found = await searchDirectory(entryPath); // Recurse into subdirectory
                if (found) {
                    return found;
                }
            }
        }
        return null; // Folder not found in this directory
    }

    return searchDirectory(baseDir);
}

export function findN0vaCachePath(dir): string {
    const folderName = "N0vaDesktopCache"
    findFolderRecursively(dir, folderName).then((result) => {
        if (result) return result
        else return ""
    })
    return ""
}

export function extract(n0vaCachePath: string, savePath: string): boolean {
    return true
}
