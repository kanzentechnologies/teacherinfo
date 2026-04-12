'use client';

import React, { useCallback } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Link } from '@tiptap/extension-link';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';

interface ToolbarProps {
  editor: Editor | null;
}

const EditorButton = ({ 
  onClick, 
  isActive = false, 
  disabled = false, 
  children 
}: { 
  onClick: () => void, 
  isActive?: boolean, 
  disabled?: boolean, 
  children: React.ReactNode 
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`px-2 py-1 text-xs border border-[#dcdcdc] transition-colors font-sans ${
      isActive 
        ? 'bg-[#e6f0fa] font-bold text-[#1a1a1a]' 
        : 'bg-[#ffffff] text-[#1a1a1a] hover:bg-[#e6f0fa]'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    {children}
  </button>
);

const Toolbar = ({ editor }: ToolbarProps) => {
  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-[#dcdcdc] bg-[#ffffff]">
      <div className="flex gap-1 mr-2 border-r border-[#dcdcdc] pr-2">
        <EditorButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>Bold</EditorButton>
        <EditorButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>Italic</EditorButton>
        <EditorButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')}>Underline</EditorButton>
      </div>

      <div className="flex gap-1 mr-2 border-r border-[#dcdcdc] pr-2">
        <EditorButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })}>H1</EditorButton>
        <EditorButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}>H2</EditorButton>
        <EditorButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })}>H3</EditorButton>
      </div>

      <div className="flex gap-1 mr-2 border-r border-[#dcdcdc] pr-2">
        <EditorButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>Bullet List</EditorButton>
        <EditorButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>Numbered List</EditorButton>
      </div>

      <div className="flex gap-1 mr-2 border-r border-[#dcdcdc] pr-2">
        <EditorButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })}>Align Left</EditorButton>
        <EditorButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })}>Align Center</EditorButton>
        <EditorButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })}>Align Right</EditorButton>
      </div>

      <div className="flex gap-1 mr-2 border-r border-[#dcdcdc] pr-2">
        <EditorButton onClick={setLink} isActive={editor.isActive('link')}>Insert Link</EditorButton>
      </div>

      <div className="flex flex-wrap gap-1">
        <EditorButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>Insert Table</EditorButton>
        <EditorButton onClick={() => editor.chain().focus().addRowAfter().run()} disabled={!editor.can().addRowAfter()}>Add Row</EditorButton>
        <EditorButton onClick={() => editor.chain().focus().deleteRow().run()} disabled={!editor.can().deleteRow()}>Delete Row</EditorButton>
        <EditorButton onClick={() => editor.chain().focus().addColumnAfter().run()} disabled={!editor.can().addColumnAfter()}>Add Column</EditorButton>
        <EditorButton onClick={() => editor.chain().focus().deleteColumn().run()} disabled={!editor.can().deleteColumn()}>Delete Column</EditorButton>
        <EditorButton onClick={() => editor.chain().focus().mergeCells().run()} disabled={!editor.can().mergeCells()}>Merge Cells</EditorButton>
        <EditorButton onClick={() => editor.chain().focus().splitCell().run()} disabled={!editor.can().splitCell()}>Split Cell</EditorButton>
      </div>
    </div>
  );
};

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      // Export as HTML
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap',
      },
      transformPastedHTML(html) {
        // Strip inline styles and classes to maintain strict UI
        return html
          .replace(/style="[^"]*"/gi, '')
          .replace(/class="[^"]*"/gi, '');
      },
    },
  });

  return (
    <div className="border border-[#dcdcdc] bg-[#ffffff] flex flex-col">
      <Toolbar editor={editor} />
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
