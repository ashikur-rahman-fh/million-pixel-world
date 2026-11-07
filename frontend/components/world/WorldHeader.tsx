interface WorldHeaderProps {
  viewportRow: number;
}

export function WorldHeader({ viewportRow }: WorldHeaderProps) {
  return (
    <header className="z-50 absolute top-2 left-2 bg-transparent text-black p-2 flex justify-between items-center font-console text-xs">
      <span>row: {viewportRow.toLocaleString()}</span>
    </header>
  );
}
