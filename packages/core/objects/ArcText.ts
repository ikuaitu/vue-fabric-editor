/*eslint prefer-const: "off"*/
import { fabric } from 'fabric';
import { sectorBoundingBox } from './utils/index';
const _dimensionAffectingProps = [
  'curvature',
  'fontSize',
  'fontWeight',
  'fontFamily',
  'fontStyle',
  'lineHeight',
  'text',
  'charSpacing',
  'textAlign',
  'styles',
  'color',
  'canvas',
];
const multipleSpacesRegex = /  +/g; // 多个空格正则匹配
const NUM_FRACTION_DIGITS = 2;
const BaseRadius = 10000;
const { Color, util, Point } = fabric;

const ArcText = fabric.util.createClass(fabric.IText, {
  type: 'arc-text',
  useRenderBoundingBoxes: true,
  useBothRenderingMethod: true,
  initialize: function (text: string, options: any) {
    this.callSuper('initialize', text, options);
  },
  toObject: function (propertiesToInclude: any) {
    const obj = this.callSuper('toObject', propertiesToInclude);
    obj.radius = this.radius;
    obj.curvature = this.curvature;
    return obj;
  },
  _render: function (ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(-this._contentOffsetX, -this._contentOffsetY);
    if (!this.__lineHeights) {
      this.initDimensions();
    }
    this._setTextStyles(ctx);
    this._renderTextLinesBackground(ctx);
    this._renderTextDecoration(ctx, 'underline');
    this._renderText(ctx);
    this._renderTextDecoration(ctx, 'overline');
    this._renderTextDecoration(ctx, 'linethrough');
    ctx.restore();
  },
  // 设置圆角
  setRadius: function (value: number) {
    this.setCurvature(BaseRadius / value);
  },
  // 设置弧度
  setCurvature: function (value: number) {
    this.set('curvature', value);
    // 手动触发对象修改事件
    this.canvas?.fire('object:modified');
  },
  renderCharCallback: function (
    method: any,
    ctx: CanvasRenderingContext2D,
    lineIndex: number,
    charIndex: number,
    endCharIndex: number,
    left: number,
    top: number,
    fullDecl: any
  ) {
    for (let index = charIndex; index <= endCharIndex; index++) {
      const tr = this._charTransformations[lineIndex][index];
      ctx.textAlign = 'center';
      if (tr.char) {
        let angle = this.curvature > 0 ? -tr.charAngle : -tr.charAngle - Math.PI;
        if (tr.contour && fullDecl.contourStroke) {
          ctx.save();
          ctx.lineWidth = fullDecl.contourStrokeWidth;
          ctx.strokeStyle = fullDecl.contourStroke;
          ctx.beginPath();
          ctx.moveTo(tr.contour.tl.x, tr.contour.tl.y);
          ctx.lineTo(tr.contour.tr.x, tr.contour.tr.y);
          ctx.lineTo(tr.contour.br.x, tr.contour.br.y);
          ctx.lineTo(tr.contour.bl.x, tr.contour.bl.y);
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        }
        this.runCharRendering(method, ctx, tr.char, tr.cl.x, tr.cl.y, angle, fullDecl, 'center');
      }
    }
  },
  runCharRendering: function (
    method: any,
    ctx: CanvasRenderingContext2D,
    _char: string,
    left: number,
    top: number,
    angle: number,
    fullDecl: any,
    alignment?: string
  ) {
    if (ctx) {
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(angle);
    }
    this.defaultTextRender(method, ctx, _char, fullDecl);
    if (ctx) {
      ctx.restore();
    }
  },

  getSelectionStartFromPointer: function (e: any) {
    const mouseOffset = this.getLocalPointer(e);
    let relX = mouseOffset.x + (-this.width / 2 + this._contentOffsetX) * this.scaleX,
      relY =
        mouseOffset.y +
        (-this.height / 2 - this._curvingCenter.y + this._contentOffsetY) * this.scaleY,
      angle = Math.atan2(-relX, -relY),
      radius = Math.sqrt(relX * relX + relY * relY) / this.scaleY,
      selectedLine = 0;

    if (this.curvature > 0) {
      while (radius < this._linesRads[selectedLine]) {
        selectedLine++;
      }
    } else {
      if (angle < 0) angle += Math.PI * 2;
      while (radius > this._linesRads[selectedLine]) {
        selectedLine++;
      }
    }
    if (selectedLine >= this._textLines.length) {
      selectedLine = this._textLines.length - 1;
    }

    let charIndex = 0;
    for (let i = 0; i < selectedLine; i++) {
      charIndex += this._textLines[i].length + this.missingNewlineOffset(i);
    }

    let specials = this._specialArray && this._specialArray[selectedLine];
    let specialsLen = 0;
    let diff = Infinity,
      diff2,
      j;
    for (j = 0; j < (this._charTransformations[selectedLine] || []).length; j++) {
      if (
        (specials && specials[j] && specials[j] === specials[j - 1]) ||
        this._charTransformations[selectedLine][j].isDiacritic
      ) {
        specialsLen++;
        continue;
      }
      diff2 =
        Math.abs(this._charTransformations[selectedLine][j].leftAngle - angle) % (Math.PI * 2);
      if (diff < diff2) {
        let result = charIndex + j - 1 - specialsLen;
        specialsLen = 0;
        return result;
      }
      diff = diff2;
      specialsLen = 0;
    }
    return charIndex + j - 1;
  },
  _getLineLeftOffset: function (lineIndex: number, width?: number): number {
    if (!width) return 0;
    let lineWidth = this.getLineWidth(lineIndex);
    if (this.textAlign === 'center') return (width - lineWidth) / 2;
    if (this.textAlign === 'right') return width - lineWidth;
    if (this.textAlign === 'justify-center' && this.isEndOfWrapping(lineIndex))
      return (width - lineWidth) / 2;
    if (this.textAlign === 'justify-right' && this.isEndOfWrapping(lineIndex))
      return width - lineWidth;
    return 0;
  },

  _renderTextDecoration: function (ctx: CanvasRenderingContext2D, type: any) {
    if (!this.get(type) && !this.styleHas(type)) {
      return;
    }
    let currentFill,
      _size,
      size,
      dy,
      _dy,
      lastFill,
      line,
      lastDecoration,
      charStart,
      currentDecoration;
    ctx.save();
    for (let i = 0, len = this._textLines.length; i < len; i++) {
      if (!this.type && !this.styleHas(type, i)) {
        continue;
      }
      charStart = 0;
      lastDecoration = this.getValueOfPropertyAt(i, 0, type);
      lastFill = this.getValueOfPropertyAt(i, 0, 'fill');
      size = this.getHeightOfChar(i, 0);
      dy = this.getValueOfPropertyAt(i, 0, 'deltaY');
      let j;
      for (j = 0; j < this._textLines[i].length; j++) {
        currentDecoration = this.getValueOfPropertyAt(i, j, type);
        currentFill = this.getValueOfPropertyAt(i, j, 'fill');
        _size = this.getHeightOfChar(i, j);
        _dy = this.getValueOfPropertyAt(i, j, 'deltaY');

        if (
          currentDecoration !== lastDecoration ||
          currentFill !== lastFill ||
          _size !== size ||
          _dy !== dy
        ) {
          if (lastDecoration && lastFill) {
            let offset = this.offsets[type] * size + dy;
            this._drawTextLinesDecorationSector(ctx, lastFill, offset, i, charStart, j);
          }

          lastDecoration = currentDecoration;
          lastFill = currentFill;
          size = _size;
          dy = _dy;
          charStart = j;
        }
      }
      if (currentDecoration && currentFill) {
        const offset = this.offsets[type] * size + dy;
        this._drawTextLinesDecorationSector(ctx, currentFill, offset, i, charStart, j);
      }
    }
    ctx.restore();
    this._removeShadow(ctx);
  },

  enArcLargeSpaces: function (width: number) {
    let diffSpace, currentLineWidth, numberOfSpaces, accumulatedSpace, line, charBound, spaces;
    for (let i = 0, len = this._textLines.length; i < len; i++) {
      if (this.textAlign !== 'justify' && (i === len - 1 || this.isEndOfWrapping(i))) {
        continue;
      }
      accumulatedSpace = 0;
      line = this._textLines[i];
      currentLineWidth = this.getLineWidth(i);
      if (currentLineWidth < width && (spaces = this.textLines[i].match(this._reSpacesAndTabs))) {
        numberOfSpaces = spaces.length;
        diffSpace = (width - currentLineWidth) / numberOfSpaces;
        for (let j = 0, jlen = line.length; j <= jlen; j++) {
          charBound = this.__charBounds[i][j];
          if (this._reSpaceAndTab.test(line[j])) {
            charBound.width += diffSpace;
            charBound.kernedWidth += diffSpace;
            charBound.left += accumulatedSpace;
            accumulatedSpace += diffSpace;
          } else {
            charBound.left += accumulatedSpace;
          }
        }
      }
    }
  },

  _getBaseLine: function (styleFontSize = 1) {
    return this.lineHeight * this.fontSize - 0.9 * styleFontSize;
  },

  initDimensions: function () {
    if (this.__skipDimension) {
      return;
    }
    this.isEditing && this.initDelayedCursor();
    this.clearContextTop();
    this._splitText();
    this._clearCache();
    for (let li = 0, len = this._textLines.length; li < len; li++) {
      this.getLineWidth(li);
      this.getHeightOfLine(li);
    }
    const textHeight = this.calcTextHeight();
    const textWidth = this.calcTextWidth();
    const curvature = this.curvature !== undefined ? this.curvature : 1;
    this.radius = BaseRadius / curvature;
    const cx = 0,
      cy = curvature > 0 ? textHeight / 2 + this.radius : -textHeight / 2 + this.radius;
    this._curvingCenter = new Point(cx, cy);
    let globalOffset = 0;
    if (curvature > 0) {
      globalOffset = textHeight;
    }
    this._linesRads = [];
    if (this.textAlign.indexOf('justify') !== -1) {
      this.enArcLargeSpaces(textWidth);
    }
    // 自定义_charTransformations 字符位置信息
    const cts: any[] = (this._charTransformations = []);

    let yMin = Infinity,
      yMax = -Infinity,
      xMin = Infinity,
      xMax = -Infinity;
    for (let i = 0; i < this.__charBounds.length; i++) {
      cts[i] = [];
      const row = this.__charBounds[i];
      let currentLeft = -textWidth / 2 + this._getLineLeftOffset(i, textWidth);
      if (this.__lineInfo) {
        currentLeft += this.__lineInfo[i].renderedLeft;
      }
      const heightOfLine = this.getHeightOfLine(i);
      const charOffset =
        heightOfLine -
        heightOfLine / this.lineHeight +
        (heightOfLine * this._fontSizeFraction) / this.lineHeight;
      if (curvature > 0) {
        globalOffset -= heightOfLine;
      } else {
        globalOffset += heightOfLine;
      }
      const rowOffset = Math.abs(this.radius) + globalOffset;
      this._linesRads.push(rowOffset);
      for (let j = 0; j < row.length; j++) {
        const bounds = row[j];
        const decl = this.getCompleteStyleDeclaration(i, j);
        const deltaY = (decl && decl.deltaY) || 0;
        let bottomRadius,
          topRadius,
          charRadius,
          lineRadius,
          leftAngle,
          charAngle,
          rightAngle,
          renderLeftAngle,
          renderRightAngle;
        if (curvature > 0) {
          bottomRadius = deltaY + rowOffset;
          topRadius = deltaY + rowOffset + heightOfLine;
          charRadius = deltaY + rowOffset + charOffset;
          lineRadius = deltaY + rowOffset + heightOfLine - heightOfLine / this.lineHeight;

          const midRadius = (bottomRadius * 3 + topRadius * 2) / 5;
          leftAngle = -(currentLeft + bounds.left) / midRadius;
          rightAngle = -(currentLeft + bounds.left + bounds.width) / midRadius;
          charAngle = -(currentLeft + bounds.left + bounds.width / 2) / midRadius;
        } else {
          bottomRadius = deltaY + rowOffset;
          topRadius = deltaY + rowOffset - heightOfLine;
          charRadius = deltaY + rowOffset - charOffset;
          lineRadius = deltaY + rowOffset - heightOfLine + heightOfLine / this.lineHeight;

          let midRadius = (bottomRadius * 2 + topRadius * 3) / 5;
          leftAngle = Math.PI + (currentLeft + bounds.left) / midRadius;
          rightAngle = Math.PI + (currentLeft + bounds.left + bounds.width) / midRadius;
          charAngle = Math.PI + (currentLeft + bounds.left + bounds.width / 2) / midRadius;
        }
        const rsin = Math.sin(rightAngle),
          rcos = Math.cos(rightAngle),
          lsin = Math.sin(leftAngle),
          lcos = Math.cos(leftAngle),
          csin = Math.sin(charAngle),
          ccos = Math.cos(charAngle);
        const ct = {
          contour: bounds.contour && {
            x: bounds.contour.x * decl.fontSize,
            w: bounds.contour.w * decl.fontSize,
            h: bounds.contour.h * decl.fontSize,
            y: this._getBaseLine(decl.fontSize) + bounds.contour.y * decl.fontSize,
          },
          char: this._textLines[i][j],
          charAngle,
          leftAngle,
          rightAngle,
          charRadius,
          bottomRadius,
          topRadius,
          lineRadius,
          renderLeftAngle,
          renderRightAngle,
          bl: { x: cx - bottomRadius * lsin, y: cy - bottomRadius * lcos },
          br: { x: cx - bottomRadius * rsin, y: cy - bottomRadius * rcos },
          tl: { x: cx - topRadius * lsin, y: cy - topRadius * lcos },
          tr: { x: cx - topRadius * rsin, y: cy - topRadius * rcos },
          nl: { x: cx - lineRadius * lsin, y: cy - lineRadius * lcos },
          nr: { x: cx - lineRadius * rsin, y: cy - lineRadius * rcos },
          cl: { x: cx - charRadius * csin, y: cy - charRadius * ccos },
          lc: { x: cx - lineRadius * csin, y: cy - lineRadius * ccos },
        };

        if (ct.char?.trim() && bounds.contour) {
          let cos = (util as any).cos(-charAngle),
            sin = (util as any).sin(-charAngle);
          let rotateMatrix = [cos, sin, -sin, cos, 0, 0];
          let matrix = util.multiplyTransformMatrices([1, 0, 0, 1, ct.lc.x, ct.lc.y], rotateMatrix);
          let y = ct.contour.y;
          if (curvature > 0) {
            const x = ct.contour.x - this.__charBounds[i][j].width / 2;
            ct.contour.br = (util as any).transformPoint({ x: x + ct.contour.w, y: -y }, matrix);
            ct.contour.bl = (util as any).transformPoint({ x: x, y: -y }, matrix);
            ct.contour.tl = (util as any).transformPoint({ x: x, y: -y - ct.contour.h }, matrix);
            ct.contour.tr = (util as any).transformPoint(
              { x: x + ct.contour.w, y: -y - ct.contour.h },
              matrix
            );
          } else {
            const x = -ct.contour.x + this.__charBounds[i][j].width / 2;
            ct.contour.br = (util as any).transformPoint({ x: x - ct.contour.w, y: y }, matrix);
            ct.contour.bl = (util as any).transformPoint({ x: x, y: y }, matrix);
            ct.contour.tl = (util as any).transformPoint({ x: x, y: y + ct.contour.h }, matrix);
            ct.contour.tr = (util as any).transformPoint(
              { x: x - ct.contour.w, y: y + ct.contour.h },
              matrix
            );
          }
          xMin = Math.min(xMin, ct.contour.br.x, ct.contour.bl.x, ct.contour.tl.x, ct.contour.tr.x);
          xMax = Math.max(xMax, ct.contour.br.x, ct.contour.bl.x, ct.contour.tl.x, ct.contour.tr.x);
          yMin = Math.min(yMin, ct.contour.br.y, ct.contour.bl.y, ct.contour.tl.y, ct.contour.tr.y);
          yMax = Math.max(yMax, ct.contour.br.y, ct.contour.bl.y, ct.contour.tl.y, ct.contour.tr.y);
        }
        cts[i][j] = ct;
      }
    }
    for (let i = 0; i < cts.length; i++) {
      const ctsl = cts[i],
        cta = ctsl[0],
        ctb = ctsl[ctsl.length - 1];
      let bbox, bbox2;
      if (curvature > 0) {
        bbox = sectorBoundingBox(
          cta.tl,
          ctb.tr,
          this._curvingCenter,
          this._linesRads[i] + this.__lineHeights[i]
        );
        bbox2 = sectorBoundingBox(cta.nl, ctb.nr, this._curvingCenter, this._linesRads[i]);
      } else {
        bbox = sectorBoundingBox(
          ctb.tr,
          cta.tl,
          this._curvingCenter,
          this._linesRads[i] - this.__lineHeights[i]
        );
        bbox2 = sectorBoundingBox(ctb.nr, cta.nl, this._curvingCenter, this._linesRads[i]);
      }
      xMin = Math.min(xMin, bbox.x, bbox2.x);
      xMax = Math.max(xMax, bbox.x + bbox.width, bbox2.x + bbox2.width);
      yMin = Math.min(yMin, bbox.y, bbox2.y);
      yMax = Math.max(yMax, bbox.y + bbox.height, bbox2.y + bbox2.height);
    }

    this._enableDiacritics();

    const leftOverflow = -xMin - textWidth / 2;
    const rightOverflow = xMax - textWidth / 2;
    const topOverflow = -yMin - textHeight / 2;
    const bottomOverflow = yMax - textHeight / 2;

    this._contentOffsetY = bottomOverflow / 2 - topOverflow / 2;
    this._contentOffsetX = rightOverflow / 2 - leftOverflow / 2;

    if (this._contentOffsetX > 0) {
      this.width = Math.max(textWidth + leftOverflow + rightOverflow, this.MIN_TEXT_WIDTH);
    }
    this.height = Math.max(textHeight + topOverflow + bottomOverflow, textHeight);
  },

  _hasStyleChanged: function (prevStyle: string[], thisStyle: string[]) {
    if (Object.keys(prevStyle).length !== Object.keys(thisStyle).length) {
      return true;
    }
    for (let prop in prevStyle) {
      if (prevStyle[prop] !== thisStyle[prop]) {
        return true;
      }
    }
    return false;
  },

  interateTextChunks: function (lineIndex: number, foo: any, iteratorFn?: any) {
    let actualStyle,
      nextStyle,
      firstChar = 0;
    let specs = this._specialArray;
    let line = this._textLines[lineIndex];
    let isJustify = this.textAlign.indexOf('justify') !== -1;
    let shortCut =
      !isJustify &&
      this.charSpacing === 0 &&
      (!specs || !specs[lineIndex]) &&
      this.isEmptyStyles(lineIndex);

    if (shortCut) {
      foo(0, line.length, null);
      return;
    }

    let timeToRender;

    for (let i = 0, len = line.length - 1; i <= len; i++) {
      timeToRender = i === len || this.charSpacing;
      iteratorFn && iteratorFn(i);
      if (isJustify && !timeToRender) {
        if (this._reSpaceAndTab.test(line[i])) {
          timeToRender = true;
        }
      }
      if (!timeToRender) {
        actualStyle = actualStyle || this.getCompleteStyleDeclaration(lineIndex, i);
        nextStyle = this.getCompleteStyleDeclaration(lineIndex, i + 1);
        timeToRender =
          (specs && specs[lineIndex] && specs[lineIndex][i] !== specs[lineIndex][i + 1]) ||
          this._hasStyleChanged(actualStyle, nextStyle);
      }

      if (timeToRender) {
        foo(firstChar, i, actualStyle);
        firstChar = i + 1;
        actualStyle = nextStyle;
      }
    }
  },

  _enableDiacritics: function () {
    const cts = this._charTransformations;
    //Fix Diacritics symbols on a curve
    const diacritics = [
      '́',
      '̀',
      '̂',
      '̌',
      '̋',
      '̏',
      '̃',
      '̇',
      '̣',
      '·',
      '̈',
      'ː',
      '̆',
      '̑',
      '͗',
      '̃',
      '҃',
      '̩',
      '̄',
      '̱',
      '⃓',
      '̷',
      '̵',
      '̊',
      '̓',
      '̒',
      '̔',
      '̉',
      '̛',
      '̦',
      '̧',
      '̡',
      '̢',
      '̨',
      '͝',
      '͡',
      '',
      '͞',
      '͠',
    ];
    for (let i in cts) {
      for (let j in cts[i]) {
        if (cts[i][j].char && diacritics.includes(cts[i][j].char)) {
          for (let k: any = j; k--; ) {
            if (cts[i][k].char) {
              cts[i][k].char += cts[i][j].char;
              cts[i][j].isDiacritic = true;
              delete cts[i][j].char;
              break;
            }
          }
        }
      }
    }
  },

  _drawTextLinesDecorationSector: function (
    ctx: CanvasRenderingContext2D,
    currentColor: string,
    offset: number,
    line: number,
    charStart: number,
    charEnd: number
  ) {
    ctx.fillStyle = currentColor;
    ctx.lineWidth = this.fontSize / 15;
    let startChar = this._charTransformations[line][charStart];
    let endChar = this._charTransformations[line][charEnd - 1];
    ctx.beginPath();
    if (this.curvature < 0) {
      ctx.arc(
        this._curvingCenter.x,
        this._curvingCenter.y,
        startChar.charRadius + 1 + offset,
        -startChar.leftAngle - Math.PI / 2,
        -endChar.rightAngle - Math.PI / 2,
        true
      );
    } else {
      ctx.arc(
        this._curvingCenter.x,
        this._curvingCenter.y,
        startChar.charRadius - 1 - offset,
        -startChar.leftAngle - Math.PI / 2,
        -endChar.rightAngle - Math.PI / 2,
        false
      );
    }
    ctx.stroke();
  },

  _contextSelectBackgroundSector: function (
    ctx: CanvasRenderingContext2D,
    line: number,
    charStart: number,
    charEnd: number,
    fullLineRadius?: boolean
  ) {
    ctx.beginPath();
    let startChar = this._charTransformations[line][charStart];
    let endChar = this._charTransformations[line][charEnd];
    ctx.moveTo(startChar.tl.x, startChar.tl.y);
    let radius = fullLineRadius ? startChar.bottomRadius : startChar.lineRadius;
    const startStatus = this.curvature < 0 ? true : false;
    ctx.arc(
      this._curvingCenter.x,
      this._curvingCenter.y,
      radius,
      -startChar.leftAngle - Math.PI / 2,
      -endChar.rightAngle - Math.PI / 2,
      startStatus
    );
    ctx.lineTo(endChar.tr.x, endChar.tr.y);
    const endStatus = this.curvature < 0 ? false : true;
    ctx.arc(
      this._curvingCenter.x,
      this._curvingCenter.y,
      startChar.topRadius,
      -endChar.rightAngle - Math.PI / 2,
      -startChar.leftAngle - Math.PI / 2,
      endStatus
    );
    ctx.closePath();
  },
  // 设置文本背景颜色
  _renderTextLinesBackground: function (ctx: CanvasRenderingContext2D) {
    if (!this.textBackgroundColor && !this.styleHas('textBackgroundColor')) return;
    let originalFill = ctx.fillStyle,
      lastColor,
      charStart,
      currentColor;
    for (let i = 0, len = this._textLines.length; i < len; i++) {
      if (!this.textBackgroundColor && !this.styleHas('textBackgroundColor', i)) {
        continue;
      }
      charStart = 0;
      lastColor = this.getValueOfPropertyAt(i, 0, 'textBackgroundColor');
      let j = 0;
      for (j = 0; j < this._textLines[i].length; j++) {
        currentColor = this.getValueOfPropertyAt(i, j, 'textBackgroundColor');
        if (currentColor !== lastColor) {
          if (lastColor) {
            ctx.fillStyle = lastColor;
            this._contextSelectBackgroundSector(ctx, i, charStart, j - 1);
            ctx.fill();
          }
          charStart = j;
          lastColor = currentColor;
        }
      }
      if (currentColor) {
        ctx.fillStyle = currentColor;
        this._contextSelectBackgroundSector(ctx, i, charStart, j - 1);
        ctx.fill();
      }
    }
    ctx.fillStyle = originalFill;
    this._removeShadow(ctx);
  },

  _set: function (key: any, value: any) {
    this.callSuper('_set', key, value);
    let needsDims = false;
    if (typeof key === 'object') {
      const keys = key;
      for (let _key in keys) {
        needsDims = needsDims || _dimensionAffectingProps.indexOf(_key) !== -1;
      }
    } else {
      needsDims = _dimensionAffectingProps.indexOf(key) !== -1;
    }

    if (needsDims) {
      this.initDimensions();
      this.setCoords();
    }
    return this;
  },
  renderSelection: function (boundaries: any, ctx: CanvasRenderingContext2D) {
    const selectionStart = this.inCompositionMode
        ? this.hiddenTextarea.selectionStart
        : this.selectionStart,
      selectionEnd = this.inCompositionMode ? this.hiddenTextarea.selectionEnd : this.selectionEnd,
      start = this.get2DCursorLocation(selectionStart),
      end = this.get2DCursorLocation(selectionEnd),
      startLine = start.lineIndex,
      endLine = end.lineIndex,
      startChar = start.charIndex < 0 ? 0 : start.charIndex,
      endChar = end.charIndex < 0 ? 0 : end.charIndex;

    ctx.fillStyle = this.selectionColor;
    ctx && ctx.translate(-this._contentOffsetX, -this._contentOffsetY);

    for (let i = startLine; i <= endLine; i++) {
      let charStart = i === startLine ? startChar : 0,
        charEnd = i >= startLine && i < endLine ? this._textLines[i].length : endChar;
      this._contextSelectBackgroundSector(ctx, i, charStart, charEnd - 1, i !== endLine);
      ctx.fill();
    }
  },

  _measureLine(lineIndex: number) {
    let width = 0,
      charIndex,
      grapheme,
      line = this._textLines[lineIndex],
      prevGrapheme,
      graphemeInfo,
      numOfSpaces = 0,
      lineBounds = new Array(line.length);
    let renderedLeft = 0;
    let renderedWidth = 0;
    let renderedBottom = -Infinity;
    let renderedTop = -Infinity;
    this.__charBounds[lineIndex] = lineBounds;
    for (charIndex = 0; charIndex < line.length; charIndex++) {
      grapheme = line[charIndex];
      const style = this.getCompleteStyleDeclaration(lineIndex, charIndex);
      graphemeInfo = this._getGraphemeBox(grapheme, lineIndex, charIndex, prevGrapheme);
      lineBounds[charIndex] = graphemeInfo;
      width += graphemeInfo.kernedWidth;
      prevGrapheme = grapheme;
      let contourX, contourW, contourH, contourY;
      if (this.useRenderBoundingBoxes && graphemeInfo.contour) {
        contourX = graphemeInfo.contour.x * style.fontSize;
        contourW = graphemeInfo.contour.w * style.fontSize;
        contourH = graphemeInfo.contour.h * style.fontSize;
        contourY = this._getBaseLine(style.fontSize) + graphemeInfo.contour.y * style.fontSize;
        renderedLeft = Math.max(renderedLeft, -(graphemeInfo.left + contourX));
        renderedWidth = Math.max(renderedWidth, contourW + contourX + graphemeInfo.left);
        renderedBottom = Math.max(renderedBottom, -contourY);
        renderedTop = Math.max(renderedTop, contourY + contourH);
      }
    }
    lineBounds[charIndex] = {
      left: graphemeInfo ? graphemeInfo.left + graphemeInfo.width : 0,
      width: 0,
      kernedWidth: 0,
      height: this.fontSize,
    };
    const renderedRight = Math.max(0, renderedWidth - width);
    return {
      width,
      numOfSpaces,
      renderedLeft,
      renderedBottom,
      renderedRight,
      renderedTop,
    };
  },

  getLineWidth(lineIndex: number) {
    if (this.__lineWidths[lineIndex]) {
      return this.__lineWidths[lineIndex];
    }
    let width,
      line = this._textLines[lineIndex],
      lineInfo;
    if (line.length === 0) {
      width = 0;
    } else {
      lineInfo = this.measureLine(lineIndex);
      if (this.useRenderBoundingBoxes) {
        width = lineInfo.width + lineInfo.renderedRight + lineInfo.renderedLeft;
        this.__lineInfo[lineIndex] = lineInfo;
      } else {
        width = lineInfo.width;
      }
    }
    this.__lineWidths[lineIndex] = width;
    return width;
  },
  // 覆盖 renderCursor
  renderCursor(boundaries: any, ctx: CanvasRenderingContext2D) {
    const cursorLocation = this.get2DCursorLocation(),
      lineIndex = cursorLocation.lineIndex,
      topOffset = boundaries.topOffset,
      charIndex = cursorLocation.charIndex > 0 ? cursorLocation.charIndex - 1 : 0,
      multiplier = this.scaleX * this.canvas.getZoom(),
      charHeight = this.getValueOfPropertyAt(lineIndex, charIndex, 'fontSize'),
      dy = this.getValueOfPropertyAt(lineIndex, charIndex, 'deltaY'),
      cursorWidth = this.cursorWidth / multiplier;
    if (this.inCompositionMode) {
      this.renderSelection(boundaries, ctx);
    }

    ctx.lineWidth = cursorWidth;
    ctx.strokeStyle = this.getValueOfPropertyAt(lineIndex, charIndex, 'fill');
    ctx.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity;

    if (this._charTransformations[lineIndex]?.[charIndex]) {
      const tr = this._charTransformations[lineIndex][charIndex];
      ctx.translate(-this._contentOffsetX, -this._contentOffsetY);
      ctx.beginPath();
      ctx.moveTo(tr.nr.x, tr.nr.y);
      ctx.lineTo(tr.tr.x, tr.tr.y);
      ctx.stroke();
    } else {
      ctx.fillRect(
        boundaries.left + boundaries.leftOffset - cursorWidth / 2,
        topOffset + boundaries.top + dy,
        cursorWidth,
        charHeight
      );
    }
  },

  _renderTextCommon(ctx: CanvasRenderingContext2D, method: any) {
    ctx && ctx.save();
    let lineHeights = 0;
    const left = this._getLeftOffset(),
      top = this._getTopOffset();
    // _applyPatternGradientTransformText ?
    const offsets = this._applyPatternGradientTransform(
      ctx,
      method === 'fillText' ? this.fill : this.stroke
    );

    for (let i = 0, len = (this._textLines || []).length; i < len; i++) {
      let lineOffsetX = 0,
        lineOffsetY = 0;
      if (this.__lineInfo && this.__lineInfo[i]) {
        lineOffsetX = this.__lineInfo[i].renderedLeft;
        lineOffsetY = this.__renderOffsetTop;
      }
      const heightOfLine = this.getHeightOfLine(i),
        maxHeight = heightOfLine / this.lineHeight,
        leftOffset = this._getLineLeftOffset(i);
      this._renderTextLine(
        method,
        ctx,
        this._textLines[i],
        left + leftOffset - offsets.offsetX + lineOffsetX,
        top + lineHeights + maxHeight - offsets.offsetY - lineOffsetY,
        i
      );
      lineHeights += heightOfLine;
    }
    ctx && ctx.restore();
  },

  _renderText(ctx: CanvasRenderingContext2D) {
    if (this.fill) {
      ctx.fillStyle = this.fill;
    }

    if (this.useBothRenderingMethod) {
      return this._renderTextCommon(ctx, 'both');
    }
    if (this.paintFirst === 'stroke') {
      this._renderTextStroke(ctx);
      this._renderTextFill(ctx);
    } else {
      this._renderTextFill(ctx);
      this._renderTextStroke(ctx);
    }
  },
  // 分割文本
  _splitText() {
    let text = this.text;
    if (this.textTransform) {
      if (this.textTransform === 'uppercase') {
        text = text.toUpperCase();
      }
      if (this.textTransform === 'lowercase') {
        text = text.toLowerCase();
      }
      if (this.textTransform === 'capitalize') {
        text = (util.string as any).capitalize(text);
      }
    }
    let newLines = this._splitTextIntoLines(text);
    this.textLines = newLines.lines;
    this._textLines = newLines.graphemeLines;
    this._unwrappedTextLines = newLines._unwrappedLines;
    this._text = newLines.graphemeText;

    if (this.useRenderBoundingBoxes) {
      this.__lineInfo = [];
    }
    return newLines;
  },
  // // 计算文本高度
  calcTextHeight() {
    let lineHeight,
      height = 0;
    for (let i = 0, len = this._textLines.length; i < len; i++) {
      lineHeight = this.getHeightOfLine(i);
      height += i === len - 1 ? lineHeight / this.lineHeight : lineHeight;
    }
    return height;
  },
  //    渲染字符样式
  _renderChars(
    method: 'fillText' | 'strokeText',
    ctx: CanvasRenderingContext2D,
    line: Array<any>,
    left: number,
    top: number,
    lineIndex: number
  ) {
    let lineHeight = this.getHeightOfLine(lineIndex),
      charBox,
      boxWidth = 0;
    ctx && ctx.save();
    top -= (lineHeight * this._fontSizeFraction) / this.lineHeight;
    this.interateTextChunks(
      lineIndex,
      (charIndex: any, endCharIndex: any) => {
        this._renderStr(method, ctx, lineIndex, charIndex, endCharIndex, left, top);
        left += boxWidth;
        boxWidth = 0;
      },
      (i: any) => {
        charBox = this.__charBounds[lineIndex][i];
        if (boxWidth === 0) {
          left += charBox.kernedWidth - charBox.width;
          boxWidth += charBox.width;
        } else {
          boxWidth += charBox.kernedWidth;
        }
      }
    );
    ctx && ctx.restore();
  },

  _renderStr(
    method: any,
    ctx: CanvasRenderingContext2D,
    lineIndex: number,
    charIndex: number,
    endCharIndex: number,
    left: number,
    top: number
  ) {
    const decl = this._getStyleDeclaration(lineIndex, charIndex),
      fullDecl = this.getCompleteStyleDeclaration(lineIndex, charIndex),
      shouldFill = method === 'fillText' && fullDecl.fill,
      shouldStroke = method === 'strokeText' && fullDecl.stroke && fullDecl.strokeWidth;
    let fillOffsets, strokeOffsets;
    if (method !== 'calc' && method !== 'both' && !shouldStroke && !shouldFill) {
      return;
    }
    ctx && decl && ctx.save();
    // ctx && this._applyCharStyles(method, ctx, lineIndex, charIndex, fullDecl);

    shouldFill && (fillOffsets = this._setFillStyles(ctx, fullDecl));
    shouldStroke && (strokeOffsets = this._setStrokeStyles(ctx, fullDecl));

    if (decl && decl.textBackgroundColor) {
      this._removeShadow(ctx);
    }
    if (decl && decl.deltaY) {
      top += decl.deltaY;
    }

    fullDecl.special =
      this._specialArray &&
      this._specialArray[lineIndex] &&
      this._specialArray[lineIndex][charIndex];

    if (this.renderCharCallback) {
      this.renderCharCallback(method, ctx, lineIndex, charIndex, endCharIndex, left, top, fullDecl);
    } else {
      const text = this._textLines[lineIndex].slice(charIndex, endCharIndex + 1).join('');
      this.runCharRendering(method, ctx, text, left, top, 0, fullDecl);
    }
    ctx && decl && ctx.restore();
  },

  _renderBackground(ctx: CanvasRenderingContext2D) {
    if (!this.backgroundColor && !this.backgroundStroke) {
      return;
    }
    let dim = this._getNonTransformedDimensions();
    if (this.backgroundColor) {
      ctx.fillStyle = this.backgroundColor;
      ctx.fillRect(-dim.x / 2, -dim.y / 2, dim.x, dim.y);
    }

    if (this.backgroundStroke) {
      this._setStrokeStyles(ctx, this.backgroundStroke);
      ctx.strokeRect(-dim.x / 2, -dim.y / 2, dim.x, dim.y);
    }
    this._removeShadow(ctx);
  },

  defaultTextRender(method: string, ctx: CanvasRenderingContext2D, _char: string, decl: any) {
    if (method === 'both') {
      if (decl.fill && this.paintFirst === 'fill') {
        ctx.fillText(_char, 0, 0);
      }
      if (decl.stroke && decl.strokeWidth) {
        if (this.shadow && !this.shadow.affectStroke) {
          this._removeShadow(ctx);
        }
        ctx.save();
        this._setLineDash(ctx, this.strokeDashArray);
        ctx.beginPath();
        ctx.strokeText(_char, 0, 0);
        ctx.closePath();
        ctx.restore();
      }
      if (decl.fill && this.paintFirst === 'stroke') {
        ctx.fillText(_char, 0, 0);
      }
    } else {
      method === 'fillText' && decl.fill && ctx.fillText(_char, 0, 0);
      method === 'strokeText' && decl.stroke && decl.strokeWidth && ctx.strokeText(_char, 0, 0);
    }
    return true;
  },

  getHeightOfLine(lineIndex: number) {
    if (!this.__lineHeights) {
      this.initDimensions();
    }
    if (this.__lineHeights[lineIndex]) {
      return this.__lineHeights[lineIndex];
    }

    const line = this._textLines[lineIndex];
    let maxHeight = this.getHeightOfChar(lineIndex, 0);
    for (let i = 1, len = line.length; i < len; i++) {
      maxHeight = Math.max(this.getHeightOfChar(lineIndex, i), maxHeight);
    }
    return (this.__lineHeights[lineIndex] = maxHeight * this.lineHeight * this._fontSizeMult);
  },

  cleanStyle(property: any) {
    if (!this.styles || !property) return false;
    const obj = this.styles;
    let letterCount,
      stylePropertyValue,
      graphemeCount = 0,
      stylesCount = 0,
      allStyleObjectPropertiesMatch = true;
    for (let p1 in obj) {
      letterCount = 0;
      for (let p2 in obj[p1]) {
        const styleObject = obj[p1][p2],
          stylePropertyHasBeenSet = Object.prototype.hasOwnProperty.call(styleObject, property);
        stylesCount++;
        if (stylePropertyHasBeenSet) {
          if (!stylePropertyValue) {
            stylePropertyValue = styleObject[property];
          } else if (styleObject[property] !== stylePropertyValue) {
            allStyleObjectPropertiesMatch = false;
          }
          if (styleObject[property] === this[property]) {
            delete styleObject[property];
          }
        } else {
          allStyleObjectPropertiesMatch = false;
        }
        if (Object.keys(styleObject).length !== 0) {
          letterCount++;
        } else {
          delete obj[p1][p2];
        }
      }
      if (letterCount === 0) {
        delete obj[p1];
      }
    }
    for (let i = 0; i < this._textLines.length; i++) {
      graphemeCount += this._textLines[i].length;
    }
    if (allStyleObjectPropertiesMatch && stylesCount === graphemeCount) {
      if (stylePropertyValue !== undefined) {
        this.set(property, stylePropertyValue);
      }
      this.removeStyle(property);
    }
  },

  getLocalPointer(e: any, pointer?: any) {
    pointer = pointer || this.canvas.getPointer(e);
    let pClicked = new Point(pointer.x, pointer.y);
    const objectLeftTop = this._getLeftTopCoords();
    if (this.angle) {
      pClicked = util.rotatePoint(pClicked, objectLeftTop, util.degreesToRadians(-this.angle));
    }
    return {
      x: pClicked.x - objectLeftTop.x,
      y: pClicked.y - objectLeftTop.y,
    };
  },

  toSVG(reviver: any): any {
    const imageData = this.toDataURL();
    return `<image xlink:href="${imageData}" width="${this.width * this.scaleX}" height="${
      this.height * this.scaleY
    }" x="${this.left}" y="${this.top}"/>`;
  },
  _toSVG() {
    const offsets = this._getSVGLeftTopOffsets();
    const textAndBg = this._getSVGTextAndBg(offsets.textTop, offsets.textLeft);
    return this._wrapSVGTextAndBg(textAndBg);
  },

  _getSVGLeftTopOffsets() {
    return {
      textLeft: -this.width / 2,
      textTop: -this.height / 2,
      lineTop: this.getHeightOfLine(0),
    };
  },

  _wrapSVGTextAndBg(textAndBg: any) {
    const noShadow = true,
      textDecoration = this.getSvgTextDecoration(this);
    return [
      textAndBg.textBgRects.join(''),
      '\t\t<text xml:space="preserve" ',
      this.fontFamily ? 'font-family="' + this.fontFamily.replace(/"/g, "'") + '" ' : '',
      this.fontSize ? 'font-size="' + this.fontSize + '" ' : '',
      this.fontStyle ? 'font-style="' + this.fontStyle + '" ' : '',
      this.fontWeight ? 'font-weight="' + this.fontWeight + '" ' : '',
      textDecoration ? 'text-decoration="' + textDecoration + '" ' : '',
      'style="',
      this.getSvgStyles(noShadow),
      '"',
      this.addPaintOrder(),
      ' >',
      textAndBg.textSpans.join(''),
      '</text>\n',
    ];
  },

  _setSVGBg(textBgRects: any) {
    if (this.backgroundColor) {
      textBgRects.push(
        '\t\t<rect ',
        this._getFillAttributes(this.backgroundColor),
        ' x="',
        util.toFixed(-this.width / 2, NUM_FRACTION_DIGITS),
        '" y="',
        util.toFixed(-this.height / 2, NUM_FRACTION_DIGITS),
        '" width="',
        util.toFixed(this.width, NUM_FRACTION_DIGITS),
        '" height="',
        util.toFixed(this.height, NUM_FRACTION_DIGITS),
        '"></rect>\n'
      );
    }
  },

  _getSVGTextAndBg(textTopOffset: any, textLeftOffset: any) {
    let textSpans: any[] = [],
      textBgRects: any[] = [],
      height = textTopOffset,
      lineOffset;
    this._setSVGBg(textBgRects);

    // text and text-background
    for (let i = 0, len = this._textLines.length; i < len; i++) {
      lineOffset = this._getLineLeftOffset(i);
      if (this.textBackgroundColor || this.styleHas('textBackgroundColor', i)) {
        this._setSVGTextLineBg(textBgRects, i, textLeftOffset + lineOffset, height);
      }
      this._setSVGTextLineText(textSpans, i, textLeftOffset + lineOffset, height);
      height += this.getHeightOfLine(i);
    }

    return {
      textSpans: textSpans,
      textBgRects: textBgRects,
    };
  },

  _createTextCharSpan(_char: string, styleDecl: any, left: number, top: number, angle: number) {
    const shouldUseWhitespace =
        _char !== _char.trim() || _char.match(multipleSpacesRegex) ? true : false,
      styleProps = this.getSvgSpanStyles(styleDecl, shouldUseWhitespace),
      fillStyles = styleProps ? 'style="' + styleProps + '"' : '',
      dy = styleDecl.deltaY;
    let dySpan = '';
    if (dy) {
      dySpan = ' dy="' + util.toFixed(dy, NUM_FRACTION_DIGITS) + '" ';
    }
    return [
      '<tspan x="',
      util.toFixed(left, NUM_FRACTION_DIGITS),
      '" y="',
      util.toFixed(top, NUM_FRACTION_DIGITS),
      '" ',
      dySpan,
      'rotate="',
      angle + '"',
      fillStyles,
      '>',
      util.string.escapeXml(_char),
      '</tspan>',
    ].join('');
  },

  _hasStyleChangedForSvg(prevStyle: any, thisStyle: any) {
    return (
      this._hasStyleChanged(prevStyle, thisStyle) ||
      prevStyle.overline !== thisStyle.overline ||
      prevStyle.underline !== thisStyle.underline ||
      prevStyle.linethrough !== thisStyle.linethrough
    );
  },

  _setSVGTextLineText(
    textSpans: string[],
    lineIndex: number,
    textLeftOffset: number,
    textTopOffset: number
  ) {
    // set proper line offset
    let lineHeight = this.getHeightOfLine(lineIndex),
      isJustify = this.textAlign.indexOf('justify') !== -1,
      actualStyle,
      nextStyle,
      charsToRender = '',
      charBox,
      style,
      boxWidth = 0,
      line = this._textLines[lineIndex],
      timeToRender;

    textTopOffset += (lineHeight * (1 - this._fontSizeFraction)) / this.lineHeight;
    for (let i = 0, len = line.length - 1; i <= len; i++) {
      timeToRender = i === len || this.charSpacing;
      charsToRender += line[i];
      charBox = this._charTransformations[lineIndex][i];
      const angle = this.curvature > 0 ? -charBox.charAngle : -charBox.charAngle - Math.PI;
      if (boxWidth === 0) {
        textLeftOffset += charBox.kernedWidth - charBox.width;
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
        actualStyle = actualStyle || this.getCompleteStyleDeclaration(lineIndex, i);
        nextStyle = this.getCompleteStyleDeclaration(lineIndex, i + 1);
        timeToRender = this._hasStyleChangedForSvg(actualStyle, nextStyle);
      }
      if (timeToRender) {
        style = this._getStyleDeclaration(lineIndex, i) || {};
        // textSpans.push(this._createTextCharSpan(charsToRender, style, textLeftOffset, textTopOffset));
        const degress = (angle * 180) / Math.PI;
        textSpans.push(
          this._createTextCharSpan(charsToRender, style, charBox.cl.x, charBox.cl.y, degress)
        );
        charsToRender = '';
        actualStyle = nextStyle;
        textLeftOffset += boxWidth;
        boxWidth = 0;
      }
    }
  },

  _getCursorBoundariesOffsets(index: number) {
    let topOffset = 0,
      leftOffset = 0;
    const { charIndex, lineIndex } = this.get2DCursorLocation(index);

    for (let i = 0; i < lineIndex; i++) {
      topOffset += this.getHeightOfLine(i);
    }
    const lineLeftOffset = this._getLineLeftOffset(lineIndex);
    const bound = this.__charBounds.length ? this.__charBounds[lineIndex][charIndex] : undefined;
    bound && (leftOffset = bound.left);
    if (this.charSpacing !== 0 && charIndex === this._textLines[lineIndex].length) {
      leftOffset -= this._getWidthOfCharSpacing();
    }
    const boundaries = {
      top: topOffset,
      left: lineLeftOffset + (leftOffset > 0 ? leftOffset : 0),
    };
    if (this.direction === 'rtl') {
      if (
        this.textAlign === 'right' ||
        this.textAlign === 'justify' ||
        this.textAlign === 'justify_right'
      ) {
        boundaries.left *= -1;
      } else if (this.textAlign === 'left' || this.textAlign === 'justify_left') {
        boundaries.left = lineLeftOffset - (leftOffset > 0 ? leftOffset : 0);
      } else if (this.textAlign === 'center' || this.textAlign === 'justify_center') {
        boundaries.left = lineLeftOffset - (leftOffset > 0 ? leftOffset : 0);
      }
    }
    return boundaries;
  },

  _setSVGTextLineBg(textBgRects: string[], i: number, leftOffset: number, textTopOffset: number) {
    let line = this._textLines[i],
      heightOfLine = this.getHeightOfLine(i) / this.lineHeight,
      boxWidth = 0,
      boxStart = 0,
      charBox,
      currentColor,
      lastColor = this.getValueOfPropertyAt(i, 0, 'textBackgroundColor');
    for (let j = 0, jlen = line.length; j < jlen; j++) {
      charBox = this.__charBounds[i][j];
      currentColor = this.getValueOfPropertyAt(i, j, 'textBackgroundColor');
      if (currentColor !== lastColor) {
        lastColor &&
          this._pushTextBgRect(
            textBgRects,
            lastColor,
            leftOffset + boxStart,
            textTopOffset,
            boxWidth,
            heightOfLine
          );
        boxStart = charBox.left;
        boxWidth = charBox.width;
        lastColor = currentColor;
      } else {
        boxWidth += charBox.kernedWidth;
      }
    }
    currentColor &&
      this._pushTextBgRect(
        textBgRects,
        currentColor,
        leftOffset + boxStart,
        textTopOffset,
        boxWidth,
        heightOfLine
      );
  },

  _getFillAttributes(value: any) {
    let fillColor: any = value && typeof value === 'string' ? new Color(value) : '';
    if (!fillColor || !fillColor.getSource() || fillColor.getAlpha() === 1) {
      return 'fill="' + value + '"';
    }
    return 'opacity="' + fillColor.getAlpha() + '" fill="' + fillColor.setAlpha(1).toRgb() + '"';
  },

  _getSVGLineTopOffset(lineIndex: number) {
    let lineTopOffset = 0,
      lastHeight = 0,
      j = 0;
    for (let j = 0; j < lineIndex; j++) {
      lineTopOffset += this.getHeightOfLine(j);
    }
    lastHeight = this.getHeightOfLine(j);
    return {
      lineTop: lineTopOffset,
      offset:
        ((this._fontSizeMult - this._fontSizeFraction) * lastHeight) /
        (this.lineHeight * this._fontSizeMult),
    };
  },

  getSvgStyles(skipShadow: boolean) {
    const svgStyle = this.callSuper('getSvgStyles', skipShadow);
    return svgStyle + ' white-space: pre;';
  },
});

function _fromObject(klass: any, object: any, callback: any, extraParam: string) {
  (util as any).enlivenPatterns([object.fill, object.stroke], function (patterns: any[]) {
    if (typeof patterns[0] !== 'undefined') {
      object.fill = patterns[0];
    }
    if (typeof patterns[1] !== 'undefined') {
      object.stroke = patterns[1];
    }
    (util as any).enlivenObjectEnlivables(object, object, function () {
      const instance = extraParam ? new klass(object[extraParam], object) : new klass(object);
      callback && callback(instance);
    });
  });
}

ArcText.fromObject = function (object: any, callback: any) {
  const clone = fabric.util.object.clone as (object: any, deep: boolean) => any;
  const options = clone(object, true);
  if (!options.radius) options.radius = 311;
  if (!options.curvature) options.curvature = Math.floor(BaseRadius / options.radius);
  _fromObject(ArcText, options, callback, 'text');
};

export default ArcText;
