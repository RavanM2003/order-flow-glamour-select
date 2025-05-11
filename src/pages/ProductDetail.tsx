import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { DollarSign, ChevronRight, ShoppingCart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const products = [
  {
    id: "1",
    title: "Moisturizer Cream",
    description: "Hydrating face cream for daily use with natural ingredients that nourish and protect your skin. Suitable for all skin types and provides 24-hour hydration.",
    longDescription: "Our premium Moisturizer Cream is formulated with hyaluronic acid, ceramides, and natural plant extracts to provide intense hydration that lasts all day. This lightweight, non-greasy formula absorbs quickly into the skin, creating a protective barrier that prevents moisture loss while allowing your skin to breathe. Rich in antioxidants, our moisturizer helps protect your skin from environmental stressors and free radical damage. The unique blend of ingredients works to improve skin texture, reduce the appearance of fine lines, and promote a healthy, radiant complexion. Suitable for all skin types, including sensitive skin, this fragrance-free cream can be used both morning and night as part of your daily skincare routine.",
    image: "moisturizer.jpg",
    price: 45,
    size: "50ml",
    ingredients: "Water, Glycerin, Caprylic/Capric Triglyceride, Cetearyl Alcohol, Ceteareth-20, Sodium Hyaluronate, Ceramide NP, Aloe Barbadensis Leaf Juice, Tocopheryl Acetate, Panthenol, Allantoin, Butyrospermum Parkii (Shea) Butter, Simmondsia Chinensis (Jojoba) Seed Oil, Phenoxyethanol, Ethylhexylglycerin.",
    directions: "Apply a small amount to clean, dry skin morning and evening. Gently massage using upward motions until fully absorbed. For best results, use after cleansing and applying serums.",
    category: "Skin Care",
    relatedServices: [
      { id: 1, name: "Facial Treatment", price: 150 }
    ]
  },
  {
    id: "2",
    title: "Anti-Aging Serum",
    description: "Premium anti-aging formula with collagen that reduces fine lines and wrinkles. Our advanced formula boosts skin elasticity and promotes a youthful appearance.",
    longDescription: "Our revolutionary Anti-Aging Serum combines the power of retinol, peptides, and collagen to effectively target multiple signs of aging. This potent formula penetrates deep into the skin to stimulate collagen production, improve elasticity, and reduce the appearance of fine lines and wrinkles. Enriched with vitamin C, this serum brightens your complexion and helps fade dark spots and discoloration for a more even skin tone. Hyaluronic acid provides intense hydration, plumping the skin and creating a smoother appearance. With regular use, you'll notice firmer, more youthful-looking skin with improved texture and radiance. The lightweight, fast-absorbing formula is designed to work effectively without causing irritation, making it suitable for most skin types.",
    image: "serum.jpg",
    price: 75,
    size: "30ml",
    ingredients: "Water, Propylene Glycol, Glycerin, Retinol, Palmitoyl Tripeptide-1, Palmitoyl Tetrapeptide-7, Sodium Hyaluronate, Hydrolyzed Collagen, Ascorbic Acid, Tocopheryl Acetate, Niacinamide, Panthenol, Allantoin, Phenoxyethanol, Ethylhexylglycerin.",
    directions: "Apply 2-3 drops to clean, dry skin in the evening. Gently pat into skin and allow to absorb before applying moisturizer. Start using 2-3 times per week, gradually increasing to nightly use as tolerated. Always use sunscreen during daytime when using this product.",
    category: "Skin Care",
    relatedServices: [
      { id: 1, name: "Facial Treatment", price: 150 }
    ]
  },
  {
    id: "3",
    title: "Hair Care Kit",
    description: "Complete kit for healthy hair including shampoo, conditioner, and leave-in treatment. Specially formulated to repair damaged hair and add shine and volume.",
    longDescription: "Our comprehensive Hair Care Kit contains everything you need for salon-quality hair at home. This professional-grade set includes a sulfate-free shampoo that gently cleanses while maintaining hair's natural oils, a deep conditioning treatment that repairs and strengthens damaged strands, and a leave-in treatment that provides heat protection and enhances shine. Formulated with keratin, argan oil, and botanical extracts, these products work together to transform dry, damaged hair into soft, smooth, and manageable locks. Regular use helps prevent split ends, reduces frizz, and protects color-treated hair from fading. Suitable for all hair types, this kit is especially beneficial for those with dry, damaged, or chemically treated hair who want to restore their hair's health and vitality.",
    image: "haircare.jpg",
    price: 60,
    size: "Shampoo: 250ml, Conditioner: 250ml, Leave-in Treatment: 100ml",
    ingredients: "Shampoo: Water, Sodium Cocoyl Isethionate, Cocamidopropyl Betaine, Sodium Lauroyl Sarcosinate, Glycerin, Panthenol, Hydrolyzed Keratin, Argania Spinosa Kernel Oil, Phenoxyethanol, Ethylhexylglycerin. Conditioner: Water, Cetearyl Alcohol, Behentrimonium Chloride, Glycerin, Panthenol, Hydrolyzed Keratin, Argania Spinosa Kernel Oil, Phenoxyethanol, Ethylhexylglycerin.",
    directions: "Shampoo: Apply to wet hair, massage gently into scalp and hair, rinse thoroughly. Conditioner: After shampooing, apply generously to mid-lengths and ends, leave for 2-3 minutes, then rinse. Leave-in Treatment: Apply to damp, towel-dried hair, focusing on mid-lengths and ends. Style as usual.",
    category: "Hair Care",
    relatedServices: [
      { id: 4, name: "Hair Styling", price: 80 }
    ]
  },
  // Additional products would be added here
];

const ProductDetail = () => {
  const { id } = useParams<{id: string}>();
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12 text-center">
          <h1 className="text-4xl font-bold text-glamour-800 mb-6">Product Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button className="bg-glamour-700 hover:bg-glamour-800" asChild>
            <Link to="/products">Browse All Products</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-2/3">
            <h1 className="text-4xl font-bold text-glamour-800 mb-4">{product.title}</h1>
            
            <div className="flex items-center space-x-6 mb-6">
              <div className="text-sm bg-glamour-100 text-glamour-800 px-3 py-1 rounded-full">
                {product.category}
              </div>
              <div className="flex items-center text-glamour-700 font-semibold text-xl">
                <DollarSign className="mr-1 h-5 w-5" />
                <span>{product.price}</span>
              </div>
            </div>
            
            <div className="bg-gray-200 h-80 rounded-lg mb-8 flex items-center justify-center">
              <p className="text-glamour-600">Product Image</p>
            </div>
            
            <div className="prose max-w-none mb-8">
              <h2 className="text-2xl font-semibold text-glamour-800 mb-4">Description</h2>
              <p className="text-gray-700 mb-6">{product.longDescription || product.description}</p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-glamour-800 mb-3">Details</h3>
                  <ul className="space-y-2">
                    <li><span className="font-medium">Size:</span> {product.size}</li>
                    <li><span className="font-medium">Category:</span> {product.category}</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-glamour-800 mb-3">How to Use</h3>
                  <p className="text-gray-700">{product.directions}</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-glamour-800 mb-3">Ingredients</h3>
              <p className="text-gray-700 text-sm">{product.ingredients}</p>
            </div>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              {product.relatedServices && product.relatedServices.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-glamour-800 mt-8 mb-4">Related Services</h3>
                  <div className="space-y-4">
                    {product.relatedServices.map(service => (
                      <div key={service.id} className="border rounded-md p-4">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">{service.name}</h4>
                          <span className="text-glamour-700 font-semibold">${service.price}</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link to={`/services/${service.id}`}>
                            View Service
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              <div className="mt-8 p-4 bg-glamour-50 rounded-md">
                <h4 className="font-semibold text-glamour-800 mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-4">Have questions about this product? Our beauty experts are here to help!</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
