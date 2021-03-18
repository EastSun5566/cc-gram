/* eslint-disable no-restricted-globals */
export interface MessageData {
  canvas: OffscreenCanvas;

  image: HTMLImageElement;

  filterStyle: string;
}

addEventListener('message', ({ data, origin }: MessageEvent<MessageData>) => {
  const { canvas, image, filterStyle } = data;
  const ctx = canvas.getContext('2d', { alpha: false });

  if (!ctx) return;

  ctx.filter = filterStyle;
  ctx.drawImage(image, 0, 0);

  postMessage('done', origin);
});
