export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <p className="text-6xl font-display font-800" style={{ color: "hsl(192,70%,40%)", fontWeight: 800 }}>404</p>
        <p className="mt-2 text-sm" style={{ color: "rgba(150,180,200,0.5)" }}>Página não encontrada</p>
      </div>
    </div>
  );
}
