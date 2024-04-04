const svgString = `<svg class="star-svg" viewBox="4 2 15 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink" width="400px" height="400px">
    <clipPath id="t">
        <circle r="0.05" transform="translate(5, 7) scale(140, 140)"  cx="0.001" cy="0.001" />
    </clipPath>
    <clipPath id="c">
        <circle transform="translate(12, 10) scale(14, 14)"  r="0.5"  cx="0.01" cy="0.01" />
    </clipPath>
<g clip-path="url(#t)">
<path clip-path="url(#c)" d="M15.422,18.129l-5.264-2.768l-5.265,2.768l1.006-5.863L1.64,8.114l5.887-0.855
	l2.632-5.334l2.633,5.334l5.885,0.855l-4.258,4.152L15.422,18.129z" fill="red"/></g>
</svg>`;

import * as fabric from 'fabric';

export async function testCase(canvas: fabric.Canvas) {
  const svg = await fabric.loadSVGFromString(svgString);
  canvas.add(...(svg.objects.filter((obj) => !!obj) as fabric.FabricObject[]));
}
