export const GenerationLines = () => {
  return (
    <div className="pointer-events-none flex h-full w-full flex-col justify-between">
      <div></div>
      {new Array(100).fill(0).map((_, i) => {
        return <div key={i} className="h-1 w-full bg-white/20"></div>;
      })}
      <div></div>
    </div>
  );
};
