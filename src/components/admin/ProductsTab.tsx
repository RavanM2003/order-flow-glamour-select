
import { useEffect, useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusIcon, SearchIcon, EditIcon, PowerIcon } from "lucide-react";
import ProductForm from "@/components/ProductForm";
import DetailDrawer from "@/components/common/DetailDrawer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PriceDisplay from "@/components/ui/price-display";

const ProductsTable = ({ 
  products, 
  onEdit, 
  onToggleStatus,
  className = ""
}) => (
  <div className={`overflow-x-auto ${className}`}>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[150px]">Name</TableHead>
          <TableHead className="min-w-[80px]">Price</TableHead>
          <TableHead className="hidden sm:table-cell">Stock</TableHead>
          <TableHead className="hidden md:table-cell min-w-[200px]">Description</TableHead>
          <TableHead className="hidden md:table-cell">Status</TableHead>
          <TableHead className="text-right min-w-[120px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              No products found
            </TableCell>
          </TableRow>
        ) : (
          products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500 sm:hidden">
                    <PriceDisplay price={product.price} /> • Stock: {product.stock}
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <PriceDisplay price={product.price} discount={product.discount} />
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                  {product.stock}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="max-w-[200px] truncate">
                  {product.description || "No description"}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="default">Active</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(product)}
                    className="text-xs px-2 py-1"
                  >
                    <EditIcon className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleStatus(product.id)}
                    className="text-xs px-2 py-1 text-orange-600 hover:text-orange-700"
                  >
                    <PowerIcon className="h-3 w-3 mr-1" />
                    Disable
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
);

const ProductsHeader = ({ searchTerm, setSearchTerm, onAddClick }) => (
  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <CardTitle>Products</CardTitle>
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          className="w-full sm:w-[200px] pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button onClick={onAddClick} className="w-full sm:w-auto">
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Product
      </Button>
    </div>
  </CardHeader>
);

const ProductsTab = () => {
  const { products, isLoading, error, fetchProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleToggleStatus = (productId) => {
    // TODO: Implement disable product functionality
    console.log('Disable product:', productId);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    fetchProducts();
  };

  return (
    <Card>
      <ProductsHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddClick={() => {
          setEditingProduct(null);
          setIsFormOpen(true);
        }}
      />
      <CardContent className="p-0 sm:p-6">
        {isLoading ? (
          <div className="flex justify-center p-8">Loading products...</div>
        ) : error ? (
          <div className="text-red-500 p-8 text-center">Error: {error}</div>
        ) : (
          <ProductsTable
            products={filteredProducts}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
            className="px-4 sm:px-0"
          />
        )}
      </CardContent>

      {/* Product Form Drawer */}
      <DetailDrawer
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        position="right"
      >
        <ProductForm
          product={editingProduct}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsFormOpen(false)}
        />
      </DetailDrawer>
    </Card>
  );
};

export default ProductsTab;
