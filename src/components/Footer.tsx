export default function Footer() {
  return (
    <footer className="w-full border-t border-secondary/20 mt-auto">
      <div className="max-w-[120rem] mx-auto px-[8%] py-8">
        <p className="font-paragraph text-sm text-secondary-foreground">
          © {new Date().getFullYear()} AeroForge AI. Deterministic Parametric CAD Compiler.
        </p>
      </div>
    </footer>
  );
}
