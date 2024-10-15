/*
 * 文本框，修改两端对齐逻辑
 */
import { fabric } from 'fabric';

fabric.Textbox = fabric.util.createClass(fabric.Textbox, {
  type: 'textbox',

  _renderChars: function (method, ctx, line, left, top, lineIndex) {
    // set proper line offset
    var lineHeight = this.getHeightOfLine(lineIndex),
      isJustify = this.textAlign.indexOf('justify') !== -1,
      actualStyle,
      nextStyle,
      charsToRender = '',
      charBox,
      boxWidth = 0,
      timeToRender,
      path = this.path,
      shortCut = !isJustify && this.charSpacing === 0 && this.isEmptyStyles(lineIndex) && !path,
      isLtr = this.direction === 'ltr',
      sign = this.direction === 'ltr' ? 1 : -1,
      drawingLeft,
      currentDirection = ctx.canvas.getAttribute('dir');
    ctx.save();
    if (currentDirection !== this.direction) {
      ctx.canvas.setAttribute('dir', isLtr ? 'ltr' : 'rtl');
      ctx.direction = isLtr ? 'ltr' : 'rtl';
      ctx.textAlign = isLtr ? 'left' : 'right';
    }
    top -= (lineHeight * this._fontSizeFraction) / this.lineHeight;
    if (shortCut) {
      // render all the line in one pass without checking
      // drawingLeft = isLtr ? left : left - this.getLineWidth(lineIndex);
      this._renderChar(method, ctx, lineIndex, 0, line.join(''), left, top, lineHeight);
      ctx.restore();
      return;
    }
    for (var i = 0, len = line.length - 1; i <= len; i++) {
      timeToRender = i === len || this.charSpacing || path;
      charsToRender += line[i];
      charBox = this.__charBounds[lineIndex][i];
      if (boxWidth === 0) {
        left += sign * (charBox.kernedWidth - charBox.width);
        boxWidth += charBox.width;
      } else {
        boxWidth += charBox.kernedWidth;
      }
      if (isJustify && !timeToRender) {
        if (this._reSpaceAndTab.test(line[i])) {
          timeToRender = true;
        }
      }
      if (!timeToRender) {
        // if we have charSpacing, we render char by char
        actualStyle = actualStyle || this.getCompleteStyleDeclaration(lineIndex, i);
        nextStyle = this.getCompleteStyleDeclaration(lineIndex, i + 1);
        timeToRender = fabric.util.hasStyleChanged(actualStyle, nextStyle, false);
      }
      // if (timeToRender) {
      if (path) {
        ctx.save();
        ctx.translate(charBox.renderLeft, charBox.renderTop);
        ctx.rotate(charBox.angle);
        this._renderChar(method, ctx, lineIndex, i, charsToRender, -boxWidth / 2, 0, lineHeight);
        ctx.restore();
      } else {
        drawingLeft = left;
        this._renderChar(method, ctx, lineIndex, i, charsToRender, drawingLeft, top, lineHeight);
      }
      charsToRender = '';
      actualStyle = nextStyle;
      left += sign * boxWidth;
      boxWidth = 0;
      // }
    }
    ctx.restore();
  },
  enlargeSpaces: function () {
    var diffSpace, currentLineWidth, numberOfSpaces, accumulatedSpace, line, charBound, spaces;
    for (var i = 0, len = this._textLines.length; i < len; i++) {
      if (this.textAlign !== 'justify' && (i === len - 1 || this.isEndOfWrapping(i))) {
        continue;
      }
      accumulatedSpace = 0;
      line = this._textLines[i];
      currentLineWidth = this.getLineWidth(i);
      if (
        currentLineWidth < this.width &&
        (spaces = this.textLines[i].split('')) &&
        spaces.length > 1
      ) {
        numberOfSpaces = spaces.length;
        diffSpace = (this.width - currentLineWidth) / (numberOfSpaces - 1);
        for (var j = 0, jlen = line.length; j <= jlen; j++) {
          charBound = this.__charBounds[i][j];
          // if (this._reSpaceAndTab.test(line[j])) {
          charBound.left += accumulatedSpace;
          if (j < jlen - 1) {
            charBound.width += diffSpace;
            charBound.kernedWidth += diffSpace;
            accumulatedSpace += diffSpace;
          }
          // } else {
          //   charBound.left += accumulatedSpace;
          // }
        }
      }
    }
  },
});

fabric.Textbox.fromObject = function (options, callback) {
  const { text } = options;
  return callback(new fabric.Textbox(text, options));
};

export default fabric.Rect;
