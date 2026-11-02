interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const buttonClass = "rounded-md px-3 py-2 text-sm shadow-sm transition-colors";
const normalClass =
  "bg-white text-black hover:bg-black hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black";

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 py-6">
      <button
        className={`${buttonClass} ${normalClass}`}
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
        <button
          key={number}
          className={`${buttonClass} ${number === page ? "bg-black text-white" : normalClass}`}
          onClick={() => onChange(number)}
        >
          {number}
        </button>
      ))}

      <button
        className={`${buttonClass} ${normalClass}`}
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}
