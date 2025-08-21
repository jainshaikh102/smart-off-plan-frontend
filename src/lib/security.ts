export const sanitize = {
  text: (s: string) => s.replace(/[<>]/g, ""),
  email: (s: string) => s.trim(),
  phone: (s: string) => s.replace(/[^0-9+\-()\s]/g, "").trim(),
};

