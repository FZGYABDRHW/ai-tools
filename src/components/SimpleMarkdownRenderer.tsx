import React from 'react';

interface SimpleMarkdownRendererProps {
    content: string;
    style?: React.CSSProperties;
}

const SimpleMarkdownRenderer: React.FC<SimpleMarkdownRendererProps> = ({ content, style }) => {
    const renderMarkdown = (text: string) => {
        if (!text) return '';

        // Simple markdown rendering for basic formatting
        let html = text
            // Code blocks ```code``` (handle first to avoid conflicts)
            .replace(/```([\s\S]*?)```/g, '<pre style="background: #f5f5f5; padding: 8px; border-radius: 4px; margin: 8px 0; overflow-x: auto;"><code>$1</code></pre>')
            // Inline code `code`
            .replace(/`([^`]+)`/g, '<code style="background: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>')
            // Bold text **text** or __text__
            .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600;">$1</strong>')
            .replace(/__(.*?)__/g, '<strong style="font-weight: 600;">$1</strong>')
            // Italic text *text* or _text_
            .replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>')
            .replace(/_(.*?)_/g, '<em style="font-style: italic;">$1</em>')
            // Headers ## Header
            .replace(/^### (.*$)/gim, '<h3 style="margin: 12px 0 8px 0; font-size: 16px; font-weight: 600;">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 style="margin: 16px 0 10px 0; font-size: 18px; font-weight: 600;">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 style="margin: 20px 0 12px 0; font-size: 20px; font-weight: 600;">$1</h1>')
            // Bullet points - item
            .replace(/^- (.*$)/gim, '<li style="margin: 4px 0;">$1</li>')
            // Numbered lists 1. item
            .replace(/^\d+\. (.*$)/gim, '<li style="margin: 4px 0;">$1</li>')
            // Line breaks
            .replace(/\n/g, '<br>');

        // Wrap consecutive <li> elements in <ul>
        html = html.replace(/(<li[^>]*>.*?<\/li>)(\s*<li[^>]*>.*?<\/li>)*/g, (match) => {
            return `<ul style="margin: 8px 0; padding-left: 20px;">${match}</ul>`;
        });

        return html;
    };

    return (
        <div
            style={{
                ...style,
                lineHeight: '1.6',
                fontSize: '14px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
            }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
        />
    );
};

export default SimpleMarkdownRenderer;
