function FilterButtons({ filter, setFilter, counts }) {
  const filters = [
    { id: "all", label: "All", count: counts.all },
    { id: "pending", label: "Pending", count: counts.pending },
    { id: "completed", label: "Completed", count: counts.completed },
  ];

  return (
    <div className="filter-controls" role="group" aria-label="Filter tasks">
      {filters.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`filter-btn ${filter === item.id ? "active-filter" : ""}`}
          onClick={() => setFilter(item.id)}
        >
          {item.label} ({item.count})
        </button>
      ))}
    </div>
  );
}

export default FilterButtons;
