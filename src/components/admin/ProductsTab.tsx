import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Edit, Trash, ChevronLeft, ChevronRight, DollarSign, Package, CalendarPlus } from 'lucide-react';
import DetailDrawer from '@/components/common/DetailDrawer';
import { Dialog, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog';

const allServices = [
  "Facial Treatment", "Massage Therapy", "Manicure", "Hair Styling", "Makeup Application", "Body Treatment", "Hair Coloring", "Eyebrow Shaping", "Pedicure", "Waxing", "Hair Treatment", "Eyelash Extensions"
];

const ProductsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [products, setProducts] = useState([
    { 
      id: 1, 
      name: "Anti-Aging Serum", 
      price: 75, 
      stock: 18, 
      category: "Skin Care", 
      relatedServices: ["Facial Treatment"],
      description: "Our revolutionary Anti-Aging Serum combines the power of retinol, peptides, and collagen to effectively target multiple signs of aging. This potent formula penetrates deep into the skin to stimulate collagen production, improve elasticity, and reduce the appearance of fine lines and wrinkles. Enriched with vitamin C, this serum brightens your complexion and helps fade dark spots and discoloration for a more even skin tone. Hyaluronic acid provides intense hydration, plumping the skin and creating a smoother appearance. With regular use, you'll notice firmer, more youthful-looking skin with improved texture and radiance. The lightweight, fast-absorbing formula is designed to work effectively without causing irritation, making it suitable for most skin types.",
      details: "Size: 30ml\nCategory: Skin Care",
      howToUse: "Apply 2-3 drops to clean, dry skin in the evening. Gently pat into skin and allow to absorb before applying moisturizer. Start using 2-3 times per week, gradually increasing to nightly use as tolerated. Always use sunscreen during daytime when using this product.",
      ingredients: "Water, Propylene Glycol, Glycerin, Retinol, Palmitoyl Tripeptide-1, Palmitoyl Tetrapeptide-7, Sodium Hyaluronate, Hydrolyzed Collagen, Ascorbic Acid, Tocopheryl Acetate, Niacinamide, Panthenol, Allantoin, Phenoxyethanol, Ethylhexylglycerin."
    },
    { id: 2, name: "Moisturizer Cream", price: 45, stock: 24, category: "Skin Care", relatedServices: ["Facial Treatment"] },
    { id: 3, name: "Hair Care Kit", price: 60, stock: 15, category: "Hair Care", relatedServices: ["Hair Styling", "Hair Treatment"] },
    { id: 4, name: "Facial Cleansing Gel", price: 35, stock: 30, category: "Skin Care", relatedServices: ["Facial Treatment"] },
    { id: 5, name: "Luxury Makeup Palette", price: 85, stock: 12, category: "Makeup", relatedServices: ["Makeup Application"] },
    { id: 6, name: "Nail Care Set", price: 40, stock: 20, category: "Nail Care", relatedServices: ["Manicure", "Pedicure"] },
    { id: 7, name: "Body Scrub", price: 38, stock: 22, category: "Body Care", relatedServices: ["Body Treatment"] },
    { id: 8, name: "Hair Styling Gel", price: 25, stock: 35, category: "Hair Care", relatedServices: ["Hair Styling"] },
    { id: 9, name: "Eye Cream", price: 55, stock: 16, category: "Skin Care", relatedServices: ["Facial Treatment"] },
    { id: 10, name: "Lip Balm Collection", price: 30, stock: 28, category: "Makeup", relatedServices: ["Makeup Application"] },
    { id: 11, name: "Massage Oil", price: 42, stock: 25, category: "Body Care", relatedServices: ["Massage Therapy"] },
    { id: 12, name: "Hair Mask", price: 48, stock: 20, category: "Hair Care", relatedServices: ["Hair Treatment"] }
  ]);
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    price: '', 
    category: '', 
    stock: '', 
    relatedServices: [],
    description: '',
    details: '',
    howToUse: '',
    ingredients: ''
  });
  const [addProductError, setAddProductError] = useState('');
  const [editProductOpen, setEditProductOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editProductForm, setEditProductForm] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    relatedServices: [],
    description: '',
    details: '',
    howToUse: '',
    ingredients: ''
  });
  const [editProductError, setEditProductError] = useState('');
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Paginate products
  const pageSize = 10;
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Add Product logic
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.stock) {
      setAddProductError('All fields are required');
      return;
    }
    setProducts([
      { ...newProduct, id: products.length + 1, price: Number(newProduct.price), stock: Number(newProduct.stock) },
      ...products
    ]);
    setNewProduct({ name: '', price: '', category: '', stock: '', relatedServices: [], description: '', details: '', howToUse: '', ingredients: '' });
    setAddProductOpen(false);
    setAddProductError('');
  };
  // Multi-select handler
  const handleServiceSelect = (service) => {
    setNewProduct(prev =>
      prev.relatedServices.includes(service)
        ? { ...prev, relatedServices: prev.relatedServices.filter(s => s !== service) }
        : { ...prev, relatedServices: [...prev.relatedServices, service] }
    );
  };

  // Edit Product logic
  const handleEditProduct = (product) => {
    setEditProduct(product);
    setEditProductForm({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      relatedServices: product.relatedServices || [],
      description: product.description || '',
      details: product.details || '',
      howToUse: product.howToUse || '',
      ingredients: product.ingredients || ''
    });
    setEditProductOpen(true);
    setEditProductError('');
  };

  const handleEditProductSubmit = (e) => {
    e.preventDefault();
    if (!editProductForm.name || !editProductForm.price || !editProductForm.category || !editProductForm.stock) {
      setEditProductError('Name, price, category, and stock are required');
      return;
    }
    setProducts(products.map(p =>
      p.id === editProduct.id
        ? { ...p, ...editProductForm, price: Number(editProductForm.price), stock: Number(editProductForm.stock) }
        : p
    ));
    setEditProductOpen(false);
    setEditProduct(null);
    setEditProductError('');
  };

  const handleDeleteProduct = (id) => {
    setDeleteProductId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = () => {
    setProducts(products.filter(p => p.id !== deleteProductId));
    setDeleteDialogOpen(false);
    setDeleteProductId(null);
  };

  const cancelDeleteProduct = () => {
    setDeleteDialogOpen(false);
    setDeleteProductId(null);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-glamour-800">Products</h2>
          <Button className="bg-glamour-700 hover:bg-glamour-800 text-white" onClick={() => setAddProductOpen(true)}>
            <CalendarPlus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search products..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Related Services</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                      {product.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium flex items-center justify-end">
                    <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                    {product.price}
                  </TableCell>
                  <TableCell className="text-center">
                    {product.stock < 20 ? (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        {product.stock}
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {product.stock}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.relatedServices.map((service, index) => (
                        <span key={index} className="text-xs bg-glamour-100 text-glamour-800 px-2 py-1 rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditProduct(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredProducts.length)} of {filteredProducts.length} entries
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
      {/* Add Product Drawer */}
      <DetailDrawer open={addProductOpen} onOpenChange={setAddProductOpen} title="Add Product">
        <form onSubmit={handleAddProduct} className="space-y-4 p-4">
          <Input
            placeholder="Product Name"
            value={newProduct.name}
            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
            required
          />
          <Input
            placeholder="Price"
            type="number"
            value={newProduct.price}
            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
            required
          />
          <Input
            placeholder="Category"
            value={newProduct.category}
            onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
            required
          />
          <Input
            placeholder="Stock"
            type="number"
            value={newProduct.stock}
            onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
            required
          />
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              className="w-full min-h-[150px] p-2 border rounded-md"
              placeholder="Enter detailed product description..."
              value={newProduct.description}
              onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Details</label>
            <textarea
              className="w-full min-h-[100px] p-2 border rounded-md"
              placeholder="Enter product details (size, category, etc.)..."
              value={newProduct.details}
              onChange={e => setNewProduct({ ...newProduct, details: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">How to Use</label>
            <textarea
              className="w-full min-h-[100px] p-2 border rounded-md"
              placeholder="Enter usage instructions..."
              value={newProduct.howToUse}
              onChange={e => setNewProduct({ ...newProduct, howToUse: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Ingredients</label>
            <textarea
              className="w-full min-h-[100px] p-2 border rounded-md"
              placeholder="Enter product ingredients..."
              value={newProduct.ingredients}
              onChange={e => setNewProduct({ ...newProduct, ingredients: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Related Services</label>
            <div className="flex flex-wrap gap-2">
              {allServices.map(service => (
                <button
                  type="button"
                  key={service}
                  className={`px-3 py-1 rounded-full border text-xs ${newProduct.relatedServices.includes(service) ? 'bg-glamour-700 text-white border-glamour-700' : 'bg-white text-glamour-800 border-gray-300'}`}
                  onClick={() => handleServiceSelect(service)}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>
          {addProductError && <div className="text-red-600 text-sm">{addProductError}</div>}
          <Button type="submit" className="bg-glamour-700 hover:bg-glamour-800 text-white w-full">Add Product</Button>
        </form>
      </DetailDrawer>
      {/* Edit Product Drawer */}
      <DetailDrawer open={editProductOpen} onOpenChange={setEditProductOpen} title="Edit Product">
        <form onSubmit={handleEditProductSubmit} className="space-y-4 p-4">
          <Input
            placeholder="Product Name"
            value={editProductForm.name}
            onChange={e => setEditProductForm({ ...editProductForm, name: e.target.value })}
            required
          />
          <Input
            placeholder="Price"
            type="number"
            value={editProductForm.price}
            onChange={e => setEditProductForm({ ...editProductForm, price: e.target.value })}
            required
          />
          <Input
            placeholder="Category"
            value={editProductForm.category}
            onChange={e => setEditProductForm({ ...editProductForm, category: e.target.value })}
            required
          />
          <Input
            placeholder="Stock"
            type="number"
            value={editProductForm.stock}
            onChange={e => setEditProductForm({ ...editProductForm, stock: e.target.value })}
            required
          />
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              className="w-full min-h-[150px] p-2 border rounded-md"
              placeholder="Enter detailed product description..."
              value={editProductForm.description}
              onChange={e => setEditProductForm({ ...editProductForm, description: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Details</label>
            <textarea
              className="w-full min-h-[100px] p-2 border rounded-md"
              placeholder="Enter product details (size, category, etc.)..."
              value={editProductForm.details}
              onChange={e => setEditProductForm({ ...editProductForm, details: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">How to Use</label>
            <textarea
              className="w-full min-h-[100px] p-2 border rounded-md"
              placeholder="Enter usage instructions..."
              value={editProductForm.howToUse}
              onChange={e => setEditProductForm({ ...editProductForm, howToUse: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Ingredients</label>
            <textarea
              className="w-full min-h-[100px] p-2 border rounded-md"
              placeholder="Enter product ingredients..."
              value={editProductForm.ingredients}
              onChange={e => setEditProductForm({ ...editProductForm, ingredients: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Related Services</label>
            <div className="flex flex-wrap gap-2">
              {allServices.map(service => (
                <button
                  type="button"
                  key={service}
                  className={`px-3 py-1 rounded-full border text-xs ${editProductForm.relatedServices.includes(service) ? 'bg-glamour-700 text-white border-glamour-700' : 'bg-white text-glamour-800 border-gray-300'}`}
                  onClick={() => {
                    setEditProductForm(prev =>
                      prev.relatedServices.includes(service)
                        ? { ...prev, relatedServices: prev.relatedServices.filter(s => s !== service) }
                        : { ...prev, relatedServices: [...prev.relatedServices, service] }
                    );
                  }}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>
          {editProductError && <div className="text-red-600 text-sm">{editProductError}</div>}
          <Button type="submit" className="bg-glamour-700 hover:bg-glamour-800 text-white w-full">Save Changes</Button>
        </form>
      </DetailDrawer>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            Məhsulu silmək istədiyinizə əminsiniz?
          </DialogHeader>
          <div className="py-4 text-sm text-muted-foreground">
            Bu əməliyyat geri qaytarıla bilməz. Məhsul silinəcək.
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={cancelDeleteProduct}>Ləğv et</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmDeleteProduct}>Sil</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsTab;
