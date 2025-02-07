import Editor from "../editor/Editor";
import { JSONContent } from "@tiptap/react";

const ItemContent = ({
  content,
  onChange,
  readOnly = false,
}: {
  content: JSONContent;
  onChange: (newContent: JSONContent) => void;
  readOnly?: boolean;
}) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <Editor content={content} onChange={onChange} readOnly={readOnly} />
    </div>
  );
};

export default ItemContent;
