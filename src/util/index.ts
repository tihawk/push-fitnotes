import path from "path";
import { cwd } from "process";

export function getAbsolutePath(relativePath: string): string {
    return path.join(cwd(), relativePath)
}