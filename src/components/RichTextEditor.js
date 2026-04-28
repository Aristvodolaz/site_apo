import dynamic from 'next/dynamic';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';

const ReactQuill = dynamic(() => import('./QuillEditorInner'), {
  ssr: false,
  loading: () => <div className="loading-editor">Загрузка редактора...</div>
});

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'blockquote', 'code-block',
  'list', 'bullet', 'indent',
  'script',
  'link', 'image', 'video',
  'color', 'background',
  'align', 'size',
  'width', 'height', 'style'
];

export default function RichTextEditor({ value, onChange }) {
  const [mounted, setMounted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const wrapperRef = useRef(null);

  // Stable refs so imageHandler doesn't need to change
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => { valueRef.current = value; }, [value]);

  useEffect(() => { setMounted(true); }, []);

  const handleChange = useCallback((content) => {
    if (onChangeRef.current) onChangeRef.current(content || '');
  }, []);

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Ошибка загрузки изображения');
        }

        const { url } = await response.json();

        // Получаем Quill-инстанс через DOM — работает независимо от ref/dynamic
        const qlContainer = wrapperRef.current?.querySelector('.ql-container');
        const quill = qlContainer ? window.Quill?.find(qlContainer) : null;

        if (quill) {
          const range = quill.getSelection(true);
          const index = range ? range.index : quill.getLength();
          quill.insertEmbed(index, 'image', url);
          quill.setSelection(index + 1);
        } else {
          // Fallback: вставляем в конец
          const current = valueRef.current || '';
          if (onChangeRef.current) {
            onChangeRef.current(current + `<p><img src="${url}" alt="" style="max-width:100%;height:auto;" /></p>`);
          }
        }
      } catch (error) {
        alert(`Не удалось загрузить изображение: ${error.message}`);
      } finally {
        setUploading(false);
      }
    };
  }, []); // stable — не зависит от value/onChange

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: { image: imageHandler }
    },
    clipboard: { matchVisual: false },
    imageResize: {
      modules: ['Resize', 'DisplaySize', 'Toolbar']
    }
  }), [imageHandler]);

  if (!mounted) {
    return (
      <div className="loading-editor">
        Загрузка редактора...
        <style jsx>{`
          .loading-editor {
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 20px;
            text-align: center;
            background: #f8f9fa;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .quill-wrapper {
          background-color: white;
          border-radius: 4px;
          position: relative;
        }
        .ql-toolbar.ql-snow {
          border-radius: 4px 4px 0 0;
          background: #f8f9fa;
        }
        .ql-container.ql-snow {
          border-radius: 0 0 4px 4px;
          font-size: 16px;
          font-family: inherit;
        }
        .ql-editor {
          min-height: 400px;
          line-height: 1.7;
        }
        .ql-editor p { margin-bottom: 0.8em; }
        .ql-editor img { max-width: 100%; height: auto; border-radius: 4px; }
        .ql-editor blockquote {
          border-left: 4px solid #ccc;
          margin: 0;
          padding-left: 1em;
          color: #666;
        }
        .ql-editor pre.ql-syntax {
          background: #23272e;
          color: #abb2bf;
          border-radius: 4px;
          padding: 1em;
          font-family: monospace;
        }
        .upload-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          border-radius: 4px;
          font-size: 14px;
          color: #555;
          gap: 8px;
        }
      `}</style>
      <div className="quill-wrapper" ref={wrapperRef}>
        {uploading && (
          <div className="upload-overlay">
            <span className="spinner-border spinner-border-sm" role="status" />
            Загрузка изображения...
          </div>
        )}
        <ReactQuill
          value={value || ''}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          theme="snow"
          placeholder="Введите содержание новости..."
        />
      </div>
    </>
  );
}
