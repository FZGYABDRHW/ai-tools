"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_editor_1 = require("@toast-ui/react-editor");
require("@toast-ui/editor/dist/toastui-editor.css");
require("./MilkdownEditor.css");
const MilkdownEditor = ({ value, onChange, placeholder = "Write your prompt here...", readOnly = false }) => {
    const editorRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (editorRef.current && !readOnly) {
            const editorInstance = editorRef.current.getInstance();
            if (editorInstance.getMarkdown() !== value) {
                editorInstance.setMarkdown(value);
            }
        }
    }, [value, readOnly]);
    // Handle readonly state changes
    (0, react_1.useEffect)(() => {
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
    return ((0, jsx_runtime_1.jsx)("div", { className: "wowworks-editor-container", style: { height: '100%', minHeight: '400px' }, children: (0, jsx_runtime_1.jsx)(react_editor_1.Editor, { ref: editorRef, initialValue: value, onChange: readOnly ? handleReadOnlyChange : handleChange, placeholder: placeholder, previewStyle: "vertical", height: "100%", initialEditType: "wysiwyg", useCommandShortcut: !readOnly, hideModeSwitch: readOnly, toolbarItems: readOnly ? [] : [
                ['heading', 'bold', 'italic', 'strike'],
                ['hr', 'quote'],
                ['ul', 'ol', 'task', 'indent', 'outdent'],
                ['table', 'image', 'link'],
                ['code', 'codeblock']
            ] }) }));
};
exports.default = MilkdownEditor;
//# sourceMappingURL=MilkdownEditor.js.map