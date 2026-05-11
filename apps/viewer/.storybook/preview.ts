import type { Preview } from "@storybook/react-vite";
import "../src/styles.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "hsl(222 47% 7%)" },
        { name: "light", value: "hsl(0 0% 100%)" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: { test: "todo" },
  },
  decorators: [
    (Story, ctx) => {
      // Default to dark theme so the highlight tints match the live viewer.
      if (typeof document !== "undefined") {
        const cls = document.documentElement.classList;
        const wantDark = ctx.globals.theme !== "light";
        cls.toggle("dark", wantDark);
      }
      return Story();
    },
  ],
  globalTypes: {
    theme: {
      description: "Theme",
      defaultValue: "dark",
      toolbar: {
        title: "Theme",
        items: [
          { value: "dark", title: "Dark" },
          { value: "light", title: "Light" },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
