"use client";

import { Accordion, AccordionItem } from "@/components/Accordion";

export function FAQ({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  return (
    <Accordion>
      {faqs.map((faq, index) => (
        <AccordionItem
          key={index}
          aria-label={`FAQ ${index + 1}`}
          title={faq.question}
        >
          {faq.answer}
        </AccordionItem>
      ))}
    </Accordion>
  );
}
