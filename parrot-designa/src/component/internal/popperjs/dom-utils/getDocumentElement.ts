
import { isElement } from './instanceOf'

export default function getDocumentElement (
    element
) {
    return (
        (isElement(element)
            ? element.ownerDocument
            : element.document) || window.document
    ).documentElement
}
