import TextBlock from "../blocks/TextBlock";
import { ContentBlock, TextBlock as TextBlockType } from "@/lib/constants";
import Delta from "quill-delta";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";

const ItemContent = ({
  content,
  onChange,
}: {
  content: ContentBlock[];
  onChange: (newContent: ContentBlock[]) => void;
}) => {
  useEffect(() => {
    if (content.length === 0) {
      const newBlock: TextBlockType = {
        id: uuidv4(),
        type: "text",
        data: { delta: new Delta([]) },
      };
      onChange([newBlock]);
    }
  }, [content, onChange]);

  const handleBlockChange = (index: number, newData: Delta) => {
    const newContent = content.map((block, i) => {
      if (i === index && block.type === "text") {
        return {
          ...block,
          data: {
            delta: newData,
          },
        };
      }
      return block;
    });
    onChange(newContent);
  };

  return (
    <div>
      {content.map((block, index) => {
        switch (block.type) {
          case "text":
            return (
              <TextBlock
                key={block.id}
                data={block.data.delta}
                onChange={(newData) => handleBlockChange(index, newData)}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default ItemContent;
