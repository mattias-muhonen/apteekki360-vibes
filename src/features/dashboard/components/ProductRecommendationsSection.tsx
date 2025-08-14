import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent } from '../../../components/ui';
import type { Product } from '../../../products';
import { products } from '../../../products';
import type { LabEntry } from '../../../services/openai';
import OpenAI from 'openai';

interface ProductRecommendationsSectionProps {
  recommendations: Product[];
  labResults?: LabEntry[];
}

const ProductRecommendationsSection: React.FC<ProductRecommendationsSectionProps> = ({
  recommendations,
  labResults = []
}) => {
  const [aiRecommendedProducts, setAiRecommendedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBasedOnInfo, setShowBasedOnInfo] = useState(false);
  const [showMoreProducts, setShowMoreProducts] = useState(false);
  const [allRecommendations, setAllRecommendations] = useState<Product[]>([]);

  // Filter abnormal lab results
  const abnormalLabResults = labResults.filter(result => result.status !== 'Normal');
  const allResultsNormal = labResults.length > 0 && abnormalLabResults.length === 0;

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showBasedOnInfo) {
        const target = event.target as Element;
        if (!target.closest('.info-tooltip') && !target.closest('.info-button')) {
          setShowBasedOnInfo(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBasedOnInfo]);

  useEffect(() => {
    if (abnormalLabResults.length > 0) {
      getAIProductRecommendations();
    }
  }, [abnormalLabResults.length]);

  const getAIProductRecommendations = async () => {
    if (abnormalLabResults.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });

      // Create a detailed prompt with lab results and available products
      const labSummary = abnormalLabResults.map(result => 
        `${result.test}: ${result.result} (${result.status}, reference: ${result.referenceRange})`
      ).join('\n');

      const productNames = products.map(p => p.name).join('\n');

      const prompt = `Based on these abnormal lab results:
${labSummary}

From this list of available products, recommend exactly 6 products that would be most beneficial:
${productNames}

Respond with only the exact product names, one per line, no additional text or formatting. Choose products that are most relevant to improving these specific lab values.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a health expert recommending products based on lab results. Respond only with exact product names from the provided list, one per line.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.3
      });

      const aiResponse = response.choices[0]?.message?.content?.trim();
      
      if (aiResponse) {
        const recommendedProductNames = aiResponse.split('\n').map(name => name.trim()).filter(name => name);
        
        // Find the actual product objects
        const recommendedProducts = recommendedProductNames
          .map(name => products.find(p => p.name === name))
          .filter((product): product is Product => product !== undefined)
          .slice(0, 6); // Get up to 6 products

        setAllRecommendations(recommendedProducts);
        setAiRecommendedProducts(recommendedProducts.slice(0, 2)); // Show first 2 initially
      } else {
        throw new Error('No recommendations received');
      }

    } catch (error) {
      console.error('Error getting AI product recommendations:', error);
      setError('Unable to get personalized recommendations');
      
      // Fallback to manual recommendations based on common issues
      const fallbackProducts = getFallbackRecommendations(abnormalLabResults);
      setAllRecommendations(fallbackProducts);
      setAiRecommendedProducts(fallbackProducts.slice(0, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackRecommendations = (abnormalResults: LabEntry[]): Product[] => {
    const recommendations: Product[] = [];
    
    // Check for specific conditions and recommend relevant products
    for (const result of abnormalResults) {
      const testLower = result.test.toLowerCase();
      
      if (testLower.includes('cholesterol') && result.status === 'High') {
        // Recommend omega-3 or heart health products
        const omega = products.find(p => p.name.includes('Omegalive'));
        if (omega && !recommendations.find(r => r.name === omega.name)) {
          recommendations.push(omega);
        }
      }
      
      if (testLower.includes('vitamin d') && result.status === 'Low') {
        // Recommend vitamin D products
        const vitaminD = products.find(p => p.name.includes('DeviSol'));
        if (vitaminD && !recommendations.find(r => r.name === vitaminD.name)) {
          recommendations.push(vitaminD);
        }
      }
      
      if (testLower.includes('hemoglobin') && result.status === 'Low') {
        // Recommend iron supplements
        const iron = products.find(p => p.name.includes('Sideral') || p.name.includes('Ferrodan'));
        if (iron && !recommendations.find(r => r.name === iron.name)) {
          recommendations.push(iron);
        }
      }
    }
    
    // Add more general health products to reach 6 recommendations
    const additionalProducts = [
      'Multivita Plus Monivitamiini',
      'Harmonia Ksm66',
      'Puhdas+ Vahva Ashwagandha + Bioperine 150mg',
      'Puhdas+ Quattro Magnesium',
      'Minisun Monivitamiini Vahva',
      'Puhdas+ Vahva Kurkumiini + Bioperine 250mg'
    ];
    
    for (const productName of additionalProducts) {
      if (recommendations.length >= 6) break;
      const product = products.find(p => p.name === productName);
      if (product && !recommendations.find(r => r.name === product.name)) {
        recommendations.push(product);
      }
    }
    
    return recommendations.slice(0, 6);
  };

  // Create blood test monitoring recommendation
  const bloodTestRecommendation: Product = {
    name: "Blood Test Monitoring",
    price: "From 49,90 €",
    description: "Regular blood work monitoring is essential for tracking your health progress and catching potential issues early. Schedule comprehensive testing every 6-12 months to maintain optimal health.",
    image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&auto=format"
  };

  // Show AI recommendations if we have abnormal results, otherwise show original recommendations
  const baseProducts = abnormalLabResults.length > 0 
    ? (showMoreProducts ? allRecommendations : aiRecommendedProducts)
    : (showMoreProducts ? recommendations : recommendations.slice(0, 2));
  
  // Always add blood test as first recommendation, then show other products
  const displayProducts = baseProducts.length > 0 
    ? [bloodTestRecommendation, ...baseProducts]
    : [bloodTestRecommendation];

  const handleShowMoreProducts = () => {
    if (abnormalLabResults.length > 0) {
      // For abnormal results, show all AI recommendations
      setShowMoreProducts(true);
    } else {
      // For normal results, show all original recommendations
      setShowMoreProducts(true);
    }
  };

  const hasMoreProducts = abnormalLabResults.length > 0 
    ? allRecommendations.length > 2
    : recommendations.length > 2;

  if (displayProducts.length === 0 && !isLoading && !error && !allResultsNormal) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          {abnormalLabResults.length > 0 ? 'Personalized Recommendations' : 'Recommended for You'}
        </h2>
        <p className="text-gray-600">
          {abnormalLabResults.length > 0 
            ? `AI-selected products based on your lab results that need attention`
            : 'Personalized product suggestions based on your health metrics'
          }
        </p>
      </div>

      {isLoading && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Getting personalized recommendations...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      )}

      {displayProducts.length > 0 && !isLoading && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 relative">
          {abnormalLabResults.length > 0 && (
            <>
              {/* Information Icon */}
              <button
                onClick={() => setShowBasedOnInfo(!showBasedOnInfo)}
                className="info-button absolute bottom-4 right-4 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-lg z-10"
                aria-label="Show recommendation details"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </button>

              {/* Based On Information Tooltip */}
              {showBasedOnInfo && (
                <div className="info-tooltip absolute bottom-16 right-4 bg-white p-4 rounded-lg shadow-xl border border-gray-200 z-20 max-w-xs">
                  <div className="text-sm">
                    <div className="font-semibold text-gray-800 mb-2">Recommendations based on:</div>
                    <div className="text-gray-600 space-y-1">
                      {abnormalLabResults.map((result, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="font-medium">{result.test}:</span>
                          <span className="text-red-600">{result.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Triangle pointer */}
                  <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-white transform rotate-45 border-r border-b border-gray-200"></div>
                </div>
              )}
            </>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProducts.map((product, index) => (
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
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                    {index === 0 && product.name === "Blood Test Monitoring" && (
                      <span className="inline-flex items-center gap-1">
                        🩸 {product.name}
                      </span>
                    )}
                    {!(index === 0 && product.name === "Blood Test Monitoring") && product.name}
                  </h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-3 leading-relaxed flex-1">
                    {product.description ? 
                      product.description.substring(0, 120) + '...' : 
                      'Quality health product to support your wellness journey'
                    }
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-green-600">{product.price}</span>
                    {product.name === "Blood Test Monitoring" ? (
                      <Button size="sm" variant="outline" className="bg-blue-50 border-blue-200 hover:bg-blue-100">
                        Schedule Test
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/catalog?search=${encodeURIComponent(product.name)}`}>
                          View Product
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6">
            {!showMoreProducts && hasMoreProducts ? (
              <Button variant="outline" onClick={handleShowMoreProducts}>
                More recommendations
              </Button>
            ) : showMoreProducts ? (
              <Button variant="outline" onClick={() => setShowMoreProducts(false)}>
                Show less
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/catalog">Browse catalog</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductRecommendationsSection;
