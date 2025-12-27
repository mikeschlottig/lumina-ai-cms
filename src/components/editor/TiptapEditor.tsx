import React from 'react';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import {
  Bold,
  Italic,
  List,
  Heading1,
  Heading2,
  Quote,
  Sparkles,
  Type,
  ListOrdered,
  Image as ImageIcon,
  Command
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { chatService } from '@/lib/chat';
interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
}
export function TiptapEditor({ content, onChange, editable = true }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Typography,
      Placeholder.configure({
        placeholder: 'Write your story, or type "/" for AI commands...',
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-zinc dark:prose-invert max-w-none focus:outline-none min-h-[600px] py-12 text-lg leading-relaxed antialiased selection:bg-indigo-100 dark:selection:bg-indigo-900/40',
      },
    },
  });
  if (!editor) return null;
  const handleAIAction = async (prompt: string) => {
    const previousContent = editor.getHTML();
    editor.chain().focus().insertContent(' <span class="animate-pulse text-indigo-500 font-medium">Lumina is thinking...</span>').run();
    try {
      let result = '';
      await chatService.sendMessage(
        `Based on this draft: "${previousContent}", please ${prompt}`,
        undefined,
        (chunk) => {
          result += chunk;
        }
      );
      // Replace the loading indicator
      editor.commands.undo();
      editor.chain().focus().insertContent(result).run();
    } catch (error) {
      editor.commands.undo();
    }
  };
  return (
    <div className="relative w-full group">
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex items-center gap-1 overflow-hidden rounded-xl border bg-background/95 backdrop-blur-sm p-1 shadow-xl border-zinc-200 dark:border-zinc-800">
        <Toggle size="sm" pressed={editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </Toggle>
        <Separator orientation="vertical" className="mx-1 h-4" />
        <Toggle size="sm" pressed={editor.isActive('heading', { level: 1 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor.isActive('bulletList')} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </Toggle>
        <Separator orientation="vertical" className="mx-1 h-4" />
        <Button variant="ghost" size="sm" className="h-8 px-2 gap-1 text-indigo-500 font-medium" onClick={() => handleAIAction('rewrite the last paragraph to be more engaging.')}>
          <Sparkles className="h-3.5 w-3.5" />
          <span>Polishing</span>
        </Button>
      </BubbleMenu>
      <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex flex-col gap-0.5 overflow-hidden rounded-xl border bg-background/95 backdrop-blur-sm p-1.5 shadow-2xl min-w-[180px] border-zinc-200 dark:border-zinc-800">
        <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <Command className="h-3 w-3" /> Commands
        </div>
        <button className="flex items-center gap-2 w-full px-2 py-2 text-sm text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 font-medium transition-colors" onClick={() => handleAIAction('continue the writing in the same style for another two paragraphs.')}>
          <Sparkles className="h-4 w-4" />
          <span>AI Continue</span>
        </button>
        <button className="flex items-center gap-2 w-full px-2 py-2 text-sm text-left hover:bg-accent rounded-lg transition-colors" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <Type className="h-4 w-4" />
          <span>Heading 1</span>
        </button>
        <button className="flex items-center gap-2 w-full px-2 py-2 text-sm text-left hover:bg-accent rounded-lg transition-colors" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" />
          <span>Bullet List</span>
        </button>
        <button className="flex items-center gap-2 w-full px-2 py-2 text-sm text-left hover:bg-accent rounded-lg transition-colors" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
          <span>Numbered List</span>
        </button>
        <button className="flex items-center gap-2 w-full px-2 py-2 text-sm text-left hover:bg-accent rounded-lg transition-colors opacity-50 cursor-not-allowed">
          <ImageIcon className="h-4 w-4" />
          <span>Add Image</span>
        </button>
      </FloatingMenu>
      <EditorContent editor={editor} />
    </div>
  );
}