export async function getAllProducts() {
  const response = await fetch('https://dummyjson.com/products');
  const data = await response.json();
  return data;
}
