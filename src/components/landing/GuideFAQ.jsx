'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from 'next/image';

export function GuideFAQ() {
  return (
    <section id="guide" className="py-20 bg-base-200 border-b-2 border-base-content px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-10 pb-4 p-4">
          <Image src="/logo.png" alt="Relic OS" width={48} height={48} className="pixelated" />
          <h2 className="text-3xl md:text-5xl font-black font-heading uppercase tracking-widest text-base-content">
            User Manual
          </h2>
        </div>

        <Accordion className="w-full space-y-4" defaultValue="item-1">
          <AccordionItem value="item-1" className="border-2 border-base-content shadow-[4px_4px_0px_var(--color-base-content)] bg-base-200 data-[state=open]:bg-primary data-[state=open]:text-primary-content transition-colors">
            <AccordionTrigger className="px-5 py-4 hover:no-underline font-heading uppercase text-lg md:text-xl font-bold tracking-wider [&_svg]:!size-6 [&_svg]:!w-6 [&_svg]:!h-6">
              How does the Web Browser work?
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 font-body text-xl font-medium bg-base-100 text-base-content pt-4 border-t-2 border-base-content">
              Relic OS includes a fully functional web browser. It uses DuckDuckGo for searches and loads web pages securely inside iframes. You can open multiple browser windows, navigate history, and explore the web just like on a real desktop.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border-2 border-base-content shadow-[4px_4px_0px_var(--color-base-content)] bg-base-200 data-[state=open]:bg-primary data-[state=open]:text-primary-content transition-colors">
            <AccordionTrigger className="px-5 py-4 hover:no-underline font-heading uppercase text-lg md:text-xl font-bold tracking-wider [&_svg]:!size-6 [&_svg]:!w-6 [&_svg]:!h-6">
              Can I play games on Relic OS?
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 font-body text-xl font-medium bg-base-100 text-base-content pt-4 border-t-2 border-base-content">
              Absolutely! The Game Directory fetches curated, web-based indie games directly from itch.io. Simply click "Play" to launch a game in a new window. Games run entirely within Relic OS without requiring external accounts or downloads.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-2 border-base-content shadow-[4px_4px_0px_var(--color-base-content)] bg-base-200 data-[state=open]:bg-primary data-[state=open]:text-primary-content transition-colors">
            <AccordionTrigger className="px-5 py-4 hover:no-underline font-heading uppercase text-lg md:text-xl font-bold tracking-wider [&_svg]:!size-6 [&_svg]:!w-6 [&_svg]:!h-6">
              How does YouTube integration work?
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 font-body text-xl font-medium bg-base-100 text-base-content pt-4 border-t-2 border-base-content">
              You can watch YouTube videos natively. Simply paste a YouTube URL or Video ID into the YouTube app, and it will embed the official player in a resizable window. The audio integrates perfectly with the OS.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-2 border-base-content shadow-[4px_4px_0px_var(--color-base-content)] bg-base-200 data-[state=open]:bg-primary data-[state=open]:text-primary-content transition-colors">
            <AccordionTrigger className="px-5 py-4 hover:no-underline font-heading uppercase text-lg md:text-xl font-bold tracking-wider [&_svg]:!size-6 [&_svg]:!w-6 [&_svg]:!h-6">
              How do I change the theme?
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 font-body text-xl font-medium bg-base-100 text-base-content pt-4 border-t-2 border-base-content">
              Open the Settings app to customize your experience. You can switch between built-in retro presets (like Pocket, Color, and Advance) or create your own custom theme by overriding the hex colors.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
