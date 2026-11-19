import { DomUtils, parseDocument } from "htmlparser2";
import type { IdeaParser } from "./index.ts";
import parse from 'html-dom-parser'

export const amazonIdeaParser: IdeaParser = (body) => {
    const dom = parseDocument(body);
    const titleNode = DomUtils.getElementById("productTitle", dom)
    const priceNodes = DomUtils.getElementById("apex_offerDisplay_desktop", dom)
    const priceNode = DomUtils.getElementsByClassName('a-offscreen', priceNodes!)
    console.log(priceNode)

    return {
        name: titleNode ? DomUtils.textContent(titleNode).trim() : '',
        price: priceNode ? DomUtils.textContent(priceNode).trim() : ''
    }
}