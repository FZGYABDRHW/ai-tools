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
        if (editorRef.current && !readOnly) {
            const editorInstance = editorRef.current.getInstance();
            if (editorInstance.getMarkdown() !== value) {
                editorInstance.setMarkdown(value);
            }
        }
    }, [value, readOnly]);

    // Handle readonly state changes
    useEffect(() => {
        if (editorRef.current) {
            const editorInstance = editorRef.current.getInstance();
            // Set the editor content when readonly state changes
            if (editorInstance.getMarkdown() !== value) {
                editorInstance.setMarkdown(value);
            }
        }
    }, [readOnly, value]);



    const handleChange = () => {
        if (editorRef.current && !readOnly) {
            const editorInstance = editorRef.current.getInstance();
            const markdown = editorInstance.getMarkdown();
            onChange(markdown);
        }
    };

    const handleReadOnlyChange = () => {
        // No-op function for readonly mode to prevent errors
    };

    return (
        <div className="wowworks-editor-container" style={{ height: '100%', minHeight: '400px' }}>
            <Editor
                ref={editorRef}
                initialValue={value}
                onChange={readOnly ? handleReadOnlyChange : handleChange}
                placeholder={placeholder}
                previewStyle="vertical"
                height="100%"
                initialEditType="wysiwyg"
                useCommandShortcut={!readOnly}
                hideModeSwitch={readOnly}
                toolbarItems={readOnly ? [] : [
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
