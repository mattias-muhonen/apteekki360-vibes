import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Page from '../../components/Page';
import { Button, Input, Card, CardContent, CardFooter, CardHeader } from '../../components/ui';
import { Search, Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import productsData from '../../products';
import type { Product } from '../../products';

const Catalog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Convert the imported data to our Product interface
  const products: Product[] = productsData;

  // Extract categories from product names for filtering
  const categories = useMemo(() => {
    const categorySet = new Set(['all']);
    products.forEach(product => {
      if (product.name.toLowerCase().includes('stress') || product.name.toLowerCase().includes('sedix') || product.name.toLowerCase().includes('harmonia')) {
        categorySet.add('stress-sleep');
      } else if (product.name.toLowerCase().includes('tabletti') || product.name.toLowerCase().includes('mg')) {
        categorySet.add('medicine');
      } else if (product.name.toLowerCase().includes('antisept') || product.name.toLowerCase().includes('voide')) {
        categorySet.add('skincare');
      } else {
        categorySet.add('health-wellness');
      }
    });
    return Array.from(categorySet);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || (() => {
        const name = product.name.toLowerCase();
        switch (selectedCategory) {
          case 'stress-sleep':
            return name.includes('stress') || name.includes('sedix') || name.includes('harmonia') || name.includes('uni');
          case 'medicine':
            return name.includes('tabletti') || name.includes('mg') || name.includes('aspirin') || name.includes('panadol');
          case 'skincare':
            return name.includes('antisept') || name.includes('voide') || name.includes('geeli');
          case 'health-wellness':
            return !name.includes('stress') && !name.includes('tabletti') && !name.includes('antisept');
          default:
            return true;
        }
      })();

      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price.replace(/[^\d,]/g, '').replace(',', '.')) - 
                 parseFloat(b.price.replace(/[^\d,]/g, '').replace(',', '.'));
        case 'price-high':
          return parseFloat(b.price.replace(/[^\d,]/g, '').replace(',', '.')) - 
                 parseFloat(a.price.replace(/[^\d,]/g, '').replace(',', '.'));
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'all': return 'All Categories';
      case 'stress-sleep': return 'Stress & Sleep';
      case 'medicine': return 'Medicine';
      case 'skincare': return 'Skincare';
      case 'health-wellness': return 'Health & Wellness';
      default: return category;
    }
  };

  return (
    <Page 
      title="Product Catalog" 
      subtitle="Premium supplements and health products from Finnish pharmacy Apteekki360.fi"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {getCategoryDisplayName(category)}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredProducts.map((product, index) => (
            <Card key={index} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="p-0">
                <div className="aspect-square bg-white rounded-t-lg overflow-hidden flex items-center justify-center p-4">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={cn(
                    "w-full h-full flex items-center justify-center text-gray-400 bg-white",
                    product.image_url ? "hidden" : "flex"
                  )}>
                    <div className="text-center">
                      <div className="text-4xl mb-2">📦</div>
                      <div className="text-sm">No image</div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 leading-tight">
                  {product.name}
                </h3>
                
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    ({Math.floor(Math.random() * 200) + 50} reviews)
                  </span>
                </div>

                {product.description && (
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {product.description.length > 120 
                      ? `${product.description.substring(0, 120)}...` 
                      : product.description
                    }
                  </p>
                )}

                <div className="mt-auto">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    {product.price}
                  </div>
                  {product.price.includes('alk.') && (
                    <div className="text-sm text-gray-500">Starting from</div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button className="w-full" size="sm">
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Member Benefits Section */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Become a Member</h2>
            <p className="text-lg mb-6 opacity-90">
              Save 15-25% on all products with exclusive member pricing
            </p>
            <Button asChild variant="outline" className="bg-white text-purple-600 hover:bg-gray-100">
              <Link to="/tiers">View Membership</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link to="/booking">Book Lab Test</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard">View Dashboard</Link>
          </Button>
        </div>
      </div>
    </Page>
  );
};

export default Catalog;
