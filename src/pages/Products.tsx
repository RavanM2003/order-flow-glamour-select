
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";

const Products = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  
  const products = [
    {
      id: 1,
      title: "Moisturizer Cream",
      description: "Hydrating face cream for daily use with natural ingredients that nourish and protect your skin. Suitable for all skin types and provides 24-hour hydration.",
      image: "moisturizer.jpg",
      price: 45,
      category: "Skin Care"
    },
    {
      id: 2,
      title: "Anti-Aging Serum",
      description: "Premium anti-aging formula with collagen that reduces fine lines and wrinkles. Our advanced formula boosts skin elasticity and promotes a youthful appearance.",
      image: "serum.jpg",
      price: 75,
      category: "Skin Care"
    },
    {
      id: 3,
      title: "Hair Care Kit",
      description: "Complete kit for healthy hair including shampoo, conditioner, and leave-in treatment. Specially formulated to repair damaged hair and add shine and volume.",
      image: "haircare.jpg",
      price: 60,
      category: "Hair Care"
    },
    {
      id: 4,
      title: "Facial Cleansing Gel",
      description: "Gentle cleansing gel that removes impurities without stripping natural oils. Perfect for daily use and suitable for sensitive skin.",
      image: "cleansing.jpg",
      price: 35,
      category: "Skin Care"
    },
    {
      id: 5,
      title: "Luxury Makeup Palette",
      description: "Versatile makeup palette with 12 eyeshadows, 2 blushes, and 2 highlighters. All colors are highly pigmented and long-lasting.",
      image: "palette.jpg",
      price: 85,
      category: "Makeup"
    },
    {
      id: 6,
      title: "Nail Care Set",
      description: "Complete nail care set including strengthening base coat, top coat, and nail oil. Keeps your nails healthy and strong between salon visits.",
      image: "nailcare.jpg",
      price: 40,
      category: "Nail Care"
    }
  ];
  
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <h1 className="text-4xl font-bold text-glamour-800 mb-2">Our Products</h1>
        <p className="text-lg text-gray-600 mb-6 max-w-3xl">
          Discover our premium selection of beauty products for your daily skincare and beauty routine.
        </p>
        
        <div className="flex mb-8">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <p className="text-glamour-600">Product Image</p>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold text-glamour-800">{product.title}</h2>
                  <div className="text-glamour-700 font-semibold">${product.price}</div>
                </div>
                <p className="text-sm text-glamour-600 mb-4">{product.category}</p>
                <p className="text-gray-600 mb-6 line-clamp-3">{product.description}</p>
                <Button className="w-full bg-glamour-700 hover:bg-glamour-800" asChild>
                  <Link to={`/products/${product.id}`}>
                    View Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No products found matching your search.</p>
            <Button 
              variant="link" 
              className="text-glamour-700" 
              onClick={() => setSearchTerm("")}
            >
              Clear search
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Products;
