import { getTranslationEditorData } from "@/lib/cms";
import { MessagesEditor } from "./messages-editor";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const data = await getTranslationEditorData();
  const totalFields = data.reduce((sum, ns) => sum + ns.fields.length, 0);

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <span className="font-head text-[12px] font-semibold uppercase tracking-[0.18em] text-sume-blue">
          Konten Situs
        </span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-sume-ink sm:text-4xl">
          Pesan Terjemahan
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-sume-body">
          Kelola seluruh teks situs dalam Bahasa Indonesia &amp; English.{" "}
          {data.length} namespace · {totalFields} kunci. Perubahan langsung
          tayang setelah disimpan.
        </p>
      </div>
      <MessagesEditor data={data} />
    </div>
  );
}
