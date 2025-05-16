import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Импортируем Quill без SSR
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="loading-editor">Загрузка редактора...</div>
});

// Конфигурация Quill
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link'],
    ['clean']
  ]
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link'
];

export default function RichTextEditor({ value, onChange }) {
  const [mounted, setMounted] = useState(false);
  const [editorValue, setEditorValue] = useState(value || '');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setEditorValue(value || '');
  }, [value]);

  const handleChange = (content) => {
    setEditorValue(content);
    if (onChange) {
      onChange(content || '');
    }
  };

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
        .quill {
          height: 300px;
          margin-bottom: 50px;
        }
        .ql-container {
          font-size: 16px;
          font-family: inherit;
        }
        .ql-editor {
          min-height: 200px;
        }
        .ql-editor p {
          margin-bottom: 1em;
        }
      `}</style>
      <ReactQuill
        value={editorValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        theme="snow"
        placeholder="Введите содержание новости..."
      />
    </>
  );
} 