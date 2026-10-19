import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const runtime = "nodejs"

export async function GET() {
  const document = await readFile(join(process.cwd(), "public", "Is_Analizi_Kadro_Personel_Atama.docx"))

  return new Response(document, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": 'attachment; filename="Is_Analizi_Kadro_Personel_Atama.docx"',
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
