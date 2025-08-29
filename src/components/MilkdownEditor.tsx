import React, { useEffect, useRef } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import './MilkdownEditor.css';

interface MilkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    readOnly?: boolean;
}

const MilkdownEditor: React.FC<MilkdownEditorProps> = ({ 
    value, 
    onChange, 
    placeholder = "Write your prompt here...",
    readOnly = false 
}) => {
    const editorRef = useRef<Editor>(null);

    useEffect(() => {
        if (editorRef.current) {
            const editorInstance = editorRef.current.getInstance();
            if (editorInstance.getMarkdown() !== value) {
                editorInstance.setMarkdown(value);
            }
        }
    }, [value]);

    const handleChange = () => {
        if (editorRef.current) {
            const editorInstance = editorRef.current.getInstance();
            const markdown = editorInstance.getMarkdown();
            onChange(markdown);
        }
    };

    return (
        <div className="wowworks-editor-container" style={{ height: '100%', minHeight: '400px' }}>
            <Editor
                ref={editorRef}
                initialValue={value}
                onChange={handleChange}
                placeholder={placeholder}
                previewStyle="vertical"
                height="100%"
                initialEditType="wysiwyg"
                useCommandShortcut={true}
                hideModeSwitch={false}
                toolbarItems={[
                    ['heading', 'bold', 'italic', 'strike'],
                    ['hr', 'quote'],
                    ['ul', 'ol', 'task', 'indent', 'outdent'],
                    ['table', 'image', 'link'],
                    ['code', 'codeblock']
                ]}
            />
        </div>
    );
};

export default MilkdownEditor;
