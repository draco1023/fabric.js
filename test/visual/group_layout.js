(function () {
    fabric.Object.prototype.objectCaching = true;
    var visualTestLoop;
    if (fabric.isLikelyNode) {
        visualTestLoop = global.visualTestLoop;
    }
    else {
        visualTestLoop = window.visualTestLoop;
    }

    var tests = [];

    function createObjectsForLayoutTests(text) {
        var circle = new fabric.Circle({
            left: 100,
            top: 50,
            radius: 50
        });
        var itext = new fabric.IText(text, {
            left: 100,
            top: 150
        });
        var rect = new fabric.Rect({
            top: 200,
            width: 50,
            height: 50,
            fill: 'red',
            opacity: 0.3
        })
        return [
            rect,
            circle,
            itext
        ];
    }

    function createGroupForLayoutTests(text, options) {
        return new fabric.Group(createObjectsForLayoutTests(text), options);
    }

    function createLayerForLayoutTests(text, options) {
        return new fabric.Layer(createObjectsForLayoutTests(text), options);
    }

    function fixedLayout(canvas, callback) {
        var g = createGroupForLayoutTests('fixed layout', {
            backgroundColor: 'azure',
            layout: 'fixed',
            width: 50,
            height: 50,
            angle: 30
        });
        canvas.add(g);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
    }
/*
    tests.push({
        test: 'fixed layout with width, height, angle values',
        code: fixedLayout,
        golden: 'group-fixed-layout.png',
        newModule: 'Group Layout',
        percentage: 0.06,
        width: 400,
        height: 300
    });
*/
    function fitContentLayout(canvas, callback) {
        var g = createGroupForLayoutTests('fit-content layout', {
            backgroundColor: 'blue'
        });
        canvas.add(g);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
    }

    tests.push({
        test: 'fit-content layout',
        code: fitContentLayout,
        golden: 'group-layout/fit-content.png',
        newModule: 'Group Layout',
        percentage: 0.06,
        width: 400,
        height: 300
    });

    function fitContentLayoutRelative(canvas, callback) {
        var g = createGroupForLayoutTests('fit-content layout', {
            backgroundColor: 'blue'
        });
        g.clone().then((clone) => {
            canvas.add(clone);
            canvas.renderAll();
            callback(canvas.lowerCanvasEl);
        })
    }

    tests.push({
        test: 'fit-content layout',
        code: fitContentLayoutRelative,
        golden: 'group-layout/fit-content.png',
        percentage: 0.06,
        width: 400,
        height: 300
    });

    function fitContentReLayout(canvas, callback) {
        var g = createGroupForLayoutTests('fit-content layout', {
            backgroundColor: 'blue'
        });
        var objects = g.removeAll();
        //  layout
        objects.forEach(o => g.add(o));
        canvas.add(g);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
    }

    tests.push({
        test: 'fit-content relayout',
        code: fitContentReLayout,
        golden: 'group-layout/fit-content.png',
        percentage: 0.06,
        width: 400,
        height: 300
    });

    function fitContentLayoutWithSkewX(canvas, callback) {
        var g = createGroupForLayoutTests('fit-content layout', {
            backgroundColor: 'blue',
            skewX: 45
        });
        canvas.add(g);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
    }

    tests.push({
        test: 'fit-content layout',
        code: fitContentLayoutWithSkewX,
        golden: 'group-layout/fit-content-skewX.png',
        percentage: 0.06,
        width: 400 + Math.ceil(300 / Math.SQRT2),
        height: 300
    });

    function fitContentLayoutWithSkewY(canvas, callback) {
        var g = createGroupForLayoutTests('fit-content layout', {
            backgroundColor: 'blue',
            skewY: 45
        });
        canvas.add(g);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
    }

    tests.push({
        test: 'fit-content layout',
        code: fitContentLayoutWithSkewY,
        golden: 'group-layout/fit-content-skewY.png',
        percentage: 0.06,
        width: 400,
        height: 400 + Math.ceil(400 / Math.SQRT2)
    });

    function nestedLayout(canvas, callback) {
        var rect3 = new fabric.Rect({
            width: 100,
            height: 100,
            fill: 'yellow'
        });
        var rect4 = new fabric.Rect({
            width: 100,
            height: 100,
            left: 100,
            top: 100,
            fill: 'purple'
        });
        var group3 = new fabric.Group(
            [rect3, rect4],
            { scaleX: 0.5, scaleY: 0.5, top: 100, left: 0 });
        group3.subTargetCheck = true;
        group3.setCoords();
        var rect1 = new fabric.Rect({
            width: 100,
            height: 100,
            fill: 'red'
        });
        var rect2 = new fabric.Rect({
            width: 100,
            height: 100,
            left: 100,
            top: 100,
            fill: 'blue'
        });
        var g = new fabric.Group([rect1, rect2, group3], { top: -150, left: -50 });
        g.subTargetCheck = true;
        canvas.viewportTransform = [0.1, 0, 0, 0.1, 100, 200];
        canvas.add(g);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
    }

    tests.push({
        test: 'unit test scene',
        code: nestedLayout,
        golden: 'group-layout/unit-test-scene.png',
        percentage: 0.01,
        width: 120,
        height: 210
    });

    function fitContentLayoutChange(canvas, callback) {
        var g = createGroupForLayoutTests('fit-content layout', {
            backgroundColor: 'blue'
        });
        var point = fabric.util.transformPoint(
            new fabric.Point(50, 0),
            fabric.util.invertTransform(g.calcTransformMatrix())
        );
        g.item(0).set({ left: point.x });
        g.item(1).set({ skewX: -45 });
        g.item(2).rotate(45);
        g.triggerLayout();
        canvas.add(g);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
    }

    tests.push({
        test: 'fit-content layout after change',
        code: fitContentLayoutChange,
        golden: 'group-layout/fit-content2.png',
        percentage: 0.06,
        width: 400,
        height: 300
    });

    function fitContentLayoutAdd(canvas, callback) {
        var g = createGroupForLayoutTests('fit-content layout', {
            backgroundColor: 'blue'
        });
        var rect = new fabric.Rect({
            top: 200,
            left: 50,
            width: 50,
            height: 50,
            fill: 'red',
            angle: 15,
            skewY: 30
        })
        g.add(rect);
        canvas.add(g);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
    }

    tests.push({
        test: 'fit-content layout add object',
        code: fitContentLayoutAdd,
        golden: 'group-layout/fit-content3.png',
        percentage: 0.06,
        width: 400,
        height: 300
    });

    function selectedObject(canvas, callback) {
        var g = createGroupForLayoutTests('fit-content layout', {
            backgroundColor: 'blue'
        });
        canvas.add(g);
        canvas.setActiveObject(g.item(0));
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
    }

    tests.push({
        test: 'selected object',
        code: selectedObject,
        golden: 'group-layout/selected_object.png',
        percentage: 0.02,
        width: 400,
        height: 300,
        fabricClass: 'Canvas'
    });

    function selectedObjectExport(canvas, callback) {
        var g = createGroupForLayoutTests('fit-content layout', {
            backgroundColor: 'blue'
        });
        canvas.add(g);
        canvas.setActiveObject(g.item(0));
        canvas.renderAll();
        callback(g.toCanvasElement());
    }

    tests.push({
        test: 'selected object - exported',
        code: selectedObjectExport,
        golden: 'group-layout/selected_object_exported.png',
        percentage: 0.02,
        width: 400,
        height: 300,
        fabricClass: 'Canvas'
    });

    function clipPathLayout(canvas, callback) {
        var g = createGroupForLayoutTests('clip path layout', {
            backgroundColor: 'magenta',
            clipPath: new fabric.Circle({
                radius: 110,
                originX: 'center',
                originY: 'center',
            }),
            layout: 'clip-path'
        });
        canvas.add(g);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
    }

    tests.push({
        test: 'clip-path layout',
        code: clipPathLayout,
        golden: 'group-layout/clip-path.png',
        percentage: 0.06,
        width: 300,
        height: 300
    });

    function clipPathLayoutWithScale(canvas, callback) {
        var g = createGroupForLayoutTests('clip path layout', {
            backgroundColor: 'magenta',
            clipPath: new fabric.Circle({
                radius: 110,
                originX: 'center',
                originY: 'center',
                scaleX: 0.6
            }),
            layout: 'clip-path'
        });
        canvas.add(g);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
    }

    tests.push({
        test: 'clip-path layout scaleX value',
        code: clipPathLayoutWithScale,
        golden: 'group-layout/clip-path1.png',
        percentage: 0.06,
        width: 300,
        height: 300
    });

    function clipPathLayout2(canvas, callback) {
        var g = createGroupForLayoutTests('clip path layout', {
            backgroundColor: 'magenta',
            clipPath: new fabric.Circle({
                radius: 110,
                left: -150,
                top: -100,
                scaleX: 1.5,
            }),
            layout: 'clip-path'
        });
        canvas.add(g);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
    }

    tests.push({
        test: 'clip-path layout left, top, originX, originY, scaleX values - WRONG',
        code: clipPathLayout2,
        golden: 'group-layout/clip-path2.png',
        percentage: 0.06,
        width: 330,
        height: 330
    });

    function absClipPathLayout(canvas, callback) {
        var g = createGroupForLayoutTests('clip path layout', {
            backgroundColor: '#0dcaf0',
            clipPath: new fabric.Circle({
                radius: 110,
                originX: 'center',
                originY: 'center',
                absolutePositioned: true,
                left: 50,
                top: 150,
                skewX: 20
            }),
            layout: 'clip-path',
        });
        canvas.add(g);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
    }

    tests.push({
        test: 'absolute clip-path layout',
        code: absClipPathLayout,
        golden: 'group-layout/clip-path3.png',
        percentage: 0.06,
        width: 250,
        height: 250
    });

    function fitContentNestedLayer(canvas, callback) {
        var g = createGroupForLayoutTests('fixed layout,\nlayer on top', {
            layout: 'fixed',
            backgroundColor: 'blue'
        });
        var objects = g.removeAll();
        var layer = new fabric.Layer(objects, { backgroundColor: 'yellow' });
        g.add(layer);
        canvas.add(g);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
    }

    tests.push({
        test: 'layer nested in group',
        code: fitContentNestedLayer,
        golden: 'group-layout/nested-layer.png',
        percentage: 0.06,
        width: 400,
        height: 300
    });

    function LayerLayout(canvas, callback) {
        var layer = createLayerForLayoutTests('Layer', {
            backgroundColor: 'blue',
        });
        canvas.add(layer);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
    }

    tests.push({
        test: 'layer',
        code: LayerLayout,
        golden: 'group-layout/layer.png',
        percentage: 0.06,
        width: 400,
        height: 300
    });

    function LayerLayoutWithSkew(canvas, callback) {
        var layer = createLayerForLayoutTests('Layer', {
            backgroundColor: 'blue',
            skewX: 45
        });
        canvas.add(layer);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
    }
/*
        tests.push({
            test: 'layer with skewX',
            code: LayerLayoutWithSkew,
            golden: 'group-layout/layer-skewX.png',
            percentage: 0.06,
            width: 400,
            height: 300
        });
    */

    function createObjectsForOriginTests(originX, originY, options) {
        var rect1 = new fabric.Rect({ left: 150, top: 100, width: 30, height: 10, strokeWidth: 0 }),
            rect2 = new fabric.Rect({ left: 200, top: 120, width: 10, height: 40, strokeWidth: 0 }),
            controlPoint = new fabric.Circle({ radius: 5, fill: 'blue', left: 150, top: 100, originX: 'center', originY: 'center' }),
            tlControlPoint = new fabric.Circle({ radius: 5, fill: 'red', left: 150, top: 100, strokeWidth: 0 });

        var g = new fabric.Group([rect1, rect2, tlControlPoint], Object.assign({}, options, {
            originX, originY, backgroundColor: 'pink'
        }));
        return [g, controlPoint];
    }

    var originX = ['left', 'center', 'right'];
    var originY = ['top', 'center', 'bottom'];

    for (let angle = 0; angle < 360; angle += 30) {
        originX.forEach(ox => {
            originY.forEach(oy => {
                tests.push({
                    test: `layout with originX=${ox}, originY=${oy} and angle=${angle} values`,
                    code: function (canvas, callback) {
                        canvas.add.apply(canvas, createObjectsForOriginTests(ox, oy, { angle }));
                        canvas.renderAll();
                        callback(canvas.lowerCanvasEl);
                    },
                    golden: `group-layout/origin-${ox}-${oy}-${angle}deg.png`,
                    percentage: 0.001,
                    width: 300,
                    height: 200
                });
            });
        });
    }

    tests.forEach(visualTestLoop(QUnit));
})();
