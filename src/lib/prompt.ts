import promptDocument from "../content/prompt.md?raw";
import { typografText } from "./typograf";

export async function readPromptDocument(): Promise<string> {
  return typografText(promptDocument.trim());
}
