import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent } from '../../../components/ui';
import type { Product } from '../../../products';

interface ProductRecommendationsSectionProps {
  recommendations: Product[];
}

const ProductRecommendationsSection: React.FC<ProductRecommendationsSectionProps> = ({
  recommendations
}) => {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
        <p className="text-gray-600">Personalized product suggestions based on your health metrics</p>
      </div>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.slice(0, 3).map((product, index) => (
            <Card key={index} className="h-full flex flex-col hover:shadow-lg transition-all duration-200 hover:scale-105 bg-white">
              <CardContent className="p-4 flex flex-col h-full">
                {product.image_url && (
                  <div className="aspect-square w-full mb-3 bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-xs text-gray-600 mb-3 line-clamp-3 leading-relaxed flex-1">
                  {product.description ? 
                    product.description.substring(0, 120) + '...' : 
                    'Quality health product to support your wellness journey'
                  }
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-bold text-green-600">{product.price}</span>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/catalog?search=${encodeURIComponent(product.name)}`}>
                      View Product
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6">
          <Button variant="outline" asChild>
            <Link to="/catalog">More products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductRecommendationsSection;
