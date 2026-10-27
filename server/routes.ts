/* ==========================================================================
   IMAGE UPLOAD ENDPOINT (Direct Base64 for Database Storage)
   ========================================================================== */

router.post('/upload', requireAdminAuth, (req: Request, res: Response) => {
  const { dataUri, fileName } = req.body || {};

  if (!dataUri || typeof dataUri !== 'string') {
    res.status(400).json({ error: 'No image data provided.' });
    return;
  }

  const match = dataUri.match(/^data:(image\/(jpeg|png|webp|gif|avif));base64,(.+)$/);
  if (!match) {
    res.status(400).json({ error: 'Invalid image format. Allowed formats: JPEG, PNG, WEBP, GIF, AVIF.' });
    return;
  }

  const base64Data = match[3];
  const buffer = Buffer.from(base64Data, 'base64');

  if (buffer.length > 10 * 1024 * 1024) {
    res.status(400).json({ error: 'Image exceeds maximum allowed size of 10MB.' });
    return;
  }

  // Direct dataUri return kar rahe hain taaki yeh database mein save ho aur mobile/desktop sabhi jagah dikhe
  res.json({
    success: true,
    fileUrl: dataUri,
    size: buffer.length,
    fileName: fileName || 'image',
  });
});
