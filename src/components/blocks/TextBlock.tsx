import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Delta } from "quill";

const TextBlock = ({
  data,
  onChange,
}: {
  data: Delta | string;
  onChange: (newData: Delta) => void;
}) => {
  const handleChange = (
    content: string,
    delta: Delta,
    source: string,
    editor: ReactQuill.UnprivilegedEditor
  ) => {
    const newDelta = editor.getContents();
    console.log(content, delta, source, editor);
    onChange(newDelta);
  };

  return (
    <ReactQuill
      value={typeof data === "string" ? data : data.ops}
      onChange={handleChange}
    />
  );
};

export default TextBlock;
