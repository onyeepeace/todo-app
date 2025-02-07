import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect } from "react";

const Editor = ({
  content,
  onChange,
  readOnly = false,
}: {
  content: JSONContent | string;
  onChange: (newContent: JSONContent) => void;
  readOnly?: boolean;
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content:
      typeof content === "string"
        ? content
        : content || { type: "doc", content: [{ type: "paragraph" }] },
    editable: !readOnly,
    autofocus: "end",
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  useEffect(() => {
    if (editor && content) {
      const newContent = typeof content === "string" ? content : content;
      if (JSON.stringify(newContent) !== JSON.stringify(editor.getJSON())) {
        editor.commands.setContent(newContent);
      }
    }
  }, [content, editor]);

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
    <>
      <MenuBar />
      <div
        className="p-4 min-h-[200px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50"
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent editor={editor} />
      </div>
    </>
  );
};

export default Editor;
