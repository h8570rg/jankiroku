import { useCallback } from "react";
import { useToast } from "~/lib/hooks/toast";
import BasicLayout from "~/lib/layout/basic";

export default function Debug() {
  const toast = useToast();
  const addToast = useCallback(() => {
    toast.add({ content: "test" });
  }, [toast]);
  return (
    <>
      <main>
        <button onClick={addToast}>add toast</button>
      </main>
    </>
  );
}

Debug.getLayout = BasicLayout;
