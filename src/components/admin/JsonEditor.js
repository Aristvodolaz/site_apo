import { useEffect, useRef } from 'react';

const JsonEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const aceEditorRef = useRef(null);

  useEffect(() => {
    // Динамический импорт ace-builds на клиентской стороне
    const loadAce = async () => {
      try {
        // Загружаем базовый редактор
        const ace = await import('ace-builds/src-noconflict/ace');
        
        // Загружаем необходимые режимы и темы
        await import('ace-builds/src-noconflict/mode-json');
        await import('ace-builds/src-noconflict/theme-monokai');
        await import('ace-builds/src-noconflict/ext-language_tools');
        
        // Создаем редактор без webpack-resolver
        if (editorRef.current && !aceEditorRef.current) {
          aceEditorRef.current = ace.edit(editorRef.current);
          
          // Конфигурация редактора
          aceEditorRef.current.setTheme('ace/theme/monokai');
          aceEditorRef.current.session.setMode('ace/mode/json');
          aceEditorRef.current.setOptions({
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
            fontSize: 14,
            printMargin: false,
          });
          
          // Устанавливаем начальное значение
          aceEditorRef.current.session.setValue(value || '');
          
          // Обработчик изменений
          aceEditorRef.current.session.on('change', () => {
            onChange(aceEditorRef.current.getValue());
          });
        }
      } catch (error) {
        console.error('Ошибка загрузки ACE Editor:', error);
      }
    };

    loadAce();

    // Очистка при размонтировании
    return () => {
      if (aceEditorRef.current) {
        aceEditorRef.current.destroy();
        aceEditorRef.current = null;
      }
    };
  }, []);

  // Обновляем значение редактора, если пропс value изменился
  useEffect(() => {
    if (aceEditorRef.current && value !== aceEditorRef.current.getValue()) {
      aceEditorRef.current.session.setValue(value || '');
    }
  }, [value]);

  return (
    <div 
      ref={editorRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        fontSize: '14px',
        borderRadius: '4px',
        overflow: 'hidden'
      }}
    ></div>
  );
};

export default JsonEditor; 