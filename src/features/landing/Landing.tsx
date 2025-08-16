
import { Link } from 'react-router-dom';
import Page from '../../components/Page';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui';

const Landing = () => (
  <Page>
    <div className="min-h-screen">
      {/* Hero Section */}
  <section className="bg-gradient-to-br from-[#53846aff] via-[#3a5c4d] to-[#254034] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Take control of your health
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-purple-100 leading-relaxed">
              Health360 is your holistic wellbeing navigator and companion
            </h2>
            <p className="text-lg md:text-xl mb-8 text-purple-100 leading-relaxed">
              Our aim is to provide a seamless, personalized experience that empowers you to understand your unique biological blueprint, make informed decisions, and consistently progress towards your health and longevity goals.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
              {/* AI Symptom Checker Card */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all duration-300">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-semibold">AI Symptom Checker</CardTitle>
                  <CardDescription className="text-purple-100">
                    Take our free health assessment to get personalized recommendations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    size="lg" 
                    asChild 
                    className="w-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600 transition-colors font-semibold"
                  >
                    <Link to="/chat">Start Assessment</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Lab Test Interpretation Card */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all duration-300">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-semibold">Lab Test Interpretation</CardTitle>
                  <CardDescription className="text-purple-100">
                    Register or log-in  and upload your lab results to get personalised AI-powered insights and recommendations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    size="lg" 
                    asChild 
                    className="w-full bg-white text-purple-600 hover:bg-gray-100 font-semibold"
                  >
                    <Link to="/dashboard">Upload Your Lab Test</Link>
                  </Button>
                </CardContent>
              </Card>
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
                <CardTitle className="text-xl">Private, Fast Answers</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Start with a quick, anonymous check—no account needed. Get clear, evidence-based guidance in just two minutes.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Personal Plans, Not Generic Advice</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your results and recommendations are tailored to your symptoms, goals, and lab data—not a one-size-fits-all script.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">All-in-One Care Pathway</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Book labs, chat with professionals, and access trusted products and services—all in one seamless platform.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Built for Real Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Move from confusion to action with step-by-step plans, reminders, and ongoing support—so you actually see results.
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
