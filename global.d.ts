import { HSAccordion } from "flyonui/flyonui";

declare global {
  interface Window {
    // Specific JS component
    HSAccordion: typeof HSAccordion;
  }
}

export {};
