'use client';

import {useState} from 'react';

export default function Home(){
  const [file, setFile] = useState<File | null>(null);
  const [placeholders, setPlaceholders] = useState<any[] | null>(null);
  const [loading , setLoading] = useState(false);
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleUpload = async() => {
    if(!file) return;
    setLoading(true);
    try{
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${backend}/extract-placeholders`, {
        method: 'POST',
        body: formData
      });

      if(!res.ok){
        const txt = await res.text();
        throw new Error(`Upload failed: ${res.status} ${txt}}`);
      }
      const data = await res.json();
      setPlaceholders(data);
    } catch(e: any){
      alert(e.message);
    } finally{
      setLoading(false);
    }
  }
  return (
   <main className="flex min-h-screen flex-col items-center justify-center p-6 gap-4">
      <h1 className="text-2xl font-semibold">Upload SAFE .docx</h1>

      <input
        type="file"
        accept=".docx"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="border rounded px-4 py-2"
      >
        {loading ? 'Processing...' : 'Upload and Extract Placeholders'}
      </button>

      {placeholders && (
        <div className="w-full max-w-2xl mt-6">
          <h2 className="text-xl font-medium mb-2">Detected placeholders</h2>
          <pre className="text-sm whitespace-pre-wrap bg-gray-100 p-3 rounded">
            {JSON.stringify(placeholders, null, 2)}
          </pre>
        </div>
      )}
    </main>
);
}

