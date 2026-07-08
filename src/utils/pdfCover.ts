// 编辑器上传 PDF 时，用 pdf.js 在本地把第一页画到 canvas，导出 JPEG 作为封面图。
// pdfjs-dist 体积不小（~400KB gz），因此全部走动态 import：
// 只有在编辑页真的点了「上传 PDF」才会加载，访客端的公开页面完全不受影响。
export async function pdfFirstPageToImage(file: File, targetWidth = 1100): Promise<File> {
  const pdfjs = await import('pdfjs-dist');
  const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;

  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  try {
    const page = await doc.getPage(1);
    const base = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: Math.min(2.5, targetWidth / base.width) });

    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas 不可用');
    // PDF 页面可能带透明背景，先铺白底，否则导出 JPEG 会发黑
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
    if (!blob) throw new Error('封面导出失败');
    const stem = file.name.replace(/\.pdf$/i, '').trim() || 'paper';
    return new File([blob], `${stem}-p1.jpg`, { type: 'image/jpeg' });
  } finally {
    void doc.destroy();
  }
}
