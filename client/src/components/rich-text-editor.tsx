import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link 
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = "Start writing...",
  className = ""
}: RichTextEditorProps) {
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    setSelectionStart(e.target.selectionStart);
    setSelectionEnd(e.target.selectionEnd);
  }, [onChange]);

  const applyFormat = useCallback((format: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText = content;
    let newCursorPos = end;

    switch (format) {
      case 'bold':
        newText = content.substring(0, start) + `**${selectedText}**` + content.substring(end);
        newCursorPos = selectedText ? end + 4 : start + 4;
        break;
      case 'italic':
        newText = content.substring(0, start) + `*${selectedText}*` + content.substring(end);
        newCursorPos = selectedText ? end + 2 : start + 2;
        break;
      case 'underline':
        newText = content.substring(0, start) + `__${selectedText}__` + content.substring(end);
        newCursorPos = selectedText ? end + 4 : start + 4;
        break;
      case 'quote':
        const lines = selectedText.split('\n');
        const quotedLines = lines.map(line => `> ${line}`).join('\n');
        newText = content.substring(0, start) + quotedLines + content.substring(end);
        newCursorPos = start + quotedLines.length;
        break;
      case 'code':
        newText = content.substring(0, start) + `\`${selectedText}\`` + content.substring(end);
        newCursorPos = selectedText ? end + 2 : start + 2;
        break;
      case 'link':
        newText = content.substring(0, start) + `[${selectedText}](url)` + content.substring(end);
        newCursorPos = selectedText ? end + 6 : start + 6;
        break;
      default:
        return;
    }

    onChange(newText);
    
    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [content, onChange]);

  return (
    <div className={`border border-ink-300 rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="p-3 bg-ink-50 border-b border-ink-200 rounded-t-lg">
        <div className="flex items-center space-x-2 flex-wrap">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('bold')}
            className="p-2 hover:bg-ink-200 rounded"
          >
            <Bold className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('italic')}
            className="p-2 hover:bg-ink-200 rounded"
          >
            <Italic className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('underline')}
            className="p-2 hover:bg-ink-200 rounded"
          >
            <Underline className="h-4 w-4" />
          </Button>
          
          <div className="w-px h-6 bg-ink-300"></div>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-ink-200 rounded"
          >
            <List className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-ink-200 rounded"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          
          <div className="w-px h-6 bg-ink-300"></div>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('quote')}
            className="p-2 hover:bg-ink-200 rounded"
          >
            <Quote className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('code')}
            className="p-2 hover:bg-ink-200 rounded"
          >
            <Code className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('link')}
            className="p-2 hover:bg-ink-200 rounded"
          >
            <Link className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Editor */}
      <Textarea
        value={content}
        onChange={handleTextareaChange}
        placeholder={placeholder}
        className="w-full p-4 border-0 focus:ring-0 focus:ring-offset-0 font-mono text-sm rounded-b-lg resize-none min-h-[300px]"
        onSelect={(e) => {
          const target = e.target as HTMLTextAreaElement;
          setSelectionStart(target.selectionStart);
          setSelectionEnd(target.selectionEnd);
        }}
      />
    </div>
  );
}
