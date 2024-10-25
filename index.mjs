import {B, getChildren, getStyle, setAttribute, setChildLast, setElement, setHTML, setStyles} from '@taufik-nurrohman/document';
import {fromHTML} from '@taufik-nurrohman/from';
import {getOffset, getSize} from '@taufik-nurrohman/rect';
import {isSet} from '@taufik-nurrohman/is';
import {toNumber} from '@taufik-nurrohman/to';

function el(a, b = 'span') {
    return '<' + b + '>' + a + '</' + b + '>';
}

function getRectSelection($, div, self) {
    let span = el('&zwnj;'),
        props = [
            'border-bottom-width',
            'border-left-width',
            'border-right-width',
            'border-top-width',
            'box-sizing',
            'direction',
            'font-family',
            'font-size',
            'font-size-adjust',
            'font-stretch',
            'font-style',
            'font-variant',
            'font-weight',
            'height',
            'letter-spacing',
            'line-height',
            'max-height',
            'max-width',
            'min-height',
            'min-width',
            'padding-bottom',
            'padding-left',
            'padding-right',
            'padding-top',
            'tab-size',
            'text-align',
            'text-decoration',
            'text-indent',
            'text-transform',
            'width',
            'word-spacing'
        ];
    setHTML(div, el(fromHTML($.before)) + span + el(fromHTML($.value), 'mark') + span + el(fromHTML($.after)));
    let styles = "";
    props.forEach(prop => {
        let value = getStyle(self, prop);
        value && (styles += prop + ':' + value + ';');
    });
    let L = toNumber(getStyle(self, props[1]), 0),
        T = toNumber(getStyle(self, props[3]), 0),
        [X, Y] = getOffset(self),
        [W, H] = getSize(self);
    setAttribute(div, 'style', styles);
    setStyles(div, {
        'border-style': 'solid',
        'white-space': 'pre-wrap',
        'word-wrap': 'break-word',
        'overflow': 'hidden',
        'position': 'absolute',
        'left': X,
        'top': Y,
        'visibility': 'hidden'
    });
    setChildLast(B, div);
    let c = getChildren(div);
    let start = c[1],
        rect = c[2],
        end = c[3],
        startOffset = getOffset(start),
        startSize = getSize(start),
        rectOffset = getOffset(rect),
        rectSize = getSize(rect),
        endOffset = getOffset(end),
        endSize = getSize(end);
    return [{
        h: startSize[1], // Caret height (must be the font size)
        w: 0, // Caret width is always zero
        x: startOffset[0] + X + L, // Left offset of selection start
        y: startOffset[1] + Y + T // Top offset of selection start
    }, {
        h: endSize[1], // Caret height (must be the font size)
        w: 0, // Caret width is always zero
        x: endOffset[0] + X + L, // Left offset of selection end
        y: endOffset[1] + Y + T // Top offset of selection end
    }, {
        h: rectSize[1], // Total selection height
        w: rectSize[0], // Total selection width
        x: rectOffset[0] + X + L, // Left offset of the whole selection
        y: rectOffset[1] + Y + T // Top offset of the whole selection
    }, {
        h: H, // Text area height
        w: W, // Text area width
        x: X, // Left offset of text area
        y: Y // Top offset of text area
    }];
}

export default function Rect(self) {
    let $ = this;
    $.mirror = setElement('div');
    $.rect = key => {
        let r = getRectSelection($.$(), $.mirror, self);
        return isSet(key) ? [
            r[0][key],
            r[1][key],
            r[2][key],
            r[3][key]
        ] : r;
    };
}