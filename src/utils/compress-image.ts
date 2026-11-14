const MAX_DIMENSION = 1600
const QUALITY = 0.82

const extensions: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
}

// Resizes to fit MAX_DIMENSION and re-encodes before upload. Falls back to the
// original file when compression fails or would not make it smaller.
export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/webp", QUALITY))
    if (!blob || blob.size >= file.size || !extensions[blob.type]) return file

    const name = `${file.name.replace(/\.[^.]+$/, "")}.${extensions[blob.type]}`
    return new File([blob], name, { type: blob.type })
  } catch {
    return file
  }
}
