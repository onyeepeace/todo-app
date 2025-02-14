import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect } from "react";
import { TextBlock as TextBlockType } from "@/lib/constants";

const TextBlock = ({
  block,
  onChange,
  readOnly = false,
}: {
  block: TextBlockType;
  onChange: (newBlock: TextBlockType) => void;
  readOnly?: boolean;
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: block.content || "<p>Start typing...</p>",
    editable: true,
    autofocus: "end",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange({
        ...block,
        content: html,
      });
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly);
    }
  }, [editor, readOnly]);

  useEffect(() => {
    if (editor && block.content && block.content !== editor.getHTML()) {
      editor.commands.setContent(block.content);
    }
  }, [block.content, editor]);

  const MenuBar = useCallback(() => {
    if (!editor || readOnly) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded text-sm ${
            editor.isActive("bold")
              ? "bg-gray-200 text-gray-900"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded text-sm ${
            editor.isActive("italic")
              ? "bg-gray-200 text-gray-900"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`px-2 py-1 rounded text-sm ${
            editor.isActive("strike")
              ? "bg-gray-200 text-gray-900"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Strike
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`px-2 py-1 rounded text-sm ${
            editor.isActive("paragraph")
              ? "bg-gray-200 text-gray-900"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Paragraph
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`px-2 py-1 rounded text-sm ${
            editor.isActive("heading", { level: 1 })
              ? "bg-gray-200 text-gray-900"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-2 py-1 rounded text-sm ${
            editor.isActive("heading", { level: 2 })
              ? "bg-gray-200 text-gray-900"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded text-sm ${
            editor.isActive("bulletList")
              ? "bg-gray-200 text-gray-900"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Bullet List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded text-sm ${
            editor.isActive("orderedList")
              ? "bg-gray-200 text-gray-900"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Ordered List
        </button>
      </div>
    );
  }, [editor, readOnly]);

  if (!editor) {
    return (
      <div className="border rounded-lg overflow-hidden bg-white p-4 min-h-[200px]">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <MenuBar />
      <div
        className="p-4 min-h-[200px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50"
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TextBlock;
