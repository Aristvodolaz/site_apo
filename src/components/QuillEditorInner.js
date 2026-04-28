import { forwardRef, useRef, useImperativeHandle } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillEditorInner = forwardRef((props, ref) => {
  const quillRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getEditor: () => quillRef.current?.getEditor?.(),
  }));

  return <ReactQuill ref={quillRef} {...props} />;
});

QuillEditorInner.displayName = 'QuillEditorInner';
export default QuillEditorInner;
