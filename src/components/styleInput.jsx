export function StyledCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer hidden"
      />
      <span className="relative w-5 h-5 border-2 border-primaryYellow rounded-md flex items-center justify-center
        before:content-[''] before:w-3 before:h-3
        before:rounded-sm before:bg-primaryYellow
        before:scale-0 peer-checked:before:scale-100
        transition-all duration-150"
      />
      {label}
    </label>
  );
}

export function StyledRadio({ label, name, value, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="peer hidden"
      />
      <span className="relative w-5 h-5 border-2 border-primaryYellow rounded-full flex items-center justify-center
        before:content-[''] before:w-3 before:h-3
        before:rounded-full before:bg-primaryYellow
        before:scale-0 peer-checked:before:scale-100
        transition-all duration-150"
      />
      {label}
    </label>
  );
}