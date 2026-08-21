import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ServiceFaq } from "@/content/services";

export function Faq({ items }: { items: ServiceFaq[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, index) => (
        <AccordionItem key={item.question} value={`item-${index}`}>
          <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/**
 * Homepage FAQ. Every answer is drawn from information Solden already publishes
 * (hours, drop-off, non-drivable quotes, warranty, insurers) — nothing invented.
 */
export const generalFaqs: ServiceFaq[] = [
  {
    question: "Do I get to choose my own repairer?",
    answer:
      "If your policy includes choice of repairer, yes. We are an approved repairer for all major insurers with choice of repairer policies, and our team will help you through the claim process, liaise with your insurance company and arrange the necessary paperwork so the experience is comfortable and stress free.",
  },
  {
    question: "What are your opening hours?",
    answer:
      "We're open 8:00am to 4:00pm Monday to Friday. Saturdays and after hours are by appointment only, and weekend and night drop-off is available if you can't get here during the week.",
  },
  {
    question: "My car isn't drivable. What now?",
    answer:
      "Don't drive it. We arrange off-site quotations for non-drivable vehicles by appointment — call us on (07) 3205 2988 and we'll organise a time to come and look at it.",
  },
  {
    question: "Is your work guaranteed?",
    answer:
      "Yes. Every repair is backed by our full repair warranty. If there is ever a problem, we will fix it.",
  },
  {
    question: "Is my car safe while it's with you?",
    answer:
      "Our premises are fully secured, alarmed and monitored, and the yard is gated. Vehicles are never left outside overnight.",
  },
  {
    question: "Do you only work on cars?",
    answer:
      "No. Our spray booth is extra large, so we take trucks, buses, caravans, boats and commercial vehicles as well as cars and motorbikes.",
  },
  {
    question: "Which suburbs do you service?",
    answer:
      "Our workshop is at 6 Aldinga Street, Brendale, and we regularly repair vehicles for customers right across north Brisbane and the Moreton Bay region — Strathpine, Bray Park, Warner, Albany Creek, Eatons Hill, Cashmere, Kallangur, Petrie, Lawnton, North Lakes and the surrounding suburbs. If you're further out, call us anyway and we'll let you know.",
  },
  {
    question: "How much will my repair cost?",
    answer:
      "It depends entirely on the damage, so we quote each job properly rather than guessing. Quotes are free — pop in with your vehicle, or send photos and details through our quote form and we'll come back to you.",
  },
];
