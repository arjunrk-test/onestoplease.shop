import ProductsListPage from "@/app/admin/components/products/ProductsListPage";

export default async function CategoryPage({ params }: { params: { category: string } }) {
  return <ProductsListPage />;
}
