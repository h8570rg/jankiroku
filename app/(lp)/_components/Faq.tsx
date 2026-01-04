"use client";

import { Accordion, AccordionItem } from "@/components/accordion";

export function Faq({
  faqs,
}: {
  faqs: { key: string; question: string; answer: string }[];
}) {
  return (
    <Accordion>
      {faqs.map((faq, index) => (
        <AccordionItem
          key={faq.key}
          aria-label={`FAQ ${index + 1}`}
          title={faq.question}
        >
          {faq.answer}
        </AccordionItem>
      ))}
    </Accordion>
  );
}
