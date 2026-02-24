interface CategoryFilterProps {
  categories: string[];
  active: string;
  onSelect: (cat: string) => void;
}

const CategoryFilter = ({ categories, active, onSelect }: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            active === cat
              ? "bg-[hsl(var(--chip-active-bg))] text-[hsl(var(--chip-active-fg))]"
              : "bg-[hsl(var(--chip-bg))] text-foreground hover:bg-muted"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
