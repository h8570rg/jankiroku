"use client";

import { Accordion } from "@/components/accordion";

export function Faq({
  faqs,
}: {
  faqs: { key: string; question: string; answer: string }[];
}) {
  return (
    <Accordion>
      {faqs.map((faq, index) => (
        <Accordion.Item key={faq.key} aria-label={`FAQ ${index + 1}`}>
          <Accordion.Heading>
            <Accordion.Trigger>
              {faq.question}
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body>{faq.answer}</Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
