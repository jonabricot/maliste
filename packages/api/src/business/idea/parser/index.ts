import type { IdeaInsertType, IdeaType } from "../../../types.ts";
import { amazonIdeaParser } from "./amazon.ts";

export type IdeaParser = (input: string) => IdeaInsertType

export function ideaParserFactory(url: string, body: string) {
    if (url.includes('amazon.fr')) return amazonIdeaParser(body)
    return null
}