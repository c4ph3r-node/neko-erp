import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Star, Users, Building2, Shield, Globe, Zap, BarChart3, CreditCard, Play, Menu, X, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import SignupForm from '../components/Forms/SignupForm';
import DemoRequestForm from '../components/Forms/DemoRequestForm';

const features = [
  {
    icon: BarChart3,
    title: 'Complete Financial Management',
    description: 'Full accounting suite with General Ledger, AR/AP, Banking, and KRA compliance for Kenyan businesses.'
  },
  {
    icon: Users,
    title: 'Customer & Vendor Management',
    description: 'Comprehensive CRM with customer profiles, credit management, and vendor relationship tracking.'
  },
  {
    icon: Building2,
    title: 'Multi-Tenant Architecture',
    description: 'Secure, scalable platform supporting multiple companies with isolated data and custom configurations.'
  },
  {
    icon: Shield,
    title: 'KRA Compliance & Tax Management',
    description: 'Built-in Kenyan tax compliance with VAT, PAYE, NHIF, NSSF calculations and eTIMS integration.'
  },
  {
    icon: Zap,
    title: 'Workflow Automation',
    description: 'Automated approval workflows, notifications, and business process management.'
  },
  {
    icon: Globe,
    title: 'Multi-Currency & Localization',
    description: 'Support for multiple currencies, languages, and regional business requirements.'
  }
];

const testimonials = [
  {
    name: 'Sarah Wanjiku',
    company: 'Nairobi Tech Solutions',
    role: 'CEO',
    content: 'NekoERP transformed our financial management. The KRA compliance features saved us countless hours during tax season.',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
  },
  {
    name: 'James Mwangi',
    company: 'Mombasa Manufacturing Ltd',
    role: 'Finance Director',
    content: 'The inventory management and manufacturing modules are exactly what we needed. Real-time stock tracking is a game changer.',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
  },
  {
    name: 'Grace Akinyi',
    company: 'Kisumu Retail Group',
    role: 'Operations Manager',
    content: 'The multi-location support and real-time reporting help us manage our 5 stores efficiently. Highly recommended!',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
  }
];

const pricingPlans = [
  {
    name: 'Starter',
    price: 'KES 2,999',
    period: 'per month',
    description: 'Perfect for small businesses and startups',
    features: [
      'Up to 3 users',
      'Basic accounting & invoicing',
      'Customer & vendor management',
      'KRA compliance tools',
      'Email support',
      '5GB storage'
    ],
    popular: false
  },
  {
    name: 'Professional',
    price: 'KES 7,999',
    period: 'per month',
    description: 'Ideal for growing businesses',
    features: [
      'Up to 15 users',
      'Full accounting suite',
      'Inventory management',
      'Project tracking',
      'Advanced reporting',
      'Priority support',
      '50GB storage',
      'API access'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'KES 19,999',
    period: 'per month',
    description: 'For large organizations',
    features: [
      'Unlimited users',
      'All features included',
      'Manufacturing (MRP)',
      'Multi-location support',
      'Custom integrations',
      'Dedicated support',
      'Unlimited storage',
      'White-label options'
    ],
    popular: false
  }
];

export default function LandingPage() {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleStartTrial = () => {
    setShowSignupModal(true);
  };

  const handleRequestDemo = () => {
    setShowDemoModal(true);
  };

  const handleSignupSubmit = (signupData: any) => {
    // Create new tenant account with trial tracking
    const tenantData = {
      ...signupData,
      id: `tenant_${Date.now()}`,
      subdomain: signupData.companyName.toLowerCase().replace(/[^a-z0-9]/g, ''),
      status: 'trial',
      plan: 'professional',
      trialStartDate: new Date(),
      trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      createdAt: new Date(),
      isActive: true
    };
    
    // Store tenant data in localStorage for demo purposes
    localStorage.setItem('tenantData', JSON.stringify(tenantData));
    localStorage.setItem('user', JSON.stringify({
      id: Date.now().toString(),
      email: signupData.email,
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      role: 'admin',
      tenantId: tenantData.id,
      permissions: ['all']
    }));
    
    setShowSignupModal(false);
    alert('Account created successfully! Welcome to your 30-day free trial!');
    window.location.href = '/dashboard';
  };

  const handleDemoSubmit = (demoData: any) => {
    console.log('Demo request submitted:', demoData);
    setShowDemoModal(false);
    alert('Demo request submitted! Our team will contact you within 24 hours.');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">NekoERP</h1>
                <p className="text-xs text-blue-600">Kenyan Business Suite</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 font-medium">Testimonials</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 font-medium">Contact</a>
              <Button variant="outline" onClick={() => navigate('/login')} className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Login
              </Button>
              <Button variant="secondary" onClick={handleRequestDemo}>
                Request Demo
              </Button>
              <Button onClick={handleStartTrial}>
                Start Free Trial
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-4">
                <a href="#features" className="block text-gray-600 hover:text-gray-900 font-medium">Features</a>
                <a href="#pricing" className="block text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
                <a href="#testimonials" className="block text-gray-600 hover:text-gray-900 font-medium">Testimonials</a>
                <a href="#contact" className="block text-gray-600 hover:text-gray-900 font-medium">Contact</a>
                <div className="space-y-2">
                  <Button variant="outline" onClick={() => navigate('/login')} className="w-full flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
                  <Button variant="secondary" onClick={handleRequestDemo} className="w-full">
                    Request Demo
                  </Button>
                  <Button onClick={handleStartTrial} className="w-full">
                    Start Free Trial
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Complete ERP Solution for
              <span className="text-blue-600 block">Kenyan Businesses</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your business operations with our comprehensive ERP platform. 
              Built specifically for Kenyan businesses with full KRA compliance, 
              multi-currency support, and advanced automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleStartTrial} className="text-lg px-8 py-4">
                Start 30-Day Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="secondary" size="lg" onClick={handleRequestDemo} className="text-lg px-8 py-4">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Full access to all features • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything Your Business Needs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive business management tools designed specifically for the Kenyan market
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your business size and needs. All plans include KRA compliance tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-xl shadow-sm border-2 p-8 relative ${
                plan.popular ? 'border-blue-500' : 'border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  variant={plan.popular ? 'primary' : 'secondary'}
                  onClick={handleStartTrial}
                >
                  Start Free Trial
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Kenyan Businesses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our customers say about transforming their business operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-blue-600">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of Kenyan businesses already using NekoERP to streamline their operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-8 py-4"
              onClick={handleStartTrial}
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              className="border-white text-white hover:bg-blue-700 text-lg px-8 py-4"
              onClick={handleRequestDemo}
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">NekoERP</h3>
                  <p className="text-xs text-blue-400">Kenyan Business Suite</p>
                </div>
              </div>
              <p className="text-gray-400">
                Comprehensive ERP solution built specifically for Kenyan businesses with full KRA compliance.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Support</a></li>
                <li><a href="#" className="hover:text-white">Training</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 NekoERP. All rights reserved. Built for Kenyan businesses.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <Modal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        title="Start Your Free Trial"
        size="lg"
      >
        <SignupForm
          onSubmit={handleSignupSubmit}
          onCancel={() => setShowSignupModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        title="Request a Demo"
        size="lg"
      >
        <DemoRequestForm
          onSubmit={handleDemoSubmit}
          onCancel={() => setShowDemoModal(false)}
        />
      </Modal>
    </div>
  );
}