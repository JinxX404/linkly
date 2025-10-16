tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#3B82F6",
          dark: "#6366F1",
        },
        background: {
          light: "#F9FAFB",
          dark: "#111827",
        },
        card: {
          light: "#FFFFFF",
          dark: "#1F2937",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#1F2937",
        },
        text: {
          light: "#1F2937",
          dark: "#F9FAFB",
        },
        "text-secondary": {
          light: "#6B7280",
          dark: "#9CA3AF",
        },
        border: {
          light: "#E5E7EB",
          dark: "#374151",
        },
        accent: {
          green: "#10B981",
          red: "#EF4444",
        },
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        full: "9999px",
      },
      boxShadow: {
        soft: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
        "soft-dark":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
      },
    },
  },
};
