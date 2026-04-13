/** Dispatched after nav to home so HomePage can focus the command input. */
export const FOCUS_TERMINAL_INPUT_EVENT = "portfolio:focus-terminal-input";

export function requestTerminalInputFocus() {
  window.setTimeout(() => {
    window.dispatchEvent(new CustomEvent(FOCUS_TERMINAL_INPUT_EVENT));
  }, 0);
}
