import Typograf from "typograf";

const typograf = new Typograf({ locale: ["ru"] });

export function typografText(text: string): string {
  return typograf.execute(text);
}
