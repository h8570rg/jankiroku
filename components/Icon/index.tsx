/**
 * Use material icons.
 * @see https://fonts.google.com/icons
 */

export type IconName = "add";

export function Icon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 44 44">
      <use xlinkHref={`#${name}`} />
    </svg>
  );
}

export function IconDefs() {
  return (
    <svg
      aria-hidden="true"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <svg id="add" viewBox="0 -960 960 960">
          <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
        </svg>
      </defs>
    </svg>
  );
}
