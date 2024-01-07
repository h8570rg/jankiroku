/**
 * @see https://nextjs.org/learn/dashboard-app/adding-search-and-pagination
 */
import { Suspense } from "react";
import { ModalBody, ModalContent, ModalHeader } from "~/components/Modal";
import { ScrollShadow } from "~/components/ScrollShadow";
import { List } from "./List";
import { ModalController } from "./ModalController";
import { Search } from "./Search";

export function AddModal({ query }: { query: string }) {
  return (
    <ModalController>
      <ModalContent>
        <ModalHeader>フレンド追加</ModalHeader>
        <ModalBody>
          <Search />
          <ScrollShadow className="h-[280px] py-1">
            <Suspense key={query} fallback={<List query={query} skeleton />}>
              <List query={query} />
            </Suspense>
          </ScrollShadow>
        </ModalBody>
      </ModalContent>
    </ModalController>
  );
}
