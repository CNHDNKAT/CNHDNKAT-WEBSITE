import promptDocument from "../content/prompt.md?raw";

export async function readPromptDocument(): Promise<string> {
  return promptDocument.trim();
}
