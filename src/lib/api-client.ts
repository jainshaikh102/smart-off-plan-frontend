// Example content
export const fetchData = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};
