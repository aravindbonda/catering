import { useRef, useState } from 'react';
import api from '../services/api';

function MenuUpload() {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const upload = async (selectedFiles) => {
    const accepted = Array.from(selectedFiles || []);
    if (!accepted.length) return;

    const form = new FormData();
    accepted.forEach((file) => form.append('files', file));
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { data } = await api.post('/api/uploads/menu', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFiles(data.files || []);
      setItems(data.extractedItems || []);
      setMessage(data.message || 'Menu extracted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. PDF, JPG, and PNG are supported.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-wrap">
      <div className="luxe-section rounded-[2rem] p-8 text-white shadow-luxe">
        <div className="relative z-10">
          <p className="font-bold uppercase text-[#D9B08C]">Menu Upload</p>
          <h1 className="mt-2 text-4xl font-extrabold">Upload PDF or image menu</h1>
          <p className="mt-3 max-w-2xl text-white/75">Mock AI extraction reads your uploaded menu and returns editable dish suggestions for booking.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="panel-card">
          <input ref={inputRef} className="hidden" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={(event) => upload(event.target.files)} />
          <button className="btn-primary" type="button" onClick={() => inputRef.current?.click()} disabled={loading}>{loading ? 'Uploading...' : 'Choose Menu Files'}</button>
          <div className="mt-5 rounded-[1.5rem] border-2 border-dashed border-[#D9B08C] bg-[#FFF7EF] p-8 text-center text-[#755F54]" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); upload(event.dataTransfer.files); }}>
            Drag PDF, JPG, or PNG files here.
          </div>
          {message && <div className="mt-4 rounded-2xl bg-[#FFF7EF] p-4 font-bold text-[#7A2E1F]">{message}</div>}
          {error && <div className="mt-4 rounded-2xl bg-red-50 p-4 font-bold text-red-700">{error}</div>}
          <div className="mt-5 grid gap-3">
            {files.map((file) => <div className="rounded-2xl border border-[#EADCCB] bg-white p-4" key={file.previewUrl || file.name}><strong>{file.name}</strong><span className="ml-2 text-sm text-[#755F54]">{Math.round(file.size / 1024)} KB</span></div>)}
          </div>
        </section>

        <section className="panel-card">
          <p className="eyebrow">Extracted Menu Items</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {items.map((item) => <article className="luxe-card p-4" key={item.name}><span className="pill">{item.category}</span><h2 className="mt-3 font-extrabold text-[#1F1F1F]">{item.name}</h2><p className="mt-1 text-sm text-[#755F54]">Rs.{item.price} per plate</p></article>)}
            {!items.length && <p className="text-[#755F54]">Uploaded menu items will appear here.</p>}
          </div>
        </section>
      </div>
    </section>
  );
}

export default MenuUpload;
