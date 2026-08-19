import { DOMParser } from '@xmldom/xmldom';

if (typeof globalThis !== 'undefined' && typeof globalThis.DOMParser === 'undefined') {
  // @ts-ignore
  globalThis.DOMParser = DOMParser;
}
if (typeof self !== 'undefined' && typeof (self as any).DOMParser === 'undefined') {
  // @ts-ignore
  (self as any).DOMParser = DOMParser;
}

const NodePolyfill = {
  ELEMENT_NODE: 1,
  ATTRIBUTE_NODE: 2,
  TEXT_NODE: 3,
  CDATA_SECTION_NODE: 4,
  ENTITY_REFERENCE_NODE: 5,
  ENTITY_NODE: 6,
  PROCESSING_INSTRUCTION_NODE: 7,
  COMMENT_NODE: 8,
  DOCUMENT_NODE: 9,
  DOCUMENT_TYPE_NODE: 10,
  DOCUMENT_FRAGMENT_NODE: 11,
  NOTATION_NODE: 12
};

if (typeof globalThis !== 'undefined' && typeof globalThis.Node === 'undefined') {
  // @ts-ignore
  globalThis.Node = NodePolyfill;
}
if (typeof self !== 'undefined' && typeof (self as any).Node === 'undefined') {
  // @ts-ignore
  (self as any).Node = NodePolyfill;
}
