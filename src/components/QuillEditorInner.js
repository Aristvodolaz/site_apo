import { forwardRef, useRef, useImperativeHandle } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageResize', ImageResize);

const Parchment = Quill.import('parchment');

const QuillEditorInner = forwardRef(({ modules, ...props }, ref) => {
  const quillRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getEditor: () => quillRef.current?.getEditor?.(),
  }));

  // Inject parchment — required by quill-image-resize-module-react
  const mergedModules = modules?.imageResize
    ? { ...modules, imageResize: { ...modules.imageResize, parchment: Parchment } }
    : modules;

  return <ReactQuill ref={quillRef} modules={mergedModules} {...props} />;
});

QuillEditorInner.displayName = 'QuillEditorInner';
export default QuillEditorInner;
