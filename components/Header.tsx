export function Header() {
  return (
    <header className="mb-12 text-center">
      <div className="flex items-center justify-center gap-3 mb-3">
        <h1 className="text-5xl font-bold tracking-tight text-foreground">
          Treebot Tales
        </h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Explore conversational insights about the recent treebot talks
      </p>
      <div className="mt-4 h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent rounded-full opacity-50" />
    </header>
  );
}