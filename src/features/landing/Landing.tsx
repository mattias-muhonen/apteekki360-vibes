
import { Link } from 'react-router-dom';
import Page from '../../components/Page';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui';

const Landing = () => (
  <Page>
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Optimize Your Health with AI-Powered Insights
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100 leading-relaxed">
              Get personalized health assessments, expert recommendations, and track your progress 
              with Health360's comprehensive men's health platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" asChild className="bg-white text-purple-600 hover:bg-gray-100">
                <Link to="/chat">Start Free Assessment</Link>
              </Button>
              <Button size="lg" asChild className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600 transition-colors">
                <Link to="/catalog">Browse Products</Link>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {['Fatigue & Low Energy', 'Testosterone Issues', 'Sleep Problems', 'Stress Management', 'Nutrition Guidance'].map((symptom) => (
                <span key={symptom} className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Health360?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the future of personalized healthcare with our comprehensive health optimization platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="text-4xl mb-4">🤖</div>
                <CardTitle className="text-xl">AI Health Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get personalized insights through our intelligent chat system that understands your symptoms and health goals.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="text-4xl mb-4">🧪</div>
                <CardTitle className="text-xl">Lab Results Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Monitor your testosterone levels, energy scores, and other key health metrics with comprehensive tracking tools.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="text-4xl mb-4">💊</div>
                <CardTitle className="text-xl">Finnish Pharmacy Products</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access authentic supplements and health products from trusted Finnish pharmacy Apteekki360.fi.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="text-4xl mb-4">📊</div>
                <CardTitle className="text-xl">Progress Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track your health journey with detailed dashboards and progress reports tailored to your goals.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Thousands</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <p className="text-gray-600 mb-4 italic">
                  "Health360 helped me identify my energy issues and find the right supplements. My testosterone levels improved significantly!"
                </p>
                <div className="font-semibold text-gray-900">- Mikko, 34</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <p className="text-gray-600 mb-4 italic">
                  "The AI assessment was incredibly accurate. The recommendations were spot-on and easy to follow."
                </p>
                <div className="font-semibold text-gray-900">- Jukka, 41</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <p className="text-gray-600 mb-4 italic">
                  "Finally, a platform that understands men's health. The lab tracking feature is game-changing."
                </p>
                <div className="font-semibold text-gray-900">- Antti, 28</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Health360</h3>
              <p className="text-gray-400">Your comprehensive men's health optimization platform.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-2">
                <Link to="/chat" className="block text-gray-400 hover:text-white transition-colors">Health Assessment</Link>
                <Link to="/dashboard" className="block text-gray-400 hover:text-white transition-colors">Dashboard</Link>
                <Link to="/catalog" className="block text-gray-400 hover:text-white transition-colors">Products</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2">
                <Link to="/booking" className="block text-gray-400 hover:text-white transition-colors">Book Tests</Link>
                <Link to="/insights" className="block text-gray-400 hover:text-white transition-colors">Health Insights</Link>
                <Link to="/tiers" className="block text-gray-400 hover:text-white transition-colors">Membership</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <a href="#contact" className="block text-gray-400 hover:text-white transition-colors">Contact Us</a>
                <a href="#privacy" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#terms" className="block text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">&copy; 2025 Health360. All rights reserved. In partnership with Apteekki360.fi</p>
          </div>
        </div>
      </footer>
    </div>
  </Page>
);

export default Landing;
