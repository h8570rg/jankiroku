import classNames from "classnames";

// nextui tableにfooterがないのでclassだけ踏襲して作成
export function Table({ children }: { children: React.ReactNode }) {
  return <table className="size-full min-w-full table-auto">{children}</table>;
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <thead className="[&>tr]:first:rounded-lg">
      <tr className="outline-none">{children}</tr>
      <tr
        aria-hidden="true"
        className="block size-px"
        style={{
          marginLeft: "0.25rem",
          marginTop: "0.25rem",
        }}
      ></tr>
    </thead>
  );
}

export function TableColumn({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={classNames(
        "group h-10 whitespace-nowrap bg-default-100 px-1 text-left align-middle text-tiny font-semibold text-foreground-500 outline-none first:rounded-l-lg last:rounded-r-lg",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="group outline-none">{children}</tr>;
}

export function TableCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td
      className={classNames(
        "relative whitespace-normal px-1 py-2 align-middle text-small font-normal outline-none before:absolute before:inset-0 before:z-0 before:bg-default/40 before:opacity-0 before:content-[''] first:before:rounded-l-lg last:before:rounded-r-lg [&>*]:relative",
        className,
      )}
    >
      {children}
    </td>
  );
}

export function TableFooter({ children }: { children: React.ReactNode }) {
  return (
    <tfoot>
      <tr
        aria-hidden="true"
        className="block size-px"
        style={{
          marginLeft: "0.25rem",
          marginTop: "0.25rem",
        }}
      ></tr>
      {children}
    </tfoot>
  );
}

export function TableFooterRow({ children }: { children: React.ReactNode }) {
  return <tr className="group">{children}</tr>;
}

export function TableFooterCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td
      className={classNames(
        "h-10 whitespace-nowrap bg-default-100 px-1 text-left align-middle text-tiny font-semibold text-foreground-500 outline-none group-[:nth-of-type(2)]:first:rounded-tl-lg group-[:nth-of-type(2)]:last:rounded-tr-lg group-last:first:rounded-bl-lg group-last:last:rounded-br-lg",
        className,
      )}
    >
      {children}
    </td>
  );
}
