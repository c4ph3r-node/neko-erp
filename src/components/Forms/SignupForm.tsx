import React, { useState } from 'react';
import { Building2, User, Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import Button from '../UI/Button';

interface SignupFormProps {
  onSubmit: (signupData: any) => void;
  onCancel: () => void;
}

const kenyanCounties = [
  'Nairobi', 'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita Taveta', 'Garissa', 'Wajir', 'Mandera',
  'Marsabit', 'Isiolo', 'Meru', 'Tharaka Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri',
  'Kirinyaga', 'Murang\'a', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo Marakwet',
  'Nandi', 'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma',
  'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira'
];

const businessTypes = [
  'Sole Proprietorship',
  'Partnership',
  'Limited Liability Company (LLC)',
  'Private Limited Company',
  'Public Limited Company',
  'Non-Governmental Organization (NGO)',
  'Cooperative Society',
  'Branch of Foreign Company'
];

const industries = [
  'Agriculture & Farming',
  'Manufacturing',
  'Technology & Software',
  'Retail & Wholesale',
  'Construction & Real Estate',
  'Healthcare & Medical',
  'Education & Training',
  'Financial Services',
  'Transportation & Logistics',
  'Hospitality & Tourism',
  'Professional Services',
  'Media & Entertainment',
  'Energy & Utilities',
  'Mining & Extraction',
  'Import & Export',
  'Other'
];

export default function SignupForm({ onSubmit, onCancel }: SignupFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Company Information
    companyName: '',
    businessType: '',
    industry: '',
    kraPin: '',
    vatNumber: '',
    employeeCount: '',
    
    // Address Information
    street: '',
    city: '',
    county: '',
    postalCode: '',
    
    // Subscription
    selectedPlan: 'professional',
    trialDays: 30,
    
    // Preferences
    currency: 'KES',
    timezone: 'Africa/Nairobi',
    language: 'en',
    
    // Terms
    agreeToTerms: false,
    agreeToMarketing: false
  });

  const [errors, setErrors] = useState<any>({});

  const validateStep = (step: number) => {
    const newErrors: any = {};

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (formData.password && formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    }

    if (step === 2) {
      if (!formData.companyName) newErrors.companyName = 'Company name is required';
      if (!formData.businessType) newErrors.businessType = 'Business type is required';
      if (!formData.industry) newErrors.industry = 'Industry is required';
      if (!formData.employeeCount) newErrors.employeeCount = 'Employee count is required';
    }

    if (step === 3) {
      if (!formData.street) newErrors.street = 'Street address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.county) newErrors.county = 'County is required';
      if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';
    }

    if (step === 4) {
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      // Generate tenant data
      const tenantData = {
        ...formData,
        tenantId: `tenant_${Date.now()}`,
        subdomain: formData.companyName.toLowerCase().replace(/[^a-z0-9]/g, ''),
        trialStartDate: new Date(),
        trialEndDate: new Date(Date.now() + formData.trialDays * 24 * 60 * 60 * 1000),
        status: 'trial',
        createdAt: new Date()
      };
      
      onSubmit(tenantData);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Personal</span>
          <span>Company</span>
          <span>Address</span>
          <span>Review</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your.email@company.co.ke"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+254 7XX XXX XXX"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Minimum 8 characters"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Company Information */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">Company Information</h3>
              <p className="text-gray-600">Tell us about your business</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => updateFormData('companyName', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.companyName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Your Company Ltd"
              />
              {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Type *</label>
                <select
                  value={formData.businessType}
                  onChange={(e) => updateFormData('businessType', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.businessType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Business Type</option>
                  {businessTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                <select
                  value={formData.industry}
                  onChange={(e) => updateFormData('industry', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.industry ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
                {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">KRA PIN</label>
                <input
                  type="text"
                  value={formData.kraPin}
                  onChange={(e) => updateFormData('kraPin', e.target.value.toUpperCase())}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="P051234567A"
                  maxLength={11}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">VAT Number</label>
                <input
                  type="text"
                  value={formData.vatNumber}
                  onChange={(e) => updateFormData('vatNumber', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="VAT001234567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Employees *</label>
              <select
                value={formData.employeeCount}
                onChange={(e) => updateFormData('employeeCount', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.employeeCount ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Employee Count</option>
                <option value="1-5">1-5 employees</option>
                <option value="6-15">6-15 employees</option>
                <option value="16-50">16-50 employees</option>
                <option value="51-100">51-100 employees</option>
                <option value="101-500">101-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
              {errors.employeeCount && <p className="text-red-500 text-sm mt-1">{errors.employeeCount}</p>}
            </div>
          </div>
        )}

        {/* Step 3: Address Information */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">Business Address</h3>
              <p className="text-gray-600">Where is your business located?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => updateFormData('street', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.street ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Building name, street name"
              />
              {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City/Town *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nairobi, Mombasa, Kisumu..."
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">County *</label>
                <select
                  value={formData.county}
                  onChange={(e) => updateFormData('county', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.county ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select County</option>
                  {kenyanCounties.map(county => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
                {errors.county && <p className="text-red-500 text-sm mt-1">{errors.county}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => updateFormData('postalCode', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.postalCode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="00100, 80100, 40100..."
              />
              {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
            </div>
          </div>
        )}

        {/* Step 4: Review & Terms */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">Review & Confirm</h3>
              <p className="text-gray-600">Review your information and start your free trial</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Personal Information</h4>
                <p className="text-gray-600">{formData.firstName} {formData.lastName}</p>
                <p className="text-gray-600">{formData.email}</p>
                <p className="text-gray-600">{formData.phone}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Company Information</h4>
                <p className="text-gray-600">{formData.companyName}</p>
                <p className="text-gray-600">{formData.businessType} • {formData.industry}</p>
                <p className="text-gray-600">{formData.employeeCount} employees</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Business Address</h4>
                <p className="text-gray-600">{formData.street}</p>
                <p className="text-gray-600">{formData.city}, {formData.county} {formData.postalCode}</p>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Your Free Trial</h4>
              <p className="text-blue-800">✓ 30 days free access to all Professional features</p>
              <p className="text-blue-800">✓ Full KRA compliance tools</p>
              <p className="text-blue-800">✓ Up to 15 users</p>
              <p className="text-blue-800">✓ Priority support</p>
              <p className="text-sm text-blue-700 mt-2">No credit card required. Cancel anytime.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => updateFormData('agreeToTerms', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                  I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> *
                </label>
              </div>
              {errors.agreeToTerms && <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>}
              
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreeToMarketing"
                  checked={formData.agreeToMarketing}
                  onChange={(e) => updateFormData('agreeToMarketing', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <label htmlFor="agreeToMarketing" className="ml-2 block text-sm text-gray-900">
                  I would like to receive product updates and marketing communications
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <div>
            {currentStep > 1 && (
              <Button variant="secondary" onClick={handlePrevious}>
                Previous
              </Button>
            )}
          </div>
          <div className="flex space-x-4">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            {currentStep < 4 ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="submit">
                Start Free Trial
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}