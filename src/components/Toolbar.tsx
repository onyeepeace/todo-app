const Toolbar = ({ onAddBlock }: { onAddBlock: (type: string) => void }) => {
  return (
    <div>
      <button onClick={() => onAddBlock("text")}>Add Text</button>
    </div>
  );
};

export default Toolbar;
