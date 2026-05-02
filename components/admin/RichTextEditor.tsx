'use client';

import React, { useCallback, useState } from 'react';
import { useEditor, EditorContent, Editor, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Link } from '@tiptap/extension-link';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import FontFamily from '@tiptap/extension-font-family';
import TiptapImage from '@tiptap/extension-image';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Link as LinkIcon, 
  Table as TableIcon,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Quote,
  Code,
  Type,
  Palette,
  Highlighter,
  Plus,
  Minus,
  Columns,
  Rows,
  Combine,
  Split,
  ChevronDown,
  Baseline,
  Type as TypeIcon,
  Trash2,
  Paperclip
} from 'lucide-react';

// Custom Font Size Extension
const FontSize = Extension.create({
  name: 'fontSize',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize,
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run();
      },
    };
  },
});

interface ToolbarProps {
  editor: Editor | null;
}

const EditorButton = ({ 
  onClick, 
  isActive = false, 
  disabled = false, 
  title,
  className = '',
  children 
}: { 
  onClick: () => void, 
  isActive?: boolean, 
  disabled?: boolean, 
  title?: string,
  className?: string,
  children: React.ReactNode 
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded-md transition-all flex items-center justify-center relative ${
      isActive 
        ? 'bg-primary text-white shadow-sm' 
        : 'text-text-muted hover:bg-gray-100 hover:text-primary'
    } ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
  >
    {children}
  </button>
);

const ColorPicker = ({ 
  onSelect, 
  onReset, 
  resetLabel, 
  onClose,
  currentColor
}: { 
  onSelect: (color: string) => void, 
  onReset: () => void, 
  resetLabel: string,
  onClose: () => void,
  currentColor?: string 
}) => {
  const themeColors = [
    ['#ffffff', '#000000', '#e7e6e6', '#44546a', '#4472c4', '#ed7d31', '#a5a5a5', '#ffc000', '#5b9bd5', '#70ad47'],
    ['#f2f2f2', '#7f7f7f', '#d0cece', '#d6dce4', '#d9e1f2', '#fbe4d5', '#ededed', '#fff2cc', '#deeaf6', '#e2efda'],
    ['#d8d8d8', '#595959', '#aeaaaa', '#adb9ca', '#b4c6e7', '#f7cbac', '#dbdbdb', '#fee599', '#bdd7ee', '#c6e0b4'],
    ['#bfbfbf', '#3f3f3f', '#757070', '#8496b0', '#8ea9db', '#f4b083', '#c9c9c9', '#ffd965', '#9bc2e6', '#a8d08d'],
    ['#a5a5a5', '#262626', '#3a3838', '#323e4f', '#2f5496', '#c45911', '#7b7b7b', '#bf8f00', '#2e74b5', '#538135'],
    ['#7b7b7b', '#0c0c0c', '#161616', '#212934', '#1f3864', '#843c0b', '#525252', '#7f5f00', '#1f4e78', '#375623'],
  ];

  const standardColors = ['#c00000', '#ff0000', '#ffc000', '#ffff00', '#92d050', '#00b050', '#00b0f0', '#0070c0', '#002060', '#7030a0'];

  return (
    <div className="absolute top-full left-0 mt-1 p-3 bg-white border border-border-main shadow-2xl z-50 rounded-lg w-64 animate-in fade-in zoom-in duration-150">
      <button 
        type="button" 
        className="w-full text-left px-2 py-1.5 text-xs hover:bg-gray-100 rounded mb-2 flex items-center gap-2"
        onClick={() => { onReset(); onClose(); }}
      >
        <div className="w-4 h-4 border border-gray-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-white"></div>
          <div className="absolute inset-0 border-t border-red-500 -rotate-45 origin-top-left scale-150"></div>
        </div>
        {resetLabel}
      </button>
      
      <div className="mb-2">
        <div className="text-[10px] font-bold text-gray-400 uppercase mb-1 px-1">Theme Colors</div>
        <div className="grid grid-cols-10 gap-0.5">
          {themeColors.map((row, rowIndex) => (
            row.map((color, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                type="button"
                className="w-5 h-5 border border-transparent hover:border-gray-400 transition-transform hover:scale-110 z-10"
                style={{ backgroundColor: color }}
                onClick={() => { onSelect(color); onClose(); }}
                title={color}
              />
            ))
          ))}
        </div>
      </div>

      <div className="mb-2">
        <div className="text-[10px] font-bold text-gray-400 uppercase mb-1 px-1">Standard Colors</div>
        <div className="grid grid-cols-10 gap-0.5">
          {standardColors.map(color => (
            <button
              key={color}
              type="button"
              className="w-5 h-5 border border-transparent hover:border-gray-400 transition-transform hover:scale-110 z-10"
              style={{ backgroundColor: color }}
              onClick={() => { onSelect(color); onClose(); }}
              title={color}
            />
          ))}
        </div>
      </div>
      
      <div className="pt-2 border-t border-border-main mt-2">
        <label className="w-full text-left px-2 py-1.5 text-xs hover:bg-gray-100 rounded flex items-center gap-2 cursor-pointer">
          <Palette size={14} className="text-gray-500" />
          <span>More Colors...</span>
          <input 
            type="color" 
            className="sr-only" 
            value={currentColor || '#000000'}
            onChange={(e) => {
              onSelect(e.target.value);
            }}
          />
        </label>
      </div>
    </div>
  );
};

const Toolbar = ({ editor }: ToolbarProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [showFontFamilyDropdown, setShowFontFamilyDropdown] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState('16px');
  const [currentFontFamily, setCurrentFontFamily] = useState('Arial');

  // Update local font size state when editor state changes
  React.useEffect(() => {
    if (!editor) return;

    const updateState = () => {
      const textStyleAttrs = editor.getAttributes('textStyle');
      
      if (textStyleAttrs.fontSize) {
        setCurrentFontSize(textStyleAttrs.fontSize);
      } else {
        const { selection } = editor.state;
        const mark = selection.$from.marks().find(m => m.type.name === 'textStyle');
        if (mark?.attrs.fontSize) {
          setCurrentFontSize(mark.attrs.fontSize);
        } else {
          setCurrentFontSize('16px');
        }
      }

      const fontFamily = textStyleAttrs.fontFamily;
      if (fontFamily) {
        setCurrentFontFamily(fontFamily.replace(/['"]/g, ''));
      } else {
        setCurrentFontFamily('Arial');
      }
    };

    editor.on('transaction', updateState);
    editor.on('selectionUpdate', updateState);
    editor.on('update', updateState);

    // Initial check
    updateState();

    return () => {
      editor.off('transaction', updateState);
      editor.off('selectionUpdate', updateState);
      editor.off('update', updateState);
    };
  }, [editor]);

  const fontSizeRef = React.useRef<HTMLDivElement>(null);
  const fontFamilyRef = React.useRef<HTMLDivElement>(null);
  const colorRef = React.useRef<HTMLDivElement>(null);
  const highlightRef = React.useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (showFontSizeDropdown && fontSizeRef.current && !fontSizeRef.current.contains(target)) {
        setShowFontSizeDropdown(false);
      }
      if (showFontFamilyDropdown && fontFamilyRef.current && !fontFamilyRef.current.contains(target)) {
        setShowFontFamilyDropdown(false);
      }
      if (showColorPicker && colorRef.current && !colorRef.current.contains(target)) {
        setShowColorPicker(false);
      }
      if (showHighlightPicker && highlightRef.current && !highlightRef.current.contains(target)) {
        setShowHighlightPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColorPicker, showHighlightPicker, showFontSizeDropdown, showFontFamilyDropdown]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const standardFontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
  const fontSizeNumber = parseInt(currentFontSize) || 16;
  
  const fontFamilies = [
    { name: 'Arial', value: 'Arial' },
    { name: 'Times New Roman', value: 'Times New Roman' },
    { name: 'Calibri', value: 'Calibri' },
    { name: 'Courier New', value: 'Courier New' },
    { name: 'Comic Sans MS', value: 'Comic Sans MS' },
    { name: 'Georgia', value: 'Georgia' },
    { name: 'Impact', value: 'Impact' },
    { name: 'Tahoma', value: 'Tahoma' },
    { name: 'Trebuchet MS', value: 'Trebuchet MS' },
    { name: 'Verdana', value: 'Verdana' },
    { name: 'Helvetica', value: 'Helvetica' },
    { name: 'Garamond', value: 'Garamond' },
    { name: 'Bookman Old Style', value: 'Bookman Old Style' }
  ];

  const stepFontSize = (direction: 'up' | 'down') => {
    let nextSize;
    if (direction === 'up') {
      nextSize = standardFontSizes.find(size => size > fontSizeNumber) || fontSizeNumber + 2;
    } else {
      const reversed = [...standardFontSizes].reverse();
      nextSize = reversed.find(size => size < fontSizeNumber) || Math.max(8, fontSizeNumber - 2);
    }
    const sizeStr = `${nextSize}px`;
    editor.chain().focus().setFontSize(sizeStr).run();
    setCurrentFontSize(sizeStr);
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border-main bg-white sticky top-0 z-10 shadow-sm">
      {/* History */}
      <div className="flex items-center gap-0.5 pr-2 border-r border-border-main">
        <EditorButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><Undo size={16} /></EditorButton>
        <EditorButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><Redo size={16} /></EditorButton>
      </div>

      {/* Font Family (Word Style) */}
      <div className="flex items-center gap-0.5 px-2 border-r border-border-main">
        <div className="relative" ref={fontFamilyRef}>
          <button 
            type="button"
            onClick={() => {
              setShowFontFamilyDropdown(!showFontFamilyDropdown);
              setShowFontSizeDropdown(false);
              setShowColorPicker(false);
              setShowHighlightPicker(false);
            }}
            className="flex items-center bg-white border border-border-main rounded px-2 py-1 h-8 min-w-[120px] justify-between hover:border-primary transition-colors"
          >
            <span className="text-sm text-gray-700 truncate max-w-[140px]" style={{ fontFamily: currentFontFamily }}>{currentFontFamily || 'Font'}</span>
            <ChevronDown size={12} className="text-gray-400 ml-1 flex-shrink-0" />
          </button>
          
          {showFontFamilyDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 max-h-64 overflow-y-auto bg-white border border-border-main shadow-xl z-50 rounded-md animate-in fade-in zoom-in duration-150">
              {fontFamilies.map(font => (
                <button
                  key={font.value}
                  type="button"
                  className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 transition-colors ${currentFontFamily === font.value ? 'bg-blue-50 text-primary font-bold' : 'text-gray-700'}`}
                  style={{ fontFamily: font.value }}
                  onClick={() => {
                    editor.chain().focus().setFontFamily(font.value).run();
                    setCurrentFontFamily(font.value);
                    setShowFontFamilyDropdown(false);
                  }}
                >
                  {font.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Font Size (Excel Style) */}
      <div className="flex items-center gap-0.5 px-2 border-r border-border-main">
        <div className="relative" ref={fontSizeRef}>
          <button 
            type="button"
            onClick={() => {
              setShowFontSizeDropdown(!showFontSizeDropdown);
              setShowFontFamilyDropdown(false);
              setShowColorPicker(false);
              setShowHighlightPicker(false);
            }}
            className="flex items-center bg-white border border-border-main rounded px-2 py-1 h-8 min-w-[50px] justify-between hover:border-primary transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">{fontSizeNumber}</span>
            <ChevronDown size={12} className="text-gray-400 ml-1" />
          </button>
          
          {showFontSizeDropdown && (
            <div className="absolute top-full left-0 mt-1 w-20 max-h-60 overflow-y-auto bg-white border border-border-main shadow-xl z-50 rounded-md animate-in fade-in zoom-in duration-150">
              {standardFontSizes.map(size => (
                <button
                  key={size}
                  type="button"
                  className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 transition-colors ${fontSizeNumber === size ? 'bg-blue-50 text-primary font-bold' : 'text-gray-700'}`}
                  onClick={() => {
                    const sizeStr = `${size}px`;
                    editor.chain().focus().setFontSize(sizeStr).run();
                    setCurrentFontSize(sizeStr);
                    setShowFontSizeDropdown(false);
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-0.5 ml-1">
          <EditorButton onClick={() => stepFontSize('up')} title="Increase Font Size">
            <div className="relative">
              <Baseline size={16} />
              <Plus size={8} className="absolute -top-1 -right-1 font-bold" />
            </div>
          </EditorButton>
          <EditorButton onClick={() => stepFontSize('down')} title="Decrease Font Size">
            <div className="relative">
              <Baseline size={14} />
              <Minus size={8} className="absolute -top-1 -right-1 font-bold" />
            </div>
          </EditorButton>
        </div>
      </div>

      {/* Basic Formatting */}
      <div className="flex items-center gap-0.5 px-2 border-r border-border-main">
        <EditorButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold"><Bold size={16} /></EditorButton>
        <EditorButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic"><Italic size={16} /></EditorButton>
        <EditorButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline"><UnderlineIcon size={16} /></EditorButton>
      </div>

      {/* Colors (Excel Style) */}
      <div className="flex items-center gap-0.5 px-2 border-r border-border-main">
        <div className="relative" ref={colorRef}>
          <button 
            type="button"
            onClick={() => { 
              setShowColorPicker(!showColorPicker); 
              setShowHighlightPicker(false); 
              setShowFontSizeDropdown(false);
              setShowFontFamilyDropdown(false);
            }}
            className={`p-1.5 hover:bg-gray-100 rounded flex flex-col items-center transition-colors ${showColorPicker ? 'bg-gray-100' : ''}`}
            title="Font Color"
          >
            <Baseline size={18} />
            <div className="h-1 w-full mt-0.5 rounded-full" style={{ backgroundColor: editor.getAttributes('textStyle').color || '#000000' }}></div>
          </button>
          {showColorPicker && (
            <ColorPicker 
              onSelect={(color) => editor.chain().focus().setColor(color).run()}
              onReset={() => editor.chain().focus().unsetColor().run()}
              resetLabel="Automatic"
              onClose={() => setShowColorPicker(false)}
              currentColor={editor.getAttributes('textStyle').color}
            />
          )}
        </div>

        <div className="relative" ref={highlightRef}>
          <button 
            type="button"
            onClick={() => { 
              setShowHighlightPicker(!showHighlightPicker); 
              setShowColorPicker(false); 
              setShowFontSizeDropdown(false);
              setShowFontFamilyDropdown(false);
            }}
            className={`p-1.5 hover:bg-gray-100 rounded flex flex-col items-center transition-colors ${showHighlightPicker ? 'bg-gray-100' : ''}`}
            title="Fill Color"
          >
            <Highlighter size={18} />
            <div className="h-1 w-full mt-0.5 rounded-full" style={{ backgroundColor: editor.getAttributes('highlight').color || 'transparent', border: !editor.getAttributes('highlight').color ? '1px solid #e5e7eb' : 'none' }}></div>
          </button>
          {showHighlightPicker && (
            <ColorPicker 
              onSelect={(color) => editor.chain().focus().toggleHighlight({ color }).run()}
              onReset={() => editor.chain().focus().unsetHighlight().run()}
              resetLabel="No Fill"
              onClose={() => setShowHighlightPicker(false)}
              currentColor={editor.getAttributes('highlight').color}
            />
          )}
        </div>
      </div>

      {/* Headings */}
      <div className="flex items-center gap-0.5 px-2 border-r border-border-main">
        <EditorButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Heading 1"><Heading1 size={16} /></EditorButton>
        <EditorButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2"><Heading2 size={16} /></EditorButton>
        <EditorButton onClick={() => editor.chain().focus().setParagraph().run()} isActive={editor.isActive('paragraph')} title="Paragraph"><Type size={16} /></EditorButton>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-0.5 px-2 border-r border-border-main">
        <EditorButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List"><List size={16} /></EditorButton>
        <EditorButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List"><ListOrdered size={16} /></EditorButton>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-0.5 px-2 border-r border-border-main">
        <EditorButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left"><AlignLeft size={16} /></EditorButton>
        <EditorButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center"><AlignCenter size={16} /></EditorButton>
        <EditorButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right"><AlignRight size={16} /></EditorButton>
      </div>

      {/* Links & Tables & Uploads */}
      <div className="flex items-center gap-0.5 px-2">
        <EditorButton onClick={setLink} isActive={editor.isActive('link')} title="Insert Link"><LinkIcon size={16} /></EditorButton>
        
        <label className={`p-2 rounded-md transition-all flex items-center justify-center relative text-text-muted hover:bg-gray-100 hover:text-primary cursor-pointer`} title="Upload Image or File">
          <Paperclip size={16} />
          <input 
            type="file" 
            className="hidden" 
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const formData = new FormData();
              formData.append('file', file);
              
              const isImage = file.type.startsWith('image/');

              try {
                const res = await fetch('/api/upload', {
                  method: 'POST',
                  body: formData,
                });
                
                if (!res.ok) throw new Error('Upload failed');
                
                const data = await res.json();
                
                if (data.url) {
                  if (isImage) {
                    editor.chain().focus().setImage({ src: data.url }).run();
                  } else {
                    editor.chain().focus().insertContent(`<a href="${data.url}" class="text-secondary underline" target="_blank">${file.name}</a>`).run();
                  }
                }
              } catch (error) {
                console.error("Failed to upload", error);
                alert("Failed to upload file");
              }
              
              e.target.value = '';
            }}
          />
        </label>

        <EditorButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert Table"><TableIcon size={16} /></EditorButton>
      </div>

      {/* Advanced Table Controls (Understandable) */}
      {editor.isActive('table') && (
        <div className="w-full flex flex-wrap items-center gap-2 mt-2 p-2 bg-slate-50 border border-slate-200 rounded-md animate-in slide-in-from-top-2 duration-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Table Options:</span>
          
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md p-0.5">
            <EditorButton onClick={() => editor.chain().focus().addRowBefore().run()} title="Add Row Above" className="text-xs px-2 py-1"><Rows size={14} className="mr-1 text-blue-500" /> + Above</EditorButton>
            <EditorButton onClick={() => editor.chain().focus().addRowAfter().run()} title="Add Row Below" className="text-xs px-2 py-1"><Rows size={14} className="mr-1 text-blue-500" /> + Below</EditorButton>
            <EditorButton onClick={() => editor.chain().focus().deleteRow().run()} title="Delete Row" className="text-xs px-2 py-1 text-red-600 hover:bg-red-50"><Trash2 size={14} className="mr-1" /> Row</EditorButton>
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md p-0.5">
            <EditorButton onClick={() => editor.chain().focus().addColumnBefore().run()} title="Add Column Left" className="text-xs px-2 py-1"><Columns size={14} className="mr-1 text-blue-500" /> + Left</EditorButton>
            <EditorButton onClick={() => editor.chain().focus().addColumnAfter().run()} title="Add Column Right" className="text-xs px-2 py-1"><Columns size={14} className="mr-1 text-blue-500" /> + Right</EditorButton>
            <EditorButton onClick={() => editor.chain().focus().deleteColumn().run()} title="Delete Column" className="text-xs px-2 py-1 text-red-600 hover:bg-red-50"><Trash2 size={14} className="mr-1" /> Col</EditorButton>
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md p-0.5">
            <EditorButton onClick={() => editor.chain().focus().mergeCells().run()} title="Merge Selected Cells" className="text-xs px-2 py-1"><Combine size={14} className="mr-1 text-purple-500" /> Merge</EditorButton>
            <EditorButton onClick={() => editor.chain().focus().splitCell().run()} title="Split Current Cell" className="text-xs px-2 py-1"><Split size={14} className="mr-1 text-purple-500" /> Split</EditorButton>
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md p-0.5 ml-auto">
            <EditorButton onClick={() => editor.chain().focus().deleteTable().run()} title="Delete Entire Table" className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 font-medium"><Trash2 size={14} className="mr-1" /> Delete Table</EditorButton>
          </div>
        </div>
      )}
    </div>
  );
};

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-secondary underline cursor-pointer',
        },
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
      Placeholder.configure({
        placeholder,
      }),
      TextStyle,
      FontFamily,
      Color,
      Highlight.configure({ multicolor: true }),
      FontSize,
      TiptapImage.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full rounded-md border border-border-main my-4 shadow-sm',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap prose prose-sm max-w-none focus:outline-none min-h-[400px] p-6',
      },
    },
  });

  const initialValueSet = React.useRef(false);

  React.useEffect(() => {
    if (editor && value !== undefined && typeof value === 'string') {
      if (!initialValueSet.current && value !== '') {
        editor.commands.setContent(value);
        initialValueSet.current = true;
      }
    }
  }, [editor, value]);

  return (
    <div className="border border-border-main bg-white rounded-md overflow-hidden flex flex-col focus-within:border-secondary transition-colors shadow-sm">
      <Toolbar editor={editor} />
      <div className="flex-1 overflow-y-auto bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
