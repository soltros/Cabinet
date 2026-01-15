/**
 * @licstart The following is the entire license notice for the
 * JavaScript code in this page
 *
 * Copyright 2023 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @licend The above is the entire license notice for the
 * JavaScript code in this page
 */

/******/ // The require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = globalThis.pdfjsImageDecoders = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Jbig2Error: () => (/* reexport */ Jbig2Error),
  Jbig2Image: () => (/* reexport */ Jbig2Image),
  JpegError: () => (/* reexport */ JpegError),
  JpegImage: () => (/* reexport */ JpegImage),
  JpxError: () => (/* reexport */ JpxError),
  JpxImage: () => (/* reexport */ JpxImage),
  VerbosityLevel: () => (/* reexport */ VerbosityLevel),
  getVerbosityLevel: () => (/* reexport */ getVerbosityLevel),
  setVerbosityLevel: () => (/* reexport */ setVerbosityLevel)
});

;// CONCATENATED MODULE: ./src/shared/util.js
const isNodeJS = typeof process === "object" && process + "" === "[object process]" && !process.versions.nw && !(process.versions.electron && process.type && process.type !== "browser");
const IDENTITY_MATRIX = (/* unused pure expression or super */ null && ([1, 0, 0, 1, 0, 0]));
const FONT_IDENTITY_MATRIX = (/* unused pure expression or super */ null && ([0.001, 0, 0, 0.001, 0, 0]));
const MAX_IMAGE_SIZE_TO_CACHE = 10e6;
const LINE_FACTOR = 1.35;
const LINE_DESCENT_FACTOR = 0.35;
const BASELINE_FACTOR = LINE_DESCENT_FACTOR / LINE_FACTOR;
const RenderingIntentFlag = {
  ANY: 0x01,
  DISPLAY: 0x02,
  PRINT: 0x04,
  SAVE: 0x08,
  ANNOTATIONS_FORMS: 0x10,
  ANNOTATIONS_STORAGE: 0x20,
  ANNOTATIONS_DISABLE: 0x40,
  OPLIST: 0x100
};
const AnnotationMode = {
  DISABLE: 0,
  ENABLE: 1,
  ENABLE_FORMS: 2,
  ENABLE_STORAGE: 3
};
const util_AnnotationEditorPrefix = "pdfjs_internal_editor_";
const AnnotationEditorType = {
  DISABLE: -1,
  NONE: 0,
  FREETEXT: 3,
  HIGHLIGHT: 9,
  STAMP: 13,
  INK: 15
};
const AnnotationEditorParamsType = {
  RESIZE: 1,
  CREATE: 2,
  FREETEXT_SIZE: 11,
  FREETEXT_COLOR: 12,
  FREETEXT_OPACITY: 13,
  INK_COLOR: 21,
  INK_THICKNESS: 22,
  INK_OPACITY: 23,
  HIGHLIGHT_COLOR: 31,
  HIGHLIGHT_DEFAULT_COLOR: 32,
  HIGHLIGHT_THICKNESS: 33,
  HIGHLIGHT_FREE: 34,
  HIGHLIGHT_SHOW_ALL: 35
};
const PermissionFlag = {
  PRINT: 0x04,
  MODIFY_CONTENTS: 0x08,
  COPY: 0x10,
  MODIFY_ANNOTATIONS: 0x20,
  FILL_INTERACTIVE_FORMS: 0x100,
  COPY_FOR_ACCESSIBILITY: 0x200,
  ASSEMBLE: 0x400,
  PRINT_HIGH_QUALITY: 0x800
};
const TextRenderingMode = {
  FILL: 0,
  STROKE: 1,
  FILL_STROKE: 2,
  INVISIBLE: 3,
  FILL_ADD_TO_PATH: 4,
  STROKE_ADD_TO_PATH: 5,
  FILL_STROKE_ADD_TO_PATH: 6,
  ADD_TO_PATH: 7,
  FILL_STROKE_MASK: 3,
  ADD_TO_PATH_FLAG: 4
};
const util_ImageKind = {
  GRAYSCALE_1BPP: 1,
  RGB_24BPP: 2,
  RGBA_32BPP: 3
};
const AnnotationType = {
  TEXT: 1,
  LINK: 2,
  FREETEXT: 3,
  LINE: 4,
  SQUARE: 5,
  CIRCLE: 6,
  POLYGON: 7,
  POLYLINE: 8,
  HIGHLIGHT: 9,
  UNDERLINE: 10,
  SQUIGGLY: 11,
  STRIKEOUT: 12,
  STAMP: 13,
  CARET: 14,
  INK: 15,
  POPUP: 16,
  FILEATTACHMENT: 17,
  SOUND: 18,
  MOVIE: 19,
  WIDGET: 20,
  SCREEN: 21,
  PRINTERMARK: 22,
  TRAPNET: 23,
  WATERMARK: 24,
  THREED: 25,
  REDACT: 26
};
const AnnotationReplyType = {
  GROUP: "Group",
  REPLY: "R"
};
const AnnotationFlag = {
  INVISIBLE: 0x01,
  HIDDEN: 0x02,
  PRINT: 0x04,
  NOZOOM: 0x08,
  NOROTATE: 0x10,
  NOVIEW: 0x20,
  READONLY: 0x40,
  LOCKED: 0x80,
  TOGGLENOVIEW: 0x100,
  LOCKEDCONTENTS: 0x200
};
const AnnotationFieldFlag = {
  READONLY: 0x0000001,
  REQUIRED: 0x0000002,
  NOEXPORT: 0x0000004,
  MULTILINE: 0x0001000,
  PASSWORD: 0x0002000,
  NOTOGGLETOOFF: 0x0004000,
  RADIO: 0x0008000,
  PUSHBUTTON: 0x0010000,
  COMBO: 0x0020000,
  EDIT: 0x0040000,
  SORT: 0x0080000,
  FILESELECT: 0x0100000,
  MULTISELECT: 0x0200000,
  DONOTSPELLCHECK: 0x0400000,
  DONOTSCROLL: 0x0800000,
  COMB: 0x1000000,
  RICHTEXT: 0x2000000,
  RADIOSINUNISON: 0x2000000,
  COMMITONSELCHANGE: 0x4000000
};
const AnnotationBorderStyleType = {
  SOLID: 1,
  DASHED: 2,
  BEVELED: 3,
  INSET: 4,
  UNDERLINE: 5
};
const AnnotationActionEventType = {
  E: "Mouse Enter",
  X: "Mouse Exit",
  D: "Mouse Down",
  U: "Mouse Up",
  Fo: "Focus",
  Bl: "Blur",
  PO: "PageOpen",
  PC: "PageClose",
  PV: "PageVisible",
  PI: "PageInvisible",
  K: "Keystroke",
  F: "Format",
  V: "Validate",
  C: "Calculate"
};
const DocumentActionEventType = {
  WC: "WillClose",
  WS: "WillSave",
  DS: "DidSave",
  WP: "WillPrint",
  DP: "DidPrint"
};
const PageActionEventType = {
  O: "PageOpen",
  C: "PageClose"
};
const VerbosityLevel = {
  ERRORS: 0,
  WARNINGS: 1,
  INFOS: 5
};
const CMapCompressionType = {
  NONE: 0,
  BINARY: 1
};
const OPS = {
  dependency: 1,
  setLineWidth: 2,
  setLineCap: 3,
  setLineJoin: 4,
  setMiterLimit: 5,
  setDash: 6,
  setRenderingIntent: 7,
  setFlatness: 8,
  setGState: 9,
  save: 10,
  restore: 11,
  transform: 12,
  moveTo: 13,
  lineTo: 14,
  curveTo: 15,
  curveTo2: 16,
  curveTo3: 17,
  closePath: 18,
  rectangle: 19,
  stroke: 20,
  closeStroke: 21,
  fill: 22,
  eoFill: 23,
  fillStroke: 24,
  eoFillStroke: 25,
  closeFillStroke: 26,
  closeEOFillStroke: 27,
  endPath: 28,
  clip: 29,
  eoClip: 30,
  beginText: 31,
  endText: 32,
  setCharSpacing: 33,
  setWordSpacing: 34,
  setHScale: 35,
  setLeading: 36,
  setFont: 37,
  setTextRenderingMode: 38,
  setTextRise: 39,
  moveText: 40,
  setLeadingMoveText: 41,
  setTextMatrix: 42,
  nextLine: 43,
  showText: 44,
  showSpacedText: 45,
  nextLineShowText: 46,
  nextLineSetSpacingShowText: 47,
  setCharWidth: 48,
  setCharWidthAndBounds: 49,
  setStrokeColorSpace: 50,
  setFillColorSpace: 51,
  setStrokeColor: 52,
  setStrokeColorN: 53,
  setFillColor: 54,
  setFillColorN: 55,
  setStrokeGray: 56,
  setFillGray: 57,
  setStrokeRGBColor: 58,
  setFillRGBColor: 59,
  setStrokeCMYKColor: 60,
  setFillCMYKColor: 61,
  shadingFill: 62,
  beginInlineImage: 63,
  beginImageData: 64,
  endInlineImage: 65,
  paintXObject: 66,
  markPoint: 67,
  markPointProps: 68,
  beginMarkedContent: 69,
  beginMarkedContentProps: 70,
  endMarkedContent: 71,
  beginCompat: 72,
  endCompat: 73,
  paintFormXObjectBegin: 74,
  paintFormXObjectEnd: 75,
  beginGroup: 76,
  endGroup: 77,
  beginAnnotation: 80,
  endAnnotation: 81,
  paintImageMaskXObject: 83,
  paintImageMaskXObjectGroup: 84,
  paintImageXObject: 85,
  paintInlineImageXObject: 86,
  paintInlineImageXObjectGroup: 87,
  paintImageXObjectRepeat: 88,
  paintImageMaskXObjectRepeat: 89,
  paintSolidColorImageMask: 90,
  constructPath: 91
};
const PasswordResponses = {
  NEED_PASSWORD: 1,
  INCORRECT_PASSWORD: 2
};
let verbosity = VerbosityLevel.WARNINGS;
function setVerbosityLevel(level) {
  if (Number.isInteger(level)) {
    verbosity = level;
  }
}
function getVerbosityLevel() {
  return verbosity;
}
function info(msg) {
  if (verbosity >= VerbosityLevel.INFOS) {
    console.log(`Info: ${msg}`);
  }
}
function util_warn(msg) {
  if (verbosity >= VerbosityLevel.WARNINGS) {
    console.log(`Warning: ${msg}`);
  }
}
function util_unreachable(msg) {
  throw new Error(msg);
}
function util_assert(cond, msg) {
  if (!cond) {
    util_unreachable(msg);
  }
}
function _isValidProtocol(url) {
  switch (url?.protocol) {
    case "http:":
    case "https:":
    case "ftp:":
    case "mailto:":
    case "tel:":
      return true;
    default:
      return false;
  }
}
function createValidAbsoluteUrl(url, baseUrl = null, options = null) {
  if (!url) {
    return null;
  }
  try {
    if (options && typeof url === "string") {
      if (options.addDefaultProtocol && url.startsWith("www.")) {
        const dots = url.match(/\./g);
        if (dots?.length >= 2) {
          url = `http://${url}`;
        }
      }
      if (options.tryConvertEncoding) {
        try {
          url = stringToUTF8String(url);
        } catch {}
      }
    }
    const absoluteUrl = baseUrl ? new URL(url, baseUrl) : new URL(url);
    if (_isValidProtocol(absoluteUrl)) {
      return absoluteUrl;
    }
  } catch {}
  return null;
}
function util_shadow(obj, prop, value, nonSerializable = false) {
  Object.defineProperty(obj, prop, {
    value,
    enumerable: !nonSerializable,
    configurable: true,
    writable: false
  });
  return value;
}
const BaseException = function BaseExceptionClosure() {
  function BaseException(message, name) {
    if (this.constructor === BaseException) {
      util_unreachable("Cannot initialize BaseException.");
    }
    this.message = message;
    this.name = name;
  }
  BaseException.prototype = new Error();
  BaseException.constructor = BaseException;
  return BaseException;
}();
class PasswordException extends BaseException {
  constructor(msg, code) {
    super(msg, "PasswordException");
    this.code = code;
  }
}
class UnknownErrorException extends BaseException {
  constructor(msg, details) {
    super(msg, "UnknownErrorException");
    this.details = details;
  }
}
class InvalidPDFException extends BaseException {
  constructor(msg) {
    super(msg, "InvalidPDFException");
  }
}
class MissingPDFException extends BaseException {
  constructor(msg) {
    super(msg, "MissingPDFException");
  }
}
class UnexpectedResponseException extends BaseException {
  constructor(msg, status) {
    super(msg, "UnexpectedResponseException");
    this.status = status;
  }
}
class FormatError extends BaseException {
  constructor(msg) {
    super(msg, "FormatError");
  }
}
class AbortException extends BaseException {
  constructor(msg) {
    super(msg, "AbortException");
  }
}
function bytesToString(bytes) {
  if (typeof bytes !== "object" || bytes?.length === undefined) {
    util_unreachable("Invalid argument for bytesToString");
  }
  const length = bytes.length;
  const MAX_ARGUMENT_COUNT = 8192;
  if (length < MAX_ARGUMENT_COUNT) {
    return String.fromCharCode.apply(null, bytes);
  }
  const strBuf = [];
  for (let i = 0; i < length; i += MAX_ARGUMENT_COUNT) {
    const chunkEnd = Math.min(i + MAX_ARGUMENT_COUNT, length);
    const chunk = bytes.subarray(i, chunkEnd);
    strBuf.push(String.fromCharCode.apply(null, chunk));
  }
  return strBuf.join("");
}
function stringToBytes(str) {
  if (typeof str !== "string") {
    util_unreachable("Invalid argument for stringToBytes");
  }
  const length = str.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; ++i) {
    bytes[i] = str.charCodeAt(i) & 0xff;
  }
  return bytes;
}
function string32(value) {
  return String.fromCharCode(value >> 24 & 0xff, value >> 16 & 0xff, value >> 8 & 0xff, value & 0xff);
}
function util_objectSize(obj) {
  return Object.keys(obj).length;
}
function objectFromMap(map) {
  const obj = Object.create(null);
  for (const [key, value] of map) {
    obj[key] = value;
  }
  return obj;
}
function isLittleEndian() {
  const buffer8 = new Uint8Array(4);
  buffer8[0] = 1;
  const view32 = new Uint32Array(buffer8.buffer, 0, 1);
  return view32[0] === 1;
}
function isEvalSupported() {
  try {
    new Function("");
    return true;
  } catch {
    return false;
  }
}
class util_FeatureTest {
  static get isLittleEndian() {
    return util_shadow(this, "isLittleEndian", isLittleEndian());
  }
  static get isEvalSupported() {
    return util_shadow(this, "isEvalSupported", isEvalSupported());
  }
  static get isOffscreenCanvasSupported() {
    return util_shadow(this, "isOffscreenCanvasSupported", typeof OffscreenCanvas !== "undefined");
  }
  static get platform() {
    if (typeof navigator !== "undefined" && typeof navigator?.platform === "string") {
      return util_shadow(this, "platform", {
        isMac: navigator.platform.includes("Mac")
      });
    }
    return util_shadow(this, "platform", {
      isMac: false
    });
  }
  static get isCSSRoundSupported() {
    return util_shadow(this, "isCSSRoundSupported", globalThis.CSS?.supports?.("width: round(1.5px, 1px)"));
  }
}
const hexNumbers = Array.from(Array(256).keys(), n => n.toString(16).padStart(2, "0"));
class Util {
  static makeHexColor(r, g, b) {
    return `#${hexNumbers[r]}${hexNumbers[g]}${hexNumbers[b]}`;
  }
  static scaleMinMax(transform, minMax) {
    let temp;
    if (transform[0]) {
      if (transform[0] < 0) {
        temp = minMax[0];
        minMax[0] = minMax[2];
        minMax[2] = temp;
      }
      minMax[0] *= transform[0];
      minMax[2] *= transform[0];
      if (transform[3] < 0) {
        temp = minMax[1];
        minMax[1] = minMax[3];
        minMax[3] = temp;
      }
      minMax[1] *= transform[3];
      minMax[3] *= transform[3];
    } else {
      temp = minMax[0];
      minMax[0] = minMax[1];
      minMax[1] = temp;
      temp = minMax[2];
      minMax[2] = minMax[3];
      minMax[3] = temp;
      if (transform[1] < 0) {
        temp = minMax[1];
        minMax[1] = minMax[3];
        minMax[3] = temp;
      }
      minMax[1] *= transform[1];
      minMax[3] *= transform[1];
      if (transform[2] < 0) {
        temp = minMax[0];
        minMax[0] = minMax[2];
        minMax[2] = temp;
      }
      minMax[0] *= transform[2];
      minMax[2] *= transform[2];
    }
    minMax[0] += transform[4];
    minMax[1] += transform[5];
    minMax[2] += transform[4];
    minMax[3] += transform[5];
  }
  static transform(m1, m2) {
    return [m1[0] * m2[0] + m1[2] * m2[1], m1[1] * m2[0] + m1[3] * m2[1], m1[0] * m2[2] + m1[2] * m2[3], m1[1] * m2[2] + m1[3] * m2[3], m1[0] * m2[4] + m1[2] * m2[5] + m1[4], m1[1] * m2[4] + m1[3] * m2[5] + m1[5]];
  }
  static applyTransform(p, m) {
    const xt = p[0] * m[0] + p[1] * m[2] + m[4];
    const yt = p[0] * m[1] + p[1] * m[3] + m[5];
    return [xt, yt];
  }
  static applyInverseTransform(p, m) {
    const d = m[0] * m[3] - m[1] * m[2];
    const xt = (p[0] * m[3] - p[1] * m[2] + m[2] * m[5] - m[4] * m[3]) / d;
    const yt = (-p[0] * m[1] + p[1] * m[0] + m[4] * m[1] - m[5] * m[0]) / d;
    return [xt, yt];
  }
  static getAxialAlignedBoundingBox(r, m) {
    const p1 = this.applyTransform(r, m);
    const p2 = this.applyTransform(r.slice(2, 4), m);
    const p3 = this.applyTransform([r[0], r[3]], m);
    const p4 = this.applyTransform([r[2], r[1]], m);
    return [Math.min(p1[0], p2[0], p3[0], p4[0]), Math.min(p1[1], p2[1], p3[1], p4[1]), Math.max(p1[0], p2[0], p3[0], p4[0]), Math.max(p1[1], p2[1], p3[1], p4[1])];
  }
  static inverseTransform(m) {
    const d = m[0] * m[3] - m[1] * m[2];
    return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d, (m[2] * m[5] - m[4] * m[3]) / d, (m[4] * m[1] - m[5] * m[0]) / d];
  }
  static singularValueDecompose2dScale(m) {
    const transpose = [m[0], m[2], m[1], m[3]];
    const a = m[0] * transpose[0] + m[1] * transpose[2];
    const b = m[0] * transpose[1] + m[1] * transpose[3];
    const c = m[2] * transpose[0] + m[3] * transpose[2];
    const d = m[2] * transpose[1] + m[3] * transpose[3];
    const first = (a + d) / 2;
    const second = Math.sqrt((a + d) ** 2 - 4 * (a * d - c * b)) / 2;
    const sx = first + second || 1;
    const sy = first - second || 1;
    return [Math.sqrt(sx), Math.sqrt(sy)];
  }
  static normalizeRect(rect) {
    const r = rect.slice(0);
    if (rect[0] > rect[2]) {
      r[0] = rect[2];
      r[2] = rect[0];
    }
    if (rect[1] > rect[3]) {
      r[1] = rect[3];
      r[3] = rect[1];
    }
    return r;
  }
  static intersect(rect1, rect2) {
    const xLow = Math.max(Math.min(rect1[0], rect1[2]), Math.min(rect2[0], rect2[2]));
    const xHigh = Math.min(Math.max(rect1[0], rect1[2]), Math.max(rect2[0], rect2[2]));
    if (xLow > xHigh) {
      return null;
    }
    const yLow = Math.max(Math.min(rect1[1], rect1[3]), Math.min(rect2[1], rect2[3]));
    const yHigh = Math.min(Math.max(rect1[1], rect1[3]), Math.max(rect2[1], rect2[3]));
    if (yLow > yHigh) {
      return null;
    }
    return [xLow, yLow, xHigh, yHigh];
  }
  static #getExtremumOnCurve(x0, x1, x2, x3, y0, y1, y2, y3, t, minMax) {
    if (t <= 0 || t >= 1) {
      return;
    }
    const mt = 1 - t;
    const tt = t * t;
    const ttt = tt * t;
    const x = mt * (mt * (mt * x0 + 3 * t * x1) + 3 * tt * x2) + ttt * x3;
    const y = mt * (mt * (mt * y0 + 3 * t * y1) + 3 * tt * y2) + ttt * y3;
    minMax[0] = Math.min(minMax[0], x);
    minMax[1] = Math.min(minMax[1], y);
    minMax[2] = Math.max(minMax[2], x);
    minMax[3] = Math.max(minMax[3], y);
  }
  static #getExtremum(x0, x1, x2, x3, y0, y1, y2, y3, a, b, c, minMax) {
    if (Math.abs(a) < 1e-12) {
      if (Math.abs(b) >= 1e-12) {
        this.#getExtremumOnCurve(x0, x1, x2, x3, y0, y1, y2, y3, -c / b, minMax);
      }
      return;
    }
    const delta = b ** 2 - 4 * c * a;
    if (delta < 0) {
      return;
    }
    const sqrtDelta = Math.sqrt(delta);
    const a2 = 2 * a;
    this.#getExtremumOnCurve(x0, x1, x2, x3, y0, y1, y2, y3, (-b + sqrtDelta) / a2, minMax);
    this.#getExtremumOnCurve(x0, x1, x2, x3, y0, y1, y2, y3, (-b - sqrtDelta) / a2, minMax);
  }
  static bezierBoundingBox(x0, y0, x1, y1, x2, y2, x3, y3, minMax) {
    if (minMax) {
      minMax[0] = Math.min(minMax[0], x0, x3);
      minMax[1] = Math.min(minMax[1], y0, y3);
      minMax[2] = Math.max(minMax[2], x0, x3);
      minMax[3] = Math.max(minMax[3], y0, y3);
    } else {
      minMax = [Math.min(x0, x3), Math.min(y0, y3), Math.max(x0, x3), Math.max(y0, y3)];
    }
    this.#getExtremum(x0, x1, x2, x3, y0, y1, y2, y3, 3 * (-x0 + 3 * (x1 - x2) + x3), 6 * (x0 - 2 * x1 + x2), 3 * (x1 - x0), minMax);
    this.#getExtremum(x0, x1, x2, x3, y0, y1, y2, y3, 3 * (-y0 + 3 * (y1 - y2) + y3), 6 * (y0 - 2 * y1 + y2), 3 * (y1 - y0), minMax);
    return minMax;
  }
}
const PDFStringTranslateTable = (/* unused pure expression or super */ null && ([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x2d8, 0x2c7, 0x2c6, 0x2d9, 0x2dd, 0x2db, 0x2da, 0x2dc, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x2022, 0x2020, 0x2021, 0x2026, 0x2014, 0x2013, 0x192, 0x2044, 0x2039, 0x203a, 0x2212, 0x2030, 0x201e, 0x201c, 0x201d, 0x2018, 0x2019, 0x201a, 0x2122, 0xfb01, 0xfb02, 0x141, 0x152, 0x160, 0x178, 0x17d, 0x131, 0x142, 0x153, 0x161, 0x17e, 0, 0x20ac]));
function util_stringToPDFString(str) {
  if (str[0] >= "\xEF") {
    let encoding;
    if (str[0] === "\xFE" && str[1] === "\xFF") {
      encoding = "utf-16be";
      if (str.length % 2 === 1) {
        str = str.slice(0, -1);
      }
    } else if (str[0] === "\xFF" && str[1] === "\xFE") {
      encoding = "utf-16le";
      if (str.length % 2 === 1) {
        str = str.slice(0, -1);
      }
    } else if (str[0] === "\xEF" && str[1] === "\xBB" && str[2] === "\xBF") {
      encoding = "utf-8";
    }
    if (encoding) {
      try {
        const decoder = new TextDecoder(encoding, {
          fatal: true
        });
        const buffer = stringToBytes(str);
        const decoded = decoder.decode(buffer);
        if (!decoded.includes("\x1b")) {
          return decoded;
        }
        return decoded.replaceAll(/\x1b[^\x1b]*(?:\x1b|$)/g, "");
      } catch (ex) {
        util_warn(`stringToPDFString: "${ex}".`);
      }
    }
  }
  const strBuf = [];
  for (let i = 0, ii = str.length; i < ii; i++) {
    const charCode = str.charCodeAt(i);
    if (charCode === 0x1b) {
      while (++i < ii && str.charCodeAt(i) !== 0x1b) {}
      continue;
    }
    const code = PDFStringTranslateTable[charCode];
    strBuf.push(code ? String.fromCharCode(code) : str.charAt(i));
  }
  return strBuf.join("");
}
function stringToUTF8String(str) {
  return decodeURIComponent(escape(str));
}
function utf8StringToString(str) {
  return unescape(encodeURIComponent(str));
}
function isArrayEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0, ii = arr1.length; i < ii; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}
function getModificationDate(date = new Date()) {
  const buffer = [date.getUTCFullYear().toString(), (date.getUTCMonth() + 1).toString().padStart(2, "0"), date.getUTCDate().toString().padStart(2, "0"), date.getUTCHours().toString().padStart(2, "0"), date.getUTCMinutes().toString().padStart(2, "0"), date.getUTCSeconds().toString().padStart(2, "0")];
  return buffer.join("");
}
let NormalizeRegex = null;
let NormalizationMap = null;
function normalizeUnicode(str) {
  if (!NormalizeRegex) {
    NormalizeRegex = /([\u00a0\u00b5\u037e\u0eb3\u2000-\u200a\u202f\u2126\ufb00-\ufb04\ufb06\ufb20-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufba1\ufba4-\ufba9\ufbae-\ufbb1\ufbd3-\ufbdc\ufbde-\ufbe7\ufbea-\ufbf8\ufbfc-\ufbfd\ufc00-\ufc5d\ufc64-\ufcf1\ufcf5-\ufd3d\ufd88\ufdf4\ufdfa-\ufdfb\ufe71\ufe77\ufe79\ufe7b\ufe7d]+)|(\ufb05+)/gu;
    NormalizationMap = new Map([["ﬅ", "ſt"]]);
  }
  return str.replaceAll(NormalizeRegex, (_, p1, p2) => p1 ? p1.normalize("NFKC") : NormalizationMap.get(p2));
}
function getUuid() {
  if (typeof crypto !== "undefined" && typeof crypto?.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const buf = new Uint8Array(32);
  if (typeof crypto !== "undefined" && typeof crypto?.getRandomValues === "function") {
    crypto.getRandomValues(buf);
  } else {
    for (let i = 0; i < 32; i++) {
      buf[i] = Math.floor(Math.random() * 255);
    }
  }
  return bytesToString(buf);
}
const AnnotationPrefix = "pdfjs_internal_id_";
const FontRenderOps = {
  BEZIER_CURVE_TO: 0,
  MOVE_TO: 1,
  LINE_TO: 2,
  QUADRATIC_CURVE_TO: 3,
  RESTORE: 4,
  SAVE: 5,
  SCALE: 6,
  TRANSFORM: 7,
  TRANSLATE: 8
};

;// CONCATENATED MODULE: ./src/core/primitives.js

const CIRCULAR_REF = Symbol("CIRCULAR_REF");
const EOF = Symbol("EOF");
let CmdCache = Object.create(null);
let NameCache = Object.create(null);
let RefCache = Object.create(null);
function clearPrimitiveCaches() {
  CmdCache = Object.create(null);
  NameCache = Object.create(null);
  RefCache = Object.create(null);
}
class Name {
  constructor(name) {
    this.name = name;
  }
  static get(name) {
    return NameCache[name] ||= new Name(name);
  }
}
class Cmd {
  constructor(cmd) {
    this.cmd = cmd;
  }
  static get(cmd) {
    return CmdCache[cmd] ||= new Cmd(cmd);
  }
}
const nonSerializable = function nonSerializableClosure() {
  return nonSerializable;
};
class primitives_Dict {
  constructor(xref = null) {
    this._map = Object.create(null);
    this.xref = xref;
    this.objId = null;
    this.suppressEncryption = false;
    this.__nonSerializable__ = nonSerializable;
  }
  assignXref(newXref) {
    this.xref = newXref;
  }
  get size() {
    return Object.keys(this._map).length;
  }
  get(key1, key2, key3) {
    let value = this._map[key1];
    if (value === undefined && key2 !== undefined) {
      value = this._map[key2];
      if (value === undefined && key3 !== undefined) {
        value = this._map[key3];
      }
    }
    if (value instanceof primitives_Ref && this.xref) {
      return this.xref.fetch(value, this.suppressEncryption);
    }
    return value;
  }
  async getAsync(key1, key2, key3) {
    let value = this._map[key1];
    if (value === undefined && key2 !== undefined) {
      value = this._map[key2];
      if (value === undefined && key3 !== undefined) {
        value = this._map[key3];
      }
    }
    if (value instanceof primitives_Ref && this.xref) {
      return this.xref.fetchAsync(value, this.suppressEncryption);
    }
    return value;
  }
  getArray(key1, key2, key3) {
    let value = this._map[key1];
    if (value === undefined && key2 !== undefined) {
      value = this._map[key2];
      if (value === undefined && key3 !== undefined) {
        value = this._map[key3];
      }
    }
    if (value instanceof primitives_Ref && this.xref) {
      value = this.xref.fetch(value, this.suppressEncryption);
    }
    if (Array.isArray(value)) {
      value = value.slice();
      for (let i = 0, ii = value.length; i < ii; i++) {
        if (value[i] instanceof primitives_Ref && this.xref) {
          value[i] = this.xref.fetch(value[i], this.suppressEncryption);
        }
      }
    }
    return value;
  }
  getRaw(key) {
    return this._map[key];
  }
  getKeys() {
    return Object.keys(this._map);
  }
  getRawValues() {
    return Object.values(this._map);
  }
  set(key, value) {
    this._map[key] = value;
  }
  has(key) {
    return this._map[key] !== undefined;
  }
  forEach(callback) {
    for (const key in this._map) {
      callback(key, this.get(key));
    }
  }
  static get empty() {
    const emptyDict = new primitives_Dict(null);
    emptyDict.set = (key, value) => {
      unreachable("Should not call `set` on the empty dictionary.");
    };
    return shadow(this, "empty", emptyDict);
  }
  static merge({
    xref,
    dictArray,
    mergeSubDicts = false
  }) {
    const mergedDict = new primitives_Dict(xref),
      properties = new Map();
    for (const dict of dictArray) {
      if (!(dict instanceof primitives_Dict)) {
        continue;
      }
      for (const [key, value] of Object.entries(dict._map)) {
        let property = properties.get(key);
        if (property === undefined) {
          property = [];
          properties.set(key, property);
        } else if (!mergeSubDicts || !(value instanceof primitives_Dict)) {
          continue;
        }
        property.push(value);
      }
    }
    for (const [name, values] of properties) {
      if (values.length === 1 || !(values[0] instanceof primitives_Dict)) {
        mergedDict._map[name] = values[0];
        continue;
      }
      const subDict = new primitives_Dict(xref);
      for (const dict of values) {
        for (const [key, value] of Object.entries(dict._map)) {
          if (subDict._map[key] === undefined) {
            subDict._map[key] = value;
          }
        }
      }
      if (subDict.size > 0) {
        mergedDict._map[name] = subDict;
      }
    }
    properties.clear();
    return mergedDict.size > 0 ? mergedDict : primitives_Dict.empty;
  }
  clone() {
    const dict = new primitives_Dict(this.xref);
    for (const key of this.getKeys()) {
      dict.set(key, this.getRaw(key));
    }
    return dict;
  }
}
class primitives_Ref {
  constructor(num, gen) {
    this.num = num;
    this.gen = gen;
  }
  toString() {
    if (this.gen === 0) {
      return `${this.num}R`;
    }
    return `${this.num}R${this.gen}`;
  }
  static fromString(str) {
    const ref = RefCache[str];
    if (ref) {
      return ref;
    }
    const m = /^(\d+)R(\d*)$/.exec(str);
    if (!m || m[1] === "0") {
      return null;
    }
    return RefCache[str] = new primitives_Ref(parseInt(m[1]), !m[2] ? 0 : parseInt(m[2]));
  }
  static get(num, gen) {
    const key = gen === 0 ? `${num}R` : `${num}R${gen}`;
    return RefCache[key] ||= new primitives_Ref(num, gen);
  }
}
class primitives_RefSet {
  constructor(parent = null) {
    this._set = new Set(parent?._set);
  }
  has(ref) {
    return this._set.has(ref.toString());
  }
  put(ref) {
    this._set.add(ref.toString());
  }
  remove(ref) {
    this._set.delete(ref.toString());
  }
  [Symbol.iterator]() {
    return this._set.values();
  }
  clear() {
    this._set.clear();
  }
}
class RefSetCache {
  constructor() {
    this._map = new Map();
  }
  get size() {
    return this._map.size;
  }
  get(ref) {
    return this._map.get(ref.toString());
  }
  has(ref) {
    return this._map.has(ref.toString());
  }
  put(ref, obj) {
    this._map.set(ref.toString(), obj);
  }
  putAlias(ref, aliasRef) {
    this._map.set(ref.toString(), this.get(aliasRef));
  }
  [Symbol.iterator]() {
    return this._map.values();
  }
  clear() {
    this._map.clear();
  }
  *items() {
    for (const [ref, value] of this._map) {
      yield [primitives_Ref.fromString(ref), value];
    }
  }
}
function primitives_isName(v, name) {
  return v instanceof Name && (name === undefined || v.name === name);
}
function isCmd(v, cmd) {
  return v instanceof Cmd && (cmd === undefined || v.cmd === cmd);
}
function isDict(v, type) {
  return v instanceof primitives_Dict && (type === undefined || primitives_isName(v.get("Type"), type));
}
function isRefsEqual(v1, v2) {
  return v1.num === v2.num && v1.gen === v2.gen;
}

;// CONCATENATED MODULE: ./src/core/base_stream.js

class base_stream_BaseStream {
  constructor() {
    if (this.constructor === base_stream_BaseStream) {
      util_unreachable("Cannot initialize BaseStream.");
    }
  }
  get length() {
    util_unreachable("Abstract getter `length` accessed");
  }
  get isEmpty() {
    util_unreachable("Abstract getter `isEmpty` accessed");
  }
  get isDataLoaded() {
    return util_shadow(this, "isDataLoaded", true);
  }
  getByte() {
    util_unreachable("Abstract method `getByte` called");
  }
  getBytes(length) {
    util_unreachable("Abstract method `getBytes` called");
  }
  peekByte() {
    const peekedByte = this.getByte();
    if (peekedByte !== -1) {
      this.pos--;
    }
    return peekedByte;
  }
  peekBytes(length) {
    const bytes = this.getBytes(length);
    this.pos -= bytes.length;
    return bytes;
  }
  getUint16() {
    const b0 = this.getByte();
    const b1 = this.getByte();
    if (b0 === -1 || b1 === -1) {
      return -1;
    }
    return (b0 << 8) + b1;
  }
  getInt32() {
    const b0 = this.getByte();
    const b1 = this.getByte();
    const b2 = this.getByte();
    const b3 = this.getByte();
    return (b0 << 24) + (b1 << 16) + (b2 << 8) + b3;
  }
  getByteRange(begin, end) {
    util_unreachable("Abstract method `getByteRange` called");
  }
  getString(length) {
    return bytesToString(this.getBytes(length));
  }
  skip(n) {
    this.pos += n || 1;
  }
  reset() {
    util_unreachable("Abstract method `reset` called");
  }
  moveStart() {
    util_unreachable("Abstract method `moveStart` called");
  }
  makeSubStream(start, length, dict = null) {
    util_unreachable("Abstract method `makeSubStream` called");
  }
  getBaseStreams() {
    return null;
  }
}

;// CONCATENATED MODULE: ./src/core/core_utils.js



const PDF_VERSION_REGEXP = /^[1-9]\.\d$/;
function getLookupTableFactory(initializer) {
  let lookup;
  return function () {
    if (initializer) {
      lookup = Object.create(null);
      initializer(lookup);
      initializer = null;
    }
    return lookup;
  };
}
class MissingDataException extends BaseException {
  constructor(begin, end) {
    super(`Missing data [${begin}, ${end})`, "MissingDataException");
    this.begin = begin;
    this.end = end;
  }
}
class ParserEOFException extends BaseException {
  constructor(msg) {
    super(msg, "ParserEOFException");
  }
}
class XRefEntryException extends BaseException {
  constructor(msg) {
    super(msg, "XRefEntryException");
  }
}
class XRefParseException extends BaseException {
  constructor(msg) {
    super(msg, "XRefParseException");
  }
}
function arrayBuffersToBytes(arr) {
  const length = arr.length;
  if (length === 0) {
    return new Uint8Array(0);
  }
  if (length === 1) {
    return new Uint8Array(arr[0]);
  }
  let dataLength = 0;
  for (let i = 0; i < length; i++) {
    dataLength += arr[i].byteLength;
  }
  const data = new Uint8Array(dataLength);
  let pos = 0;
  for (let i = 0; i < length; i++) {
    const item = new Uint8Array(arr[i]);
    data.set(item, pos);
    pos += item.byteLength;
  }
  return data;
}
function getInheritableProperty({
  dict,
  key,
  getArray = false,
  stopWhenFound = true
}) {
  let values;
  const visited = new RefSet();
  while (dict instanceof Dict && !(dict.objId && visited.has(dict.objId))) {
    if (dict.objId) {
      visited.put(dict.objId);
    }
    const value = getArray ? dict.getArray(key) : dict.get(key);
    if (value !== undefined) {
      if (stopWhenFound) {
        return value;
      }
      (values ||= []).push(value);
    }
    dict = dict.get("Parent");
  }
  return values;
}
const ROMAN_NUMBER_MAP = (/* unused pure expression or super */ null && (["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM", "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC", "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"]));
function toRomanNumerals(number, lowerCase = false) {
  assert(Number.isInteger(number) && number > 0, "The number should be a positive integer.");
  const romanBuf = [];
  let pos;
  while (number >= 1000) {
    number -= 1000;
    romanBuf.push("M");
  }
  pos = number / 100 | 0;
  number %= 100;
  romanBuf.push(ROMAN_NUMBER_MAP[pos]);
  pos = number / 10 | 0;
  number %= 10;
  romanBuf.push(ROMAN_NUMBER_MAP[10 + pos]);
  romanBuf.push(ROMAN_NUMBER_MAP[20 + number]);
  const romanStr = romanBuf.join("");
  return lowerCase ? romanStr.toLowerCase() : romanStr;
}
function log2(x) {
  if (x <= 0) {
    return 0;
  }
  return Math.ceil(Math.log2(x));
}
function readInt8(data, offset) {
  return data[offset] << 24 >> 24;
}
function readUint16(data, offset) {
  return data[offset] << 8 | data[offset + 1];
}
function readUint32(data, offset) {
  return (data[offset] << 24 | data[offset + 1] << 16 | data[offset + 2] << 8 | data[offset + 3]) >>> 0;
}
function isWhiteSpace(ch) {
  return ch === 0x20 || ch === 0x09 || ch === 0x0d || ch === 0x0a;
}
function isNumberArray(arr, len) {
  return Array.isArray(arr) && (len === null || arr.length === len) && arr.every(x => typeof x === "number");
}
function parseXFAPath(path) {
  const positionPattern = /(.+)\[(\d+)\]$/;
  return path.split(".").map(component => {
    const m = component.match(positionPattern);
    if (m) {
      return {
        name: m[1],
        pos: parseInt(m[2], 10)
      };
    }
    return {
      name: component,
      pos: 0
    };
  });
}
function escapePDFName(str) {
  const buffer = [];
  let start = 0;
  for (let i = 0, ii = str.length; i < ii; i++) {
    const char = str.charCodeAt(i);
    if (char < 0x21 || char > 0x7e || char === 0x23 || char === 0x28 || char === 0x29 || char === 0x3c || char === 0x3e || char === 0x5b || char === 0x5d || char === 0x7b || char === 0x7d || char === 0x2f || char === 0x25) {
      if (start < i) {
        buffer.push(str.substring(start, i));
      }
      buffer.push(`#${char.toString(16)}`);
      start = i + 1;
    }
  }
  if (buffer.length === 0) {
    return str;
  }
  if (start < str.length) {
    buffer.push(str.substring(start, str.length));
  }
  return buffer.join("");
}
function escapeString(str) {
  return str.replaceAll(/([()\\\n\r])/g, match => {
    if (match === "\n") {
      return "\\n";
    } else if (match === "\r") {
      return "\\r";
    }
    return `\\${match}`;
  });
}
function _collectJS(entry, xref, list, parents) {
  if (!entry) {
    return;
  }
  let parent = null;
  if (entry instanceof Ref) {
    if (parents.has(entry)) {
      return;
    }
    parent = entry;
    parents.put(parent);
    entry = xref.fetch(entry);
  }
  if (Array.isArray(entry)) {
    for (const element of entry) {
      _collectJS(element, xref, list, parents);
    }
  } else if (entry instanceof Dict) {
    if (isName(entry.get("S"), "JavaScript")) {
      const js = entry.get("JS");
      let code;
      if (js instanceof BaseStream) {
        code = js.getString();
      } else if (typeof js === "string") {
        code = js;
      }
      code &&= stringToPDFString(code).replaceAll("\x00", "");
      if (code) {
        list.push(code);
      }
    }
    _collectJS(entry.getRaw("Next"), xref, list, parents);
  }
  if (parent) {
    parents.remove(parent);
  }
}
function collectActions(xref, dict, eventType) {
  const actions = Object.create(null);
  const additionalActionsDicts = getInheritableProperty({
    dict,
    key: "AA",
    stopWhenFound: false
  });
  if (additionalActionsDicts) {
    for (let i = additionalActionsDicts.length - 1; i >= 0; i--) {
      const additionalActions = additionalActionsDicts[i];
      if (!(additionalActions instanceof Dict)) {
        continue;
      }
      for (const key of additionalActions.getKeys()) {
        const action = eventType[key];
        if (!action) {
          continue;
        }
        const actionDict = additionalActions.getRaw(key);
        const parents = new RefSet();
        const list = [];
        _collectJS(actionDict, xref, list, parents);
        if (list.length > 0) {
          actions[action] = list;
        }
      }
    }
  }
  if (dict.has("A")) {
    const actionDict = dict.get("A");
    const parents = new RefSet();
    const list = [];
    _collectJS(actionDict, xref, list, parents);
    if (list.length > 0) {
      actions.Action = list;
    }
  }
  return objectSize(actions) > 0 ? actions : null;
}
const XMLEntities = {
  0x3c: "&lt;",
  0x3e: "&gt;",
  0x26: "&amp;",
  0x22: "&quot;",
  0x27: "&apos;"
};
function* codePointIter(str) {
  for (let i = 0, ii = str.length; i < ii; i++) {
    const char = str.codePointAt(i);
    if (char > 0xd7ff && (char < 0xe000 || char > 0xfffd)) {
      i++;
    }
    yield char;
  }
}
function encodeToXmlString(str) {
  const buffer = [];
  let start = 0;
  for (let i = 0, ii = str.length; i < ii; i++) {
    const char = str.codePointAt(i);
    if (0x20 <= char && char <= 0x7e) {
      const entity = XMLEntities[char];
      if (entity) {
        if (start < i) {
          buffer.push(str.substring(start, i));
        }
        buffer.push(entity);
        start = i + 1;
      }
    } else {
      if (start < i) {
        buffer.push(str.substring(start, i));
      }
      buffer.push(`&#x${char.toString(16).toUpperCase()};`);
      if (char > 0xd7ff && (char < 0xe000 || char > 0xfffd)) {
        i++;
      }
      start = i + 1;
    }
  }
  if (buffer.length === 0) {
    return str;
  }
  if (start < str.length) {
    buffer.push(str.substring(start, str.length));
  }
  return buffer.join("");
}
function validateFontName(fontFamily, mustWarn = false) {
  const m = /^("|').*("|')$/.exec(fontFamily);
  if (m && m[1] === m[2]) {
    const re = new RegExp(`[^\\\\]${m[1]}`);
    if (re.test(fontFamily.slice(1, -1))) {
      if (mustWarn) {
        warn(`FontFamily contains unescaped ${m[1]}: ${fontFamily}.`);
      }
      return false;
    }
  } else {
    for (const ident of fontFamily.split(/[ \t]+/)) {
      if (/^(\d|(-(\d|-)))/.test(ident) || !/^[\w-\\]+$/.test(ident)) {
        if (mustWarn) {
          warn(`FontFamily contains invalid <custom-ident>: ${fontFamily}.`);
        }
        return false;
      }
    }
  }
  return true;
}
function validateCSSFont(cssFontInfo) {
  const DEFAULT_CSS_FONT_OBLIQUE = "14";
  const DEFAULT_CSS_FONT_WEIGHT = "400";
  const CSS_FONT_WEIGHT_VALUES = new Set(["100", "200", "300", "400", "500", "600", "700", "800", "900", "1000", "normal", "bold", "bolder", "lighter"]);
  const {
    fontFamily,
    fontWeight,
    italicAngle
  } = cssFontInfo;
  if (!validateFontName(fontFamily, true)) {
    return false;
  }
  const weight = fontWeight ? fontWeight.toString() : "";
  cssFontInfo.fontWeight = CSS_FONT_WEIGHT_VALUES.has(weight) ? weight : DEFAULT_CSS_FONT_WEIGHT;
  const angle = parseFloat(italicAngle);
  cssFontInfo.italicAngle = isNaN(angle) || angle < -90 || angle > 90 ? DEFAULT_CSS_FONT_OBLIQUE : italicAngle.toString();
  return true;
}
function recoverJsURL(str) {
  const URL_OPEN_METHODS = ["app.launchURL", "window.open", "xfa.host.gotoURL"];
  const regex = new RegExp("^\\s*(" + URL_OPEN_METHODS.join("|").replaceAll(".", "\\.") + ")\\((?:'|\")([^'\"]*)(?:'|\")(?:,\\s*(\\w+)\\)|\\))", "i");
  const jsUrl = regex.exec(str);
  if (jsUrl?.[2]) {
    const url = jsUrl[2];
    let newWindow = false;
    if (jsUrl[3] === "true" && jsUrl[1] === "app.launchURL") {
      newWindow = true;
    }
    return {
      url,
      newWindow
    };
  }
  return null;
}
function numberToString(value) {
  if (Number.isInteger(value)) {
    return value.toString();
  }
  const roundedValue = Math.round(value * 100);
  if (roundedValue % 100 === 0) {
    return (roundedValue / 100).toString();
  }
  if (roundedValue % 10 === 0) {
    return value.toFixed(1);
  }
  return value.toFixed(2);
}
function getNewAnnotationsMap(annotationStorage) {
  if (!annotationStorage) {
    return null;
  }
  const newAnnotationsByPage = new Map();
  for (const [key, value] of annotationStorage) {
    if (!key.startsWith(AnnotationEditorPrefix)) {
      continue;
    }
    let annotations = newAnnotationsByPage.get(value.pageIndex);
    if (!annotations) {
      annotations = [];
      newAnnotationsByPage.set(value.pageIndex, annotations);
    }
    annotations.push(value);
  }
  return newAnnotationsByPage.size > 0 ? newAnnotationsByPage : null;
}
function isAscii(str) {
  return /^[\x00-\x7F]*$/.test(str);
}
function stringToUTF16HexString(str) {
  const buf = [];
  for (let i = 0, ii = str.length; i < ii; i++) {
    const char = str.charCodeAt(i);
    buf.push((char >> 8 & 0xff).toString(16).padStart(2, "0"), (char & 0xff).toString(16).padStart(2, "0"));
  }
  return buf.join("");
}
function stringToUTF16String(str, bigEndian = false) {
  const buf = [];
  if (bigEndian) {
    buf.push("\xFE\xFF");
  }
  for (let i = 0, ii = str.length; i < ii; i++) {
    const char = str.charCodeAt(i);
    buf.push(String.fromCharCode(char >> 8 & 0xff), String.fromCharCode(char & 0xff));
  }
  return buf.join("");
}
function getRotationMatrix(rotation, width, height) {
  switch (rotation) {
    case 90:
      return [0, 1, -1, 0, width, 0];
    case 180:
      return [-1, 0, 0, -1, width, height];
    case 270:
      return [0, -1, 1, 0, 0, height];
    default:
      throw new Error("Invalid rotation");
  }
}
function getSizeInBytes(x) {
  return Math.ceil(Math.ceil(Math.log2(1 + x)) / 8);
}

;// CONCATENATED MODULE: ./src/core/arithmetic_decoder.js
const QeTable = [{
  qe: 0x5601,
  nmps: 1,
  nlps: 1,
  switchFlag: 1
}, {
  qe: 0x3401,
  nmps: 2,
  nlps: 6,
  switchFlag: 0
}, {
  qe: 0x1801,
  nmps: 3,
  nlps: 9,
  switchFlag: 0
}, {
  qe: 0x0ac1,
  nmps: 4,
  nlps: 12,
  switchFlag: 0
}, {
  qe: 0x0521,
  nmps: 5,
  nlps: 29,
  switchFlag: 0
}, {
  qe: 0x0221,
  nmps: 38,
  nlps: 33,
  switchFlag: 0
}, {
  qe: 0x5601,
  nmps: 7,
  nlps: 6,
  switchFlag: 1
}, {
  qe: 0x5401,
  nmps: 8,
  nlps: 14,
  switchFlag: 0
}, {
  qe: 0x4801,
  nmps: 9,
  nlps: 14,
  switchFlag: 0
}, {
  qe: 0x3801,
  nmps: 10,
  nlps: 14,
  switchFlag: 0
}, {
  qe: 0x3001,
  nmps: 11,
  nlps: 17,
  switchFlag: 0
}, {
  qe: 0x2401,
  nmps: 12,
  nlps: 18,
  switchFlag: 0
}, {
  qe: 0x1c01,
  nmps: 13,
  nlps: 20,
  switchFlag: 0
}, {
  qe: 0x1601,
  nmps: 29,
  nlps: 21,
  switchFlag: 0
}, {
  qe: 0x5601,
  nmps: 15,
  nlps: 14,
  switchFlag: 1
}, {
  qe: 0x5401,
  nmps: 16,
  nlps: 14,
  switchFlag: 0
}, {
  qe: 0x5101,
  nmps: 17,
  nlps: 15,
  switchFlag: 0
}, {
  qe: 0x4801,
  nmps: 18,
  nlps: 16,
  switchFlag: 0
}, {
  qe: 0x3801,
  nmps: 19,
  nlps: 17,
  switchFlag: 0
}, {
  qe: 0x3401,
  nmps: 20,
  nlps: 18,
  switchFlag: 0
}, {
  qe: 0x3001,
  nmps: 21,
  nlps: 19,
  switchFlag: 0
}, {
  qe: 0x2801,
  nmps: 22,
  nlps: 19,
  switchFlag: 0
}, {
  qe: 0x2401,
  nmps: 23,
  nlps: 20,
  switchFlag: 0
}, {
  qe: 0x2201,
  nmps: 24,
  nlps: 21,
  switchFlag: 0
}, {
  qe: 0x1c01,
  nmps: 25,
  nlps: 22,
  switchFlag: 0
}, {
  qe: 0x1801,
  nmps: 26,
  nlps: 23,
  switchFlag: 0
}, {
  qe: 0x1601,
  nmps: 27,
  nlps: 24,
  switchFlag: 0
}, {
  qe: 0x1401,
  nmps: 28,
  nlps: 25,
  switchFlag: 0
}, {
  qe: 0x1201,
  nmps: 29,
  nlps: 26,
  switchFlag: 0
}, {
  qe: 0x1101,
  nmps: 30,
  nlps: 27,
  switchFlag: 0
}, {
  qe: 0x0ac1,
  nmps: 31,
  nlps: 28,
  switchFlag: 0
}, {
  qe: 0x09c1,
  nmps: 32,
  nlps: 29,
  switchFlag: 0
}, {
  qe: 0x08a1,
  nmps: 33,
  nlps: 30,
  switchFlag: 0
}, {
  qe: 0x0521,
  nmps: 34,
  nlps: 31,
  switchFlag: 0
}, {
  qe: 0x0441,
  nmps: 35,
  nlps: 32,
  switchFlag: 0
}, {
  qe: 0x02a1,
  nmps: 36,
  nlps: 33,
  switchFlag: 0
}, {
  qe: 0x0221,
  nmps: 37,
  nlps: 34,
  switchFlag: 0
}, {
  qe: 0x0141,
  nmps: 38,
  nlps: 35,
  switchFlag: 0
}, {
  qe: 0x0111,
  nmps: 39,
  nlps: 36,
  switchFlag: 0
}, {
  qe: 0x0085,
  nmps: 40,
  nlps: 37,
  switchFlag: 0
}, {
  qe: 0x0049,
  nmps: 41,
  nlps: 38,
  switchFlag: 0
}, {
  qe: 0x0025,
  nmps: 42,
  nlps: 39,
  switchFlag: 0
}, {
  qe: 0x0015,
  nmps: 43,
  nlps: 40,
  switchFlag: 0
}, {
  qe: 0x0009,
  nmps: 44,
  nlps: 41,
  switchFlag: 0
}, {
  qe: 0x0005,
  nmps: 45,
  nlps: 42,
  switchFlag: 0
}, {
  qe: 0x0001,
  nmps: 45,
  nlps: 43,
  switchFlag: 0
}, {
  qe: 0x5601,
  nmps: 46,
  nlps: 46,
  switchFlag: 0
}];
class ArithmeticDecoder {
  constructor(data, start, end) {
    this.data = data;
    this.bp = start;
    this.dataEnd = end;
    this.chigh = data[start];
    this.clow = 0;
    this.byteIn();
    this.chigh = this.chigh << 7 & 0xffff | this.clow >> 9 & 0x7f;
    this.clow = this.clow << 7 & 0xffff;
    this.ct -= 7;
    this.a = 0x8000;
  }
  byteIn() {
    const data = this.data;
    let bp = this.bp;
    if (data[bp] === 0xff) {
      if (data[bp + 1] > 0x8f) {
        this.clow += 0xff00;
        this.ct = 8;
      } else {
        bp++;
        this.clow += data[bp] << 9;
        this.ct = 7;
        this.bp = bp;
      }
    } else {
      bp++;
      this.clow += bp < this.dataEnd ? data[bp] << 8 : 0xff00;
      this.ct = 8;
      this.bp = bp;
    }
    if (this.clow > 0xffff) {
      this.chigh += this.clow >> 16;
      this.clow &= 0xffff;
    }
  }
  readBit(contexts, pos) {
    let cx_index = contexts[pos] >> 1,
      cx_mps = contexts[pos] & 1;
    const qeTableIcx = QeTable[cx_index];
    const qeIcx = qeTableIcx.qe;
    let d;
    let a = this.a - qeIcx;
    if (this.chigh < qeIcx) {
      if (a < qeIcx) {
        a = qeIcx;
        d = cx_mps;
        cx_index = qeTableIcx.nmps;
      } else {
        a = qeIcx;
        d = 1 ^ cx_mps;
        if (qeTableIcx.switchFlag === 1) {
          cx_mps = d;
        }
        cx_index = qeTableIcx.nlps;
      }
    } else {
      this.chigh -= qeIcx;
      if ((a & 0x8000) !== 0) {
        this.a = a;
        return cx_mps;
      }
      if (a < qeIcx) {
        d = 1 ^ cx_mps;
        if (qeTableIcx.switchFlag === 1) {
          cx_mps = d;
        }
        cx_index = qeTableIcx.nlps;
      } else {
        d = cx_mps;
        cx_index = qeTableIcx.nmps;
      }
    }
    do {
      if (this.ct === 0) {
        this.byteIn();
      }
      a <<= 1;
      this.chigh = this.chigh << 1 & 0xffff | this.clow >> 15 & 1;
      this.clow = this.clow << 1 & 0xffff;
      this.ct--;
    } while ((a & 0x8000) === 0);
    this.a = a;
    contexts[pos] = cx_index << 1 | cx_mps;
    return d;
  }
}

;// CONCATENATED MODULE: ./src/core/ccitt.js

const ccittEOL = -2;
const ccittEOF = -1;
const twoDimPass = 0;
const twoDimHoriz = 1;
const twoDimVert0 = 2;
const twoDimVertR1 = 3;
const twoDimVertL1 = 4;
const twoDimVertR2 = 5;
const twoDimVertL2 = 6;
const twoDimVertR3 = 7;
const twoDimVertL3 = 8;
const twoDimTable = [[-1, -1], [-1, -1], [7, twoDimVertL3], [7, twoDimVertR3], [6, twoDimVertL2], [6, twoDimVertL2], [6, twoDimVertR2], [6, twoDimVertR2], [4, twoDimPass], [4, twoDimPass], [4, twoDimPass], [4, twoDimPass], [4, twoDimPass], [4, twoDimPass], [4, twoDimPass], [4, twoDimPass], [3, twoDimHoriz], [3, twoDimHoriz], [3, twoDimHoriz], [3, twoDimHoriz], [3, twoDimHoriz], [3, twoDimHoriz], [3, twoDimHoriz], [3, twoDimHoriz], [3, twoDimHoriz], [3, twoDimHoriz], [3, twoDimHoriz], [3, twoDimHoriz], [3, twoDimHoriz], [3, twoDimHoriz], [3, twoDimHoriz], [3, twoDimHoriz], [3, twoDimVertL1], [3, twoDimVertL1], [3, twoDimVertL1], [3, twoDimVertL1], [3, twoDimVertL1], [3, twoDimVertL1], [3, twoDimVertL1], [3, twoDimVertL1], [3, twoDimVertL1], [3, twoDimVertL1], [3, twoDimVertL1], [3, twoDimVertL1], [3, twoDimVertL1], [3, twoDimVertL1], [3, twoDimVertL1], [3, twoDimVertL1], [3, twoDimVertR1], [3, twoDimVertR1], [3, twoDimVertR1], [3, twoDimVertR1], [3, twoDimVertR1], [3, twoDimVertR1], [3, twoDimVertR1], [3, twoDimVertR1], [3, twoDimVertR1], [3, twoDimVertR1], [3, twoDimVertR1], [3, twoDimVertR1], [3, twoDimVertR1], [3, twoDimVertR1], [3, twoDimVertR1], [3, twoDimVertR1], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0], [1, twoDimVert0]];
const whiteTable1 = [[-1, -1], [12, ccittEOL], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [11, 1792], [11, 1792], [12, 1984], [12, 2048], [12, 2112], [12, 2176], [12, 2240], [12, 2304], [11, 1856], [11, 1856], [11, 1920], [11, 1920], [12, 2368], [12, 2432], [12, 2496], [12, 2560]];
const whiteTable2 = [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [8, 29], [8, 29], [8, 30], [8, 30], [8, 45], [8, 45], [8, 46], [8, 46], [7, 22], [7, 22], [7, 22], [7, 22], [7, 23], [7, 23], [7, 23], [7, 23], [8, 47], [8, 47], [8, 48], [8, 48], [6, 13], [6, 13], [6, 13], [6, 13], [6, 13], [6, 13], [6, 13], [6, 13], [7, 20], [7, 20], [7, 20], [7, 20], [8, 33], [8, 33], [8, 34], [8, 34], [8, 35], [8, 35], [8, 36], [8, 36], [8, 37], [8, 37], [8, 38], [8, 38], [7, 19], [7, 19], [7, 19], [7, 19], [8, 31], [8, 31], [8, 32], [8, 32], [6, 1], [6, 1], [6, 1], [6, 1], [6, 1], [6, 1], [6, 1], [6, 1], [6, 12], [6, 12], [6, 12], [6, 12], [6, 12], [6, 12], [6, 12], [6, 12], [8, 53], [8, 53], [8, 54], [8, 54], [7, 26], [7, 26], [7, 26], [7, 26], [8, 39], [8, 39], [8, 40], [8, 40], [8, 41], [8, 41], [8, 42], [8, 42], [8, 43], [8, 43], [8, 44], [8, 44], [7, 21], [7, 21], [7, 21], [7, 21], [7, 28], [7, 28], [7, 28], [7, 28], [8, 61], [8, 61], [8, 62], [8, 62], [8, 63], [8, 63], [8, 0], [8, 0], [8, 320], [8, 320], [8, 384], [8, 384], [5, 10], [5, 10], [5, 10], [5, 10], [5, 10], [5, 10], [5, 10], [5, 10], [5, 10], [5, 10], [5, 10], [5, 10], [5, 10], [5, 10], [5, 10], [5, 10], [5, 11], [5, 11], [5, 11], [5, 11], [5, 11], [5, 11], [5, 11], [5, 11], [5, 11], [5, 11], [5, 11], [5, 11], [5, 11], [5, 11], [5, 11], [5, 11], [7, 27], [7, 27], [7, 27], [7, 27], [8, 59], [8, 59], [8, 60], [8, 60], [9, 1472], [9, 1536], [9, 1600], [9, 1728], [7, 18], [7, 18], [7, 18], [7, 18], [7, 24], [7, 24], [7, 24], [7, 24], [8, 49], [8, 49], [8, 50], [8, 50], [8, 51], [8, 51], [8, 52], [8, 52], [7, 25], [7, 25], [7, 25], [7, 25], [8, 55], [8, 55], [8, 56], [8, 56], [8, 57], [8, 57], [8, 58], [8, 58], [6, 192], [6, 192], [6, 192], [6, 192], [6, 192], [6, 192], [6, 192], [6, 192], [6, 1664], [6, 1664], [6, 1664], [6, 1664], [6, 1664], [6, 1664], [6, 1664], [6, 1664], [8, 448], [8, 448], [8, 512], [8, 512], [9, 704], [9, 768], [8, 640], [8, 640], [8, 576], [8, 576], [9, 832], [9, 896], [9, 960], [9, 1024], [9, 1088], [9, 1152], [9, 1216], [9, 1280], [9, 1344], [9, 1408], [7, 256], [7, 256], [7, 256], [7, 256], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 2], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [4, 3], [5, 128], [5, 128], [5, 128], [5, 128], [5, 128], [5, 128], [5, 128], [5, 128], [5, 128], [5, 128], [5, 128], [5, 128], [5, 128], [5, 128], [5, 128], [5, 128], [5, 8], [5, 8], [5, 8], [5, 8], [5, 8], [5, 8], [5, 8], [5, 8], [5, 8], [5, 8], [5, 8], [5, 8], [5, 8], [5, 8], [5, 8], [5, 8], [5, 9], [5, 9], [5, 9], [5, 9], [5, 9], [5, 9], [5, 9], [5, 9], [5, 9], [5, 9], [5, 9], [5, 9], [5, 9], [5, 9], [5, 9], [5, 9], [6, 16], [6, 16], [6, 16], [6, 16], [6, 16], [6, 16], [6, 16], [6, 16], [6, 17], [6, 17], [6, 17], [6, 17], [6, 17], [6, 17], [6, 17], [6, 17], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 4], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [4, 5], [6, 14], [6, 14], [6, 14], [6, 14], [6, 14], [6, 14], [6, 14], [6, 14], [6, 15], [6, 15], [6, 15], [6, 15], [6, 15], [6, 15], [6, 15], [6, 15], [5, 64], [5, 64], [5, 64], [5, 64], [5, 64], [5, 64], [5, 64], [5, 64], [5, 64], [5, 64], [5, 64], [5, 64], [5, 64], [5, 64], [5, 64], [5, 64], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7], [4, 7]];
const blackTable1 = [[-1, -1], [-1, -1], [12, ccittEOL], [12, ccittEOL], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [11, 1792], [11, 1792], [11, 1792], [11, 1792], [12, 1984], [12, 1984], [12, 2048], [12, 2048], [12, 2112], [12, 2112], [12, 2176], [12, 2176], [12, 2240], [12, 2240], [12, 2304], [12, 2304], [11, 1856], [11, 1856], [11, 1856], [11, 1856], [11, 1920], [11, 1920], [11, 1920], [11, 1920], [12, 2368], [12, 2368], [12, 2432], [12, 2432], [12, 2496], [12, 2496], [12, 2560], [12, 2560], [10, 18], [10, 18], [10, 18], [10, 18], [10, 18], [10, 18], [10, 18], [10, 18], [12, 52], [12, 52], [13, 640], [13, 704], [13, 768], [13, 832], [12, 55], [12, 55], [12, 56], [12, 56], [13, 1280], [13, 1344], [13, 1408], [13, 1472], [12, 59], [12, 59], [12, 60], [12, 60], [13, 1536], [13, 1600], [11, 24], [11, 24], [11, 24], [11, 24], [11, 25], [11, 25], [11, 25], [11, 25], [13, 1664], [13, 1728], [12, 320], [12, 320], [12, 384], [12, 384], [12, 448], [12, 448], [13, 512], [13, 576], [12, 53], [12, 53], [12, 54], [12, 54], [13, 896], [13, 960], [13, 1024], [13, 1088], [13, 1152], [13, 1216], [10, 64], [10, 64], [10, 64], [10, 64], [10, 64], [10, 64], [10, 64], [10, 64]];
const blackTable2 = [[8, 13], [8, 13], [8, 13], [8, 13], [8, 13], [8, 13], [8, 13], [8, 13], [8, 13], [8, 13], [8, 13], [8, 13], [8, 13], [8, 13], [8, 13], [8, 13], [11, 23], [11, 23], [12, 50], [12, 51], [12, 44], [12, 45], [12, 46], [12, 47], [12, 57], [12, 58], [12, 61], [12, 256], [10, 16], [10, 16], [10, 16], [10, 16], [10, 17], [10, 17], [10, 17], [10, 17], [12, 48], [12, 49], [12, 62], [12, 63], [12, 30], [12, 31], [12, 32], [12, 33], [12, 40], [12, 41], [11, 22], [11, 22], [8, 14], [8, 14], [8, 14], [8, 14], [8, 14], [8, 14], [8, 14], [8, 14], [8, 14], [8, 14], [8, 14], [8, 14], [8, 14], [8, 14], [8, 14], [8, 14], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 10], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [7, 11], [9, 15], [9, 15], [9, 15], [9, 15], [9, 15], [9, 15], [9, 15], [9, 15], [12, 128], [12, 192], [12, 26], [12, 27], [12, 28], [12, 29], [11, 19], [11, 19], [11, 20], [11, 20], [12, 34], [12, 35], [12, 36], [12, 37], [12, 38], [12, 39], [11, 21], [11, 21], [12, 42], [12, 43], [10, 0], [10, 0], [10, 0], [10, 0], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12], [7, 12]];
const blackTable3 = [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [6, 9], [6, 8], [5, 7], [5, 7], [4, 6], [4, 6], [4, 6], [4, 6], [4, 5], [4, 5], [4, 5], [4, 5], [3, 1], [3, 1], [3, 1], [3, 1], [3, 1], [3, 1], [3, 1], [3, 1], [3, 4], [3, 4], [3, 4], [3, 4], [3, 4], [3, 4], [3, 4], [3, 4], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2]];
class CCITTFaxDecoder {
  constructor(source, options = {}) {
    if (!source || typeof source.next !== "function") {
      throw new Error('CCITTFaxDecoder - invalid "source" parameter.');
    }
    this.source = source;
    this.eof = false;
    this.encoding = options.K || 0;
    this.eoline = options.EndOfLine || false;
    this.byteAlign = options.EncodedByteAlign || false;
    this.columns = options.Columns || 1728;
    this.rows = options.Rows || 0;
    this.eoblock = options.EndOfBlock ?? true;
    this.black = options.BlackIs1 || false;
    this.codingLine = new Uint32Array(this.columns + 1);
    this.refLine = new Uint32Array(this.columns + 2);
    this.codingLine[0] = this.columns;
    this.codingPos = 0;
    this.row = 0;
    this.nextLine2D = this.encoding < 0;
    this.inputBits = 0;
    this.inputBuf = 0;
    this.outputBits = 0;
    this.rowsDone = false;
    let code1;
    while ((code1 = this._lookBits(12)) === 0) {
      this._eatBits(1);
    }
    if (code1 === 1) {
      this._eatBits(12);
    }
    if (this.encoding > 0) {
      this.nextLine2D = !this._lookBits(1);
      this._eatBits(1);
    }
  }
  readNextChar() {
    if (this.eof) {
      return -1;
    }
    const refLine = this.refLine;
    const codingLine = this.codingLine;
    const columns = this.columns;
    let refPos, blackPixels, bits, i;
    if (this.outputBits === 0) {
      if (this.rowsDone) {
        this.eof = true;
      }
      if (this.eof) {
        return -1;
      }
      this.err = false;
      let code1, code2, code3;
      if (this.nextLine2D) {
        for (i = 0; codingLine[i] < columns; ++i) {
          refLine[i] = codingLine[i];
        }
        refLine[i++] = columns;
        refLine[i] = columns;
        codingLine[0] = 0;
        this.codingPos = 0;
        refPos = 0;
        blackPixels = 0;
        while (codingLine[this.codingPos] < columns) {
          code1 = this._getTwoDimCode();
          switch (code1) {
            case twoDimPass:
              this._addPixels(refLine[refPos + 1], blackPixels);
              if (refLine[refPos + 1] < columns) {
                refPos += 2;
              }
              break;
            case twoDimHoriz:
              code1 = code2 = 0;
              if (blackPixels) {
                do {
                  code1 += code3 = this._getBlackCode();
                } while (code3 >= 64);
                do {
                  code2 += code3 = this._getWhiteCode();
                } while (code3 >= 64);
              } else {
                do {
                  code1 += code3 = this._getWhiteCode();
                } while (code3 >= 64);
                do {
                  code2 += code3 = this._getBlackCode();
                } while (code3 >= 64);
              }
              this._addPixels(codingLine[this.codingPos] + code1, blackPixels);
              if (codingLine[this.codingPos] < columns) {
                this._addPixels(codingLine[this.codingPos] + code2, blackPixels ^ 1);
              }
              while (refLine[refPos] <= codingLine[this.codingPos] && refLine[refPos] < columns) {
                refPos += 2;
              }
              break;
            case twoDimVertR3:
              this._addPixels(refLine[refPos] + 3, blackPixels);
              blackPixels ^= 1;
              if (codingLine[this.codingPos] < columns) {
                ++refPos;
                while (refLine[refPos] <= codingLine[this.codingPos] && refLine[refPos] < columns) {
                  refPos += 2;
                }
              }
              break;
            case twoDimVertR2:
              this._addPixels(refLine[refPos] + 2, blackPixels);
              blackPixels ^= 1;
              if (codingLine[this.codingPos] < columns) {
                ++refPos;
                while (refLine[refPos] <= codingLine[this.codingPos] && refLine[refPos] < columns) {
                  refPos += 2;
                }
              }
              break;
            case twoDimVertR1:
              this._addPixels(refLine[refPos] + 1, blackPixels);
              blackPixels ^= 1;
              if (codingLine[this.codingPos] < columns) {
                ++refPos;
                while (refLine[refPos] <= codingLine[this.codingPos] && refLine[refPos] < columns) {
                  refPos += 2;
                }
              }
              break;
            case twoDimVert0:
              this._addPixels(refLine[refPos], blackPixels);
              blackPixels ^= 1;
              if (codingLine[this.codingPos] < columns) {
                ++refPos;
                while (refLine[refPos] <= codingLine[this.codingPos] && refLine[refPos] < columns) {
                  refPos += 2;
                }
              }
              break;
            case twoDimVertL3:
              this._addPixelsNeg(refLine[refPos] - 3, blackPixels);
              blackPixels ^= 1;
              if (codingLine[this.codingPos] < columns) {
                if (refPos > 0) {
                  --refPos;
                } else {
                  ++refPos;
                }
                while (refLine[refPos] <= codingLine[this.codingPos] && refLine[refPos] < columns) {
                  refPos += 2;
                }
              }
              break;
            case twoDimVertL2:
              this._addPixelsNeg(refLine[refPos] - 2, blackPixels);
              blackPixels ^= 1;
              if (codingLine[this.codingPos] < columns) {
                if (refPos > 0) {
                  --refPos;
                } else {
                  ++refPos;
                }
                while (refLine[refPos] <= codingLine[this.codingPos] && refLine[refPos] < columns) {
                  refPos += 2;
                }
              }
              break;
            case twoDimVertL1:
              this._addPixelsNeg(refLine[refPos] - 1, blackPixels);
              blackPixels ^= 1;
              if (codingLine[this.codingPos] < columns) {
                if (refPos > 0) {
                  --refPos;
                } else {
                  ++refPos;
                }
                while (refLine[refPos] <= codingLine[this.codingPos] && refLine[refPos] < columns) {
                  refPos += 2;
                }
              }
              break;
            case ccittEOF:
              this._addPixels(columns, 0);
              this.eof = true;
              break;
            default:
              info("bad 2d code");
              this._addPixels(columns, 0);
              this.err = true;
          }
        }
      } else {
        codingLine[0] = 0;
        this.codingPos = 0;
        blackPixels = 0;
        while (codingLine[this.codingPos] < columns) {
          code1 = 0;
          if (blackPixels) {
            do {
              code1 += code3 = this._getBlackCode();
            } while (code3 >= 64);
          } else {
            do {
              code1 += code3 = this._getWhiteCode();
            } while (code3 >= 64);
          }
          this._addPixels(codingLine[this.codingPos] + code1, blackPixels);
          blackPixels ^= 1;
        }
      }
      let gotEOL = false;
      if (this.byteAlign) {
        this.inputBits &= ~7;
      }
      if (!this.eoblock && this.row === this.rows - 1) {
        this.rowsDone = true;
      } else {
        code1 = this._lookBits(12);
        if (this.eoline) {
          while (code1 !== ccittEOF && code1 !== 1) {
            this._eatBits(1);
            code1 = this._lookBits(12);
          }
        } else {
          while (code1 === 0) {
            this._eatBits(1);
            code1 = this._lookBits(12);
          }
        }
        if (code1 === 1) {
          this._eatBits(12);
          gotEOL = true;
        } else if (code1 === ccittEOF) {
          this.eof = true;
        }
      }
      if (!this.eof && this.encoding > 0 && !this.rowsDone) {
        this.nextLine2D = !this._lookBits(1);
        this._eatBits(1);
      }
      if (this.eoblock && gotEOL && this.byteAlign) {
        code1 = this._lookBits(12);
        if (code1 === 1) {
          this._eatBits(12);
          if (this.encoding > 0) {
            this._lookBits(1);
            this._eatBits(1);
          }
          if (this.encoding >= 0) {
            for (i = 0; i < 4; ++i) {
              code1 = this._lookBits(12);
              if (code1 !== 1) {
                info("bad rtc code: " + code1);
              }
              this._eatBits(12);
              if (this.encoding > 0) {
                this._lookBits(1);
                this._eatBits(1);
              }
            }
          }
          this.eof = true;
        }
      } else if (this.err && this.eoline) {
        while (true) {
          code1 = this._lookBits(13);
          if (code1 === ccittEOF) {
            this.eof = true;
            return -1;
          }
          if (code1 >> 1 === 1) {
            break;
          }
          this._eatBits(1);
        }
        this._eatBits(12);
        if (this.encoding > 0) {
          this._eatBits(1);
          this.nextLine2D = !(code1 & 1);
        }
      }
      this.outputBits = codingLine[0] > 0 ? codingLine[this.codingPos = 0] : codingLine[this.codingPos = 1];
      this.row++;
    }
    let c;
    if (this.outputBits >= 8) {
      c = this.codingPos & 1 ? 0 : 0xff;
      this.outputBits -= 8;
      if (this.outputBits === 0 && codingLine[this.codingPos] < columns) {
        this.codingPos++;
        this.outputBits = codingLine[this.codingPos] - codingLine[this.codingPos - 1];
      }
    } else {
      bits = 8;
      c = 0;
      do {
        if (typeof this.outputBits !== "number") {
          throw new FormatError('Invalid /CCITTFaxDecode data, "outputBits" must be a number.');
        }
        if (this.outputBits > bits) {
          c <<= bits;
          if (!(this.codingPos & 1)) {
            c |= 0xff >> 8 - bits;
          }
          this.outputBits -= bits;
          bits = 0;
        } else {
          c <<= this.outputBits;
          if (!(this.codingPos & 1)) {
            c |= 0xff >> 8 - this.outputBits;
          }
          bits -= this.outputBits;
          this.outputBits = 0;
          if (codingLine[this.codingPos] < columns) {
            this.codingPos++;
            this.outputBits = codingLine[this.codingPos] - codingLine[this.codingPos - 1];
          } else if (bits > 0) {
            c <<= bits;
            bits = 0;
          }
        }
      } while (bits);
    }
    if (this.black) {
      c ^= 0xff;
    }
    return c;
  }
  _addPixels(a1, blackPixels) {
    const codingLine = this.codingLine;
    let codingPos = this.codingPos;
    if (a1 > codingLine[codingPos]) {
      if (a1 > this.columns) {
        info("row is wrong length");
        this.err = true;
        a1 = this.columns;
      }
      if (codingPos & 1 ^ blackPixels) {
        ++codingPos;
      }
      codingLine[codingPos] = a1;
    }
    this.codingPos = codingPos;
  }
  _addPixelsNeg(a1, blackPixels) {
    const codingLine = this.codingLine;
    let codingPos = this.codingPos;
    if (a1 > codingLine[codingPos]) {
      if (a1 > this.columns) {
        info("row is wrong length");
        this.err = true;
        a1 = this.columns;
      }
      if (codingPos & 1 ^ blackPixels) {
        ++codingPos;
      }
      codingLine[codingPos] = a1;
    } else if (a1 < codingLine[codingPos]) {
      if (a1 < 0) {
        info("invalid code");
        this.err = true;
        a1 = 0;
      }
      while (codingPos > 0 && a1 < codingLine[codingPos - 1]) {
        --codingPos;
      }
      codingLine[codingPos] = a1;
    }
    this.codingPos = codingPos;
  }
  _findTableCode(start, end, table, limit) {
    const limitValue = limit || 0;
    for (let i = start; i <= end; ++i) {
      let code = this._lookBits(i);
      if (code === ccittEOF) {
        return [true, 1, false];
      }
      if (i < end) {
        code <<= end - i;
      }
      if (!limitValue || code >= limitValue) {
        const p = table[code - limitValue];
        if (p[0] === i) {
          this._eatBits(i);
          return [true, p[1], true];
        }
      }
    }
    return [false, 0, false];
  }
  _getTwoDimCode() {
    let code = 0;
    let p;
    if (this.eoblock) {
      code = this._lookBits(7);
      p = twoDimTable[code];
      if (p?.[0] > 0) {
        this._eatBits(p[0]);
        return p[1];
      }
    } else {
      const result = this._findTableCode(1, 7, twoDimTable);
      if (result[0] && result[2]) {
        return result[1];
      }
    }
    info("Bad two dim code");
    return ccittEOF;
  }
  _getWhiteCode() {
    let code = 0;
    let p;
    if (this.eoblock) {
      code = this._lookBits(12);
      if (code === ccittEOF) {
        return 1;
      }
      p = code >> 5 === 0 ? whiteTable1[code] : whiteTable2[code >> 3];
      if (p[0] > 0) {
        this._eatBits(p[0]);
        return p[1];
      }
    } else {
      let result = this._findTableCode(1, 9, whiteTable2);
      if (result[0]) {
        return result[1];
      }
      result = this._findTableCode(11, 12, whiteTable1);
      if (result[0]) {
        return result[1];
      }
    }
    info("bad white code");
    this._eatBits(1);
    return 1;
  }
  _getBlackCode() {
    let code, p;
    if (this.eoblock) {
      code = this._lookBits(13);
      if (code === ccittEOF) {
        return 1;
      }
      if (code >> 7 === 0) {
        p = blackTable1[code];
      } else if (code >> 9 === 0 && code >> 7 !== 0) {
        p = blackTable2[(code >> 1) - 64];
      } else {
        p = blackTable3[code >> 7];
      }
      if (p[0] > 0) {
        this._eatBits(p[0]);
        return p[1];
      }
    } else {
      let result = this._findTableCode(2, 6, blackTable3);
      if (result[0]) {
        return result[1];
      }
      result = this._findTableCode(7, 12, blackTable2, 64);
      if (result[0]) {
        return result[1];
      }
      result = this._findTableCode(10, 13, blackTable1);
      if (result[0]) {
        return result[1];
      }
    }
    info("bad black code");
    this._eatBits(1);
    return 1;
  }
  _lookBits(n) {
    let c;
    while (this.inputBits < n) {
      if ((c = this.source.next()) === -1) {
        if (this.inputBits === 0) {
          return ccittEOF;
        }
        return this.inputBuf << n - this.inputBits & 0xffff >> 16 - n;
      }
      this.inputBuf = this.inputBuf << 8 | c;
      this.inputBits += 8;
    }
    return this.inputBuf >> this.inputBits - n & 0xffff >> 16 - n;
  }
  _eatBits(n) {
    if ((this.inputBits -= n) < 0) {
      this.inputBits = 0;
    }
  }
}

;// CONCATENATED MODULE: ./src/core/jbig2.js




class Jbig2Error extends BaseException {
  constructor(msg) {
    super(msg, "Jbig2Error");
  }
}
class ContextCache {
  getContexts(id) {
    if (id in this) {
      return this[id];
    }
    return this[id] = new Int8Array(1 << 16);
  }
}
class DecodingContext {
  constructor(data, start, end) {
    this.data = data;
    this.start = start;
    this.end = end;
  }
  get decoder() {
    const decoder = new ArithmeticDecoder(this.data, this.start, this.end);
    return util_shadow(this, "decoder", decoder);
  }
  get contextCache() {
    const cache = new ContextCache();
    return util_shadow(this, "contextCache", cache);
  }
}
const MAX_INT_32 = 2 ** 31 - 1;
const MIN_INT_32 = -(2 ** 31);
function decodeInteger(contextCache, procedure, decoder) {
  const contexts = contextCache.getContexts(procedure);
  let prev = 1;
  function readBits(length) {
    let v = 0;
    for (let i = 0; i < length; i++) {
      const bit = decoder.readBit(contexts, prev);
      prev = prev < 256 ? prev << 1 | bit : (prev << 1 | bit) & 511 | 256;
      v = v << 1 | bit;
    }
    return v >>> 0;
  }
  const sign = readBits(1);
  const value = readBits(1) ? readBits(1) ? readBits(1) ? readBits(1) ? readBits(1) ? readBits(32) + 4436 : readBits(12) + 340 : readBits(8) + 84 : readBits(6) + 20 : readBits(4) + 4 : readBits(2);
  let signedValue;
  if (sign === 0) {
    signedValue = value;
  } else if (value > 0) {
    signedValue = -value;
  }
  if (signedValue >= MIN_INT_32 && signedValue <= MAX_INT_32) {
    return signedValue;
  }
  return null;
}
function decodeIAID(contextCache, decoder, codeLength) {
  const contexts = contextCache.getContexts("IAID");
  let prev = 1;
  for (let i = 0; i < codeLength; i++) {
    const bit = decoder.readBit(contexts, prev);
    prev = prev << 1 | bit;
  }
  if (codeLength < 31) {
    return prev & (1 << codeLength) - 1;
  }
  return prev & 0x7fffffff;
}
const SegmentTypes = ["SymbolDictionary", null, null, null, "IntermediateTextRegion", null, "ImmediateTextRegion", "ImmediateLosslessTextRegion", null, null, null, null, null, null, null, null, "PatternDictionary", null, null, null, "IntermediateHalftoneRegion", null, "ImmediateHalftoneRegion", "ImmediateLosslessHalftoneRegion", null, null, null, null, null, null, null, null, null, null, null, null, "IntermediateGenericRegion", null, "ImmediateGenericRegion", "ImmediateLosslessGenericRegion", "IntermediateGenericRefinementRegion", null, "ImmediateGenericRefinementRegion", "ImmediateLosslessGenericRefinementRegion", null, null, null, null, "PageInformation", "EndOfPage", "EndOfStripe", "EndOfFile", "Profiles", "Tables", null, null, null, null, null, null, null, null, "Extension"];
const CodingTemplates = [[{
  x: -1,
  y: -2
}, {
  x: 0,
  y: -2
}, {
  x: 1,
  y: -2
}, {
  x: -2,
  y: -1
}, {
  x: -1,
  y: -1
}, {
  x: 0,
  y: -1
}, {
  x: 1,
  y: -1
}, {
  x: 2,
  y: -1
}, {
  x: -4,
  y: 0
}, {
  x: -3,
  y: 0
}, {
  x: -2,
  y: 0
}, {
  x: -1,
  y: 0
}], [{
  x: -1,
  y: -2
}, {
  x: 0,
  y: -2
}, {
  x: 1,
  y: -2
}, {
  x: 2,
  y: -2
}, {
  x: -2,
  y: -1
}, {
  x: -1,
  y: -1
}, {
  x: 0,
  y: -1
}, {
  x: 1,
  y: -1
}, {
  x: 2,
  y: -1
}, {
  x: -3,
  y: 0
}, {
  x: -2,
  y: 0
}, {
  x: -1,
  y: 0
}], [{
  x: -1,
  y: -2
}, {
  x: 0,
  y: -2
}, {
  x: 1,
  y: -2
}, {
  x: -2,
  y: -1
}, {
  x: -1,
  y: -1
}, {
  x: 0,
  y: -1
}, {
  x: 1,
  y: -1
}, {
  x: -2,
  y: 0
}, {
  x: -1,
  y: 0
}], [{
  x: -3,
  y: -1
}, {
  x: -2,
  y: -1
}, {
  x: -1,
  y: -1
}, {
  x: 0,
  y: -1
}, {
  x: 1,
  y: -1
}, {
  x: -4,
  y: 0
}, {
  x: -3,
  y: 0
}, {
  x: -2,
  y: 0
}, {
  x: -1,
  y: 0
}]];
const RefinementTemplates = [{
  coding: [{
    x: 0,
    y: -1
  }, {
    x: 1,
    y: -1
  }, {
    x: -1,
    y: 0
  }],
  reference: [{
    x: 0,
    y: -1
  }, {
    x: 1,
    y: -1
  }, {
    x: -1,
    y: 0
  }, {
    x: 0,
    y: 0
  }, {
    x: 1,
    y: 0
  }, {
    x: -1,
    y: 1
  }, {
    x: 0,
    y: 1
  }, {
    x: 1,
    y: 1
  }]
}, {
  coding: [{
    x: -1,
    y: -1
  }, {
    x: 0,
    y: -1
  }, {
    x: 1,
    y: -1
  }, {
    x: -1,
    y: 0
  }],
  reference: [{
    x: 0,
    y: -1
  }, {
    x: -1,
    y: 0
  }, {
    x: 0,
    y: 0
  }, {
    x: 1,
    y: 0
  }, {
    x: 0,
    y: 1
  }, {
    x: 1,
    y: 1
  }]
}];
const ReusedContexts = [0x9b25, 0x0795, 0x00e5, 0x0195];
const RefinementReusedContexts = [0x0020, 0x0008];
function decodeBitmapTemplate0(width, height, decodingContext) {
  const decoder = decodingContext.decoder;
  const contexts = decodingContext.contextCache.getContexts("GB");
  const bitmap = [];
  let contextLabel, i, j, pixel, row, row1, row2;
  const OLD_PIXEL_MASK = 0x7bf7;
  for (i = 0; i < height; i++) {
    row = bitmap[i] = new Uint8Array(width);
    row1 = i < 1 ? row : bitmap[i - 1];
    row2 = i < 2 ? row : bitmap[i - 2];
    contextLabel = row2[0] << 13 | row2[1] << 12 | row2[2] << 11 | row1[0] << 7 | row1[1] << 6 | row1[2] << 5 | row1[3] << 4;
    for (j = 0; j < width; j++) {
      row[j] = pixel = decoder.readBit(contexts, contextLabel);
      contextLabel = (contextLabel & OLD_PIXEL_MASK) << 1 | (j + 3 < width ? row2[j + 3] << 11 : 0) | (j + 4 < width ? row1[j + 4] << 4 : 0) | pixel;
    }
  }
  return bitmap;
}
function decodeBitmap(mmr, width, height, templateIndex, prediction, skip, at, decodingContext) {
  if (mmr) {
    const input = new Reader(decodingContext.data, decodingContext.start, decodingContext.end);
    return decodeMMRBitmap(input, width, height, false);
  }
  if (templateIndex === 0 && !skip && !prediction && at.length === 4 && at[0].x === 3 && at[0].y === -1 && at[1].x === -3 && at[1].y === -1 && at[2].x === 2 && at[2].y === -2 && at[3].x === -2 && at[3].y === -2) {
    return decodeBitmapTemplate0(width, height, decodingContext);
  }
  const useskip = !!skip;
  const template = CodingTemplates[templateIndex].concat(at);
  template.sort(function (a, b) {
    return a.y - b.y || a.x - b.x;
  });
  const templateLength = template.length;
  const templateX = new Int8Array(templateLength);
  const templateY = new Int8Array(templateLength);
  const changingTemplateEntries = [];
  let reuseMask = 0,
    minX = 0,
    maxX = 0,
    minY = 0;
  let c, k;
  for (k = 0; k < templateLength; k++) {
    templateX[k] = template[k].x;
    templateY[k] = template[k].y;
    minX = Math.min(minX, template[k].x);
    maxX = Math.max(maxX, template[k].x);
    minY = Math.min(minY, template[k].y);
    if (k < templateLength - 1 && template[k].y === template[k + 1].y && template[k].x === template[k + 1].x - 1) {
      reuseMask |= 1 << templateLength - 1 - k;
    } else {
      changingTemplateEntries.push(k);
    }
  }
  const changingEntriesLength = changingTemplateEntries.length;
  const changingTemplateX = new Int8Array(changingEntriesLength);
  const changingTemplateY = new Int8Array(changingEntriesLength);
  const changingTemplateBit = new Uint16Array(changingEntriesLength);
  for (c = 0; c < changingEntriesLength; c++) {
    k = changingTemplateEntries[c];
    changingTemplateX[c] = template[k].x;
    changingTemplateY[c] = template[k].y;
    changingTemplateBit[c] = 1 << templateLength - 1 - k;
  }
  const sbb_left = -minX;
  const sbb_top = -minY;
  const sbb_right = width - maxX;
  const pseudoPixelContext = ReusedContexts[templateIndex];
  let row = new Uint8Array(width);
  const bitmap = [];
  const decoder = decodingContext.decoder;
  const contexts = decodingContext.contextCache.getContexts("GB");
  let ltp = 0,
    j,
    i0,
    j0,
    contextLabel = 0,
    bit,
    shift;
  for (let i = 0; i < height; i++) {
    if (prediction) {
      const sltp = decoder.readBit(contexts, pseudoPixelContext);
      ltp ^= sltp;
      if (ltp) {
        bitmap.push(row);
        continue;
      }
    }
    row = new Uint8Array(row);
    bitmap.push(row);
    for (j = 0; j < width; j++) {
      if (useskip && skip[i][j]) {
        row[j] = 0;
        continue;
      }
      if (j >= sbb_left && j < sbb_right && i >= sbb_top) {
        contextLabel = contextLabel << 1 & reuseMask;
        for (k = 0; k < changingEntriesLength; k++) {
          i0 = i + changingTemplateY[k];
          j0 = j + changingTemplateX[k];
          bit = bitmap[i0][j0];
          if (bit) {
            bit = changingTemplateBit[k];
            contextLabel |= bit;
          }
        }
      } else {
        contextLabel = 0;
        shift = templateLength - 1;
        for (k = 0; k < templateLength; k++, shift--) {
          j0 = j + templateX[k];
          if (j0 >= 0 && j0 < width) {
            i0 = i + templateY[k];
            if (i0 >= 0) {
              bit = bitmap[i0][j0];
              if (bit) {
                contextLabel |= bit << shift;
              }
            }
          }
        }
      }
      const pixel = decoder.readBit(contexts, contextLabel);
      row[j] = pixel;
    }
  }
  return bitmap;
}
function decodeRefinement(width, height, templateIndex, referenceBitmap, offsetX, offsetY, prediction, at, decodingContext) {
  let codingTemplate = RefinementTemplates[templateIndex].coding;
  if (templateIndex === 0) {
    codingTemplate = codingTemplate.concat([at[0]]);
  }
  const codingTemplateLength = codingTemplate.length;
  const codingTemplateX = new Int32Array(codingTemplateLength);
  const codingTemplateY = new Int32Array(codingTemplateLength);
  let k;
  for (k = 0; k < codingTemplateLength; k++) {
    codingTemplateX[k] = codingTemplate[k].x;
    codingTemplateY[k] = codingTemplate[k].y;
  }
  let referenceTemplate = RefinementTemplates[templateIndex].reference;
  if (templateIndex === 0) {
    referenceTemplate = referenceTemplate.concat([at[1]]);
  }
  const referenceTemplateLength = referenceTemplate.length;
  const referenceTemplateX = new Int32Array(referenceTemplateLength);
  const referenceTemplateY = new Int32Array(referenceTemplateLength);
  for (k = 0; k < referenceTemplateLength; k++) {
    referenceTemplateX[k] = referenceTemplate[k].x;
    referenceTemplateY[k] = referenceTemplate[k].y;
  }
  const referenceWidth = referenceBitmap[0].length;
  const referenceHeight = referenceBitmap.length;
  const pseudoPixelContext = RefinementReusedContexts[templateIndex];
  const bitmap = [];
  const decoder = decodingContext.decoder;
  const contexts = decodingContext.contextCache.getContexts("GR");
  let ltp = 0;
  for (let i = 0; i < height; i++) {
    if (prediction) {
      const sltp = decoder.readBit(contexts, pseudoPixelContext);
      ltp ^= sltp;
      if (ltp) {
        throw new Jbig2Error("prediction is not supported");
      }
    }
    const row = new Uint8Array(width);
    bitmap.push(row);
    for (let j = 0; j < width; j++) {
      let i0, j0;
      let contextLabel = 0;
      for (k = 0; k < codingTemplateLength; k++) {
        i0 = i + codingTemplateY[k];
        j0 = j + codingTemplateX[k];
        if (i0 < 0 || j0 < 0 || j0 >= width) {
          contextLabel <<= 1;
        } else {
          contextLabel = contextLabel << 1 | bitmap[i0][j0];
        }
      }
      for (k = 0; k < referenceTemplateLength; k++) {
        i0 = i + referenceTemplateY[k] - offsetY;
        j0 = j + referenceTemplateX[k] - offsetX;
        if (i0 < 0 || i0 >= referenceHeight || j0 < 0 || j0 >= referenceWidth) {
          contextLabel <<= 1;
        } else {
          contextLabel = contextLabel << 1 | referenceBitmap[i0][j0];
        }
      }
      const pixel = decoder.readBit(contexts, contextLabel);
      row[j] = pixel;
    }
  }
  return bitmap;
}
function decodeSymbolDictionary(huffman, refinement, symbols, numberOfNewSymbols, numberOfExportedSymbols, huffmanTables, templateIndex, at, refinementTemplateIndex, refinementAt, decodingContext, huffmanInput) {
  if (huffman && refinement) {
    throw new Jbig2Error("symbol refinement with Huffman is not supported");
  }
  const newSymbols = [];
  let currentHeight = 0;
  let symbolCodeLength = log2(symbols.length + numberOfNewSymbols);
  const decoder = decodingContext.decoder;
  const contextCache = decodingContext.contextCache;
  let tableB1, symbolWidths;
  if (huffman) {
    tableB1 = getStandardTable(1);
    symbolWidths = [];
    symbolCodeLength = Math.max(symbolCodeLength, 1);
  }
  while (newSymbols.length < numberOfNewSymbols) {
    const deltaHeight = huffman ? huffmanTables.tableDeltaHeight.decode(huffmanInput) : decodeInteger(contextCache, "IADH", decoder);
    currentHeight += deltaHeight;
    let currentWidth = 0,
      totalWidth = 0;
    const firstSymbol = huffman ? symbolWidths.length : 0;
    while (true) {
      const deltaWidth = huffman ? huffmanTables.tableDeltaWidth.decode(huffmanInput) : decodeInteger(contextCache, "IADW", decoder);
      if (deltaWidth === null) {
        break;
      }
      currentWidth += deltaWidth;
      totalWidth += currentWidth;
      let bitmap;
      if (refinement) {
        const numberOfInstances = decodeInteger(contextCache, "IAAI", decoder);
        if (numberOfInstances > 1) {
          bitmap = decodeTextRegion(huffman, refinement, currentWidth, currentHeight, 0, numberOfInstances, 1, symbols.concat(newSymbols), symbolCodeLength, 0, 0, 1, 0, huffmanTables, refinementTemplateIndex, refinementAt, decodingContext, 0, huffmanInput);
        } else {
          const symbolId = decodeIAID(contextCache, decoder, symbolCodeLength);
          const rdx = decodeInteger(contextCache, "IARDX", decoder);
          const rdy = decodeInteger(contextCache, "IARDY", decoder);
          const symbol = symbolId < symbols.length ? symbols[symbolId] : newSymbols[symbolId - symbols.length];
          bitmap = decodeRefinement(currentWidth, currentHeight, refinementTemplateIndex, symbol, rdx, rdy, false, refinementAt, decodingContext);
        }
        newSymbols.push(bitmap);
      } else if (huffman) {
        symbolWidths.push(currentWidth);
      } else {
        bitmap = decodeBitmap(false, currentWidth, currentHeight, templateIndex, false, null, at, decodingContext);
        newSymbols.push(bitmap);
      }
    }
    if (huffman && !refinement) {
      const bitmapSize = huffmanTables.tableBitmapSize.decode(huffmanInput);
      huffmanInput.byteAlign();
      let collectiveBitmap;
      if (bitmapSize === 0) {
        collectiveBitmap = readUncompressedBitmap(huffmanInput, totalWidth, currentHeight);
      } else {
        const originalEnd = huffmanInput.end;
        const bitmapEnd = huffmanInput.position + bitmapSize;
        huffmanInput.end = bitmapEnd;
        collectiveBitmap = decodeMMRBitmap(huffmanInput, totalWidth, currentHeight, false);
        huffmanInput.end = originalEnd;
        huffmanInput.position = bitmapEnd;
      }
      const numberOfSymbolsDecoded = symbolWidths.length;
      if (firstSymbol === numberOfSymbolsDecoded - 1) {
        newSymbols.push(collectiveBitmap);
      } else {
        let i,
          y,
          xMin = 0,
          xMax,
          bitmapWidth,
          symbolBitmap;
        for (i = firstSymbol; i < numberOfSymbolsDecoded; i++) {
          bitmapWidth = symbolWidths[i];
          xMax = xMin + bitmapWidth;
          symbolBitmap = [];
          for (y = 0; y < currentHeight; y++) {
            symbolBitmap.push(collectiveBitmap[y].subarray(xMin, xMax));
          }
          newSymbols.push(symbolBitmap);
          xMin = xMax;
        }
      }
    }
  }
  const exportedSymbols = [],
    flags = [];
  let currentFlag = false,
    i,
    ii;
  const totalSymbolsLength = symbols.length + numberOfNewSymbols;
  while (flags.length < totalSymbolsLength) {
    let runLength = huffman ? tableB1.decode(huffmanInput) : decodeInteger(contextCache, "IAEX", decoder);
    while (runLength--) {
      flags.push(currentFlag);
    }
    currentFlag = !currentFlag;
  }
  for (i = 0, ii = symbols.length; i < ii; i++) {
    if (flags[i]) {
      exportedSymbols.push(symbols[i]);
    }
  }
  for (let j = 0; j < numberOfNewSymbols; i++, j++) {
    if (flags[i]) {
      exportedSymbols.push(newSymbols[j]);
    }
  }
  return exportedSymbols;
}
function decodeTextRegion(huffman, refinement, width, height, defaultPixelValue, numberOfSymbolInstances, stripSize, inputSymbols, symbolCodeLength, transposed, dsOffset, referenceCorner, combinationOperator, huffmanTables, refinementTemplateIndex, refinementAt, decodingContext, logStripSize, huffmanInput) {
  if (huffman && refinement) {
    throw new Jbig2Error("refinement with Huffman is not supported");
  }
  const bitmap = [];
  let i, row;
  for (i = 0; i < height; i++) {
    row = new Uint8Array(width);
    if (defaultPixelValue) {
      for (let j = 0; j < width; j++) {
        row[j] = defaultPixelValue;
      }
    }
    bitmap.push(row);
  }
  const decoder = decodingContext.decoder;
  const contextCache = decodingContext.contextCache;
  let stripT = huffman ? -huffmanTables.tableDeltaT.decode(huffmanInput) : -decodeInteger(contextCache, "IADT", decoder);
  let firstS = 0;
  i = 0;
  while (i < numberOfSymbolInstances) {
    const deltaT = huffman ? huffmanTables.tableDeltaT.decode(huffmanInput) : decodeInteger(contextCache, "IADT", decoder);
    stripT += deltaT;
    const deltaFirstS = huffman ? huffmanTables.tableFirstS.decode(huffmanInput) : decodeInteger(contextCache, "IAFS", decoder);
    firstS += deltaFirstS;
    let currentS = firstS;
    do {
      let currentT = 0;
      if (stripSize > 1) {
        currentT = huffman ? huffmanInput.readBits(logStripSize) : decodeInteger(contextCache, "IAIT", decoder);
      }
      const t = stripSize * stripT + currentT;
      const symbolId = huffman ? huffmanTables.symbolIDTable.decode(huffmanInput) : decodeIAID(contextCache, decoder, symbolCodeLength);
      const applyRefinement = refinement && (huffman ? huffmanInput.readBit() : decodeInteger(contextCache, "IARI", decoder));
      let symbolBitmap = inputSymbols[symbolId];
      let symbolWidth = symbolBitmap[0].length;
      let symbolHeight = symbolBitmap.length;
      if (applyRefinement) {
        const rdw = decodeInteger(contextCache, "IARDW", decoder);
        const rdh = decodeInteger(contextCache, "IARDH", decoder);
        const rdx = decodeInteger(contextCache, "IARDX", decoder);
        const rdy = decodeInteger(contextCache, "IARDY", decoder);
        symbolWidth += rdw;
        symbolHeight += rdh;
        symbolBitmap = decodeRefinement(symbolWidth, symbolHeight, refinementTemplateIndex, symbolBitmap, (rdw >> 1) + rdx, (rdh >> 1) + rdy, false, refinementAt, decodingContext);
      }
      let increment = 0;
      if (!transposed) {
        if (referenceCorner > 1) {
          currentS += symbolWidth - 1;
        } else {
          increment = symbolWidth - 1;
        }
      } else if (!(referenceCorner & 1)) {
        currentS += symbolHeight - 1;
      } else {
        increment = symbolHeight - 1;
      }
      const offsetT = t - (referenceCorner & 1 ? 0 : symbolHeight - 1);
      const offsetS = currentS - (referenceCorner & 2 ? symbolWidth - 1 : 0);
      let s2, t2, symbolRow;
      if (transposed) {
        for (s2 = 0; s2 < symbolHeight; s2++) {
          row = bitmap[offsetS + s2];
          if (!row) {
            continue;
          }
          symbolRow = symbolBitmap[s2];
          const maxWidth = Math.min(width - offsetT, symbolWidth);
          switch (combinationOperator) {
            case 0:
              for (t2 = 0; t2 < maxWidth; t2++) {
                row[offsetT + t2] |= symbolRow[t2];
              }
              break;
            case 2:
              for (t2 = 0; t2 < maxWidth; t2++) {
                row[offsetT + t2] ^= symbolRow[t2];
              }
              break;
            default:
              throw new Jbig2Error(`operator ${combinationOperator} is not supported`);
          }
        }
      } else {
        for (t2 = 0; t2 < symbolHeight; t2++) {
          row = bitmap[offsetT + t2];
          if (!row) {
            continue;
          }
          symbolRow = symbolBitmap[t2];
          switch (combinationOperator) {
            case 0:
              for (s2 = 0; s2 < symbolWidth; s2++) {
                row[offsetS + s2] |= symbolRow[s2];
              }
              break;
            case 2:
              for (s2 = 0; s2 < symbolWidth; s2++) {
                row[offsetS + s2] ^= symbolRow[s2];
              }
              break;
            default:
              throw new Jbig2Error(`operator ${combinationOperator} is not supported`);
          }
        }
      }
      i++;
      const deltaS = huffman ? huffmanTables.tableDeltaS.decode(huffmanInput) : decodeInteger(contextCache, "IADS", decoder);
      if (deltaS === null) {
        break;
      }
      currentS += increment + deltaS + dsOffset;
    } while (true);
  }
  return bitmap;
}
function decodePatternDictionary(mmr, patternWidth, patternHeight, maxPatternIndex, template, decodingContext) {
  const at = [];
  if (!mmr) {
    at.push({
      x: -patternWidth,
      y: 0
    });
    if (template === 0) {
      at.push({
        x: -3,
        y: -1
      }, {
        x: 2,
        y: -2
      }, {
        x: -2,
        y: -2
      });
    }
  }
  const collectiveWidth = (maxPatternIndex + 1) * patternWidth;
  const collectiveBitmap = decodeBitmap(mmr, collectiveWidth, patternHeight, template, false, null, at, decodingContext);
  const patterns = [];
  for (let i = 0; i <= maxPatternIndex; i++) {
    const patternBitmap = [];
    const xMin = patternWidth * i;
    const xMax = xMin + patternWidth;
    for (let y = 0; y < patternHeight; y++) {
      patternBitmap.push(collectiveBitmap[y].subarray(xMin, xMax));
    }
    patterns.push(patternBitmap);
  }
  return patterns;
}
function decodeHalftoneRegion(mmr, patterns, template, regionWidth, regionHeight, defaultPixelValue, enableSkip, combinationOperator, gridWidth, gridHeight, gridOffsetX, gridOffsetY, gridVectorX, gridVectorY, decodingContext) {
  const skip = null;
  if (enableSkip) {
    throw new Jbig2Error("skip is not supported");
  }
  if (combinationOperator !== 0) {
    throw new Jbig2Error(`operator "${combinationOperator}" is not supported in halftone region`);
  }
  const regionBitmap = [];
  let i, j, row;
  for (i = 0; i < regionHeight; i++) {
    row = new Uint8Array(regionWidth);
    if (defaultPixelValue) {
      for (j = 0; j < regionWidth; j++) {
        row[j] = defaultPixelValue;
      }
    }
    regionBitmap.push(row);
  }
  const numberOfPatterns = patterns.length;
  const pattern0 = patterns[0];
  const patternWidth = pattern0[0].length,
    patternHeight = pattern0.length;
  const bitsPerValue = log2(numberOfPatterns);
  const at = [];
  if (!mmr) {
    at.push({
      x: template <= 1 ? 3 : 2,
      y: -1
    });
    if (template === 0) {
      at.push({
        x: -3,
        y: -1
      }, {
        x: 2,
        y: -2
      }, {
        x: -2,
        y: -2
      });
    }
  }
  const grayScaleBitPlanes = [];
  let mmrInput, bitmap;
  if (mmr) {
    mmrInput = new Reader(decodingContext.data, decodingContext.start, decodingContext.end);
  }
  for (i = bitsPerValue - 1; i >= 0; i--) {
    if (mmr) {
      bitmap = decodeMMRBitmap(mmrInput, gridWidth, gridHeight, true);
    } else {
      bitmap = decodeBitmap(false, gridWidth, gridHeight, template, false, skip, at, decodingContext);
    }
    grayScaleBitPlanes[i] = bitmap;
  }
  let mg, ng, bit, patternIndex, patternBitmap, x, y, patternRow, regionRow;
  for (mg = 0; mg < gridHeight; mg++) {
    for (ng = 0; ng < gridWidth; ng++) {
      bit = 0;
      patternIndex = 0;
      for (j = bitsPerValue - 1; j >= 0; j--) {
        bit ^= grayScaleBitPlanes[j][mg][ng];
        patternIndex |= bit << j;
      }
      patternBitmap = patterns[patternIndex];
      x = gridOffsetX + mg * gridVectorY + ng * gridVectorX >> 8;
      y = gridOffsetY + mg * gridVectorX - ng * gridVectorY >> 8;
      if (x >= 0 && x + patternWidth <= regionWidth && y >= 0 && y + patternHeight <= regionHeight) {
        for (i = 0; i < patternHeight; i++) {
          regionRow = regionBitmap[y + i];
          patternRow = patternBitmap[i];
          for (j = 0; j < patternWidth; j++) {
            regionRow[x + j] |= patternRow[j];
          }
        }
      } else {
        let regionX, regionY;
        for (i = 0; i < patternHeight; i++) {
          regionY = y + i;
          if (regionY < 0 || regionY >= regionHeight) {
            continue;
          }
          regionRow = regionBitmap[regionY];
          patternRow = patternBitmap[i];
          for (j = 0; j < patternWidth; j++) {
            regionX = x + j;
            if (regionX >= 0 && regionX < regionWidth) {
              regionRow[regionX] |= patternRow[j];
            }
          }
        }
      }
    }
  }
  return regionBitmap;
}
function readSegmentHeader(data, start) {
  const segmentHeader = {};
  segmentHeader.number = readUint32(data, start);
  const flags = data[start + 4];
  const segmentType = flags & 0x3f;
  if (!SegmentTypes[segmentType]) {
    throw new Jbig2Error("invalid segment type: " + segmentType);
  }
  segmentHeader.type = segmentType;
  segmentHeader.typeName = SegmentTypes[segmentType];
  segmentHeader.deferredNonRetain = !!(flags & 0x80);
  const pageAssociationFieldSize = !!(flags & 0x40);
  const referredFlags = data[start + 5];
  let referredToCount = referredFlags >> 5 & 7;
  const retainBits = [referredFlags & 31];
  let position = start + 6;
  if (referredFlags === 7) {
    referredToCount = readUint32(data, position - 1) & 0x1fffffff;
    position += 3;
    let bytes = referredToCount + 7 >> 3;
    retainBits[0] = data[position++];
    while (--bytes > 0) {
      retainBits.push(data[position++]);
    }
  } else if (referredFlags === 5 || referredFlags === 6) {
    throw new Jbig2Error("invalid referred-to flags");
  }
  segmentHeader.retainBits = retainBits;
  let referredToSegmentNumberSize = 4;
  if (segmentHeader.number <= 256) {
    referredToSegmentNumberSize = 1;
  } else if (segmentHeader.number <= 65536) {
    referredToSegmentNumberSize = 2;
  }
  const referredTo = [];
  let i, ii;
  for (i = 0; i < referredToCount; i++) {
    let number;
    if (referredToSegmentNumberSize === 1) {
      number = data[position];
    } else if (referredToSegmentNumberSize === 2) {
      number = readUint16(data, position);
    } else {
      number = readUint32(data, position);
    }
    referredTo.push(number);
    position += referredToSegmentNumberSize;
  }
  segmentHeader.referredTo = referredTo;
  if (!pageAssociationFieldSize) {
    segmentHeader.pageAssociation = data[position++];
  } else {
    segmentHeader.pageAssociation = readUint32(data, position);
    position += 4;
  }
  segmentHeader.length = readUint32(data, position);
  position += 4;
  if (segmentHeader.length === 0xffffffff) {
    if (segmentType === 38) {
      const genericRegionInfo = readRegionSegmentInformation(data, position);
      const genericRegionSegmentFlags = data[position + RegionSegmentInformationFieldLength];
      const genericRegionMmr = !!(genericRegionSegmentFlags & 1);
      const searchPatternLength = 6;
      const searchPattern = new Uint8Array(searchPatternLength);
      if (!genericRegionMmr) {
        searchPattern[0] = 0xff;
        searchPattern[1] = 0xac;
      }
      searchPattern[2] = genericRegionInfo.height >>> 24 & 0xff;
      searchPattern[3] = genericRegionInfo.height >> 16 & 0xff;
      searchPattern[4] = genericRegionInfo.height >> 8 & 0xff;
      searchPattern[5] = genericRegionInfo.height & 0xff;
      for (i = position, ii = data.length; i < ii; i++) {
        let j = 0;
        while (j < searchPatternLength && searchPattern[j] === data[i + j]) {
          j++;
        }
        if (j === searchPatternLength) {
          segmentHeader.length = i + searchPatternLength;
          break;
        }
      }
      if (segmentHeader.length === 0xffffffff) {
        throw new Jbig2Error("segment end was not found");
      }
    } else {
      throw new Jbig2Error("invalid unknown segment length");
    }
  }
  segmentHeader.headerEnd = position;
  return segmentHeader;
}
function readSegments(header, data, start, end) {
  const segments = [];
  let position = start;
  while (position < end) {
    const segmentHeader = readSegmentHeader(data, position);
    position = segmentHeader.headerEnd;
    const segment = {
      header: segmentHeader,
      data
    };
    if (!header.randomAccess) {
      segment.start = position;
      position += segmentHeader.length;
      segment.end = position;
    }
    segments.push(segment);
    if (segmentHeader.type === 51) {
      break;
    }
  }
  if (header.randomAccess) {
    for (let i = 0, ii = segments.length; i < ii; i++) {
      segments[i].start = position;
      position += segments[i].header.length;
      segments[i].end = position;
    }
  }
  return segments;
}
function readRegionSegmentInformation(data, start) {
  return {
    width: readUint32(data, start),
    height: readUint32(data, start + 4),
    x: readUint32(data, start + 8),
    y: readUint32(data, start + 12),
    combinationOperator: data[start + 16] & 7
  };
}
const RegionSegmentInformationFieldLength = 17;
function processSegment(segment, visitor) {
  const header = segment.header;
  const data = segment.data,
    end = segment.end;
  let position = segment.start;
  let args, at, i, atLength;
  switch (header.type) {
    case 0:
      const dictionary = {};
      const dictionaryFlags = readUint16(data, position);
      dictionary.huffman = !!(dictionaryFlags & 1);
      dictionary.refinement = !!(dictionaryFlags & 2);
      dictionary.huffmanDHSelector = dictionaryFlags >> 2 & 3;
      dictionary.huffmanDWSelector = dictionaryFlags >> 4 & 3;
      dictionary.bitmapSizeSelector = dictionaryFlags >> 6 & 1;
      dictionary.aggregationInstancesSelector = dictionaryFlags >> 7 & 1;
      dictionary.bitmapCodingContextUsed = !!(dictionaryFlags & 256);
      dictionary.bitmapCodingContextRetained = !!(dictionaryFlags & 512);
      dictionary.template = dictionaryFlags >> 10 & 3;
      dictionary.refinementTemplate = dictionaryFlags >> 12 & 1;
      position += 2;
      if (!dictionary.huffman) {
        atLength = dictionary.template === 0 ? 4 : 1;
        at = [];
        for (i = 0; i < atLength; i++) {
          at.push({
            x: readInt8(data, position),
            y: readInt8(data, position + 1)
          });
          position += 2;
        }
        dictionary.at = at;
      }
      if (dictionary.refinement && !dictionary.refinementTemplate) {
        at = [];
        for (i = 0; i < 2; i++) {
          at.push({
            x: readInt8(data, position),
            y: readInt8(data, position + 1)
          });
          position += 2;
        }
        dictionary.refinementAt = at;
      }
      dictionary.numberOfExportedSymbols = readUint32(data, position);
      position += 4;
      dictionary.numberOfNewSymbols = readUint32(data, position);
      position += 4;
      args = [dictionary, header.number, header.referredTo, data, position, end];
      break;
    case 6:
    case 7:
      const textRegion = {};
      textRegion.info = readRegionSegmentInformation(data, position);
      position += RegionSegmentInformationFieldLength;
      const textRegionSegmentFlags = readUint16(data, position);
      position += 2;
      textRegion.huffman = !!(textRegionSegmentFlags & 1);
      textRegion.refinement = !!(textRegionSegmentFlags & 2);
      textRegion.logStripSize = textRegionSegmentFlags >> 2 & 3;
      textRegion.stripSize = 1 << textRegion.logStripSize;
      textRegion.referenceCorner = textRegionSegmentFlags >> 4 & 3;
      textRegion.transposed = !!(textRegionSegmentFlags & 64);
      textRegion.combinationOperator = textRegionSegmentFlags >> 7 & 3;
      textRegion.defaultPixelValue = textRegionSegmentFlags >> 9 & 1;
      textRegion.dsOffset = textRegionSegmentFlags << 17 >> 27;
      textRegion.refinementTemplate = textRegionSegmentFlags >> 15 & 1;
      if (textRegion.huffman) {
        const textRegionHuffmanFlags = readUint16(data, position);
        position += 2;
        textRegion.huffmanFS = textRegionHuffmanFlags & 3;
        textRegion.huffmanDS = textRegionHuffmanFlags >> 2 & 3;
        textRegion.huffmanDT = textRegionHuffmanFlags >> 4 & 3;
        textRegion.huffmanRefinementDW = textRegionHuffmanFlags >> 6 & 3;
        textRegion.huffmanRefinementDH = textRegionHuffmanFlags >> 8 & 3;
        textRegion.huffmanRefinementDX = textRegionHuffmanFlags >> 10 & 3;
        textRegion.huffmanRefinementDY = textRegionHuffmanFlags >> 12 & 3;
        textRegion.huffmanRefinementSizeSelector = !!(textRegionHuffmanFlags & 0x4000);
      }
      if (textRegion.refinement && !textRegion.refinementTemplate) {
        at = [];
        for (i = 0; i < 2; i++) {
          at.push({
            x: readInt8(data, position),
            y: readInt8(data, position + 1)
          });
          position += 2;
        }
        textRegion.refinementAt = at;
      }
      textRegion.numberOfSymbolInstances = readUint32(data, position);
      position += 4;
      args = [textRegion, header.referredTo, data, position, end];
      break;
    case 16:
      const patternDictionary = {};
      const patternDictionaryFlags = data[position++];
      patternDictionary.mmr = !!(patternDictionaryFlags & 1);
      patternDictionary.template = patternDictionaryFlags >> 1 & 3;
      patternDictionary.patternWidth = data[position++];
      patternDictionary.patternHeight = data[position++];
      patternDictionary.maxPatternIndex = readUint32(data, position);
      position += 4;
      args = [patternDictionary, header.number, data, position, end];
      break;
    case 22:
    case 23:
      const halftoneRegion = {};
      halftoneRegion.info = readRegionSegmentInformation(data, position);
      position += RegionSegmentInformationFieldLength;
      const halftoneRegionFlags = data[position++];
      halftoneRegion.mmr = !!(halftoneRegionFlags & 1);
      halftoneRegion.template = halftoneRegionFlags >> 1 & 3;
      halftoneRegion.enableSkip = !!(halftoneRegionFlags & 8);
      halftoneRegion.combinationOperator = halftoneRegionFlags >> 4 & 7;
      halftoneRegion.defaultPixelValue = halftoneRegionFlags >> 7 & 1;
      halftoneRegion.gridWidth = readUint32(data, position);
      position += 4;
      halftoneRegion.gridHeight = readUint32(data, position);
      position += 4;
      halftoneRegion.gridOffsetX = readUint32(data, position) & 0xffffffff;
      position += 4;
      halftoneRegion.gridOffsetY = readUint32(data, position) & 0xffffffff;
      position += 4;
      halftoneRegion.gridVectorX = readUint16(data, position);
      position += 2;
      halftoneRegion.gridVectorY = readUint16(data, position);
      position += 2;
      args = [halftoneRegion, header.referredTo, data, position, end];
      break;
    case 38:
    case 39:
      const genericRegion = {};
      genericRegion.info = readRegionSegmentInformation(data, position);
      position += RegionSegmentInformationFieldLength;
      const genericRegionSegmentFlags = data[position++];
      genericRegion.mmr = !!(genericRegionSegmentFlags & 1);
      genericRegion.template = genericRegionSegmentFlags >> 1 & 3;
      genericRegion.prediction = !!(genericRegionSegmentFlags & 8);
      if (!genericRegion.mmr) {
        atLength = genericRegion.template === 0 ? 4 : 1;
        at = [];
        for (i = 0; i < atLength; i++) {
          at.push({
            x: readInt8(data, position),
            y: readInt8(data, position + 1)
          });
          position += 2;
        }
        genericRegion.at = at;
      }
      args = [genericRegion, data, position, end];
      break;
    case 48:
      const pageInfo = {
        width: readUint32(data, position),
        height: readUint32(data, position + 4),
        resolutionX: readUint32(data, position + 8),
        resolutionY: readUint32(data, position + 12)
      };
      if (pageInfo.height === 0xffffffff) {
        delete pageInfo.height;
      }
      const pageSegmentFlags = data[position + 16];
      readUint16(data, position + 17);
      pageInfo.lossless = !!(pageSegmentFlags & 1);
      pageInfo.refinement = !!(pageSegmentFlags & 2);
      pageInfo.defaultPixelValue = pageSegmentFlags >> 2 & 1;
      pageInfo.combinationOperator = pageSegmentFlags >> 3 & 3;
      pageInfo.requiresBuffer = !!(pageSegmentFlags & 32);
      pageInfo.combinationOperatorOverride = !!(pageSegmentFlags & 64);
      args = [pageInfo];
      break;
    case 49:
      break;
    case 50:
      break;
    case 51:
      break;
    case 53:
      args = [header.number, data, position, end];
      break;
    case 62:
      break;
    default:
      throw new Jbig2Error(`segment type ${header.typeName}(${header.type}) is not implemented`);
  }
  const callbackName = "on" + header.typeName;
  if (callbackName in visitor) {
    visitor[callbackName].apply(visitor, args);
  }
}
function processSegments(segments, visitor) {
  for (let i = 0, ii = segments.length; i < ii; i++) {
    processSegment(segments[i], visitor);
  }
}
function parseJbig2Chunks(chunks) {
  const visitor = new SimpleSegmentVisitor();
  for (let i = 0, ii = chunks.length; i < ii; i++) {
    const chunk = chunks[i];
    const segments = readSegments({}, chunk.data, chunk.start, chunk.end);
    processSegments(segments, visitor);
  }
  return visitor.buffer;
}
function parseJbig2(data) {
  const end = data.length;
  let position = 0;
  if (data[position] !== 0x97 || data[position + 1] !== 0x4a || data[position + 2] !== 0x42 || data[position + 3] !== 0x32 || data[position + 4] !== 0x0d || data[position + 5] !== 0x0a || data[position + 6] !== 0x1a || data[position + 7] !== 0x0a) {
    throw new Jbig2Error("parseJbig2 - invalid header.");
  }
  const header = Object.create(null);
  position += 8;
  const flags = data[position++];
  header.randomAccess = !(flags & 1);
  if (!(flags & 2)) {
    header.numberOfPages = readUint32(data, position);
    position += 4;
  }
  const segments = readSegments(header, data, position, end);
  const visitor = new SimpleSegmentVisitor();
  processSegments(segments, visitor);
  const {
    width,
    height
  } = visitor.currentPageInfo;
  const bitPacked = visitor.buffer;
  const imgData = new Uint8ClampedArray(width * height);
  let q = 0,
    k = 0;
  for (let i = 0; i < height; i++) {
    let mask = 0,
      buffer;
    for (let j = 0; j < width; j++) {
      if (!mask) {
        mask = 128;
        buffer = bitPacked[k++];
      }
      imgData[q++] = buffer & mask ? 0 : 255;
      mask >>= 1;
    }
  }
  return {
    imgData,
    width,
    height
  };
}
class SimpleSegmentVisitor {
  onPageInformation(info) {
    this.currentPageInfo = info;
    const rowSize = info.width + 7 >> 3;
    const buffer = new Uint8ClampedArray(rowSize * info.height);
    if (info.defaultPixelValue) {
      buffer.fill(0xff);
    }
    this.buffer = buffer;
  }
  drawBitmap(regionInfo, bitmap) {
    const pageInfo = this.currentPageInfo;
    const width = regionInfo.width,
      height = regionInfo.height;
    const rowSize = pageInfo.width + 7 >> 3;
    const combinationOperator = pageInfo.combinationOperatorOverride ? regionInfo.combinationOperator : pageInfo.combinationOperator;
    const buffer = this.buffer;
    const mask0 = 128 >> (regionInfo.x & 7);
    let offset0 = regionInfo.y * rowSize + (regionInfo.x >> 3);
    let i, j, mask, offset;
    switch (combinationOperator) {
      case 0:
        for (i = 0; i < height; i++) {
          mask = mask0;
          offset = offset0;
          for (j = 0; j < width; j++) {
            if (bitmap[i][j]) {
              buffer[offset] |= mask;
            }
            mask >>= 1;
            if (!mask) {
              mask = 128;
              offset++;
            }
          }
          offset0 += rowSize;
        }
        break;
      case 2:
        for (i = 0; i < height; i++) {
          mask = mask0;
          offset = offset0;
          for (j = 0; j < width; j++) {
            if (bitmap[i][j]) {
              buffer[offset] ^= mask;
            }
            mask >>= 1;
            if (!mask) {
              mask = 128;
              offset++;
            }
          }
          offset0 += rowSize;
        }
        break;
      default:
        throw new Jbig2Error(`operator ${combinationOperator} is not supported`);
    }
  }
  onImmediateGenericRegion(region, data, start, end) {
    const regionInfo = region.info;
    const decodingContext = new DecodingContext(data, start, end);
    const bitmap = decodeBitmap(region.mmr, regionInfo.width, regionInfo.height, region.template, region.prediction, null, region.at, decodingContext);
    this.drawBitmap(regionInfo, bitmap);
  }
  onImmediateLosslessGenericRegion() {
    this.onImmediateGenericRegion(...arguments);
  }
  onSymbolDictionary(dictionary, currentSegment, referredSegments, data, start, end) {
    let huffmanTables, huffmanInput;
    if (dictionary.huffman) {
      huffmanTables = getSymbolDictionaryHuffmanTables(dictionary, referredSegments, this.customTables);
      huffmanInput = new Reader(data, start, end);
    }
    let symbols = this.symbols;
    if (!symbols) {
      this.symbols = symbols = {};
    }
    const inputSymbols = [];
    for (const referredSegment of referredSegments) {
      const referredSymbols = symbols[referredSegment];
      if (referredSymbols) {
        inputSymbols.push(...referredSymbols);
      }
    }
    const decodingContext = new DecodingContext(data, start, end);
    symbols[currentSegment] = decodeSymbolDictionary(dictionary.huffman, dictionary.refinement, inputSymbols, dictionary.numberOfNewSymbols, dictionary.numberOfExportedSymbols, huffmanTables, dictionary.template, dictionary.at, dictionary.refinementTemplate, dictionary.refinementAt, decodingContext, huffmanInput);
  }
  onImmediateTextRegion(region, referredSegments, data, start, end) {
    const regionInfo = region.info;
    let huffmanTables, huffmanInput;
    const symbols = this.symbols;
    const inputSymbols = [];
    for (const referredSegment of referredSegments) {
      const referredSymbols = symbols[referredSegment];
      if (referredSymbols) {
        inputSymbols.push(...referredSymbols);
      }
    }
    const symbolCodeLength = log2(inputSymbols.length);
    if (region.huffman) {
      huffmanInput = new Reader(data, start, end);
      huffmanTables = getTextRegionHuffmanTables(region, referredSegments, this.customTables, inputSymbols.length, huffmanInput);
    }
    const decodingContext = new DecodingContext(data, start, end);
    const bitmap = decodeTextRegion(region.huffman, region.refinement, regionInfo.width, regionInfo.height, region.defaultPixelValue, region.numberOfSymbolInstances, region.stripSize, inputSymbols, symbolCodeLength, region.transposed, region.dsOffset, region.referenceCorner, region.combinationOperator, huffmanTables, region.refinementTemplate, region.refinementAt, decodingContext, region.logStripSize, huffmanInput);
    this.drawBitmap(regionInfo, bitmap);
  }
  onImmediateLosslessTextRegion() {
    this.onImmediateTextRegion(...arguments);
  }
  onPatternDictionary(dictionary, currentSegment, data, start, end) {
    let patterns = this.patterns;
    if (!patterns) {
      this.patterns = patterns = {};
    }
    const decodingContext = new DecodingContext(data, start, end);
    patterns[currentSegment] = decodePatternDictionary(dictionary.mmr, dictionary.patternWidth, dictionary.patternHeight, dictionary.maxPatternIndex, dictionary.template, decodingContext);
  }
  onImmediateHalftoneRegion(region, referredSegments, data, start, end) {
    const patterns = this.patterns[referredSegments[0]];
    const regionInfo = region.info;
    const decodingContext = new DecodingContext(data, start, end);
    const bitmap = decodeHalftoneRegion(region.mmr, patterns, region.template, regionInfo.width, regionInfo.height, region.defaultPixelValue, region.enableSkip, region.combinationOperator, region.gridWidth, region.gridHeight, region.gridOffsetX, region.gridOffsetY, region.gridVectorX, region.gridVectorY, decodingContext);
    this.drawBitmap(regionInfo, bitmap);
  }
  onImmediateLosslessHalftoneRegion() {
    this.onImmediateHalftoneRegion(...arguments);
  }
  onTables(currentSegment, data, start, end) {
    let customTables = this.customTables;
    if (!customTables) {
      this.customTables = customTables = {};
    }
    customTables[currentSegment] = decodeTablesSegment(data, start, end);
  }
}
class HuffmanLine {
  constructor(lineData) {
    if (lineData.length === 2) {
      this.isOOB = true;
      this.rangeLow = 0;
      this.prefixLength = lineData[0];
      this.rangeLength = 0;
      this.prefixCode = lineData[1];
      this.isLowerRange = false;
    } else {
      this.isOOB = false;
      this.rangeLow = lineData[0];
      this.prefixLength = lineData[1];
      this.rangeLength = lineData[2];
      this.prefixCode = lineData[3];
      this.isLowerRange = lineData[4] === "lower";
    }
  }
}
class HuffmanTreeNode {
  constructor(line) {
    this.children = [];
    if (line) {
      this.isLeaf = true;
      this.rangeLength = line.rangeLength;
      this.rangeLow = line.rangeLow;
      this.isLowerRange = line.isLowerRange;
      this.isOOB = line.isOOB;
    } else {
      this.isLeaf = false;
    }
  }
  buildTree(line, shift) {
    const bit = line.prefixCode >> shift & 1;
    if (shift <= 0) {
      this.children[bit] = new HuffmanTreeNode(line);
    } else {
      let node = this.children[bit];
      if (!node) {
        this.children[bit] = node = new HuffmanTreeNode(null);
      }
      node.buildTree(line, shift - 1);
    }
  }
  decodeNode(reader) {
    if (this.isLeaf) {
      if (this.isOOB) {
        return null;
      }
      const htOffset = reader.readBits(this.rangeLength);
      return this.rangeLow + (this.isLowerRange ? -htOffset : htOffset);
    }
    const node = this.children[reader.readBit()];
    if (!node) {
      throw new Jbig2Error("invalid Huffman data");
    }
    return node.decodeNode(reader);
  }
}
class HuffmanTable {
  constructor(lines, prefixCodesDone) {
    if (!prefixCodesDone) {
      this.assignPrefixCodes(lines);
    }
    this.rootNode = new HuffmanTreeNode(null);
    for (let i = 0, ii = lines.length; i < ii; i++) {
      const line = lines[i];
      if (line.prefixLength > 0) {
        this.rootNode.buildTree(line, line.prefixLength - 1);
      }
    }
  }
  decode(reader) {
    return this.rootNode.decodeNode(reader);
  }
  assignPrefixCodes(lines) {
    const linesLength = lines.length;
    let prefixLengthMax = 0;
    for (let i = 0; i < linesLength; i++) {
      prefixLengthMax = Math.max(prefixLengthMax, lines[i].prefixLength);
    }
    const histogram = new Uint32Array(prefixLengthMax + 1);
    for (let i = 0; i < linesLength; i++) {
      histogram[lines[i].prefixLength]++;
    }
    let currentLength = 1,
      firstCode = 0,
      currentCode,
      currentTemp,
      line;
    histogram[0] = 0;
    while (currentLength <= prefixLengthMax) {
      firstCode = firstCode + histogram[currentLength - 1] << 1;
      currentCode = firstCode;
      currentTemp = 0;
      while (currentTemp < linesLength) {
        line = lines[currentTemp];
        if (line.prefixLength === currentLength) {
          line.prefixCode = currentCode;
          currentCode++;
        }
        currentTemp++;
      }
      currentLength++;
    }
  }
}
function decodeTablesSegment(data, start, end) {
  const flags = data[start];
  const lowestValue = readUint32(data, start + 1) & 0xffffffff;
  const highestValue = readUint32(data, start + 5) & 0xffffffff;
  const reader = new Reader(data, start + 9, end);
  const prefixSizeBits = (flags >> 1 & 7) + 1;
  const rangeSizeBits = (flags >> 4 & 7) + 1;
  const lines = [];
  let prefixLength,
    rangeLength,
    currentRangeLow = lowestValue;
  do {
    prefixLength = reader.readBits(prefixSizeBits);
    rangeLength = reader.readBits(rangeSizeBits);
    lines.push(new HuffmanLine([currentRangeLow, prefixLength, rangeLength, 0]));
    currentRangeLow += 1 << rangeLength;
  } while (currentRangeLow < highestValue);
  prefixLength = reader.readBits(prefixSizeBits);
  lines.push(new HuffmanLine([lowestValue - 1, prefixLength, 32, 0, "lower"]));
  prefixLength = reader.readBits(prefixSizeBits);
  lines.push(new HuffmanLine([highestValue, prefixLength, 32, 0]));
  if (flags & 1) {
    prefixLength = reader.readBits(prefixSizeBits);
    lines.push(new HuffmanLine([prefixLength, 0]));
  }
  return new HuffmanTable(lines, false);
}
const standardTablesCache = {};
function getStandardTable(number) {
  let table = standardTablesCache[number];
  if (table) {
    return table;
  }
  let lines;
  switch (number) {
    case 1:
      lines = [[0, 1, 4, 0x0], [16, 2, 8, 0x2], [272, 3, 16, 0x6], [65808, 3, 32, 0x7]];
      break;
    case 2:
      lines = [[0, 1, 0, 0x0], [1, 2, 0, 0x2], [2, 3, 0, 0x6], [3, 4, 3, 0xe], [11, 5, 6, 0x1e], [75, 6, 32, 0x3e], [6, 0x3f]];
      break;
    case 3:
      lines = [[-256, 8, 8, 0xfe], [0, 1, 0, 0x0], [1, 2, 0, 0x2], [2, 3, 0, 0x6], [3, 4, 3, 0xe], [11, 5, 6, 0x1e], [-257, 8, 32, 0xff, "lower"], [75, 7, 32, 0x7e], [6, 0x3e]];
      break;
    case 4:
      lines = [[1, 1, 0, 0x0], [2, 2, 0, 0x2], [3, 3, 0, 0x6], [4, 4, 3, 0xe], [12, 5, 6, 0x1e], [76, 5, 32, 0x1f]];
      break;
    case 5:
      lines = [[-255, 7, 8, 0x7e], [1, 1, 0, 0x0], [2, 2, 0, 0x2], [3, 3, 0, 0x6], [4, 4, 3, 0xe], [12, 5, 6, 0x1e], [-256, 7, 32, 0x7f, "lower"], [76, 6, 32, 0x3e]];
      break;
    case 6:
      lines = [[-2048, 5, 10, 0x1c], [-1024, 4, 9, 0x8], [-512, 4, 8, 0x9], [-256, 4, 7, 0xa], [-128, 5, 6, 0x1d], [-64, 5, 5, 0x1e], [-32, 4, 5, 0xb], [0, 2, 7, 0x0], [128, 3, 7, 0x2], [256, 3, 8, 0x3], [512, 4, 9, 0xc], [1024, 4, 10, 0xd], [-2049, 6, 32, 0x3e, "lower"], [2048, 6, 32, 0x3f]];
      break;
    case 7:
      lines = [[-1024, 4, 9, 0x8], [-512, 3, 8, 0x0], [-256, 4, 7, 0x9], [-128, 5, 6, 0x1a], [-64, 5, 5, 0x1b], [-32, 4, 5, 0xa], [0, 4, 5, 0xb], [32, 5, 5, 0x1c], [64, 5, 6, 0x1d], [128, 4, 7, 0xc], [256, 3, 8, 0x1], [512, 3, 9, 0x2], [1024, 3, 10, 0x3], [-1025, 5, 32, 0x1e, "lower"], [2048, 5, 32, 0x1f]];
      break;
    case 8:
      lines = [[-15, 8, 3, 0xfc], [-7, 9, 1, 0x1fc], [-5, 8, 1, 0xfd], [-3, 9, 0, 0x1fd], [-2, 7, 0, 0x7c], [-1, 4, 0, 0xa], [0, 2, 1, 0x0], [2, 5, 0, 0x1a], [3, 6, 0, 0x3a], [4, 3, 4, 0x4], [20, 6, 1, 0x3b], [22, 4, 4, 0xb], [38, 4, 5, 0xc], [70, 5, 6, 0x1b], [134, 5, 7, 0x1c], [262, 6, 7, 0x3c], [390, 7, 8, 0x7d], [646, 6, 10, 0x3d], [-16, 9, 32, 0x1fe, "lower"], [1670, 9, 32, 0x1ff], [2, 0x1]];
      break;
    case 9:
      lines = [[-31, 8, 4, 0xfc], [-15, 9, 2, 0x1fc], [-11, 8, 2, 0xfd], [-7, 9, 1, 0x1fd], [-5, 7, 1, 0x7c], [-3, 4, 1, 0xa], [-1, 3, 1, 0x2], [1, 3, 1, 0x3], [3, 5, 1, 0x1a], [5, 6, 1, 0x3a], [7, 3, 5, 0x4], [39, 6, 2, 0x3b], [43, 4, 5, 0xb], [75, 4, 6, 0xc], [139, 5, 7, 0x1b], [267, 5, 8, 0x1c], [523, 6, 8, 0x3c], [779, 7, 9, 0x7d], [1291, 6, 11, 0x3d], [-32, 9, 32, 0x1fe, "lower"], [3339, 9, 32, 0x1ff], [2, 0x0]];
      break;
    case 10:
      lines = [[-21, 7, 4, 0x7a], [-5, 8, 0, 0xfc], [-4, 7, 0, 0x7b], [-3, 5, 0, 0x18], [-2, 2, 2, 0x0], [2, 5, 0, 0x19], [3, 6, 0, 0x36], [4, 7, 0, 0x7c], [5, 8, 0, 0xfd], [6, 2, 6, 0x1], [70, 5, 5, 0x1a], [102, 6, 5, 0x37], [134, 6, 6, 0x38], [198, 6, 7, 0x39], [326, 6, 8, 0x3a], [582, 6, 9, 0x3b], [1094, 6, 10, 0x3c], [2118, 7, 11, 0x7d], [-22, 8, 32, 0xfe, "lower"], [4166, 8, 32, 0xff], [2, 0x2]];
      break;
    case 11:
      lines = [[1, 1, 0, 0x0], [2, 2, 1, 0x2], [4, 4, 0, 0xc], [5, 4, 1, 0xd], [7, 5, 1, 0x1c], [9, 5, 2, 0x1d], [13, 6, 2, 0x3c], [17, 7, 2, 0x7a], [21, 7, 3, 0x7b], [29, 7, 4, 0x7c], [45, 7, 5, 0x7d], [77, 7, 6, 0x7e], [141, 7, 32, 0x7f]];
      break;
    case 12:
      lines = [[1, 1, 0, 0x0], [2, 2, 0, 0x2], [3, 3, 1, 0x6], [5, 5, 0, 0x1c], [6, 5, 1, 0x1d], [8, 6, 1, 0x3c], [10, 7, 0, 0x7a], [11, 7, 1, 0x7b], [13, 7, 2, 0x7c], [17, 7, 3, 0x7d], [25, 7, 4, 0x7e], [41, 8, 5, 0xfe], [73, 8, 32, 0xff]];
      break;
    case 13:
      lines = [[1, 1, 0, 0x0], [2, 3, 0, 0x4], [3, 4, 0, 0xc], [4, 5, 0, 0x1c], [5, 4, 1, 0xd], [7, 3, 3, 0x5], [15, 6, 1, 0x3a], [17, 6, 2, 0x3b], [21, 6, 3, 0x3c], [29, 6, 4, 0x3d], [45, 6, 5, 0x3e], [77, 7, 6, 0x7e], [141, 7, 32, 0x7f]];
      break;
    case 14:
      lines = [[-2, 3, 0, 0x4], [-1, 3, 0, 0x5], [0, 1, 0, 0x0], [1, 3, 0, 0x6], [2, 3, 0, 0x7]];
      break;
    case 15:
      lines = [[-24, 7, 4, 0x7c], [-8, 6, 2, 0x3c], [-4, 5, 1, 0x1c], [-2, 4, 0, 0xc], [-1, 3, 0, 0x4], [0, 1, 0, 0x0], [1, 3, 0, 0x5], [2, 4, 0, 0xd], [3, 5, 1, 0x1d], [5, 6, 2, 0x3d], [9, 7, 4, 0x7d], [-25, 7, 32, 0x7e, "lower"], [25, 7, 32, 0x7f]];
      break;
    default:
      throw new Jbig2Error(`standard table B.${number} does not exist`);
  }
  for (let i = 0, ii = lines.length; i < ii; i++) {
    lines[i] = new HuffmanLine(lines[i]);
  }
  table = new HuffmanTable(lines, true);
  standardTablesCache[number] = table;
  return table;
}
class Reader {
  constructor(data, start, end) {
    this.data = data;
    this.start = start;
    this.end = end;
    this.position = start;
    this.shift = -1;
    this.currentByte = 0;
  }
  readBit() {
    if (this.shift < 0) {
      if (this.position >= this.end) {
        throw new Jbig2Error("end of data while reading bit");
      }
      this.currentByte = this.data[this.position++];
      this.shift = 7;
    }
    const bit = this.currentByte >> this.shift & 1;
    this.shift--;
    return bit;
  }
  readBits(numBits) {
    let result = 0,
      i;
    for (i = numBits - 1; i >= 0; i--) {
      result |= this.readBit() << i;
    }
    return result;
  }
  byteAlign() {
    this.shift = -1;
  }
  next() {
    if (this.position >= this.end) {
      return -1;
    }
    return this.data[this.position++];
  }
}
function getCustomHuffmanTable(index, referredTo, customTables) {
  let currentIndex = 0;
  for (let i = 0, ii = referredTo.length; i < ii; i++) {
    const table = customTables[referredTo[i]];
    if (table) {
      if (index === currentIndex) {
        return table;
      }
      currentIndex++;
    }
  }
  throw new Jbig2Error("can't find custom Huffman table");
}
function getTextRegionHuffmanTables(textRegion, referredTo, customTables, numberOfSymbols, reader) {
  const codes = [];
  for (let i = 0; i <= 34; i++) {
    const codeLength = reader.readBits(4);
    codes.push(new HuffmanLine([i, codeLength, 0, 0]));
  }
  const runCodesTable = new HuffmanTable(codes, false);
  codes.length = 0;
  for (let i = 0; i < numberOfSymbols;) {
    const codeLength = runCodesTable.decode(reader);
    if (codeLength >= 32) {
      let repeatedLength, numberOfRepeats, j;
      switch (codeLength) {
        case 32:
          if (i === 0) {
            throw new Jbig2Error("no previous value in symbol ID table");
          }
          numberOfRepeats = reader.readBits(2) + 3;
          repeatedLength = codes[i - 1].prefixLength;
          break;
        case 33:
          numberOfRepeats = reader.readBits(3) + 3;
          repeatedLength = 0;
          break;
        case 34:
          numberOfRepeats = reader.readBits(7) + 11;
          repeatedLength = 0;
          break;
        default:
          throw new Jbig2Error("invalid code length in symbol ID table");
      }
      for (j = 0; j < numberOfRepeats; j++) {
        codes.push(new HuffmanLine([i, repeatedLength, 0, 0]));
        i++;
      }
    } else {
      codes.push(new HuffmanLine([i, codeLength, 0, 0]));
      i++;
    }
  }
  reader.byteAlign();
  const symbolIDTable = new HuffmanTable(codes, false);
  let customIndex = 0,
    tableFirstS,
    tableDeltaS,
    tableDeltaT;
  switch (textRegion.huffmanFS) {
    case 0:
    case 1:
      tableFirstS = getStandardTable(textRegion.huffmanFS + 6);
      break;
    case 3:
      tableFirstS = getCustomHuffmanTable(customIndex, referredTo, customTables);
      customIndex++;
      break;
    default:
      throw new Jbig2Error("invalid Huffman FS selector");
  }
  switch (textRegion.huffmanDS) {
    case 0:
    case 1:
    case 2:
      tableDeltaS = getStandardTable(textRegion.huffmanDS + 8);
      break;
    case 3:
      tableDeltaS = getCustomHuffmanTable(customIndex, referredTo, customTables);
      customIndex++;
      break;
    default:
      throw new Jbig2Error("invalid Huffman DS selector");
  }
  switch (textRegion.huffmanDT) {
    case 0:
    case 1:
    case 2:
      tableDeltaT = getStandardTable(textRegion.huffmanDT + 11);
      break;
    case 3:
      tableDeltaT = getCustomHuffmanTable(customIndex, referredTo, customTables);
      customIndex++;
      break;
    default:
      throw new Jbig2Error("invalid Huffman DT selector");
  }
  if (textRegion.refinement) {
    throw new Jbig2Error("refinement with Huffman is not supported");
  }
  return {
    symbolIDTable,
    tableFirstS,
    tableDeltaS,
    tableDeltaT
  };
}
function getSymbolDictionaryHuffmanTables(dictionary, referredTo, customTables) {
  let customIndex = 0,
    tableDeltaHeight,
    tableDeltaWidth;
  switch (dictionary.huffmanDHSelector) {
    case 0:
    case 1:
      tableDeltaHeight = getStandardTable(dictionary.huffmanDHSelector + 4);
      break;
    case 3:
      tableDeltaHeight = getCustomHuffmanTable(customIndex, referredTo, customTables);
      customIndex++;
      break;
    default:
      throw new Jbig2Error("invalid Huffman DH selector");
  }
  switch (dictionary.huffmanDWSelector) {
    case 0:
    case 1:
      tableDeltaWidth = getStandardTable(dictionary.huffmanDWSelector + 2);
      break;
    case 3:
      tableDeltaWidth = getCustomHuffmanTable(customIndex, referredTo, customTables);
      customIndex++;
      break;
    default:
      throw new Jbig2Error("invalid Huffman DW selector");
  }
  let tableBitmapSize, tableAggregateInstances;
  if (dictionary.bitmapSizeSelector) {
    tableBitmapSize = getCustomHuffmanTable(customIndex, referredTo, customTables);
    customIndex++;
  } else {
    tableBitmapSize = getStandardTable(1);
  }
  if (dictionary.aggregationInstancesSelector) {
    tableAggregateInstances = getCustomHuffmanTable(customIndex, referredTo, customTables);
  } else {
    tableAggregateInstances = getStandardTable(1);
  }
  return {
    tableDeltaHeight,
    tableDeltaWidth,
    tableBitmapSize,
    tableAggregateInstances
  };
}
function readUncompressedBitmap(reader, width, height) {
  const bitmap = [];
  for (let y = 0; y < height; y++) {
    const row = new Uint8Array(width);
    bitmap.push(row);
    for (let x = 0; x < width; x++) {
      row[x] = reader.readBit();
    }
    reader.byteAlign();
  }
  return bitmap;
}
function decodeMMRBitmap(input, width, height, endOfBlock) {
  const params = {
    K: -1,
    Columns: width,
    Rows: height,
    BlackIs1: true,
    EndOfBlock: endOfBlock
  };
  const decoder = new CCITTFaxDecoder(input, params);
  const bitmap = [];
  let currentByte,
    eof = false;
  for (let y = 0; y < height; y++) {
    const row = new Uint8Array(width);
    bitmap.push(row);
    let shift = -1;
    for (let x = 0; x < width; x++) {
      if (shift < 0) {
        currentByte = decoder.readNextChar();
        if (currentByte === -1) {
          currentByte = 0;
          eof = true;
        }
        shift = 7;
      }
      row[x] = currentByte >> shift & 1;
      shift--;
    }
  }
  if (endOfBlock && !eof) {
    const lookForEOFLimit = 5;
    for (let i = 0; i < lookForEOFLimit; i++) {
      if (decoder.readNextChar() === -1) {
        break;
      }
    }
  }
  return bitmap;
}
class Jbig2Image {
  parseChunks(chunks) {
    return parseJbig2Chunks(chunks);
  }
  parse(data) {
    const {
      imgData,
      width,
      height
    } = parseJbig2(data);
    this.width = width;
    this.height = height;
    return imgData;
  }
}

;// CONCATENATED MODULE: ./src/shared/image_utils.js

function convertToRGBA(params) {
  switch (params.kind) {
    case ImageKind.GRAYSCALE_1BPP:
      return convertBlackAndWhiteToRGBA(params);
    case ImageKind.RGB_24BPP:
      return convertRGBToRGBA(params);
  }
  return null;
}
function convertBlackAndWhiteToRGBA({
  src,
  srcPos = 0,
  dest,
  width,
  height,
  nonBlackColor = 0xffffffff,
  inverseDecode = false
}) {
  const black = FeatureTest.isLittleEndian ? 0xff000000 : 0x000000ff;
  const [zeroMapping, oneMapping] = inverseDecode ? [nonBlackColor, black] : [black, nonBlackColor];
  const widthInSource = width >> 3;
  const widthRemainder = width & 7;
  const srcLength = src.length;
  dest = new Uint32Array(dest.buffer);
  let destPos = 0;
  for (let i = 0; i < height; i++) {
    for (const max = srcPos + widthInSource; srcPos < max; srcPos++) {
      const elem = srcPos < srcLength ? src[srcPos] : 255;
      dest[destPos++] = elem & 0b10000000 ? oneMapping : zeroMapping;
      dest[destPos++] = elem & 0b1000000 ? oneMapping : zeroMapping;
      dest[destPos++] = elem & 0b100000 ? oneMapping : zeroMapping;
      dest[destPos++] = elem & 0b10000 ? oneMapping : zeroMapping;
      dest[destPos++] = elem & 0b1000 ? oneMapping : zeroMapping;
      dest[destPos++] = elem & 0b100 ? oneMapping : zeroMapping;
      dest[destPos++] = elem & 0b10 ? oneMapping : zeroMapping;
      dest[destPos++] = elem & 0b1 ? oneMapping : zeroMapping;
    }
    if (widthRemainder === 0) {
      continue;
    }
    const elem = srcPos < srcLength ? src[srcPos++] : 255;
    for (let j = 0; j < widthRemainder; j++) {
      dest[destPos++] = elem & 1 << 7 - j ? oneMapping : zeroMapping;
    }
  }
  return {
    srcPos,
    destPos
  };
}
function convertRGBToRGBA({
  src,
  srcPos = 0,
  dest,
  destPos = 0,
  width,
  height
}) {
  let i = 0;
  const len32 = src.length >> 2;
  const src32 = new Uint32Array(src.buffer, srcPos, len32);
  if (FeatureTest.isLittleEndian) {
    for (; i < len32 - 2; i += 3, destPos += 4) {
      const s1 = src32[i];
      const s2 = src32[i + 1];
      const s3 = src32[i + 2];
      dest[destPos] = s1 | 0xff000000;
      dest[destPos + 1] = s1 >>> 24 | s2 << 8 | 0xff000000;
      dest[destPos + 2] = s2 >>> 16 | s3 << 16 | 0xff000000;
      dest[destPos + 3] = s3 >>> 8 | 0xff000000;
    }
    for (let j = i * 4, jj = src.length; j < jj; j += 3) {
      dest[destPos++] = src[j] | src[j + 1] << 8 | src[j + 2] << 16 | 0xff000000;
    }
  } else {
    for (; i < len32 - 2; i += 3, destPos += 4) {
      const s1 = src32[i];
      const s2 = src32[i + 1];
      const s3 = src32[i + 2];
      dest[destPos] = s1 | 0xff;
      dest[destPos + 1] = s1 << 24 | s2 >>> 8 | 0xff;
      dest[destPos + 2] = s2 << 16 | s3 >>> 16 | 0xff;
      dest[destPos + 3] = s3 << 8 | 0xff;
    }
    for (let j = i * 4, jj = src.length; j < jj; j += 3) {
      dest[destPos++] = src[j] << 24 | src[j + 1] << 16 | src[j + 2] << 8 | 0xff;
    }
  }
  return {
    srcPos,
    destPos
  };
}
function grayToRGBA(src, dest) {
  if (util_FeatureTest.isLittleEndian) {
    for (let i = 0, ii = src.length; i < ii; i++) {
      dest[i] = src[i] * 0x10101 | 0xff000000;
    }
  } else {
    for (let i = 0, ii = src.length; i < ii; i++) {
      dest[i] = src[i] * 0x1010100 | 0x000000ff;
    }
  }
}

;// CONCATENATED MODULE: ./src/core/jpg.js



class JpegError extends BaseException {
  constructor(msg) {
    super(msg, "JpegError");
  }
}
class DNLMarkerError extends BaseException {
  constructor(message, scanLines) {
    super(message, "DNLMarkerError");
    this.scanLines = scanLines;
  }
}
class EOIMarkerError extends BaseException {
  constructor(msg) {
    super(msg, "EOIMarkerError");
  }
}
const dctZigZag = new Uint8Array([0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5, 12, 19, 26, 33, 40, 48, 41, 34, 27, 20, 13, 6, 7, 14, 21, 28, 35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51, 58, 59, 52, 45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55, 62, 63]);
const dctCos1 = 4017;
const dctSin1 = 799;
const dctCos3 = 3406;
const dctSin3 = 2276;
const dctCos6 = 1567;
const dctSin6 = 3784;
const dctSqrt2 = 5793;
const dctSqrt1d2 = 2896;
function buildHuffmanTable(codeLengths, values) {
  let k = 0,
    i,
    j,
    length = 16;
  while (length > 0 && !codeLengths[length - 1]) {
    length--;
  }
  const code = [{
    children: [],
    index: 0
  }];
  let p = code[0],
    q;
  for (i = 0; i < length; i++) {
    for (j = 0; j < codeLengths[i]; j++) {
      p = code.pop();
      p.children[p.index] = values[k];
      while (p.index > 0) {
        p = code.pop();
      }
      p.index++;
      code.push(p);
      while (code.length <= i) {
        code.push(q = {
          children: [],
          index: 0
        });
        p.children[p.index] = q.children;
        p = q;
      }
      k++;
    }
    if (i + 1 < length) {
      code.push(q = {
        children: [],
        index: 0
      });
      p.children[p.index] = q.children;
      p = q;
    }
  }
  return code[0].children;
}
function getBlockBufferOffset(component, row, col) {
  return 64 * ((component.blocksPerLine + 1) * row + col);
}
function decodeScan(data, offset, frame, components, resetInterval, spectralStart, spectralEnd, successivePrev, successive, parseDNLMarker = false) {
  const mcusPerLine = frame.mcusPerLine;
  const progressive = frame.progressive;
  const startOffset = offset;
  let bitsData = 0,
    bitsCount = 0;
  function readBit() {
    if (bitsCount > 0) {
      bitsCount--;
      return bitsData >> bitsCount & 1;
    }
    bitsData = data[offset++];
    if (bitsData === 0xff) {
      const nextByte = data[offset++];
      if (nextByte) {
        if (nextByte === 0xdc && parseDNLMarker) {
          offset += 2;
          const scanLines = readUint16(data, offset);
          offset += 2;
          if (scanLines > 0 && scanLines !== frame.scanLines) {
            throw new DNLMarkerError("Found DNL marker (0xFFDC) while parsing scan data", scanLines);
          }
        } else if (nextByte === 0xd9) {
          if (parseDNLMarker) {
            const maybeScanLines = blockRow * (frame.precision === 8 ? 8 : 0);
            if (maybeScanLines > 0 && Math.round(frame.scanLines / maybeScanLines) >= 5) {
              throw new DNLMarkerError("Found EOI marker (0xFFD9) while parsing scan data, " + "possibly caused by incorrect `scanLines` parameter", maybeScanLines);
            }
          }
          throw new EOIMarkerError("Found EOI marker (0xFFD9) while parsing scan data");
        }
        throw new JpegError(`unexpected marker ${(bitsData << 8 | nextByte).toString(16)}`);
      }
    }
    bitsCount = 7;
    return bitsData >>> 7;
  }
  function decodeHuffman(tree) {
    let node = tree;
    while (true) {
      node = node[readBit()];
      switch (typeof node) {
        case "number":
          return node;
        case "object":
          continue;
      }
      throw new JpegError("invalid huffman sequence");
    }
  }
  function receive(length) {
    let n = 0;
    while (length > 0) {
      n = n << 1 | readBit();
      length--;
    }
    return n;
  }
  function receiveAndExtend(length) {
    if (length === 1) {
      return readBit() === 1 ? 1 : -1;
    }
    const n = receive(length);
    if (n >= 1 << length - 1) {
      return n;
    }
    return n + (-1 << length) + 1;
  }
  function decodeBaseline(component, blockOffset) {
    const t = decodeHuffman(component.huffmanTableDC);
    const diff = t === 0 ? 0 : receiveAndExtend(t);
    component.blockData[blockOffset] = component.pred += diff;
    let k = 1;
    while (k < 64) {
      const rs = decodeHuffman(component.huffmanTableAC);
      const s = rs & 15,
        r = rs >> 4;
      if (s === 0) {
        if (r < 15) {
          break;
        }
        k += 16;
        continue;
      }
      k += r;
      const z = dctZigZag[k];
      component.blockData[blockOffset + z] = receiveAndExtend(s);
      k++;
    }
  }
  function decodeDCFirst(component, blockOffset) {
    const t = decodeHuffman(component.huffmanTableDC);
    const diff = t === 0 ? 0 : receiveAndExtend(t) << successive;
    component.blockData[blockOffset] = component.pred += diff;
  }
  function decodeDCSuccessive(component, blockOffset) {
    component.blockData[blockOffset] |= readBit() << successive;
  }
  let eobrun = 0;
  function decodeACFirst(component, blockOffset) {
    if (eobrun > 0) {
      eobrun--;
      return;
    }
    let k = spectralStart;
    const e = spectralEnd;
    while (k <= e) {
      const rs = decodeHuffman(component.huffmanTableAC);
      const s = rs & 15,
        r = rs >> 4;
      if (s === 0) {
        if (r < 15) {
          eobrun = receive(r) + (1 << r) - 1;
          break;
        }
        k += 16;
        continue;
      }
      k += r;
      const z = dctZigZag[k];
      component.blockData[blockOffset + z] = receiveAndExtend(s) * (1 << successive);
      k++;
    }
  }
  let successiveACState = 0,
    successiveACNextValue;
  function decodeACSuccessive(component, blockOffset) {
    let k = spectralStart;
    const e = spectralEnd;
    let r = 0;
    let s;
    let rs;
    while (k <= e) {
      const offsetZ = blockOffset + dctZigZag[k];
      const sign = component.blockData[offsetZ] < 0 ? -1 : 1;
      switch (successiveACState) {
        case 0:
          rs = decodeHuffman(component.huffmanTableAC);
          s = rs & 15;
          r = rs >> 4;
          if (s === 0) {
            if (r < 15) {
              eobrun = receive(r) + (1 << r);
              successiveACState = 4;
            } else {
              r = 16;
              successiveACState = 1;
            }
          } else {
            if (s !== 1) {
              throw new JpegError("invalid ACn encoding");
            }
            successiveACNextValue = receiveAndExtend(s);
            successiveACState = r ? 2 : 3;
          }
          continue;
        case 1:
        case 2:
          if (component.blockData[offsetZ]) {
            component.blockData[offsetZ] += sign * (readBit() << successive);
          } else {
            r--;
            if (r === 0) {
              successiveACState = successiveACState === 2 ? 3 : 0;
            }
          }
          break;
        case 3:
          if (component.blockData[offsetZ]) {
            component.blockData[offsetZ] += sign * (readBit() << successive);
          } else {
            component.blockData[offsetZ] = successiveACNextValue << successive;
            successiveACState = 0;
          }
          break;
        case 4:
          if (component.blockData[offsetZ]) {
            component.blockData[offsetZ] += sign * (readBit() << successive);
          }
          break;
      }
      k++;
    }
    if (successiveACState === 4) {
      eobrun--;
      if (eobrun === 0) {
        successiveACState = 0;
      }
    }
  }
  let blockRow = 0;
  function decodeMcu(component, decode, mcu, row, col) {
    const mcuRow = mcu / mcusPerLine | 0;
    const mcuCol = mcu % mcusPerLine;
    blockRow = mcuRow * component.v + row;
    const blockCol = mcuCol * component.h + col;
    const blockOffset = getBlockBufferOffset(component, blockRow, blockCol);
    decode(component, blockOffset);
  }
  function decodeBlock(component, decode, mcu) {
    blockRow = mcu / component.blocksPerLine | 0;
    const blockCol = mcu % component.blocksPerLine;
    const blockOffset = getBlockBufferOffset(component, blockRow, blockCol);
    decode(component, blockOffset);
  }
  const componentsLength = components.length;
  let component, i, j, k, n;
  let decodeFn;
  if (progressive) {
    if (spectralStart === 0) {
      decodeFn = successivePrev === 0 ? decodeDCFirst : decodeDCSuccessive;
    } else {
      decodeFn = successivePrev === 0 ? decodeACFirst : decodeACSuccessive;
    }
  } else {
    decodeFn = decodeBaseline;
  }
  let mcu = 0,
    fileMarker;
  const mcuExpected = componentsLength === 1 ? components[0].blocksPerLine * components[0].blocksPerColumn : mcusPerLine * frame.mcusPerColumn;
  let h, v;
  while (mcu <= mcuExpected) {
    const mcuToRead = resetInterval ? Math.min(mcuExpected - mcu, resetInterval) : mcuExpected;
    if (mcuToRead > 0) {
      for (i = 0; i < componentsLength; i++) {
        components[i].pred = 0;
      }
      eobrun = 0;
      if (componentsLength === 1) {
        component = components[0];
        for (n = 0; n < mcuToRead; n++) {
          decodeBlock(component, decodeFn, mcu);
          mcu++;
        }
      } else {
        for (n = 0; n < mcuToRead; n++) {
          for (i = 0; i < componentsLength; i++) {
            component = components[i];
            h = component.h;
            v = component.v;
            for (j = 0; j < v; j++) {
              for (k = 0; k < h; k++) {
                decodeMcu(component, decodeFn, mcu, j, k);
              }
            }
          }
          mcu++;
        }
      }
    }
    bitsCount = 0;
    fileMarker = findNextFileMarker(data, offset);
    if (!fileMarker) {
      break;
    }
    if (fileMarker.invalid) {
      const partialMsg = mcuToRead > 0 ? "unexpected" : "excessive";
      util_warn(`decodeScan - ${partialMsg} MCU data, current marker is: ${fileMarker.invalid}`);
      offset = fileMarker.offset;
    }
    if (fileMarker.marker >= 0xffd0 && fileMarker.marker <= 0xffd7) {
      offset += 2;
    } else {
      break;
    }
  }
  return offset - startOffset;
}
function quantizeAndInverse(component, blockBufferOffset, p) {
  const qt = component.quantizationTable,
    blockData = component.blockData;
  let v0, v1, v2, v3, v4, v5, v6, v7;
  let p0, p1, p2, p3, p4, p5, p6, p7;
  let t;
  if (!qt) {
    throw new JpegError("missing required Quantization Table.");
  }
  for (let row = 0; row < 64; row += 8) {
    p0 = blockData[blockBufferOffset + row];
    p1 = blockData[blockBufferOffset + row + 1];
    p2 = blockData[blockBufferOffset + row + 2];
    p3 = blockData[blockBufferOffset + row + 3];
    p4 = blockData[blockBufferOffset + row + 4];
    p5 = blockData[blockBufferOffset + row + 5];
    p6 = blockData[blockBufferOffset + row + 6];
    p7 = blockData[blockBufferOffset + row + 7];
    p0 *= qt[row];
    if ((p1 | p2 | p3 | p4 | p5 | p6 | p7) === 0) {
      t = dctSqrt2 * p0 + 512 >> 10;
      p[row] = t;
      p[row + 1] = t;
      p[row + 2] = t;
      p[row + 3] = t;
      p[row + 4] = t;
      p[row + 5] = t;
      p[row + 6] = t;
      p[row + 7] = t;
      continue;
    }
    p1 *= qt[row + 1];
    p2 *= qt[row + 2];
    p3 *= qt[row + 3];
    p4 *= qt[row + 4];
    p5 *= qt[row + 5];
    p6 *= qt[row + 6];
    p7 *= qt[row + 7];
    v0 = dctSqrt2 * p0 + 128 >> 8;
    v1 = dctSqrt2 * p4 + 128 >> 8;
    v2 = p2;
    v3 = p6;
    v4 = dctSqrt1d2 * (p1 - p7) + 128 >> 8;
    v7 = dctSqrt1d2 * (p1 + p7) + 128 >> 8;
    v5 = p3 << 4;
    v6 = p5 << 4;
    v0 = v0 + v1 + 1 >> 1;
    v1 = v0 - v1;
    t = v2 * dctSin6 + v3 * dctCos6 + 128 >> 8;
    v2 = v2 * dctCos6 - v3 * dctSin6 + 128 >> 8;
    v3 = t;
    v4 = v4 + v6 + 1 >> 1;
    v6 = v4 - v6;
    v7 = v7 + v5 + 1 >> 1;
    v5 = v7 - v5;
    v0 = v0 + v3 + 1 >> 1;
    v3 = v0 - v3;
    v1 = v1 + v2 + 1 >> 1;
    v2 = v1 - v2;
    t = v4 * dctSin3 + v7 * dctCos3 + 2048 >> 12;
    v4 = v4 * dctCos3 - v7 * dctSin3 + 2048 >> 12;
    v7 = t;
    t = v5 * dctSin1 + v6 * dctCos1 + 2048 >> 12;
    v5 = v5 * dctCos1 - v6 * dctSin1 + 2048 >> 12;
    v6 = t;
    p[row] = v0 + v7;
    p[row + 7] = v0 - v7;
    p[row + 1] = v1 + v6;
    p[row + 6] = v1 - v6;
    p[row + 2] = v2 + v5;
    p[row + 5] = v2 - v5;
    p[row + 3] = v3 + v4;
    p[row + 4] = v3 - v4;
  }
  for (let col = 0; col < 8; ++col) {
    p0 = p[col];
    p1 = p[col + 8];
    p2 = p[col + 16];
    p3 = p[col + 24];
    p4 = p[col + 32];
    p5 = p[col + 40];
    p6 = p[col + 48];
    p7 = p[col + 56];
    if ((p1 | p2 | p3 | p4 | p5 | p6 | p7) === 0) {
      t = dctSqrt2 * p0 + 8192 >> 14;
      if (t < -2040) {
        t = 0;
      } else if (t >= 2024) {
        t = 255;
      } else {
        t = t + 2056 >> 4;
      }
      blockData[blockBufferOffset + col] = t;
      blockData[blockBufferOffset + col + 8] = t;
      blockData[blockBufferOffset + col + 16] = t;
      blockData[blockBufferOffset + col + 24] = t;
      blockData[blockBufferOffset + col + 32] = t;
      blockData[blockBufferOffset + col + 40] = t;
      blockData[blockBufferOffset + col + 48] = t;
      blockData[blockBufferOffset + col + 56] = t;
      continue;
    }
    v0 = dctSqrt2 * p0 + 2048 >> 12;
    v1 = dctSqrt2 * p4 + 2048 >> 12;
    v2 = p2;
    v3 = p6;
    v4 = dctSqrt1d2 * (p1 - p7) + 2048 >> 12;
    v7 = dctSqrt1d2 * (p1 + p7) + 2048 >> 12;
    v5 = p3;
    v6 = p5;
    v0 = (v0 + v1 + 1 >> 1) + 4112;
    v1 = v0 - v1;
    t = v2 * dctSin6 + v3 * dctCos6 + 2048 >> 12;
    v2 = v2 * dctCos6 - v3 * dctSin6 + 2048 >> 12;
    v3 = t;
    v4 = v4 + v6 + 1 >> 1;
    v6 = v4 - v6;
    v7 = v7 + v5 + 1 >> 1;
    v5 = v7 - v5;
    v0 = v0 + v3 + 1 >> 1;
    v3 = v0 - v3;
    v1 = v1 + v2 + 1 >> 1;
    v2 = v1 - v2;
    t = v4 * dctSin3 + v7 * dctCos3 + 2048 >> 12;
    v4 = v4 * dctCos3 - v7 * dctSin3 + 2048 >> 12;
    v7 = t;
    t = v5 * dctSin1 + v6 * dctCos1 + 2048 >> 12;
    v5 = v5 * dctCos1 - v6 * dctSin1 + 2048 >> 12;
    v6 = t;
    p0 = v0 + v7;
    p7 = v0 - v7;
    p1 = v1 + v6;
    p6 = v1 - v6;
    p2 = v2 + v5;
    p5 = v2 - v5;
    p3 = v3 + v4;
    p4 = v3 - v4;
    if (p0 < 16) {
      p0 = 0;
    } else if (p0 >= 4080) {
      p0 = 255;
    } else {
      p0 >>= 4;
    }
    if (p1 < 16) {
      p1 = 0;
    } else if (p1 >= 4080) {
      p1 = 255;
    } else {
      p1 >>= 4;
    }
    if (p2 < 16) {
      p2 = 0;
    } else if (p2 >= 4080) {
      p2 = 255;
    } else {
      p2 >>= 4;
    }
    if (p3 < 16) {
      p3 = 0;
    } else if (p3 >= 4080) {
      p3 = 255;
    } else {
      p3 >>= 4;
    }
    if (p4 < 16) {
      p4 = 0;
    } else if (p4 >= 4080) {
      p4 = 255;
    } else {
      p4 >>= 4;
    }
    if (p5 < 16) {
      p5 = 0;
    } else if (p5 >= 4080) {
      p5 = 255;
    } else {
      p5 >>= 4;
    }
    if (p6 < 16) {
      p6 = 0;
    } else if (p6 >= 4080) {
      p6 = 255;
    } else {
      p6 >>= 4;
    }
    if (p7 < 16) {
      p7 = 0;
    } else if (p7 >= 4080) {
      p7 = 255;
    } else {
      p7 >>= 4;
    }
    blockData[blockBufferOffset + col] = p0;
    blockData[blockBufferOffset + col + 8] = p1;
    blockData[blockBufferOffset + col + 16] = p2;
    blockData[blockBufferOffset + col + 24] = p3;
    blockData[blockBufferOffset + col + 32] = p4;
    blockData[blockBufferOffset + col + 40] = p5;
    blockData[blockBufferOffset + col + 48] = p6;
    blockData[blockBufferOffset + col + 56] = p7;
  }
}
function buildComponentData(frame, component) {
  const blocksPerLine = component.blocksPerLine;
  const blocksPerColumn = component.blocksPerColumn;
  const computationBuffer = new Int16Array(64);
  for (let blockRow = 0; blockRow < blocksPerColumn; blockRow++) {
    for (let blockCol = 0; blockCol < blocksPerLine; blockCol++) {
      const offset = getBlockBufferOffset(component, blockRow, blockCol);
      quantizeAndInverse(component, offset, computationBuffer);
    }
  }
  return component.blockData;
}
function findNextFileMarker(data, currentPos, startPos = currentPos) {
  const maxPos = data.length - 1;
  let newPos = startPos < currentPos ? startPos : currentPos;
  if (currentPos >= maxPos) {
    return null;
  }
  const currentMarker = readUint16(data, currentPos);
  if (currentMarker >= 0xffc0 && currentMarker <= 0xfffe) {
    return {
      invalid: null,
      marker: currentMarker,
      offset: currentPos
    };
  }
  let newMarker = readUint16(data, newPos);
  while (!(newMarker >= 0xffc0 && newMarker <= 0xfffe)) {
    if (++newPos >= maxPos) {
      return null;
    }
    newMarker = readUint16(data, newPos);
  }
  return {
    invalid: currentMarker.toString(16),
    marker: newMarker,
    offset: newPos
  };
}
class JpegImage {
  constructor({
    decodeTransform = null,
    colorTransform = -1
  } = {}) {
    this._decodeTransform = decodeTransform;
    this._colorTransform = colorTransform;
  }
  parse(data, {
    dnlScanLines = null
  } = {}) {
    function readDataBlock() {
      const length = readUint16(data, offset);
      offset += 2;
      let endOffset = offset + length - 2;
      const fileMarker = findNextFileMarker(data, endOffset, offset);
      if (fileMarker?.invalid) {
        util_warn("readDataBlock - incorrect length, current marker is: " + fileMarker.invalid);
        endOffset = fileMarker.offset;
      }
      const array = data.subarray(offset, endOffset);
      offset += array.length;
      return array;
    }
    function prepareComponents(frame) {
      const mcusPerLine = Math.ceil(frame.samplesPerLine / 8 / frame.maxH);
      const mcusPerColumn = Math.ceil(frame.scanLines / 8 / frame.maxV);
      for (const component of frame.components) {
        const blocksPerLine = Math.ceil(Math.ceil(frame.samplesPerLine / 8) * component.h / frame.maxH);
        const blocksPerColumn = Math.ceil(Math.ceil(frame.scanLines / 8) * component.v / frame.maxV);
        const blocksPerLineForMcu = mcusPerLine * component.h;
        const blocksPerColumnForMcu = mcusPerColumn * component.v;
        const blocksBufferSize = 64 * blocksPerColumnForMcu * (blocksPerLineForMcu + 1);
        component.blockData = new Int16Array(blocksBufferSize);
        component.blocksPerLine = blocksPerLine;
        component.blocksPerColumn = blocksPerColumn;
      }
      frame.mcusPerLine = mcusPerLine;
      frame.mcusPerColumn = mcusPerColumn;
    }
    let offset = 0;
    let jfif = null;
    let adobe = null;
    let frame, resetInterval;
    let numSOSMarkers = 0;
    const quantizationTables = [];
    const huffmanTablesAC = [],
      huffmanTablesDC = [];
    let fileMarker = readUint16(data, offset);
    offset += 2;
    if (fileMarker !== 0xffd8) {
      throw new JpegError("SOI not found");
    }
    fileMarker = readUint16(data, offset);
    offset += 2;
    markerLoop: while (fileMarker !== 0xffd9) {
      let i, j, l;
      switch (fileMarker) {
        case 0xffe0:
        case 0xffe1:
        case 0xffe2:
        case 0xffe3:
        case 0xffe4:
        case 0xffe5:
        case 0xffe6:
        case 0xffe7:
        case 0xffe8:
        case 0xffe9:
        case 0xffea:
        case 0xffeb:
        case 0xffec:
        case 0xffed:
        case 0xffee:
        case 0xffef:
        case 0xfffe:
          const appData = readDataBlock();
          if (fileMarker === 0xffe0) {
            if (appData[0] === 0x4a && appData[1] === 0x46 && appData[2] === 0x49 && appData[3] === 0x46 && appData[4] === 0) {
              jfif = {
                version: {
                  major: appData[5],
                  minor: appData[6]
                },
                densityUnits: appData[7],
                xDensity: appData[8] << 8 | appData[9],
                yDensity: appData[10] << 8 | appData[11],
                thumbWidth: appData[12],
                thumbHeight: appData[13],
                thumbData: appData.subarray(14, 14 + 3 * appData[12] * appData[13])
              };
            }
          }
          if (fileMarker === 0xffee) {
            if (appData[0] === 0x41 && appData[1] === 0x64 && appData[2] === 0x6f && appData[3] === 0x62 && appData[4] === 0x65) {
              adobe = {
                version: appData[5] << 8 | appData[6],
                flags0: appData[7] << 8 | appData[8],
                flags1: appData[9] << 8 | appData[10],
                transformCode: appData[11]
              };
            }
          }
          break;
        case 0xffdb:
          const quantizationTablesLength = readUint16(data, offset);
          offset += 2;
          const quantizationTablesEnd = quantizationTablesLength + offset - 2;
          let z;
          while (offset < quantizationTablesEnd) {
            const quantizationTableSpec = data[offset++];
            const tableData = new Uint16Array(64);
            if (quantizationTableSpec >> 4 === 0) {
              for (j = 0; j < 64; j++) {
                z = dctZigZag[j];
                tableData[z] = data[offset++];
              }
            } else if (quantizationTableSpec >> 4 === 1) {
              for (j = 0; j < 64; j++) {
                z = dctZigZag[j];
                tableData[z] = readUint16(data, offset);
                offset += 2;
              }
            } else {
              throw new JpegError("DQT - invalid table spec");
            }
            quantizationTables[quantizationTableSpec & 15] = tableData;
          }
          break;
        case 0xffc0:
        case 0xffc1:
        case 0xffc2:
          if (frame) {
            throw new JpegError("Only single frame JPEGs supported");
          }
          offset += 2;
          frame = {};
          frame.extended = fileMarker === 0xffc1;
          frame.progressive = fileMarker === 0xffc2;
          frame.precision = data[offset++];
          const sofScanLines = readUint16(data, offset);
          offset += 2;
          frame.scanLines = dnlScanLines || sofScanLines;
          frame.samplesPerLine = readUint16(data, offset);
          offset += 2;
          frame.components = [];
          frame.componentIds = {};
          const componentsCount = data[offset++];
          let maxH = 0,
            maxV = 0;
          for (i = 0; i < componentsCount; i++) {
            const componentId = data[offset];
            const h = data[offset + 1] >> 4;
            const v = data[offset + 1] & 15;
            if (maxH < h) {
              maxH = h;
            }
            if (maxV < v) {
              maxV = v;
            }
            const qId = data[offset + 2];
            l = frame.components.push({
              h,
              v,
              quantizationId: qId,
              quantizationTable: null
            });
            frame.componentIds[componentId] = l - 1;
            offset += 3;
          }
          frame.maxH = maxH;
          frame.maxV = maxV;
          prepareComponents(frame);
          break;
        case 0xffc4:
          const huffmanLength = readUint16(data, offset);
          offset += 2;
          for (i = 2; i < huffmanLength;) {
            const huffmanTableSpec = data[offset++];
            const codeLengths = new Uint8Array(16);
            let codeLengthSum = 0;
            for (j = 0; j < 16; j++, offset++) {
              codeLengthSum += codeLengths[j] = data[offset];
            }
            const huffmanValues = new Uint8Array(codeLengthSum);
            for (j = 0; j < codeLengthSum; j++, offset++) {
              huffmanValues[j] = data[offset];
            }
            i += 17 + codeLengthSum;
            (huffmanTableSpec >> 4 === 0 ? huffmanTablesDC : huffmanTablesAC)[huffmanTableSpec & 15] = buildHuffmanTable(codeLengths, huffmanValues);
          }
          break;
        case 0xffdd:
          offset += 2;
          resetInterval = readUint16(data, offset);
          offset += 2;
          break;
        case 0xffda:
          const parseDNLMarker = ++numSOSMarkers === 1 && !dnlScanLines;
          offset += 2;
          const selectorsCount = data[offset++],
            components = [];
          for (i = 0; i < selectorsCount; i++) {
            const index = data[offset++];
            const componentIndex = frame.componentIds[index];
            const component = frame.components[componentIndex];
            component.index = index;
            const tableSpec = data[offset++];
            component.huffmanTableDC = huffmanTablesDC[tableSpec >> 4];
            component.huffmanTableAC = huffmanTablesAC[tableSpec & 15];
            components.push(component);
          }
          const spectralStart = data[offset++],
            spectralEnd = data[offset++],
            successiveApproximation = data[offset++];
          try {
            const processed = decodeScan(data, offset, frame, components, resetInterval, spectralStart, spectralEnd, successiveApproximation >> 4, successiveApproximation & 15, parseDNLMarker);
            offset += processed;
          } catch (ex) {
            if (ex instanceof DNLMarkerError) {
              util_warn(`${ex.message} -- attempting to re-parse the JPEG image.`);
              return this.parse(data, {
                dnlScanLines: ex.scanLines
              });
            } else if (ex instanceof EOIMarkerError) {
              util_warn(`${ex.message} -- ignoring the rest of the image data.`);
              break markerLoop;
            }
            throw ex;
          }
          break;
        case 0xffdc:
          offset += 4;
          break;
        case 0xffff:
          if (data[offset] !== 0xff) {
            offset--;
          }
          break;
        default:
          const nextFileMarker = findNextFileMarker(data, offset - 2, offset - 3);
          if (nextFileMarker?.invalid) {
            util_warn("JpegImage.parse - unexpected data, current marker is: " + nextFileMarker.invalid);
            offset = nextFileMarker.offset;
            break;
          }
          if (!nextFileMarker || offset >= data.length - 1) {
            util_warn("JpegImage.parse - reached the end of the image data " + "without finding an EOI marker (0xFFD9).");
            break markerLoop;
          }
          throw new JpegError("JpegImage.parse - unknown marker: " + fileMarker.toString(16));
      }
      fileMarker = readUint16(data, offset);
      offset += 2;
    }
    if (!frame) {
      throw new JpegError("JpegImage.parse - no frame data found.");
    }
    this.width = frame.samplesPerLine;
    this.height = frame.scanLines;
    this.jfif = jfif;
    this.adobe = adobe;
    this.components = [];
    for (const component of frame.components) {
      const quantizationTable = quantizationTables[component.quantizationId];
      if (quantizationTable) {
        component.quantizationTable = quantizationTable;
      }
      this.components.push({
        index: component.index,
        output: buildComponentData(frame, component),
        scaleX: component.h / frame.maxH,
        scaleY: component.v / frame.maxV,
        blocksPerLine: component.blocksPerLine,
        blocksPerColumn: component.blocksPerColumn
      });
    }
    this.numComponents = this.components.length;
    return undefined;
  }
  _getLinearizedBlockData(width, height, isSourcePDF = false) {
    const scaleX = this.width / width,
      scaleY = this.height / height;
    let component, componentScaleX, componentScaleY, blocksPerScanline;
    let x, y, i, j, k;
    let index;
    let offset = 0;
    let output;
    const numComponents = this.components.length;
    const dataLength = width * height * numComponents;
    const data = new Uint8ClampedArray(dataLength);
    const xScaleBlockOffset = new Uint32Array(width);
    const mask3LSB = 0xfffffff8;
    let lastComponentScaleX;
    for (i = 0; i < numComponents; i++) {
      component = this.components[i];
      componentScaleX = component.scaleX * scaleX;
      componentScaleY = component.scaleY * scaleY;
      offset = i;
      output = component.output;
      blocksPerScanline = component.blocksPerLine + 1 << 3;
      if (componentScaleX !== lastComponentScaleX) {
        for (x = 0; x < width; x++) {
          j = 0 | x * componentScaleX;
          xScaleBlockOffset[x] = (j & mask3LSB) << 3 | j & 7;
        }
        lastComponentScaleX = componentScaleX;
      }
      for (y = 0; y < height; y++) {
        j = 0 | y * componentScaleY;
        index = blocksPerScanline * (j & mask3LSB) | (j & 7) << 3;
        for (x = 0; x < width; x++) {
          data[offset] = output[index + xScaleBlockOffset[x]];
          offset += numComponents;
        }
      }
    }
    let transform = this._decodeTransform;
    if (!isSourcePDF && numComponents === 4 && !transform) {
      transform = new Int32Array([-256, 255, -256, 255, -256, 255, -256, 255]);
    }
    if (transform) {
      for (i = 0; i < dataLength;) {
        for (j = 0, k = 0; j < numComponents; j++, i++, k += 2) {
          data[i] = (data[i] * transform[k] >> 8) + transform[k + 1];
        }
      }
    }
    return data;
  }
  get _isColorConversionNeeded() {
    if (this.adobe) {
      return !!this.adobe.transformCode;
    }
    if (this.numComponents === 3) {
      if (this._colorTransform === 0) {
        return false;
      } else if (this.components[0].index === 0x52 && this.components[1].index === 0x47 && this.components[2].index === 0x42) {
        return false;
      }
      return true;
    }
    if (this._colorTransform === 1) {
      return true;
    }
    return false;
  }
  _convertYccToRgb(data) {
    let Y, Cb, Cr;
    for (let i = 0, length = data.length; i < length; i += 3) {
      Y = data[i];
      Cb = data[i + 1];
      Cr = data[i + 2];
      data[i] = Y - 179.456 + 1.402 * Cr;
      data[i + 1] = Y + 135.459 - 0.344 * Cb - 0.714 * Cr;
      data[i + 2] = Y - 226.816 + 1.772 * Cb;
    }
    return data;
  }
  _convertYccToRgba(data, out) {
    for (let i = 0, j = 0, length = data.length; i < length; i += 3, j += 4) {
      const Y = data[i];
      const Cb = data[i + 1];
      const Cr = data[i + 2];
      out[j] = Y - 179.456 + 1.402 * Cr;
      out[j + 1] = Y + 135.459 - 0.344 * Cb - 0.714 * Cr;
      out[j + 2] = Y - 226.816 + 1.772 * Cb;
      out[j + 3] = 255;
    }
    return out;
  }
  _convertYcckToRgb(data) {
    let Y, Cb, Cr, k;
    let offset = 0;
    for (let i = 0, length = data.length; i < length; i += 4) {
      Y = data[i];
      Cb = data[i + 1];
      Cr = data[i + 2];
      k = data[i + 3];
      data[offset++] = -122.67195406894 + Cb * (-6.60635669420364e-5 * Cb + 0.000437130475926232 * Cr - 5.4080610064599e-5 * Y + 0.00048449797120281 * k - 0.154362151871126) + Cr * (-0.000957964378445773 * Cr + 0.000817076911346625 * Y - 0.00477271405408747 * k + 1.53380253221734) + Y * (0.000961250184130688 * Y - 0.00266257332283933 * k + 0.48357088451265) + k * (-0.000336197177618394 * k + 0.484791561490776);
      data[offset++] = 107.268039397724 + Cb * (2.19927104525741e-5 * Cb - 0.000640992018297945 * Cr + 0.000659397001245577 * Y + 0.000426105652938837 * k - 0.176491792462875) + Cr * (-0.000778269941513683 * Cr + 0.00130872261408275 * Y + 0.000770482631801132 * k - 0.151051492775562) + Y * (0.00126935368114843 * Y - 0.00265090189010898 * k + 0.25802910206845) + k * (-0.000318913117588328 * k - 0.213742400323665);
      data[offset++] = -20.810012546947 + Cb * (-0.000570115196973677 * Cb - 2.63409051004589e-5 * Cr + 0.0020741088115012 * Y - 0.00288260236853442 * k + 0.814272968359295) + Cr * (-1.53496057440975e-5 * Cr - 0.000132689043961446 * Y + 0.000560833691242812 * k - 0.195152027534049) + Y * (0.00174418132927582 * Y - 0.00255243321439347 * k + 0.116935020465145) + k * (-0.000343531996510555 * k + 0.24165260232407);
    }
    return data.subarray(0, offset);
  }
  _convertYcckToRgba(data) {
    for (let i = 0, length = data.length; i < length; i += 4) {
      const Y = data[i];
      const Cb = data[i + 1];
      const Cr = data[i + 2];
      const k = data[i + 3];
      data[i] = -122.67195406894 + Cb * (-6.60635669420364e-5 * Cb + 0.000437130475926232 * Cr - 5.4080610064599e-5 * Y + 0.00048449797120281 * k - 0.154362151871126) + Cr * (-0.000957964378445773 * Cr + 0.000817076911346625 * Y - 0.00477271405408747 * k + 1.53380253221734) + Y * (0.000961250184130688 * Y - 0.00266257332283933 * k + 0.48357088451265) + k * (-0.000336197177618394 * k + 0.484791561490776);
      data[i + 1] = 107.268039397724 + Cb * (2.19927104525741e-5 * Cb - 0.000640992018297945 * Cr + 0.000659397001245577 * Y + 0.000426105652938837 * k - 0.176491792462875) + Cr * (-0.000778269941513683 * Cr + 0.00130872261408275 * Y + 0.000770482631801132 * k - 0.151051492775562) + Y * (0.00126935368114843 * Y - 0.00265090189010898 * k + 0.25802910206845) + k * (-0.000318913117588328 * k - 0.213742400323665);
      data[i + 2] = -20.810012546947 + Cb * (-0.000570115196973677 * Cb - 2.63409051004589e-5 * Cr + 0.0020741088115012 * Y - 0.00288260236853442 * k + 0.814272968359295) + Cr * (-1.53496057440975e-5 * Cr - 0.000132689043961446 * Y + 0.000560833691242812 * k - 0.195152027534049) + Y * (0.00174418132927582 * Y - 0.00255243321439347 * k + 0.116935020465145) + k * (-0.000343531996510555 * k + 0.24165260232407);
      data[i + 3] = 255;
    }
    return data;
  }
  _convertYcckToCmyk(data) {
    let Y, Cb, Cr;
    for (let i = 0, length = data.length; i < length; i += 4) {
      Y = data[i];
      Cb = data[i + 1];
      Cr = data[i + 2];
      data[i] = 434.456 - Y - 1.402 * Cr;
      data[i + 1] = 119.541 - Y + 0.344 * Cb + 0.714 * Cr;
      data[i + 2] = 481.816 - Y - 1.772 * Cb;
    }
    return data;
  }
  _convertCmykToRgb(data) {
    let c, m, y, k;
    let offset = 0;
    for (let i = 0, length = data.length; i < length; i += 4) {
      c = data[i];
      m = data[i + 1];
      y = data[i + 2];
      k = data[i + 3];
      data[offset++] = 255 + c * (-0.00006747147073602441 * c + 0.0008379262121013727 * m + 0.0002894718188643294 * y + 0.003264231057537806 * k - 1.1185611867203937) + m * (0.000026374107616089405 * m - 0.00008626949158638572 * y - 0.0002748769067499491 * k - 0.02155688794978967) + y * (-0.00003878099212869363 * y - 0.0003267808279485286 * k + 0.0686742238595345) - k * (0.0003361971776183937 * k + 0.7430659151342254);
      data[offset++] = 255 + c * (0.00013596372813588848 * c + 0.000924537132573585 * m + 0.00010567359618683593 * y + 0.0004791864687436512 * k - 0.3109689587515875) + m * (-0.00023545346108370344 * m + 0.0002702845253534714 * y + 0.0020200308977307156 * k - 0.7488052167015494) + y * (0.00006834815998235662 * y + 0.00015168452363460973 * k - 0.09751927774728933) - k * (0.0003189131175883281 * k + 0.7364883807733168);
      data[offset++] = 255 + c * (0.000013598650411385307 * c + 0.00012423956175490851 * m + 0.0004751985097583589 * y - 0.0000036729317476630422 * k - 0.05562186980264034) + m * (0.00016141380598724676 * m + 0.0009692239130725186 * y + 0.0007782692450036253 * k - 0.44015232367526463) + y * (5.068882914068769e-7 * y + 0.0017778369011375071 * k - 0.7591454649749609) - k * (0.0003435319965105553 * k + 0.7063770186160144);
    }
    return data.subarray(0, offset);
  }
  _convertCmykToRgba(data) {
    for (let i = 0, length = data.length; i < length; i += 4) {
      const c = data[i];
      const m = data[i + 1];
      const y = data[i + 2];
      const k = data[i + 3];
      data[i] = 255 + c * (-0.00006747147073602441 * c + 0.0008379262121013727 * m + 0.0002894718188643294 * y + 0.003264231057537806 * k - 1.1185611867203937) + m * (0.000026374107616089405 * m - 0.00008626949158638572 * y - 0.0002748769067499491 * k - 0.02155688794978967) + y * (-0.00003878099212869363 * y - 0.0003267808279485286 * k + 0.0686742238595345) - k * (0.0003361971776183937 * k + 0.7430659151342254);
      data[i + 1] = 255 + c * (0.00013596372813588848 * c + 0.000924537132573585 * m + 0.00010567359618683593 * y + 0.0004791864687436512 * k - 0.3109689587515875) + m * (-0.00023545346108370344 * m + 0.0002702845253534714 * y + 0.0020200308977307156 * k - 0.7488052167015494) + y * (0.00006834815998235662 * y + 0.00015168452363460973 * k - 0.09751927774728933) - k * (0.0003189131175883281 * k + 0.7364883807733168);
      data[i + 2] = 255 + c * (0.000013598650411385307 * c + 0.00012423956175490851 * m + 0.0004751985097583589 * y - 0.0000036729317476630422 * k - 0.05562186980264034) + m * (0.00016141380598724676 * m + 0.0009692239130725186 * y + 0.0007782692450036253 * k - 0.44015232367526463) + y * (5.068882914068769e-7 * y + 0.0017778369011375071 * k - 0.7591454649749609) - k * (0.0003435319965105553 * k + 0.7063770186160144);
      data[i + 3] = 255;
    }
    return data;
  }
  getData({
    width,
    height,
    forceRGBA = false,
    forceRGB = false,
    isSourcePDF = false
  }) {
    if (this.numComponents > 4) {
      throw new JpegError("Unsupported color mode");
    }
    const data = this._getLinearizedBlockData(width, height, isSourcePDF);
    if (this.numComponents === 1 && (forceRGBA || forceRGB)) {
      const len = data.length * (forceRGBA ? 4 : 3);
      const rgbaData = new Uint8ClampedArray(len);
      let offset = 0;
      if (forceRGBA) {
        grayToRGBA(data, new Uint32Array(rgbaData.buffer));
      } else {
        for (const grayColor of data) {
          rgbaData[offset++] = grayColor;
          rgbaData[offset++] = grayColor;
          rgbaData[offset++] = grayColor;
        }
      }
      return rgbaData;
    } else if (this.numComponents === 3 && this._isColorConversionNeeded) {
      if (forceRGBA) {
        const rgbaData = new Uint8ClampedArray(data.length / 3 * 4);
        return this._convertYccToRgba(data, rgbaData);
      }
      return this._convertYccToRgb(data);
    } else if (this.numComponents === 4) {
      if (this._isColorConversionNeeded) {
        if (forceRGBA) {
          return this._convertYcckToRgba(data);
        }
        if (forceRGB) {
          return this._convertYcckToRgb(data);
        }
        return this._convertYcckToCmyk(data);
      } else if (forceRGBA) {
        return this._convertCmykToRgba(data);
      } else if (forceRGB) {
        return this._convertCmykToRgb(data);
      }
    }
    return data;
  }
}

;// CONCATENATED MODULE: ./external/openjpeg/openjpeg.js
var OpenJPEG = (() => {
  var _scriptDir = "file:///C:/pdfjs/botio-files-pdfjs/private/d6919bed03c6677/external/openjpeg/openjpeg.js";
  return function (moduleArg = {}) {
    var Module = moduleArg;
    var readyPromiseResolve, readyPromiseReject;
    var readyPromise = new Promise((resolve, reject) => {
      readyPromiseResolve = resolve;
      readyPromiseReject = reject;
    });
    "use strict";
    Module.decode = function (bytes, ignoreColorSpace) {
      const size = bytes.length;
      const ptr = Module._malloc(size);
      Module.HEAPU8.set(bytes, ptr);
      const ret = Module._jp2_decode(ptr, size, ignoreColorSpace ? 1 : 0);
      Module._free(ptr);
      if (ret) {
        const {
          errorMessages: errorMessages
        } = Module;
        if (errorMessages) {
          delete Module.errorMessages;
          return errorMessages;
        }
        return "Unknown error";
      }
      const {
        imageData: imageData
      } = Module;
      Module.imageData = null;
      return imageData;
    };
    var moduleOverrides = Object.assign({}, Module);
    var arguments_ = [];
    var thisProgram = "./this.program";
    var quit_ = (status, toThrow) => {
      throw toThrow;
    };
    var ENVIRONMENT_IS_WEB = true;
    var ENVIRONMENT_IS_WORKER = false;
    var scriptDirectory = "";
    var read_, readAsync, readBinary;
    if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
      if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href;
      } else if (typeof document != "undefined" && document.currentScript) {
        scriptDirectory = document.currentScript.src;
      }
      if (_scriptDir) {
        scriptDirectory = _scriptDir;
      }
      if (scriptDirectory.startsWith("blob:")) {
        scriptDirectory = "";
      } else {
        scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
      }
      read_ = url => {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.send(null);
        return xhr.responseText;
      };
      if (ENVIRONMENT_IS_WORKER) {
        readBinary = url => {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, false);
          xhr.responseType = "arraybuffer";
          xhr.send(null);
          return new Uint8Array(xhr.response);
        };
      }
      readAsync = (url, onload, onerror) => {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = () => {
          if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
            onload(xhr.response);
            return;
          }
          onerror();
        };
        xhr.onerror = onerror;
        xhr.send(null);
      };
    } else {}
    var out = Module["print"] || console.log.bind(console);
    var err = Module["printErr"] || console.error.bind(console);
    Object.assign(Module, moduleOverrides);
    moduleOverrides = null;
    if (Module["arguments"]) arguments_ = Module["arguments"];
    if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
    if (Module["quit"]) quit_ = Module["quit"];
    var wasmBinary;
    if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
    function intArrayFromBase64(s) {
      var decoded = atob(s);
      var bytes = new Uint8Array(decoded.length);
      for (var i = 0; i < decoded.length; ++i) {
        bytes[i] = decoded.charCodeAt(i);
      }
      return bytes;
    }
    function tryParseAsDataURI(filename) {
      if (!isDataURI(filename)) {
        return;
      }
      return intArrayFromBase64(filename.slice(dataURIPrefix.length));
    }
    var wasmMemory;
    var ABORT = false;
    var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
    function updateMemoryViews() {
      var b = wasmMemory.buffer;
      Module["HEAP8"] = HEAP8 = new Int8Array(b);
      Module["HEAP16"] = HEAP16 = new Int16Array(b);
      Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
      Module["HEAPU16"] = HEAPU16 = new Uint16Array(b);
      Module["HEAP32"] = HEAP32 = new Int32Array(b);
      Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
      Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
      Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
    }
    var __ATPRERUN__ = [];
    var __ATINIT__ = [];
    var __ATPOSTRUN__ = [];
    var runtimeInitialized = false;
    function preRun() {
      if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
          addOnPreRun(Module["preRun"].shift());
        }
      }
      callRuntimeCallbacks(__ATPRERUN__);
    }
    function initRuntime() {
      runtimeInitialized = true;
      callRuntimeCallbacks(__ATINIT__);
    }
    function postRun() {
      if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
        while (Module["postRun"].length) {
          addOnPostRun(Module["postRun"].shift());
        }
      }
      callRuntimeCallbacks(__ATPOSTRUN__);
    }
    function addOnPreRun(cb) {
      __ATPRERUN__.unshift(cb);
    }
    function addOnInit(cb) {
      __ATINIT__.unshift(cb);
    }
    function addOnPostRun(cb) {
      __ATPOSTRUN__.unshift(cb);
    }
    var runDependencies = 0;
    var runDependencyWatcher = null;
    var dependenciesFulfilled = null;
    function addRunDependency(id) {
      runDependencies++;
      Module["monitorRunDependencies"]?.(runDependencies);
    }
    function removeRunDependency(id) {
      runDependencies--;
      Module["monitorRunDependencies"]?.(runDependencies);
      if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
        }
        if (dependenciesFulfilled) {
          var callback = dependenciesFulfilled;
          dependenciesFulfilled = null;
          callback();
        }
      }
    }
    var dataURIPrefix = "data:application/octet-stream;base64,";
    var isDataURI = filename => filename.startsWith(dataURIPrefix);
    var wasmBinaryFile;
    wasmBinaryFile = "data:application/octet-stream;base64,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AkAgFSAYIA1BAnRqQRBJckUEQANAIAEgAEECdCIEaiAEIAVq/QACAP0LAgAgAEEEaiIAIBNHDQALIBMiBCAIRg0BCyAEIQAgEQRAA0AgASAAIAJsQQJ0aiAFIABBAnRqKAIANgIAIABBAWohACAGQQFqIgYgEUcNAAsLIAQgCGtBfEsNAANAIAEgACACbEECdGogBSAAQQJ0aigCADYCACABIABBAWoiBCACbEECdGogBSAEQQJ0aigCADYCACABIABBAmoiBCACbEECdGogBSAEQQJ0aigCADYCACABIABBA2oiBCACbEECdGogBSAEQQJ0aigCADYCACAAQQRqIgAgCEcNAAsLIAFBBGohASANQQFqIg0gA0cNAAsMAQsCQAJAAkAgCEEBaw4CAAECCyADQQBMDQJBACECAkAgA0EESQRAIAEhAAwBCyABIANB/P///wdxIgJBAnRqIQADQCABIAZBAnRqIgQgBP0AAgAiIf0bAEECbf0RICH9GwFBAm39HAEgIf0bAkECbf0cAiAh/RsDQQJt/RwD/QsCACAGQQRqIgYgAkcNAAsgAiADRg0DCwNAIAAgACgCAEECbTYCACAAQQRqIQAgAkEBaiICIANHDQALDAILIANBAEwNASAAKAIAIQkgAiAKbEECdCEHA0AgCSABKAIAIAEgB2oiBCgCAEEBakEBdWsiADYCBCAJIAAgBCgCAGoiADYCACABIAA2AgAgASACQQJ0aiAJKAIENgIAIAFBBGohASAGQQFqIgYgA0cNAAsMAQsgCEEDSA0AIANBAEwNACAAKAIAIgUgCCAIQQFxIhRFIgZrQQRrIglBAXYiC0ECdCIHIAEgA0ECdCIAampJIAUgC0EDdGpBDGoiBCABQQRqS3EgBUEEaiAAIAEgCkECdGoiAGogB2pBCGpJIABBCGogBElxciEVIAJBAUcgCEEESXIhFiACQQFGIAlBBUtxIRcgCEH8////B3EhECAIQQNxIREgASAFayEYIAUgCEECdGpBBGshGSAFIAhBAmsiAEECdGohGiALQQFqIhJBfHEiDEEBciETIAxBAXRBAXIhCyACIApsQQJ0IRsgACAGa0ECSSEcIAhBAXZBAWsgAmxBAnQhHQNAIAUgASgCACABIBtqIg8gAkECdGooAgAiCSAPKAIAIgBqQQJqQQJ1ayIHIABqNgIA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aCk9AAkJCSBzdGVwc2l6ZXMgKG0sZSk9AC4AKG51bGwpACglZCwlZCkgACVzfQoACQkgfQoAW0RFVl0gRHVtcCBhbiBpbWFnZV9jb21wX2hlYWRlciBzdHJ1Y3QgewoAW0RFVl0gRHVtcCBhbiBpbWFnZV9oZWFkZXIgc3RydWN0IHsKAEltYWdlIGluZm8gewoACSBkZWZhdWx0IHRpbGUgewoAJXMJIGNvbXBvbmVudCAlZCB7CgAJCSBjb21wICVkIHsKAAkgVGlsZSBpbmRleDogewoACSBNYXJrZXIgbGlzdDogewoAQ29kZXN0cmVhbSBpbmRleCBmcm9tIG1haW4gaGVhZGVyOiB7CgBDb2Rlc3RyZWFtIGluZm8gZnJvbSBtYWluIGhlYWRlcjogewoAU3RyZWFtIGVycm9yIHdoaWxlIHJlYWRpbmcgSlAyIEhlYWRlciBib3gKAEZvdW5kIGEgbWlzcGxhY2VkICclYyVjJWMlYycgYm94IG91dHNpZGUganAyaCBib3gKAE1hbGZvcm1lZCBKUDIgZmlsZSBmb3JtYXQ6IGZpcnN0IGJveCBtdXN0IGJlIEpQRUcgMjAwMCBzaWduYXR1cmUgYm94CgBNYWxmb3JtZWQgSlAyIGZpbGUgZm9ybWF0OiBzZWNvbmQgYm94IG11c3QgYmUgZmlsZSB0eXBlIGJveAoATm90IGVub3VnaCBtZW1vcnkgdG8gaGFuZGxlIGpwZWcyMDAwIGJveAoATm90IGVub3VnaCBtZW1vcnkgd2l0aCBGVFlQIEJveAoAQSBtYXJrZXIgSUQgd2FzIGV4cGVjdGVkICgweGZmLS0pIGluc3RlYWQgb2YgJS44eAoACQkgbWN0PSV4CgAJCQkgY2Jsa3N0eT0lI3gKAAkJCSBjc3R5PSUjeAoACQkgcHJnPSUjeAoASW50ZWdlciBvdmVyZmxvdwoACSB0ZHg9JXUsIHRkeT0ldQoACSB0dz0ldSwgdGg9JXUKAAkgdHgwPSV1LCB0eTA9JXUKAEludmFsaWQgY29tcG9uZW50IGluZGV4OiAldQoAU3RyZWFtIHRvbyBzaG9ydAoATWFya2VyIGhhbmRsZXIgZnVuY3Rpb24gZmFpbGVkIHRvIHJlYWQgdGhlIG1hcmtlciBzZWdtZW50CgBOb3QgZW5vdWdoIG1lbW9yeSBmb3IgY3VycmVudCBwcmVjaW5jdCBjb2RlYmxvY2sgZWxlbWVudAoARXJyb3IgcmVhZGluZyBTUENvZCBTUENvYyBlbGVtZW50CgBFcnJvciByZWFkaW5nIFNRY2Qgb3IgU1FjYyBlbGVtZW50CgBBIEJQQ0MgaGVhZGVyIGJveCBpcyBhdmFpbGFibGUgYWx0aG91Z2ggQlBDIGdpdmVuIGJ5IHRoZSBJSERSIGJveCAoJWQpIGluZGljYXRlIGNvbXBvbmVudHMgYml0IGRlcHRoIGlzIGNvbnN0YW50CgBFcnJvciB3aXRoIFNJWiBtYXJrZXI6IGlsbGVnYWwgdGlsZSBvZmZzZXQKAEludmFsaWQgcHJlY2luY3QKAE5vdCBlbm91Z2ggbWVtb3J5IHRvIGhhbmRsZSBiYW5kIHByZWNpbnRzCgBGYWlsZWQgdG8gZGVjb2RlIGFsbCB1c2VkIGNvbXBvbmVudHMKAFNpemUgb2YgY29kZSBibG9jayBkYXRhIGV4Y2VlZHMgc3lzdGVtIGxpbWl0cwoAU2l6ZSBvZiB0aWxlIGRhdGEgZXhjZWVkcyBzeXN0ZW0gbGltaXRzCgBDYW5ub3QgdGFrZSBpbiBjaGFyZ2UgbXVsdGlwbGUgTUNUIG1hcmtlcnMKAENvcnJ1cHRlZCBQUE0gbWFya2VycwoATm90IGVub3VnaCBtZW1vcnkgZm9yIHRpbGUgcmVzb2x1dGlvbnMKAENhbm5vdCB0YWtlIGluIGNoYXJnZSBtdWx0aXBsZSBjb2xsZWN0aW9ucwoASW52YWxpZCBQQ0xSIGJveC4gUmVwb3J0cyAwIHBhbGV0dGUgY29sdW1ucwoAV2UgZG8gbm90IHN1cHBvcnQgUk9JIGluIGRlY29kaW5nIEhUIGNvZGVibG9ja3MKAENhbm5vdCBoYW5kbGUgYm94IG9mIHVuZGVmaW5lZCBzaXplcwoAQ2Fubm90IHRha2UgaW4gY2hhcmdlIGNvbGxlY3Rpb25zIHdpdGhvdXQgc2FtZSBudW1iZXIgb2YgaW5kaXhlcwoASW52YWxpZCB0aWxlYy0+d2luX3h4eCB2YWx1ZXMKAENhbm5vdCBoYW5kbGUgYm94IG9mIGxlc3MgdGhhbiA4IGJ5dGVzCgBDYW5ub3QgaGFuZGxlIFhMIGJveCBvZiBsZXNzIHRoYW4gMTYgYnl0ZXMKAENvbXBvbmVudCBpbmRleCAldSB1c2VkIHNldmVyYWwgdGltZXMKAEludmFsaWQgUENMUiBib3guIFJlcG9ydHMgJWQgZW50cmllcwoATm90IGVub3VnaCBtZW1vcnkgdG8gY3JlYXRlIFRhZy10cmVlIG5vZGVzCgBDYW5ub3QgdGFrZSBpbiBjaGFyZ2UgbWN0IGRhdGEgd2l0aGluIG11bHRpcGxlIE1DVCByZWNvcmRzCgBDYW5ub3QgZGVjb2RlIHRpbGUsIG1lbW9yeSBlcnJvcgoAb3BqX2oya19hcHBseV9uYl90aWxlX3BhcnRzX2NvcnJlY3Rpb24gZXJyb3IKAFByb2JsZW0gd2l0aCBza2lwcGluZyBKUEVHMjAwMCBib3gsIHN0cmVhbSBlcnJvcgoAUHJvYmxlbSB3aXRoIHJlYWRpbmcgSlBFRzIwMDAgYm94LCBzdHJlYW0gZXJyb3IKAFVua25vd24gbWFya2VyCgBOb3QgZW5vdWdoIG1lbW9yeSB0byBhZGQgdGwgbWFya2VyCgBOb3QgZW5vdWdoIG1lbW9yeSB0byBhZGQgbWggbWFya2VyCgBOb3QgZW5vdWdoIG1lbW9yeSB0byB0YWtlIGluIGNoYXJnZSBTSVogbWFya2VyCgBFcnJvciByZWFkaW5nIFBQVCBtYXJrZXIKAE5vdCBlbm91Z2ggbWVtb3J5IHRvIHJlYWQgUFBUIG1hcmtlcgoARXJyb3IgcmVhZGluZyBTT1QgbWFya2VyCgBFcnJvciByZWFkaW5nIFBMVCBtYXJrZXIKAEVycm9yIHJlYWRpbmcgTUNUIG1hcmtlcgoATm90IGVub3VnaCBtZW1vcnkgdG8gcmVhZCBNQ1QgbWFya2VyCgBOb3QgZW5vdWdoIHNwYWNlIGZvciBleHBlY3RlZCBTT1AgbWFya2VyCgBFeHBlY3RlZCBTT1AgbWFya2VyCgBFcnJvciByZWFkaW5nIE1DTyBtYXJrZXIKAEVycm9yIHJlYWRpbmcgUkdOIG1hcmtlcgoARXJyb3IgcmVhZGluZyBQUE0gbWFya2VyCgBOb3QgZW5vdWdoIG1lbW9yeSB0byByZWFkIFBQTSBtYXJrZXIKAEVycm9yIHJlYWRpbmcgVExNIG1hcmtlcgoARXJyb3IgcmVhZGluZyBQTE0gbWFya2VyCgBOb3QgZW5vdWdoIHNwYWNlIGZvciBleHBlY3RlZCBFUEggbWFya2VyCgBFeHBlY3RlZCBFUEggbWFya2VyCgBFcnJvciByZWFkaW5nIENSRyBtYXJrZXIKAFVua25vd24gcHJvZ3Jlc3Npb24gb3JkZXIgaW4gQ09EIG1hcmtlcgoAVW5rbm93biBTY29kIHZhbHVlIGluIENPRCBtYXJrZXIKAEVycm9yIHJlYWRpbmcgQ09EIG1hcmtlcgoARXJyb3IgcmVhZGluZyBRQ0QgbWFya2VyCgBDcnJvciByZWFkaW5nIENCRCBtYXJrZXIKAEVycm9yIHJlYWRpbmcgUE9DIG1hcmtlcgoARXJyb3IgcmVhZGluZyBDT0MgbWFya2VyCgBFcnJvciByZWFkaW5nIFFDQyBtYXJrZXIKAEVycm9yIHJlYWRpbmcgTUNDIG1hcmtlcgoATm90IGVub3VnaCBtZW1vcnkgdG8gcmVhZCBNQ0MgbWFya2VyCgByZXF1aXJlZCBTSVogbWFya2VyIG5vdCBmb3VuZCBpbiBtYWluIGhlYWRlcgoAcmVxdWlyZWQgQ09EIG1hcmtlciBub3QgZm91bmQgaW4gbWFpbiBoZWFkZXIKAHJlcXVpcmVkIFFDRCBtYXJrZXIgbm90IGZvdW5kIGluIG1haW4gaGVhZGVyCgBOb3QgZW5vdWdoIG1lbW9yeSB0byBoYW5kbGUganBlZzIwMDAgZmlsZSBoZWFkZXIKAE5vdCBlbm91Z2ggbWVtb3J5IHRvIHJlYWQgaGVhZGVyCgBFcnJvciB3aXRoIEpQIFNpZ25hdHVyZSA6IGJhZCBtYWdpYyBudW1iZXIKAEluIFNPVCBtYXJrZXIsIFRQU290ICglZCkgaXMgbm90IHZhbGlkIHJlZ2FyZHMgdG8gdGhlIGN1cnJlbnQgbnVtYmVyIG9mIHRpbGUtcGFydCAoJWQpLCBnaXZpbmcgdXAKAEluIFNPVCBtYXJrZXIsIFRQU290ICglZCkgaXMgbm90IHZhbGlkIHJlZ2FyZHMgdG8gdGhlIHByZXZpb3VzIG51bWJlciBvZiB0aWxlLXBhcnQgKCVkKSwgZ2l2aW5nIHVwCgBJbiBTT1QgbWFya2VyLCBUUFNvdCAoJWQpIGlzIG5vdCB2YWxpZCByZWdhcmRzIHRvIHRoZSBjdXJyZW50IG51bWJlciBvZiB0aWxlLXBhcnQgKGhlYWRlcikgKCVkKSwgZ2l2aW5nIHVwCgB0aWxlcyByZXF1aXJlIGF0IGxlYXN0IG9uZSByZXNvbHV0aW9uCgBNYXJrZXIgaXMgbm90IGNvbXBsaWFudCB3aXRoIGl0cyBwb3NpdGlvbgoAUHJvYmxlbSB3aXRoIHNlZWsgZnVuY3Rpb24KAEVycm9yIHJlYWRpbmcgU1BDb2QgU1BDb2MgZWxlbWVudCwgSW52YWxpZCBjYmxrdy9jYmxraCBjb21iaW5hdGlvbgoASW52YWxpZCBtdWx0aXBsZSBjb21wb25lbnQgdHJhbnNmb3JtYXRpb24KAENhbm5vdCB0YWtlIGluIGNoYXJnZSBjb2xsZWN0aW9ucyBvdGhlciB0aGFuIGFycmF5IGRlY29ycmVsYXRpb24KAFRvbyBsYXJnZSB2YWx1ZSBmb3IgTnBwbQoATm90IGVub3VnaCBieXRlcyB0byByZWFkIE5wcG0KAGJhZCBwbGFjZWQganBlZyBjb2Rlc3RyZWFtCgAJIE1haW4gaGVhZGVyIHN0YXJ0IHBvc2l0aW9uPSVsbGkKCSBNYWluIGhlYWRlciBlbmQgcG9zaXRpb249JWxsaQoATWFya2VyIHNpemUgaW5jb25zaXN0ZW50IHdpdGggc3RyZWFtIGxlbmd0aAoAVGlsZSBwYXJ0IGxlbmd0aCBzaXplIGluY29uc2lzdGVudCB3aXRoIHN0cmVhbSBsZW5ndGgKAENhbm5vdCB0YWtlIGluIGNoYXJnZSBtdWx0aXBsZSBkYXRhIHNwYW5uaW5nCgBXcm9uZyBmbGFnCgBFcnJvciB3aXRoIEZUWVAgc2lnbmF0dXJlIEJveCBzaXplCgBFcnJvciB3aXRoIEpQIHNpZ25hdHVyZSBCb3ggc2l6ZQoASW52YWxpZCBwcmVjaW5jdCBzaXplCgBJbmNvbnNpc3RlbnQgbWFya2VyIHNpemUKAEludmFsaWQgbWFya2VyIHNpemUKAEVycm9yIHdpdGggU0laIG1hcmtlciBzaXplCgBOb3QgZW5vdWdoIG1lbW9yeSB0byBhZGQgYSBuZXcgdmFsaWRhdGlvbiBwcm9jZWR1cmUKAE5vdCBlbm91Z2ggbWVtb3J5IHRvIGRlY29kZSB0aWxlCgBGYWlsZWQgdG8gZGVjb2RlIHRoZSBjb2Rlc3RyZWFtIGluIHRoZSBKUDIgZmlsZQoAQ2Fubm90IHRha2UgaW4gY2hhcmdlIGNvbGxlY3Rpb25zIHdpdGggaW5kaXggc2h1ZmZsZQoAQ2Fubm90IGFsbG9jYXRlIFRpZXIgMSBoYW5kbGUKAE5vIGRlY29kZWQgYXJlYSBwYXJhbWV0ZXJzLCBzZXQgdGhlIGRlY29kZWQgYXJlYSB0byB0aGUgd2hvbGUgaW1hZ2UKAE5vdCBlbm91Z2ggbWVtb3J5IHRvIGNyZWF0ZSBUYWctdHJlZQoATm90IGVub3VnaCBtZW1vcnkgdG8gcmVpbml0aWFsaXplIHRoZSB0YWcgdHJlZQoARXJyb3IgcmVhZGluZyBTUENvZCBTUENvYyBlbGVtZW50LCBJbnZhbGlkIHRyYW5zZm9ybWF0aW9uIGZvdW5kCgBFcnJvciByZWFkaW5nIFNQQ29kIFNQQ29jIGVsZW1lbnQuIFVuc3VwcG9ydGVkIE1peGVkIEhUIGNvZGUtYmxvY2sgc3R5bGUgZm91bmQKAFRpbGUgWSBjb29yZGluYXRlcyBhcmUgbm90IHN1cHBvcnRlZAoAVGlsZSBYIGNvb3JkaW5hdGVzIGFyZSBub3Qgc3VwcG9ydGVkCgBJbWFnZSBjb29yZGluYXRlcyBhYm92ZSBJTlRfTUFYIGFyZSBub3Qgc3VwcG9ydGVkCgBKUEVHMjAwMCBIZWFkZXIgYm94IG5vdCByZWFkIHlldCwgJyVjJWMlYyVjJyBib3ggd2lsbCBiZSBpZ25vcmVkCgBvcGpfajJrX21lcmdlX3BwdCgpIGhhcyBhbHJlYWR5IGJlZW4gY2FsbGVkCgBOb3QgZW5vdWdoIG1lbW9yeSB0byByZWFkIFNPVCBtYXJrZXIuIFRpbGUgaW5kZXggYWxsb2NhdGlvbiBmYWlsZWQKAElnbm9yaW5nIGloZHIgYm94LiBGaXJzdCBpaGRyIGJveCBhbHJlYWR5IHJlYWQKAFpwcHQgJXUgYWxyZWFkeSByZWFkCgBacHBtICV1IGFscmVhZHkgcmVhZAoAUFRFUk0gY2hlY2sgZmFpbHVyZTogJWQgc3ludGhldGl6ZWQgMHhGRiBtYXJrZXJzIHJlYWQKAAkJCSBjYmxrdz0yXiVkCgAJCQkgY2Jsa2g9Ml4lZAoACQkJIHFudHN0eT0lZAoAJXMgZHg9JWQsIGR5PSVkCgAJCQkgcm9pc2hpZnQ9JWQKAAkJCSBudW1nYml0cz0lZAoACQkgbnVtbGF5ZXJzPSVkCgAlcyBudW1jb21wcz0lZAoAb3BqX2pwMl9hcHBseV9jZGVmOiBhY249JWQsIG51bWNvbXBzPSVkCgBvcGpfanAyX2FwcGx5X2NkZWY6IGNuPSVkLCBudW1jb21wcz0lZAoACQkJIG51bXJlc29sdXRpb25zPSVkCgAJCSB0eXBlPSUjeCwgcG9zPSVsbGksIGxlbj0lZAoAJXMgc2duZD0lZAoACQkJIHFtZmJpZD0lZAoAJXMgcHJlYz0lZAoACQkgbmIgb2YgdGlsZS1wYXJ0IGluIHRpbGUgWyVkXT0lZAoAJXMgeDE9JWQsIHkxPSVkCgAlcyB4MD0lZCwgeTA9JWQKAEZhaWxlZCB0byBkZWNvZGUgdGlsZSAlZC8lZAoAU2V0dGluZyBkZWNvZGluZyBhcmVhIHRvICVkLCVkLCVkLCVkCgBGYWlsZWQgdG8gZGVjb2RlIGNvbXBvbmVudCAlZAoASW52YWxpZCB2YWx1ZSBmb3IgbnVtcmVzb2x1dGlvbnMgOiAlZCwgbWF4IHZhbHVlIGlzIHNldCBpbiBvcGVuanBlZy5oIGF0ICVkCgBJbnZhbGlkIGNvbXBvbmVudCBudW1iZXI6ICVkLCByZWdhcmRpbmcgdGhlIG51bWJlciBvZiBjb21wb25lbnRzICVkCgBUb28gbWFueSBQT0NzICVkCgBJbnZhbGlkIHRpbGUgbnVtYmVyICVkCgBJbnZhbGlkIHRpbGUgcGFydCBpbmRleCBmb3IgdGlsZSBudW1iZXIgJWQuIEdvdCAlZCwgZXhwZWN0ZWQgJWQKAEVycm9yIHdpdGggU0laIG1hcmtlcjogbnVtYmVyIG9mIGNvbXBvbmVudCBpcyBpbGxlZ2FsIC0+ICVkCgBOb3QgZW5vdWdoIG1lbW9yeSBmb3IgY2llbGFiCgBDYW5ub3QgYWxsb2NhdGUgY2Jsay0+ZGVjb2RlZF9kYXRhCgBGYWlsZWQgdG8gbWVyZ2UgUFBUIGRhdGEKAEZhaWxlZCB0byBtZXJnZSBQUE0gZGF0YQoASW52YWxpZCBudW1iZXIgb2YgbGF5ZXJzIGluIENPRCBtYXJrZXIgOiAlZCBub3QgaW4gcmFuZ2UgWzEtNjU1MzVdCgBTdHJlYW0gdG9vIHNob3J0LCBleHBlY3RlZCBTT1QKAFVuYWJsZSB0byBzZXQgdDEgaGFuZGxlIGFzIFRMUwoAU3RyZWFtIGRvZXMgbm90IGVuZCB3aXRoIEVPQwoAQ2Fubm90IGhhbmRsZSBib3ggc2l6ZXMgaGlnaGVyIHRoYW4gMl4zMgoAb3BqX3BpX25leHRfbHJjcCgpOiBpbnZhbGlkIGNvbXBubzAvY29tcG5vMQoAb3BqX3BpX25leHRfcmxjcCgpOiBpbnZhbGlkIGNvbXBubzAvY29tcG5vMQoAb3BqX3BpX25leHRfY3BybCgpOiBpbnZhbGlkIGNvbXBubzAvY29tcG5vMQoAb3BqX3BpX25leHRfcGNybCgpOiBpbnZhbGlkIGNvbXBubzAvY29tcG5vMQoAb3BqX3BpX25leHRfcnBjbCgpOiBpbnZhbGlkIGNvbXBubzAvY29tcG5vMQoAb3BqX3QxX2RlY29kZV9jYmxrKCk6IHVuc3VwcG9ydGVkIGJwbm9fcGx1c19vbmUgPSAlZCA+PSAzMQoARmFpbGVkIHRvIGRlY29kZSB0aWxlIDEvMQoASW5zdWZmaWNpZW50IGRhdGEgZm9yIENNQVAgYm94LgoATmVlZCB0byByZWFkIGEgUENMUiBib3ggYmVmb3JlIHRoZSBDTUFQIGJveC4KAEluc3VmZmljaWVudCBkYXRhIGZvciBDREVGIGJveC4KAE51bWJlciBvZiBjaGFubmVsIGRlc2NyaXB0aW9uIGlzIGVxdWFsIHRvIHplcm8gaW4gQ0RFRiBib3guCgBTdHJlYW0gZXJyb3Igd2hpbGUgcmVhZGluZyBKUDIgSGVhZGVyIGJveDogbm8gJ2loZHInIGJveC4KAE5vbiBjb25mb3JtYW50IGNvZGVzdHJlYW0gVFBzb3Q9PVROc290LgoAU3RyZWFtIGVycm9yIHdoaWxlIHJlYWRpbmcgSlAyIEhlYWRlciBib3g6IGJveCBsZW5ndGggaXMgaW5jb25zaXN0ZW50LgoAQm94IGxlbmd0aCBpcyBpbmNvbnNpc3RlbnQuCgBSZXNvbHV0aW9uIGZhY3RvciBpcyBncmVhdGVyIHRoYW4gdGhlIG1heGltdW0gcmVzb2x1dGlvbiBpbiB0aGUgY29tcG9uZW50LgoAQ29tcG9uZW50IG1hcHBpbmcgc2VlbXMgd3JvbmcuIFRyeWluZyB0byBjb3JyZWN0LgoASW5jb21wbGV0ZSBjaGFubmVsIGRlZmluaXRpb25zLgoATWFsZm9ybWVkIEhUIGNvZGVibG9jay4gSW52YWxpZCBjb2RlYmxvY2sgbGVuZ3RoIHZhbHVlcy4KAFdlIGRvIG5vdCBzdXBwb3J0IG1vcmUgdGhhbiAzIGNvZGluZyBwYXNzZXMgaW4gYW4gSFQgY29kZWJsb2NrOyBUaGlzIGNvZGVibG9ja3MgaGFzICVkIHBhc3Nlcy4KAE1hbGZvcm1lZCBIVCBjb2RlYmxvY2suIERlY29kaW5nIHRoaXMgY29kZWJsb2NrIGlzIHN0b3BwZWQuIFRoZXJlIGFyZSAlZCB6ZXJvIGJpdHBsYW5lcyBpbiAlZCBiaXRwbGFuZXMuCgBDYW5ub3QgdGFrZSBpbiBjaGFyZ2UgbXVsdGlwbGUgdHJhbnNmb3JtYXRpb24gc3RhZ2VzLgoAVW5rbm93biBtYXJrZXIgaGFzIGJlZW4gZGV0ZWN0ZWQgYW5kIGdlbmVyYXRlZCBlcnJvci4KAENvZGVjIHByb3ZpZGVkIHRvIHRoZSBvcGpfc2V0X2RlY29kZWRfY29tcG9uZW50cyBmdW5jdGlvbiBpcyBub3QgYSBkZWNvbXByZXNzb3IgaGFuZGxlci4KAENvZGVjIHByb3ZpZGVkIHRvIHRoZSBvcGpfc2V0dXBfZGVjb2RlciBmdW5jdGlvbiBpcyBub3QgYSBkZWNvbXByZXNzb3IgaGFuZGxlci4KAENvZGVjIHByb3ZpZGVkIHRvIHRoZSBvcGpfcmVhZF9oZWFkZXIgZnVuY3Rpb24gaXMgbm90IGEgZGVjb21wcmVzc29yIGhhbmRsZXIuCgBUaWxlcyBkb24ndCBhbGwgaGF2ZSB0aGUgc2FtZSBkaW1lbnNpb24uIFNraXAgdGhlIE1DVCBzdGVwLgoATnVtYmVyIG9mIGNvbXBvbmVudHMgKCVkKSBpcyBpbmNvbnNpc3RlbnQgd2l0aCBhIE1DVC4gU2tpcCB0aGUgTUNUIHN0ZXAuCgBKUDIgYm94IHdoaWNoIGFyZSBhZnRlciB0aGUgY29kZXN0cmVhbSB3aWxsIG5vdCBiZSByZWFkIGJ5IHRoaXMgZnVuY3Rpb24uCgBNYWxmb3JtZWQgSFQgY29kZWJsb2NrLiBXaGVuIHRoZSBudW1iZXIgb2YgemVybyBwbGFuZXMgYml0cGxhbmVzIGlzIGVxdWFsIHRvIHRoZSBudW1iZXIgb2YgYml0cGxhbmVzLCBvbmx5IHRoZSBjbGVhbnVwIHBhc3MgbWFrZXMgc2Vuc2UsIGJ1dCB3ZSBoYXZlICVkIHBhc3NlcyBpbiB0aGlzIGNvZGVibG9jay4gVGhlcmVmb3JlLCBvbmx5IHRoZSBjbGVhbnVwIHBhc3Mgd2lsbCBiZSBkZWNvZGVkLiBUaGlzIG1lc3NhZ2Ugd2lsbCBub3QgYmUgZGlzcGxheWVkIGFnYWluLgoASW1hZ2UgaGFzIGxlc3MgY29tcG9uZW50cyB0aGFuIGNvZGVzdHJlYW0uCgBOZWVkIHRvIGRlY29kZSB0aGUgbWFpbiBoZWFkZXIgYmVmb3JlIGJlZ2luIHRvIGRlY29kZSB0aGUgcmVtYWluaW5nIGNvZGVzdHJlYW0uCgBQc290IHZhbHVlIG9mIHRoZSBjdXJyZW50IHRpbGUtcGFydCBpcyBlcXVhbCB0byB6ZXJvLCB3ZSBhc3N1bWluZyBpdCBpcyB0aGUgbGFzdCB0aWxlLXBhcnQgb2YgdGhlIGNvZGVzdHJlYW0uCgBBIG1hbGZvcm1lZCBjb2RlYmxvY2sgdGhhdCBoYXMgbW9yZSB0aGFuIG9uZSBjb2RpbmcgcGFzcywgYnV0IHplcm8gbGVuZ3RoIGZvciAybmQgYW5kIHBvdGVudGlhbGx5IHRoZSAzcmQgcGFzcyBpbiBhbiBIVCBjb2RlYmxvY2suCgAJCQkgdGlsZS1wYXJ0WyVkXTogc3Rhcl9wb3M9JWxsaSwgZW5kX2hlYWRlcj0lbGxpLCBlbmRfcG9zPSVsbGkuCgBUaWxlICV1IGhhcyBUUHNvdCA9PSAwIGFuZCBUTnNvdCA9PSAwLCBidXQgbm8gb3RoZXIgdGlsZS1wYXJ0cyB3ZXJlIGZvdW5kLiBFT0MgaXMgYWxzbyBtaXNzaW5nLgoAQ29tcG9uZW50ICVkIGRvZXNuJ3QgaGF2ZSBhIG1hcHBpbmcuCgBBIGNvbmZvcm1pbmcgSlAyIHJlYWRlciBzaGFsbCBpZ25vcmUgYWxsIENvbG91ciBTcGVjaWZpY2F0aW9uIGJveGVzIGFmdGVyIHRoZSBmaXJzdCwgc28gd2UgaWdub3JlIHRoaXMgb25lLgoAVGhlIHNpZ25hdHVyZSBib3ggbXVzdCBiZSB0aGUgZmlyc3QgYm94IGluIHRoZSBmaWxlLgoAVGhlICBib3ggbXVzdCBiZSB0aGUgZmlyc3QgYm94IGluIHRoZSBmaWxlLgoAVGhlIGZ0eXAgYm94IG11c3QgYmUgdGhlIHNlY29uZCBib3ggaW4gdGhlIGZpbGUuCgBGYWlsZWQgdG8gZGVjb2RlLgoATWFsZm9ybWVkIEhUIGNvZGVibG9jay4gSW5jb3JyZWN0IE1FTCBzZWdtZW50IHNlcXVlbmNlLgoAQ29tcG9uZW50ICVkIGlzIG1hcHBlZCB0d2ljZS4KAE9ubHkgb25lIENNQVAgYm94IGlzIGFsbG93ZWQuCgBhcHBseV9jb2xvcl90cmFuc2Zvcm1zID0gT1BKX1RSVUUgaXMgbm90IHN1cHBvcnRlZC4KAFdlIG5lZWQgYW4gaW1hZ2UgcHJldmlvdXNseSBjcmVhdGVkLgoASUhEUiBib3hfbWlzc2luZy4gUmVxdWlyZWQuCgBKUDJIIGJveCBtaXNzaW5nLiBSZXF1aXJlZC4KAE5vdCBzdXJlIGhvdyB0aGF0IGhhcHBlbmVkLgoATWFpbiBoZWFkZXIgaGFzIGJlZW4gY29ycmVjdGx5IGRlY29kZWQuCgBUaWxlICVkLyVkIGhhcyBiZWVuIGRlY29kZWQuCgBIZWFkZXIgb2YgdGlsZSAlZCAvICVkIGhhcyBiZWVuIHJlYWQuCgBFbXB0eSBTT1QgbWFya2VyIGRldGVjdGVkOiBQc290PSVkLgoARGlyZWN0IHVzZSBhdCAjJWQgaG93ZXZlciBwY29sPSVkLgoASW1wbGVtZW50YXRpb24gbGltaXRhdGlvbjogZm9yIHBhbGV0dGUgbWFwcGluZywgcGNvbFslZF0gc2hvdWxkIGJlIGVxdWFsIHRvICVkLCBidXQgaXMgZXF1YWwgdG8gJWQuCgBJbnZhbGlkIGNvbXBvbmVudC9wYWxldHRlIGluZGV4IGZvciBkaXJlY3QgbWFwcGluZyAlZC4KAEludmFsaWQgdmFsdWUgZm9yIGNtYXBbJWRdLm10eXAgPSAlZC4KAFBzb3QgdmFsdWUgaXMgbm90IGNvcnJlY3QgcmVnYXJkcyB0byB0aGUgSlBFRzIwMDAgbm9ybTogJWQuCgBNYWxmb3JtZWQgSFQgY29kZWJsb2NrLiBWTEMgY29kZSBwcm9kdWNlcyBzaWduaWZpY2FudCBzYW1wbGVzIG91dHNpZGUgdGhlIGNvZGVibG9jayBhcmVhLgoAVW5leHBlY3RlZCBPT00uCgAzMiBiaXRzIGFyZSBub3QgZW5vdWdoIHRvIGRlY29kZSB0aGlzIGNvZGVibG9jaywgc2luY2UgdGhlIG51bWJlciBvZiBiaXRwbGFuZSwgJWQsIGlzIGxhcmdlciB0aGFuIDMwLgoAQm90dG9tIHBvc2l0aW9uIG9mIHRoZSBkZWNvZGVkIGFyZWEgKHJlZ2lvbl95MT0lZCkgc2hvdWxkIGJlID4gMC4KAFJpZ2h0IHBvc2l0aW9uIG9mIHRoZSBkZWNvZGVkIGFyZWEgKHJlZ2lvbl94MT0lZCkgc2hvdWxkIGJlID4gMC4KAFVwIHBvc2l0aW9uIG9mIHRoZSBkZWNvZGVkIGFyZWEgKHJlZ2lvbl95MD0lZCkgc2hvdWxkIGJlID49IDAuCgBMZWZ0IHBvc2l0aW9uIG9mIHRoZSBkZWNvZGVkIGFyZWEgKHJlZ2lvbl94MD0lZCkgc2hvdWxkIGJlID49IDAuCgBFcnJvciByZWFkaW5nIFBQVCBtYXJrZXI6IHBhY2tldCBoZWFkZXIgaGF2ZSBiZWVuIHByZXZpb3VzbHkgZm91bmQgaW4gdGhlIG1haW4gaGVhZGVyIChQUE0gbWFya2VyKS4KAFN0YXJ0IHRvIHJlYWQgajJrIG1haW4gaGVhZGVyICglbGxkKS4KAEJvdHRvbSBwb3NpdGlvbiBvZiB0aGUgZGVjb2RlZCBhcmVhIChyZWdpb25feTE9JWQpIGlzIG91dHNpZGUgdGhlIGltYWdlIGFyZWEgKFlzaXo9JWQpLgoAVXAgcG9zaXRpb24gb2YgdGhlIGRlY29kZWQgYXJlYSAocmVnaW9uX3kwPSVkKSBpcyBvdXRzaWRlIHRoZSBpbWFnZSBhcmVhIChZc2l6PSVkKS4KAFJpZ2h0IHBvc2l0aW9uIG9mIHRoZSBkZWNvZGVkIGFyZWEgKHJlZ2lvbl94MT0lZCkgaXMgb3V0c2lkZSB0aGUgaW1hZ2UgYXJlYSAoWHNpej0lZCkuCgBMZWZ0IHBvc2l0aW9uIG9mIHRoZSBkZWNvZGVkIGFyZWEgKHJlZ2lvbl94MD0lZCkgaXMgb3V0c2lkZSB0aGUgaW1hZ2UgYXJlYSAoWHNpej0lZCkuCgBCb3R0b20gcG9zaXRpb24gb2YgdGhlIGRlY29kZWQgYXJlYSAocmVnaW9uX3kxPSVkKSBpcyBvdXRzaWRlIHRoZSBpbWFnZSBhcmVhIChZT3Npej0lZCkuCgBVcCBwb3NpdGlvbiBvZiB0aGUgZGVjb2RlZCBhcmVhIChyZWdpb25feTA9JWQpIGlzIG91dHNpZGUgdGhlIGltYWdlIGFyZWEgKFlPc2l6PSVkKS4KAFJpZ2h0IHBvc2l0aW9uIG9mIHRoZSBkZWNvZGVkIGFyZWEgKHJlZ2lvbl94MT0lZCkgaXMgb3V0c2lkZSB0aGUgaW1hZ2UgYXJlYSAoWE9zaXo9JWQpLgoATGVmdCBwb3NpdGlvbiBvZiB0aGUgZGVjb2RlZCBhcmVhIChyZWdpb25feDA9JWQpIGlzIG91dHNpZGUgdGhlIGltYWdlIGFyZWEgKFhPc2l6PSVkKS4KAFNpemUgeCBvZiB0aGUgZGVjb2RlZCBjb21wb25lbnQgaW1hZ2UgaXMgaW5jb3JyZWN0IChjb21wWyVkXS53PSVkKS4KAFNpemUgeSBvZiB0aGUgZGVjb2RlZCBjb21wb25lbnQgaW1hZ2UgaXMgaW5jb3JyZWN0IChjb21wWyVkXS5oPSVkKS4KAFRpbGUgcmVhZCwgZGVjb2RlZCBhbmQgdXBkYXRlZCBpcyBub3QgdGhlIGRlc2lyZWQgb25lICglZCB2cyAlZCkuCgBJbnZhbGlkIGNvbXBvbmVudCBpbmRleCAlZCAoPj0gJWQpLgoAb3BqX3JlYWRfaGVhZGVyKCkgc2hvdWxkIGJlIGNhbGxlZCBiZWZvcmUgb3BqX3NldF9kZWNvZGVkX2NvbXBvbmVudHMoKS4KAE1lbW9yeSBhbGxvY2F0aW9uIGZhaWx1cmUgaW4gb3BqX2pwMl9hcHBseV9wY2xyKCkuCgBpbWFnZS0+Y29tcHNbJWRdLmRhdGEgPT0gTlVMTCBpbiBvcGpfanAyX2FwcGx5X3BjbHIoKS4KAGludmFsaWQgYm94IHNpemUgJWQgKCV4KQoARmFpbCB0byByZWFkIHRoZSBjdXJyZW50IG1hcmtlciBzZWdtZW50ICglI3gpCgBFcnJvciB3aXRoIFNJWiBtYXJrZXI6IElIRFIgdygldSkgaCgldSkgdnMuIFNJWiB3KCV1KSBoKCV1KQoARXJyb3IgcmVhZGluZyBDT0MgbWFya2VyIChiYWQgbnVtYmVyIG9mIGNvbXBvbmVudHMpCgBJbnZhbGlkIG51bWJlciBvZiB0aWxlcyA6ICV1IHggJXUgKG1heGltdW0gZml4ZWQgYnkganBlZzIwMDAgbm9ybSBpcyA2NTUzNSB0aWxlcykKAEludmFsaWQgbnVtYmVyIG9mIGNvbXBvbmVudHMgKGloZHIpCgBOb3QgZW5vdWdoIG1lbW9yeSB0byBoYW5kbGUgaW1hZ2UgaGVhZGVyIChpaGRyKQoAV3JvbmcgdmFsdWVzIGZvcjogdyglZCkgaCglZCkgbnVtY29tcHMoJWQpIChpaGRyKQoASW52YWxpZCB2YWx1ZXMgZm9yIGNvbXAgPSAlZCA6IGR4PSV1IGR5PSV1IChzaG91bGQgYmUgYmV0d2VlbiAxIGFuZCAyNTUgYWNjb3JkaW5nIHRvIHRoZSBKUEVHMjAwMCBub3JtKQoAQmFkIGltYWdlIGhlYWRlciBib3ggKGJhZCBzaXplKQoAQmFkIENPTFIgaGVhZGVyIGJveCAoYmFkIHNpemUpCgBCYWQgQlBDQyBoZWFkZXIgYm94IChiYWQgc2l6ZSkKAEVycm9yIHdpdGggU0laIG1hcmtlcjogbmVnYXRpdmUgb3IgemVybyBpbWFnZSBzaXplICglbGxkIHggJWxsZCkKAHNraXA6IHNlZ21lbnQgdG9vIGxvbmcgKCVkKSB3aXRoIG1heCAoJWQpIGZvciBjb2RlYmxvY2sgJWQgKHA9JWQsIGI9JWQsIHI9JWQsIGM9JWQpCgByZWFkOiBzZWdtZW50IHRvbyBsb25nICglZCkgd2l0aCBtYXggKCVkKSBmb3IgY29kZWJsb2NrICVkIChwPSVkLCBiPSVkLCByPSVkLCBjPSVkKQoARGVzcGl0ZSBKUDIgQlBDIT0yNTUsIHByZWNpc2lvbiBhbmQvb3Igc2duZCB2YWx1ZXMgZm9yIGNvbXBbJWRdIGlzIGRpZmZlcmVudCB0aGFuIGNvbXBbMF06CiAgICAgICAgWzBdIHByZWMoJWQpIHNnbmQoJWQpIFslZF0gcHJlYyglZCkgc2duZCglZCkKAGJhZCBjb21wb25lbnQgbnVtYmVyIGluIFJHTiAoJWQgd2hlbiB0aGVyZSBhcmUgb25seSAlZCkKAEVycm9yIHdpdGggU0laIG1hcmtlcjogbnVtYmVyIG9mIGNvbXBvbmVudCBpcyBub3QgY29tcGF0aWJsZSB3aXRoIHRoZSByZW1haW5pbmcgbnVtYmVyIG9mIHBhcmFtZXRlcnMgKCAlZCB2cyAlZCkKAEVycm9yIHdpdGggU0laIG1hcmtlcjogaW52YWxpZCB0aWxlIHNpemUgKHRkeDogJWQsIHRkeTogJWQpCgBCYWQgQ09MUiBoZWFkZXIgYm94IChiYWQgc2l6ZTogJWQpCgBCYWQgQ09MUiBoZWFkZXIgYm94IChDSUVMYWIsIGJhZCBzaXplOiAlZCkKAFBURVJNIGNoZWNrIGZhaWx1cmU6ICVkIHJlbWFpbmluZyBieXRlcyBpbiBjb2RlIGJsb2NrICglZCB1c2VkIC8gJWQpCgBNYWxmb3JtZWQgSFQgY29kZWJsb2NrLiBPbmUgb2YgdGhlIGZvbGxvd2luZyBjb25kaXRpb24gaXMgbm90IG1ldDogMiA8PSBTY3VwIDw9IG1pbihMY3VwLCA0MDc5KQoASW52YWxpZCB2YWx1ZXMgZm9yIGNvbXAgPSAlZCA6IHByZWM9JXUgKHNob3VsZCBiZSBiZXR3ZWVuIDEgYW5kIDM4IGFjY29yZGluZyB0byB0aGUgSlBFRzIwMDAgbm9ybS4gT3BlbkpwZWcgb25seSBzdXBwb3J0cyB1cCB0byAzMSkKAEludmFsaWQgYml0IG51bWJlciAlZCBpbiBvcGpfdDJfcmVhZF9wYWNrZXRfaGVhZGVyKCkKAFN0cmVhbSBlcnJvciEKAEVycm9yIG9uIHdyaXRpbmcgc3RyZWFtIQoAU3RyZWFtIHJlYWNoZWQgaXRzIGVuZCAhCgBFeHBlY3RlZCBhIFNPQyBtYXJrZXIgCgBJbnZhbGlkIGJveCBzaXplICVkIGZvciBib3ggJyVjJWMlYyVjJy4gTmVlZCAlZCBieXRlcywgJWQgYnl0ZXMgcmVtYWluaW5nIAoATWFsZm9ybWVkIEhUIGNvZGVibG9jay4gRGVjb2RpbmcgdGhpcyBjb2RlYmxvY2sgaXMgc3RvcHBlZC4gVV9xIGlzIGxhcmdlciB0aGFuIHplcm8gYml0cGxhbmVzICsgMSAKAE1hbGZvcm1lZCBIVCBjb2RlYmxvY2suIERlY29kaW5nIHRoaXMgY29kZWJsb2NrIGlzIHN0b3BwZWQuIFVfcSBpc2xhcmdlciB0aGFuIGJpdHBsYW5lcyArIDEgCgBDT0xSIEJPWCBtZXRoIHZhbHVlIGlzIG5vdCBhIHJlZ3VsYXIgdmFsdWUgKCVkKSwgc28gd2Ugd2lsbCBpZ25vcmUgdGhlIGVudGlyZSBDb2xvdXIgU3BlY2lmaWNhdGlvbiBib3guIAoAV2hpbGUgcmVhZGluZyBDQ1BfUU5UU1RZIGVsZW1lbnQgaW5zaWRlIFFDRCBvciBRQ0MgbWFya2VyIHNlZ21lbnQsIG51bWJlciBvZiBzdWJiYW5kcyAoJWQpIGlzIGdyZWF0ZXIgdG8gT1BKX0oyS19NQVhCQU5EUyAoJWQpLiBTbyB3ZSBsaW1pdCB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIHN0b3JlZCB0byBPUEpfSjJLX01BWEJBTkRTICglZCkgYW5kIHNraXAgdGhlIHJlc3QuIAoASlAyIElIRFIgYm94OiBjb21wcmVzc2lvbiB0eXBlIGluZGljYXRlIHRoYXQgdGhlIGZpbGUgaXMgbm90IGEgY29uZm9ybWluZyBKUDIgZmlsZSAoJWQpIAoAVGlsZSBpbmRleCBwcm92aWRlZCBieSB0aGUgdXNlciBpcyBpbmNvcnJlY3QgJWQgKG1heCA9ICVkKSAKAEVycm9yIGRlY29kaW5nIGNvbXBvbmVudCAlZC4KVGhlIG51bWJlciBvZiByZXNvbHV0aW9ucyB0byByZW1vdmUgKCVkKSBpcyBncmVhdGVyIG9yIGVxdWFsIHRoYW4gdGhlIG51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4E8AANBPAAABVgAAAQAAAPBPAADATwAAAVQAAAAAAAAAUAAAwFAAAAFUAAABAAAAEFAAANBQAAABSAAAAAAAACBQAADAUAAAAUgAAAEAAAAwUAAA0FAAAAE4AAAAAAAAQFAAAMBQAAABOAAAAQAAAFBQAADQUAAAATAAAAAAAABgUAAAIFEAAAEwAAABAAAAcFAAADBRAAABJAAAAAAAAIBQAABAUQAAASQAAAEAAACQUAAAUFEAAAEcAAAAAAAAoFAAAIBRAAABHAAAAQAAALBQAACQUQAAARYAAAAAAACgUgAAoFEAAAEWAAABAAAAsFIAALBRAAABVgAAAAAAAOBQAADQUAAAAVYAAAEAAADwUAAAwFAAAAFUAAAAAAAAAFEAAMBQAAABVAAAAQAAABBRAADQUAAAAVEAAAAAAAAgUQAA4FAAAAFRAAABAAAAMFEAAPBQAAABSAAAAAAAAEBRAAAAUQAAAUgAAAEAAABQUQAAEFEAAAE4AAAAAAAAYFEAACBRAAABOAAAAQAAAHBRAAAwUQAAATQAAAAAAACAUQAAQFEAAAE0AAABAAAAkFEAAFBRAAABMAAAAAAAAKBRAABgUQAAATAAAAEAAACwUQAAcFEAAAEoAAAAAAAAwFEAAGBRAAABKAAAAQAAANBRAABwUQAAASQAAAAAAADgUQAAgFEAAAEkAAABAAAA8FEAAJBRAAABIgAAAAAAAABSAACgUQAAASIAAAEAAAAQUgAAsFEAAAEcAAAAAAAAIFIAAMBRAAABHAAAAQAAADBSAADQUQAAARgAAAAAAABAUgAA4FEAAAEYAAABAAAAUFIAAPBRAAABFgAAAAAAAGBSAAAAUgAAARYAAAEAAABwUgAAEFIAAAEUAAAAAAAAgFIAACBSAAABFAAAAQAAAJBSAAAwUgAAARIAAAAAAACgUgAAQFIAAAESAAABAAAAsFIAAFBSAAABEQAAAAAAAMBSAABgUgAAAREAAAEAAADQUgAAcFIAAMEKAAAAAAAA4FIAAIBSAADBCgAAAQAAAPBSAACQUgAAwQkAAAAAAAAAUwAAoFIAAMEJAAABAAAAEFMAALBSAAChCAAAAAAAACBTAADAUgAAoQgAAAEAAAAwUwAA0FIAACEFAAAAAAAAQFMAAOBSAAAhBQAAAQAAAFBTAADwUgAAQQQAAAAAAABgUwAAAFMAAEEEAAABAAAAcFMAABBTAAChAgAAAAAAAIBTAAAgUwAAoQIAAAEAAACQUwAAMFMAACECAAAAAAAAoFMAAEBTAAAhAgAAAQAAALBTAABQUwAAQQEAAAAAAADAUwAAYFMAAEEBAAABAAAA0FMAAHBTAAARAQAAAAAAAOBTAACAUwAAEQEAAAEAAADwUwAAkFMAAIUAAAAAAAAAAFQAAKBTAACFAAAAAQAAABBUAACwUwAASQAAAAAAAAAgVAAAwFMAAEkAAAABAAAAMFQAANBTAAAlAAAAAAAAAEBUAADgUwAAJQAAAAEAAABQVAAA8FMAABUAAAAAAAAAYFQAAABUAAAVAAAAAQAAAHBUAAAQVAAACQAAAAAAAACAVAAAIFQAAAkAAAABAAAAkFQAADBUAAAFAAAAAAAAAKBUAABAVAAABQAAAAEAAACwVAAAUFQAAAEAAAAAAAAAoFQAAGBUAAABAAAAAQAAALBUAABwVAAAAVYAAAAAAADAVAAAwFQAAAFWAAABAAAA0FQAANBUAAAAAQMDAQIDAwUGBwcGBgcHAAEDAwECAwMFBgcHBgYHBwUGBwcGBgcHCAgICAgICAgFBgcHBgYHBwgICAgICAgIAQIDAwICAwMGBgcHBgYHBwECAwMCAgMDBgYHBwYGBwcGBgcHBgYHBwgICAgICAgIBgYHBwYGBwcICAgICAgICAMDBAQDAwQEBwcHBwcHBwcDAwQEAwMEBAcHBwcHBwcHBwcHBwcHBwcICAgICAgICAcHBwcHBwcHCAgICAgICAgDAwQEAwMEBAcHBwcHBwcHAwMEBAMDBAQHBwcHBwcHBwcHBwcHBwcHCAgICAgICAgHBwcHBwcHBwgICAgICAgIAQIDAwICAwMGBgcHBgYHBwECAwMCAgMDBgYHBwYGBwcGBgcHBgYHBwgICAgICAgIBgYHBwYGBwcICAgICAgICAICAwMCAgMDBgYHBwYGBwcCAgMDAgIDAwYGBwcGBgcHBgYHBwYGBwcICAgICAgICAYGBwcGBgcHCAgICAgICAgDAwQEAwMEBAcHBwcHBwcHAwMEBAMDBAQHBwcHBwcHBwcHBwcHBwcHCAgICAgICAgHBwcHBwcHBwgICAgICAgIAwMEBAMDBAQHBwcHBwcHBwMDBAQDAwQEBwcHBwcHBwcHBwcHBwcHBwgICAgICAgIBwcHBwcHBwcICAgICAgICAABBQYBAgYGAwMHBwMDBwcAAQUGAQIGBgMDBwcDAwcHAwMHBwMDBwcEBAcHBAQHBwMDBwcDAwcHBAQHBwQEBwcBAgYGAgIGBgMDBwcDAwcHAQIGBgICBgYDAwcHAwMHBwMDBwcDAwcHBAQHBwQEBwcDAwcHAwMHBwQEBwcEBAcHBQYICAYGCAgHBwgIBwcICAUGCAgGBggIBwcICAcHCAgHBwgIBwcICAcHCAgHBwgIBwcICAcHCAgHBwgIBwcICAYGCAgGBggIBwcICAcHCAgGBggIBgYICAcHCAgHBwgIBwcICAcHCAgHBwgIBwcICAcHCAgHBwgIBwcICAcHCAgBAgYGAgIGBgMDBwcDAwcHAQIGBgICBgYDAwcHAwMHBwMDBwcDAwcHBAQHBwQEBwcDAwcHAwMHBwQEBwcEBAcHAgIGBgICBgYDAwcHAwMHBwICBgYCAgYGAwMHBwMDBwcDAwcHAwMHBwQEBwcEBAcHAwMHBwMDBwcEBAcHBAQHBwYGCAgGBggIBwcICAcHCAgGBggIBgYICAcHCAgHBwgIBwcICAcHCAgHBwgIBwcICAcHCAgHBwgIBwcICAcHCAgGBggIBgYICAcHCAgHBwgIBgYICAYGCAgHBwgIBwcICAcHCAgHBwgIBwcICAcHCAgHBwgIBwcICAcHCAgHBwgIAAEDAwECAwMFBgcHBgYHBwABAwMBAgMDBQYHBwYGBwcFBgcHBgYHBwgICAgICAgIBQYHBwYGBwcICAgICAgICAECAwMCAgMDBgYHBwYGBwcBAgMDAgIDAwYGBwcGBgcHBgYHBwYGBwcICAgICAgICAYGBwcGBgcHCAgICAgICAgDAwQEAwMEBAcHBwcHBwcHAwMEBAMDBAQHBwcHBwcHBwcHBwcHBwcHCAgICAgICAgHBwcHBwcHBwgICAgICAgIAwMEBAMDBAQHBwcHBwcHBwMDBAQDAwQEBwcHBwcHBwcHBwcHBwcHBwgICAgICAgIBwcHBwcHBwcICAgICAgICAECAwMCAgMDBgYHBwYGBwcBAgMDAgIDAwYGBwcGBgcHBgYHBwYGBwcICAgICAgICAYGBwcGBgcHCAgICAgICAgCAgMDAgIDAwYGBwcGBgcHAgIDAwICAwMGBgcHBgYHBwYGBwcGBgcHCAgICAgICAgGBgcHBgYHBwgICAgICAgIAwMEBAMDBAQHBwcHBwcHBwMDBAQDAwQEBwcHBwcHBwcHBwcHBwcHBwgICAgICAgIBwcHBwcHBwcICAgICAgICAMDBAQDAwQEBwcHBwcHBwcDAwQEAwMEBAcHBwcHBwcHBwcHBwcHBwcICAgICAgICAcHBwcHBwcHCAgICAgICAgAAwEEAwYEBwEEAgUEBwUHAAMBBAMGBAcBBAIFBAcFBwEEAgUEBwUHAgUCBQUHBQcBBAIFBAcFBwIFAgUFBwUHAwYEBwYIBwgEBwUHBwgHCAMGBAcGCAcIBAcFBwcIBwgEBwUHBwgHCAUHBQcHCAcIBAcFBwcIBwgFBwUHBwgHCAEEAgUEBwUHAgUCBQUHBQcBBAIFBAcFBwIFAgUFBwUHAgUCBQUHBQcCBQIFBQcFBwIFAgUFBwUHAgUCBQUHBQcEBwUHBwgHCAUHBQcHCAcIBAcFBwcIBwgFBwUHBwgHCAUHBQcHCAcIBQcFBwcIBwgFBwUHBwgHCAUHBQcHCAcIAwYEBwYIBwgEBwUHBwgHCAMGBAcGCAcIBAcFBwcIBwgEBwUHBwgHCAUHBQcHCAcIBAcFBwcIBwgFBwUHBwgHCAYIBwgICAgIBwgHCAgICAgGCAcICAgICAcIBwgICAgIBwgHCAgICAgHCAcICAgICAcIBwgICAgIBwgHCAgICAgEBwUHBwgHCAUHBQcHCAcIBAcFBwcIBwgFBwUHBwgHCAUHBQcHCAcIBQcFBwcIBwgFBwUHBwgHCAUHBQcHCAcIBwgHCAgICAgHCAcICAgICAcIBwgICAgIBwgHCAgICAgHCAcICAgICAcIBwgICAgIBwgHCAgICAgHCAcICAgICAkJCgoJCQoKDAwNCwwMDQsJCQoKCQkKCgwMCw0MDAsNDAwNDQwMCwsMCQ0KCQwKCwwMCwsMDA0NDAkLCgkMCg0JCQoKCQkKCgwMDQsMDA0LCQkKCgkJCgoMDAsNDAwLDQwMDQ0MDAsLDAkNCgkMCgsMDAsLDAwNDQwJCwoJDAoNCgoKCgoKCgoNCw0LDQsNCwoKCQkKCgkJDQsMDA0LDAwNDQ0NCwsLCw0KDQoKCwoLDQ0MDAsLDAwNCgwJCgsJDAoKCQkKCgkJCw0MDAsNDAwKCgoKCgoKCgsNCw0LDQsNCwsMDA0NDAwLCgwJCg0JDAsLCwsNDQ0NCwoLCgoNCg0AQem7AQs3AQABAAEAAQAAAQEAAAEBAAEAAQABAAEAAAAAAQEBAQAAAAAAAQABAAAAAAEBAQEAAAABAAEBAQBBqbwBCzcBAAEAAQABAAABAQAAAQEAAQABAAEAAQAAAAABAQEBAAAAAAABAAEAAAAAAQEBAQAAAAEAAQEBAEHpvAELBwEAAQABAAEAQfm8AQuVAgEAAQABAAEAAAAAAQEBAQAAAAAAAQABAAAAAAEBAQEAAAAAAAEAAQEBAAABAQAAAAEAAQABAAEBAQEBAQEBAQABAAEAAQABAAAAAAEBAQEAAQAAAQEAAQAAAAABAQEBAAEAAQEBAQECAAAABAAAAAQAAAAIAAAAkP8AAAwAAAAYAAAAUv8AABQAAAAZAAAAU/8AABQAAAAaAAAAXv8AABQAAAAbAAAAXP8AABQAAAAcAAAAXf8AABQAAAAdAAAAX/8AABQAAAAeAAAAUf8AAAIAAAAfAAAAVf8AAAQAAAAgAAAAV/8AAAQAAAAhAAAAWP8AABAAAAAiAAAAYP8AAAQAAAAjAAAAYf8AABAAAAAkAAAAkf8AQZi/AQtlY/8AAAQAAAAlAAAAZP8AABQAAAAmAAAAdP8AABQAAAAnAAAAeP8AAAQAAAAoAAAAUP8AAAQAAAApAAAAWf8AAAQAAAAqAAAAdf8AABQAAAArAAAAd/8AABQAAAAsAAAAAAAAABQAQZDAAQs1LQAAAC4AAAAvAAAAMAAAADEAAAAyAAAAMwAAADQAAAAgIFBqNgAAAHB5dGY3AAAAaDJwajgAQdDAAQsycmRoaTkAAABybG9jOgAAAGNjcGI7AAAAcmxjcDwAAABwYW1jPQAAAGZlZGM+AAAAeGIAQZDBAQtBGQALABkZGQAAAAAFAAAAAAAACQAAAAALAAAAAAAAAAAZAAoKGRkZAwoHAAEACQsYAAAJBgsAAAsABhkAAAAZGRkAQeHBAQshDgAAAAAAAAAAGQALDRkZGQANAAACAAkOAAAACQAOAAAOAEGbwgELAQwAQafCAQsVEwAAAAATAAAAAAkMAAAAAAAMAAAMAEHVwgELARAAQeHCAQsVDwAAAAQPAAAAAAkQAAAAAAAQAAAQAEGPwwELARIAQZvDAQseEQAAAAARAAAAAAkSAAAAAAASAAASAAAaAAAAGhoaAEHSwwELDhoAAAAaGhoAAAAAAAAJAEGDxAELARQAQY/EAQsVFwAAAAAXAAAAAAkUAAAAAAAUAAAUAEG9xAELARYAQcnEAQsnFQAAAAAVAAAAAAkWAAAAAAAWAAAWAAAwMTIzNDU2Nzg5QUJDREVGAEHxxAELCGwBAAAAAAAFAEGExQELAWkAQZzFAQsOagAAAGsAAAD4ZwAAAAQAQbTFAQsBAQBBxMUBCwX/////Cg==";
    function getBinarySync(file) {
      if (file == wasmBinaryFile && wasmBinary) {
        return new Uint8Array(wasmBinary);
      }
      var binary = tryParseAsDataURI(file);
      if (binary) {
        return binary;
      }
      if (readBinary) {
        return readBinary(file);
      }
      throw 'sync fetching of the wasm failed: you can preload it to Module["wasmBinary"] manually, or emcc.py will do that for you when generating HTML (but not JS)';
    }
    function instantiateSync(file, info) {
      var module;
      var binary = getBinarySync(file);
      module = new WebAssembly.Module(binary);
      var instance = new WebAssembly.Instance(module, info);
      return [instance, module];
    }
    function createWasm() {
      var info = {
        "a": wasmImports
      };
      function receiveInstance(instance, module) {
        wasmExports = instance.exports;
        wasmMemory = wasmExports["i"];
        updateMemoryViews();
        addOnInit(wasmExports["j"]);
        removeRunDependency("wasm-instantiate");
        return wasmExports;
      }
      addRunDependency("wasm-instantiate");
      if (Module["instantiateWasm"]) {
        try {
          return Module["instantiateWasm"](info, receiveInstance);
        } catch (e) {
          err(`Module.instantiateWasm callback failed with error: ${e}`);
          readyPromiseReject(e);
        }
      }
      var result = instantiateSync(wasmBinaryFile, info);
      return receiveInstance(result[0]);
    }
    var callRuntimeCallbacks = callbacks => {
      while (callbacks.length > 0) {
        callbacks.shift()(Module);
      }
    };
    var noExitRuntime = Module["noExitRuntime"] || true;
    var __emscripten_memcpy_js = (dest, src, num) => HEAPU8.copyWithin(dest, src, src + num);
    var getHeapMax = () => 2147483648;
    var growMemory = size => {
      var b = wasmMemory.buffer;
      var pages = (size - b.byteLength + 65535) / 65536;
      try {
        wasmMemory.grow(pages);
        updateMemoryViews();
        return 1;
      } catch (e) {}
    };
    var _emscripten_resize_heap = requestedSize => {
      var oldSize = HEAPU8.length;
      requestedSize >>>= 0;
      var maxHeapSize = getHeapMax();
      if (requestedSize > maxHeapSize) {
        return false;
      }
      var alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
      for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
        var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
        var replacement = growMemory(newSize);
        if (replacement) {
          return true;
        }
      }
      return false;
    };
    var ENV = {};
    var getExecutableName = () => thisProgram || "./this.program";
    var getEnvStrings = () => {
      if (!getEnvStrings.strings) {
        var lang = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
        var env = {
          "USER": "web_user",
          "LOGNAME": "web_user",
          "PATH": "/",
          "PWD": "/",
          "HOME": "/home/web_user",
          "LANG": lang,
          "_": getExecutableName()
        };
        for (var x in ENV) {
          if (ENV[x] === undefined) delete env[x];else env[x] = ENV[x];
        }
        var strings = [];
        for (var x in env) {
          strings.push(`${x}=${env[x]}`);
        }
        getEnvStrings.strings = strings;
      }
      return getEnvStrings.strings;
    };
    var stringToAscii = (str, buffer) => {
      for (var i = 0; i < str.length; ++i) {
        HEAP8[buffer++] = str.charCodeAt(i);
      }
      HEAP8[buffer] = 0;
    };
    var _environ_get = (__environ, environ_buf) => {
      var bufSize = 0;
      getEnvStrings().forEach((string, i) => {
        var ptr = environ_buf + bufSize;
        HEAPU32[__environ + i * 4 >> 2] = ptr;
        stringToAscii(string, ptr);
        bufSize += string.length + 1;
      });
      return 0;
    };
    var _environ_sizes_get = (penviron_count, penviron_buf_size) => {
      var strings = getEnvStrings();
      HEAPU32[penviron_count >> 2] = strings.length;
      var bufSize = 0;
      strings.forEach(string => bufSize += string.length + 1);
      HEAPU32[penviron_buf_size >> 2] = bufSize;
      return 0;
    };
    var printCharBuffers = [null, [], []];
    var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : undefined;
    var UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;
      while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      }
      var str = "";
      while (idx < endPtr) {
        var u0 = heapOrArray[idx++];
        if (!(u0 & 128)) {
          str += String.fromCharCode(u0);
          continue;
        }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 224) == 192) {
          str += String.fromCharCode((u0 & 31) << 6 | u1);
          continue;
        }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 240) == 224) {
          u0 = (u0 & 15) << 12 | u1 << 6 | u2;
        } else {
          u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
        }
        if (u0 < 65536) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 65536;
          str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
        }
      }
      return str;
    };
    var printChar = (stream, curr) => {
      var buffer = printCharBuffers[stream];
      if (curr === 0 || curr === 10) {
        (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
        buffer.length = 0;
      } else {
        buffer.push(curr);
      }
    };
    var UTF8ToString = (ptr, maxBytesToRead) => ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
    var _fd_write = (fd, iov, iovcnt, pnum) => {
      var num = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[iov >> 2];
        var len = HEAPU32[iov + 4 >> 2];
        iov += 8;
        for (var j = 0; j < len; j++) {
          printChar(fd, HEAPU8[ptr + j]);
        }
        num += len;
      }
      HEAPU32[pnum >> 2] = num;
      return 0;
    };
    function _jsPrintWarning(message_ptr) {
      const message = UTF8ToString(message_ptr);
      (Module.warn || console.warn)(`OpenJPEG: ${message}`);
    }
    function _setImageData(array_ptr, array_size) {
      Module.imageData = new Uint8ClampedArray(Module.HEAPU8.subarray(array_ptr, array_ptr + array_size));
    }
    function _storeErrorMessage(message_ptr) {
      const message = UTF8ToString(message_ptr);
      if (!Module.errorMessages) {
        Module.errorMessages = message;
      } else {
        Module.errorMessages += "\n" + message;
      }
    }
    var wasmImports = {
      f: __emscripten_memcpy_js,
      b: _emscripten_resize_heap,
      c: _environ_get,
      d: _environ_sizes_get,
      e: _fd_write,
      g: _jsPrintWarning,
      h: _setImageData,
      a: _storeErrorMessage
    };
    var wasmExports = createWasm();
    var ___wasm_call_ctors = wasmExports["j"];
    var _malloc = Module["_malloc"] = wasmExports["k"];
    var _free = Module["_free"] = wasmExports["l"];
    var _jp2_decode = Module["_jp2_decode"] = wasmExports["n"];
    var __emscripten_stack_restore = wasmExports["_emscripten_stack_restore"];
    var __emscripten_stack_alloc = wasmExports["_emscripten_stack_alloc"];
    var _emscripten_stack_get_current = wasmExports["emscripten_stack_get_current"];
    var calledRun;
    dependenciesFulfilled = function runCaller() {
      if (!calledRun) run();
      if (!calledRun) dependenciesFulfilled = runCaller;
    };
    function run() {
      if (runDependencies > 0) {
        return;
      }
      preRun();
      if (runDependencies > 0) {
        return;
      }
      function doRun() {
        if (calledRun) return;
        calledRun = true;
        Module["calledRun"] = true;
        if (ABORT) return;
        initRuntime();
        readyPromiseResolve(Module);
        if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
        postRun();
      }
      if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(function () {
          setTimeout(function () {
            Module["setStatus"]("");
          }, 1);
          doRun();
        }, 1);
      } else {
        doRun();
      }
    }
    if (Module["preInit"]) {
      if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
      while (Module["preInit"].length > 0) {
        Module["preInit"].pop()();
      }
    }
    run();
    return moduleArg;
  };
})();
/* harmony default export */ const openjpeg = (OpenJPEG);
;// CONCATENATED MODULE: ./src/core/stream.js


class Stream extends base_stream_BaseStream {
  constructor(arrayBuffer, start, length, dict) {
    super();
    this.bytes = arrayBuffer instanceof Uint8Array ? arrayBuffer : new Uint8Array(arrayBuffer);
    this.start = start || 0;
    this.pos = this.start;
    this.end = start + length || this.bytes.length;
    this.dict = dict;
  }
  get length() {
    return this.end - this.start;
  }
  get isEmpty() {
    return this.length === 0;
  }
  getByte() {
    if (this.pos >= this.end) {
      return -1;
    }
    return this.bytes[this.pos++];
  }
  getBytes(length) {
    const bytes = this.bytes;
    const pos = this.pos;
    const strEnd = this.end;
    if (!length) {
      return bytes.subarray(pos, strEnd);
    }
    let end = pos + length;
    if (end > strEnd) {
      end = strEnd;
    }
    this.pos = end;
    return bytes.subarray(pos, end);
  }
  getByteRange(begin, end) {
    if (begin < 0) {
      begin = 0;
    }
    if (end > this.end) {
      end = this.end;
    }
    return this.bytes.subarray(begin, end);
  }
  reset() {
    this.pos = this.start;
  }
  moveStart() {
    this.start = this.pos;
  }
  makeSubStream(start, length, dict = null) {
    return new Stream(this.bytes.buffer, start, length, dict);
  }
}
class StringStream extends Stream {
  constructor(str) {
    super(stringToBytes(str));
  }
}
class NullStream extends Stream {
  constructor() {
    super(new Uint8Array(0));
  }
}

;// CONCATENATED MODULE: ./src/core/jpx.js



class JpxError extends BaseException {
  constructor(msg) {
    super(msg, "JpxError");
  }
}
class JpxImage {
  static #module = null;
  static decode(data, ignoreColorSpace = false) {
    this.#module ||= openjpeg({
      warn: util_warn
    });
    const imageData = this.#module.decode(data, ignoreColorSpace);
    if (typeof imageData === "string") {
      throw new JpxError(imageData);
    }
    return imageData;
  }
  static cleanup() {
    this.#module = null;
  }
  static parseImageProperties(stream) {
    if (stream instanceof ArrayBuffer || ArrayBuffer.isView(stream)) {
      stream = new Stream(stream);
    } else {
      throw new JpxError("Invalid data format, must be a TypedArray.");
    }
    let newByte = stream.getByte();
    while (newByte >= 0) {
      const oldByte = newByte;
      newByte = stream.getByte();
      const code = oldByte << 8 | newByte;
      if (code === 0xff51) {
        stream.skip(4);
        const Xsiz = stream.getInt32() >>> 0;
        const Ysiz = stream.getInt32() >>> 0;
        const XOsiz = stream.getInt32() >>> 0;
        const YOsiz = stream.getInt32() >>> 0;
        stream.skip(16);
        const Csiz = stream.getUint16();
        return {
          width: Xsiz - XOsiz,
          height: Ysiz - YOsiz,
          bitsPerComponent: 8,
          componentsCount: Csiz
        };
      }
    }
    throw new JpxError("No size marker found in JPX stream");
  }
}

;// CONCATENATED MODULE: ./src/pdf.image_decoders.js




const pdfjsVersion = "4.2.67";
const pdfjsBuild = "49b388101";

var __webpack_exports__Jbig2Error = __webpack_exports__.Jbig2Error;
var __webpack_exports__Jbig2Image = __webpack_exports__.Jbig2Image;
var __webpack_exports__JpegError = __webpack_exports__.JpegError;
var __webpack_exports__JpegImage = __webpack_exports__.JpegImage;
var __webpack_exports__JpxError = __webpack_exports__.JpxError;
var __webpack_exports__JpxImage = __webpack_exports__.JpxImage;
var __webpack_exports__VerbosityLevel = __webpack_exports__.VerbosityLevel;
var __webpack_exports__getVerbosityLevel = __webpack_exports__.getVerbosityLevel;
var __webpack_exports__setVerbosityLevel = __webpack_exports__.setVerbosityLevel;
export { __webpack_exports__Jbig2Error as Jbig2Error, __webpack_exports__Jbig2Image as Jbig2Image, __webpack_exports__JpegError as JpegError, __webpack_exports__JpegImage as JpegImage, __webpack_exports__JpxError as JpxError, __webpack_exports__JpxImage as JpxImage, __webpack_exports__VerbosityLevel as VerbosityLevel, __webpack_exports__getVerbosityLevel as getVerbosityLevel, __webpack_exports__setVerbosityLevel as setVerbosityLevel };

//# sourceMappingURL=pdf.image_decoders.mjs.map