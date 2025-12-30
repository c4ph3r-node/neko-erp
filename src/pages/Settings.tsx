import React, { useState, useEffect } from 'react';
import { Save, Building2, Users, Lock, CreditCard, Globe, Clock, Languages, DollarSign, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useTenant } from '../contexts/TenantContext';
import { useAuth } from '../contexts/AuthContext';
import { useGlobalState } from '../contexts/GlobalStateContext';

const worldCurrencies = [
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KES' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' }
];

const worldLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' }
];

const worldTimezones = [
  { value: 'America/New_York', label: '(UTC-5) Eastern Time - New York' },
  { value: 'America/Chicago', label: '(UTC-6) Central Time - Chicago' },
  { value: 'America/Denver', label: '(UTC-7) Mountain Time - Denver' },
  { value: 'America/Los_Angeles', label: '(UTC-8) Pacific Time - Los Angeles' },
  { value: 'Europe/London', label: '(UTC+0) Greenwich Mean Time - London' },
  { value: 'Europe/Paris', label: '(UTC+1) Central European Time - Paris' },
  { value: 'Europe/Berlin', label: '(UTC+1) Central European Time - Berlin' },
  { value: 'Europe/Rome', label: '(UTC+1) Central European Time - Rome' },
  { value: 'Europe/Madrid', label: '(UTC+1) Central European Time - Madrid' },
  { value: 'Europe/Amsterdam', label: '(UTC+1) Central European Time - Amsterdam' },
  { value: 'Europe/Stockholm', label: '(UTC+1) Central European Time - Stockholm' },
  { value: 'Europe/Moscow', label: '(UTC+3) Moscow Standard Time - Moscow' },
  { value: 'Asia/Tokyo', label: '(UTC+9) Japan Standard Time - Tokyo' },
  { value: 'Asia/Shanghai', label: '(UTC+8) China Standard Time - Shanghai' },
  { value: 'Asia/Hong_Kong', label: '(UTC+8) Hong Kong Time - Hong Kong' },
  { value: 'Asia/Singapore', label: '(UTC+8) Singapore Standard Time - Singapore' },
  { value: 'Asia/Seoul', label: '(UTC+9) Korea Standard Time - Seoul' },
  { value: 'Asia/Mumbai', label: '(UTC+5:30) India Standard Time - Mumbai' },
  { value: 'Asia/Dubai', label: '(UTC+4) Gulf Standard Time - Dubai' },
  { value: 'Australia/Sydney', label: '(UTC+10) Australian Eastern Time - Sydney' },
  { value: 'Australia/Melbourne', label: '(UTC+10) Australian Eastern Time - Melbourne' },
  { value: 'Pacific/Auckland', label: '(UTC+12) New Zealand Standard Time - Auckland' },
  { value: 'America/Toronto', label: '(UTC-5) Eastern Time - Toronto' },
  { value: 'America/Vancouver', label: '(UTC-8) Pacific Time - Vancouver' },
  { value: 'America/Sao_Paulo', label: '(UTC-3) Brasilia Time - São Paulo' },
  { value: 'America/Mexico_City', label: '(UTC-6) Central Time - Mexico City' },
  { value: 'Africa/Cairo', label: '(UTC+2) Eastern European Time - Cairo' },
  { value: 'Africa/Johannesburg', label: '(UTC+2) South Africa Standard Time - Johannesburg' }
];

export default function Settings() {
  const { tenant } = useTenant();
  const { user } = useAuth();
  const { showNotification, dispatch } = useGlobalState();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('company');

  // Load settings from localStorage or use defaults
  const loadSettings = () => {
    const savedSettings = localStorage.getItem('erpSettings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    return {
      company: {
        name: tenant?.name || 'Acme Corporation',
        industry: 'Technology',
        currency: tenant?.settings?.currency || 'USD',
        language: tenant?.settings?.language || 'en',
        timezone: tenant?.settings?.timezone || 'America/New_York',
        fiscalYearStart: tenant?.settings?.fiscalYearStart || '01/01',
        dateFormat: tenant?.settings?.dateFormat || 'MM/dd/yyyy',
        address: '123 Business Street, City, State 12345',
        phone: '+1 (555) 123-4567',
        email: 'contact@company.com',
        website: 'https://company.com',
        taxNumber: 'TAX123456789'
      },
      security: {
        sessionTimeout: 30,
        loginNotifications: true,
        twoFactorRequired: false,
        passwordExpiry: 90,
        maxLoginAttempts: 5,
        ipWhitelist: '',
        auditLogRetention: 365
      },
      localization: {
        currency: tenant?.settings?.currency || 'USD',
        language: tenant?.settings?.language || 'en',
        timezone: tenant?.settings?.timezone || 'America/New_York',
        dateFormat: tenant?.settings?.dateFormat || 'MM/dd/yyyy',
        numberFormat: '1,234.56'
      },
      notifications: {
        email: true,
        inApp: true,
        categories: {
          system: true,
          user: true,
          financial: true,
          compliance: true,
          workflow: true
        },
        priorities: {
          low: false,
          medium: true,
          high: true,
          critical: true
        }
      }
    };
  };

  const [settings, setSettings] = useState(loadSettings());

  // Load settings and apply to global state on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('erpSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      // Merge saved settings with defaults to ensure all properties exist
      const defaultSettings = loadSettings();
      const mergedSettings = {
        ...defaultSettings,
        ...parsedSettings,
        company: { ...defaultSettings.company, ...parsedSettings.company },
        security: { ...defaultSettings.security, ...parsedSettings.security },
        localization: { ...defaultSettings.localization, ...parsedSettings.localization },
        notifications: { ...defaultSettings.notifications, ...parsedSettings.notifications }
      };
      setSettings(mergedSettings);
      
      // Apply settings to global state
      const selectedCurrency = worldCurrencies.find(c => c.code === (mergedSettings.company?.currency || mergedSettings.localization?.currency || 'USD'));
      const currencySymbol = selectedCurrency ? selectedCurrency.symbol : 'USD';
      
      dispatch({
        type: 'UPDATE_SETTINGS',
        payload: {
          currency: mergedSettings.company?.currency || mergedSettings.localization?.currency || 'USD',
          currencySymbol: currencySymbol,
          language: mergedSettings.company?.language || mergedSettings.localization?.language || 'en',
          timezone: mergedSettings.company?.timezone || mergedSettings.localization?.timezone || 'America/New_York',
          dateFormat: mergedSettings.company?.dateFormat || mergedSettings.localization?.dateFormat || 'MM/dd/yyyy',
          fiscalYearStart: mergedSettings.company?.fiscalYearStart || '01/01'
        }
      });
    }
  }, [dispatch]);

  // Update notification settings when user becomes available
  useEffect(() => {
    if (user?.notificationPreferences) {
      setSettings(prev => ({
        ...prev,
        notifications: {
          email: user.notificationPreferences?.email ?? prev.notifications?.email ?? true,
          inApp: user.notificationPreferences?.inApp ?? prev.notifications?.inApp ?? true,
          categories: {
            system: user.notificationPreferences?.categories?.system ?? prev.notifications?.categories?.system ?? true,
            user: user.notificationPreferences?.categories?.user ?? prev.notifications?.categories?.user ?? true,
            financial: user.notificationPreferences?.categories?.financial ?? prev.notifications?.categories?.financial ?? true,
            compliance: user.notificationPreferences?.categories?.compliance ?? prev.notifications?.categories?.compliance ?? true,
            workflow: user.notificationPreferences?.categories?.workflow ?? prev.notifications?.categories?.workflow ?? true
          },
          priorities: {
            low: user.notificationPreferences?.priorities?.low ?? prev.notifications?.priorities?.low ?? false,
            medium: user.notificationPreferences?.priorities?.medium ?? prev.notifications?.priorities?.medium ?? true,
            high: user.notificationPreferences?.priorities?.high ?? prev.notifications?.priorities?.high ?? true,
            critical: user.notificationPreferences?.priorities?.critical ?? prev.notifications?.priorities?.critical ?? true
          }
        }
      }));
    }
  }, [user]);

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const tabs = [
    { id: 'company', name: 'Company', icon: Building2 },
    { id: 'localization', name: 'Localization', icon: Globe },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'users', name: 'Users & Roles', icon: Users },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'integrations', name: 'Integrations', icon: Globe }
  ];

  const userRoles = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Administrator', status: 'Active', lastLogin: '2025-01-15 14:30' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Accountant', status: 'Active', lastLogin: '2025-01-15 16:45' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Employee', status: 'Pending', lastLogin: 'Never' }
  ];

  const handleSaveCompanySettings = () => {
    // Get currency symbol
    const selectedCurrency = worldCurrencies.find(c => c.code === settings.company.currency);
    const currencySymbol = selectedCurrency ? selectedCurrency.symbol : settings.company.currency;

    // Save to localStorage
    localStorage.setItem('erpSettings', JSON.stringify(settings));

    // Update global state with new settings
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        currency: settings.company.currency,
        currencySymbol: currencySymbol,
        language: settings.company.language,
        timezone: settings.company.timezone,
        dateFormat: settings.company.dateFormat,
        fiscalYearStart: settings.company.fiscalYearStart
      }
    });

    showNotification('Company settings saved successfully!', 'success');
  };

  const handleSaveSecuritySettings = () => {
    // Save to localStorage
    localStorage.setItem('erpSettings', JSON.stringify(settings));

    // Apply security settings
    if (settings.security.sessionTimeout) {
      localStorage.setItem('sessionTimeout', settings.security.sessionTimeout.toString());
    }

    showNotification('Security settings saved successfully!', 'success');
  };

  const handleSaveLocalizationSettings = () => {
    // Get currency symbol
    const selectedCurrency = worldCurrencies.find(c => c.code === settings.localization.currency);
    const currencySymbol = selectedCurrency ? selectedCurrency.symbol : settings.localization.currency;

    // Save to localStorage
    localStorage.setItem('erpSettings', JSON.stringify(settings));

    // Update global state with localization settings
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        currency: settings.localization.currency,
        currencySymbol: currencySymbol,
        language: settings.localization.language,
        timezone: settings.localization.timezone,
        dateFormat: settings.localization.dateFormat
      }
    });

    showNotification('Localization settings saved successfully!', 'success');
  };

  const handleSaveNotificationSettings = () => {
    // Save to localStorage
    localStorage.setItem('erpSettings', JSON.stringify(settings));

    // Update user notification preferences (in a real app, this would be an API call)
    if (user) {
      const updatedUser = {
        ...user,
        notificationPreferences: settings.notifications
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    showNotification('Notification settings saved successfully!', 'success');
  };

  const handleInviteUser = () => {
    const email = prompt('Enter email address to invite:');
    if (email) {
      showNotification(`Invitation sent to ${email}`, 'success');
    }
  };

  const handleEditUser = (userId: number) => {
    showNotification(`Editing user ${userId}`, 'info');
    showNotification('User edit functionality would open here', 'info');
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      showNotification('User deleted successfully', 'success');
    }
  };

  const handleResendInvitation = (userId: number) => {
    showNotification('Invitation resent successfully', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your company settings and preferences</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64">
          <Card>
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="mr-3 h-5 w-5" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Company Settings */}
          {activeTab === 'company' && (
            <Card>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Company Information</h2>
                <p className="text-gray-600">Update your company details and business information</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={settings.company.name}
                      onChange={(e) => updateSetting('company', 'name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <select 
                      value={settings.company.industry}
                      onChange={(e) => updateSetting('company', 'industry', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Retail">Retail</option>
                      <option value="Services">Services</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Education">Education</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Construction">Construction</option>
                      <option value="Transportation">Transportation</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={settings.company.phone}
                      onChange={(e) => updateSetting('company', 'phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={settings.company.email}
                      onChange={(e) => updateSetting('company', 'email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={settings.company.website}
                      onChange={(e) => updateSetting('company', 'website', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Number
                    </label>
                    <input
                      type="text"
                      value={settings.company.taxNumber}
                      onChange={(e) => updateSetting('company', 'taxNumber', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Address
                  </label>
                  <textarea
                    rows={3}
                    value={settings.company.address}
                    onChange={(e) => updateSetting('company', 'address', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your complete business address"
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveCompanySettings}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Company Settings
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Localization Settings */}
          {activeTab === 'localization' && (
            <Card>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Localization Settings</h2>
                <p className="text-gray-600">Configure currency, language, timezone, and regional preferences</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Base Currency *
                    </label>
                    <select 
                      value={settings.localization.currency}
                      onChange={(e) => updateSetting('localization', 'currency', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {worldCurrencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name} ({currency.symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Languages className="w-4 h-4 inline mr-1" />
                      Default Language *
                    </label>
                    <select 
                      value={settings.localization.language}
                      onChange={(e) => updateSetting('localization', 'language', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {worldLanguages.map(language => (
                        <option key={language.code} value={language.code}>
                          {language.name} ({language.nativeName})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Timezone *
                  </label>
                  <select 
                    value={settings.localization.timezone}
                    onChange={(e) => updateSetting('localization', 'timezone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {worldTimezones.map(timezone => (
                      <option key={timezone.value} value={timezone.value}>
                        {timezone.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Format
                    </label>
                    <select 
                      value={settings.localization.dateFormat}
                      onChange={(e) => updateSetting('localization', 'dateFormat', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="MM/dd/yyyy">MM/dd/yyyy (US Format)</option>
                      <option value="dd/MM/yyyy">dd/MM/yyyy (European Format)</option>
                      <option value="yyyy-MM-dd">yyyy-MM-dd (ISO Format)</option>
                      <option value="dd-MM-yyyy">dd-MM-yyyy (Alternative)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fiscal Year Start
                    </label>
                    <select 
                      value={settings.company.fiscalYearStart}
                      onChange={(e) => updateSetting('company', 'fiscalYearStart', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="01/01">January 1st</option>
                      <option value="04/01">April 1st</option>
                      <option value="07/01">July 1st</option>
                      <option value="10/01">October 1st</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveLocalizationSettings}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Localization Settings
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <Card>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
                <p className="text-gray-600">Configure how you receive notifications and what types of notifications you want to see</p>
              </div>

              <div className="space-y-6">
                {/* General Settings */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="email-notifications"
                        type="checkbox"
                        checked={settings.notifications?.email ?? true}
                        onChange={(e) => updateSetting('notifications', 'email', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-900">
                        Email Notifications
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="in-app-notifications"
                        type="checkbox"
                        checked={settings.notifications?.inApp ?? true}
                        onChange={(e) => updateSetting('notifications', 'inApp', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="in-app-notifications" className="ml-2 block text-sm text-gray-900">
                        In-App Notifications
                      </label>
                    </div>
                  </div>
                </div>

                {/* Category Preferences */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Notification Categories</h3>
                  <p className="text-sm text-gray-600 mb-4">Choose which types of notifications you want to receive</p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        id="system-notifications"
                        type="checkbox"
                        checked={settings.notifications?.categories?.system ?? true}
                        onChange={(e) => updateSetting('notifications', 'categories', { ...settings.notifications?.categories, system: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="system-notifications" className="ml-2 block text-sm text-gray-900">
                        System Notifications - Updates about system maintenance, upgrades, and technical issues
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="user-notifications"
                        type="checkbox"
                        checked={settings.notifications?.categories?.user ?? true}
                        onChange={(e) => updateSetting('notifications', 'categories', { ...settings.notifications?.categories, user: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="user-notifications" className="ml-2 block text-sm text-gray-900">
                        User Notifications - Account changes, profile updates, and user management
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="financial-notifications"
                        type="checkbox"
                        checked={settings.notifications?.categories?.financial ?? true}
                        onChange={(e) => updateSetting('notifications', 'categories', { ...settings.notifications?.categories, financial: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="financial-notifications" className="ml-2 block text-sm text-gray-900">
                        Financial Notifications - Invoice payments, budget alerts, and financial milestones
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="compliance-notifications"
                        type="checkbox"
                        checked={settings.notifications?.categories?.compliance ?? true}
                        onChange={(e) => updateSetting('notifications', 'categories', { ...settings.notifications?.categories, compliance: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="compliance-notifications" className="ml-2 block text-sm text-gray-900">
                        Compliance Notifications - Tax deadlines, regulatory updates, and compliance reminders
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="workflow-notifications"
                        type="checkbox"
                        checked={settings.notifications?.categories?.workflow ?? true}
                        onChange={(e) => updateSetting('notifications', 'categories', { ...settings.notifications?.categories, workflow: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="workflow-notifications" className="ml-2 block text-sm text-gray-900">
                        Workflow Notifications - Approval requests, task assignments, and process updates
                      </label>
                    </div>
                  </div>
                </div>

                {/* Priority Preferences */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Notification Priorities</h3>
                  <p className="text-sm text-gray-600 mb-4">Choose which priority levels you want to be notified about</p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        id="critical-priority"
                        type="checkbox"
                        checked={settings.notifications?.priorities?.critical ?? true}
                        onChange={(e) => updateSetting('notifications', 'priorities', { ...settings.notifications?.priorities, critical: e.target.checked })}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="critical-priority" className="ml-2 block text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Critical
                        </span>
                        <span className="ml-2">Critical - System emergencies, security alerts, and urgent compliance issues</span>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="high-priority"
                        type="checkbox"
                        checked={settings.notifications?.priorities?.high ?? true}
                        onChange={(e) => updateSetting('notifications', 'priorities', { ...settings.notifications?.priorities, high: e.target.checked })}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor="high-priority" className="ml-2 block text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          High
                        </span>
                        <span className="ml-2">High - Important deadlines, payment reminders, and significant updates</span>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="medium-priority"
                        type="checkbox"
                        checked={settings.notifications?.priorities?.medium ?? true}
                        onChange={(e) => updateSetting('notifications', 'priorities', { ...settings.notifications?.priorities, medium: e.target.checked })}
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                      />
                      <label htmlFor="medium-priority" className="ml-2 block text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Medium
                        </span>
                        <span className="ml-2">Medium - General updates, task completions, and routine notifications</span>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="low-priority"
                        type="checkbox"
                        checked={settings.notifications?.priorities?.low ?? false}
                        onChange={(e) => updateSetting('notifications', 'priorities', { ...settings.notifications?.priorities, low: e.target.checked })}
                        className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                      />
                      <label htmlFor="low-priority" className="ml-2 block text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Low
                        </span>
                        <span className="ml-2">Low - Minor updates, informational messages, and non-urgent notifications</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveNotificationSettings}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Notification Settings
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Users & Roles */}
          {activeTab === 'users' && (
            <Card>
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Users & Roles</h2>
                    <p className="text-gray-600">Manage user access and permissions</p>
                  </div>
                  <Button onClick={handleInviteUser}>
                    <Users className="w-4 h-4 mr-2" />
                    Invite User
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userRoles.map((userRole) => (
                      <tr key={userRole.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{userRole.name}</p>
                            <p className="text-sm text-gray-500">{userRole.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {userRole.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            userRole.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {userRole.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{userRole.lastLogin}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="secondary" size="sm" onClick={() => handleEditUser(userRole.id)}>
                              Edit
                            </Button>
                            {userRole.status === 'Pending' && (
                              <Button variant="secondary" size="sm" onClick={() => handleResendInvitation(userRole.id)}>
                                Resend
                              </Button>
                            )}
                            <Button variant="secondary" size="sm" onClick={() => handleDeleteUser(userRole.id)}>
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <Card>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
                <p className="text-gray-600">Configure security preferences and authentication</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600">Require 2FA for all users</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.security.twoFactorRequired}
                      onChange={(e) => updateSetting('security', 'twoFactorRequired', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Session Timeout</h3>
                    <p className="text-sm text-gray-600">Automatically log out after inactivity</p>
                  </div>
                  <select 
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={0}>Never</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Login Notifications</h3>
                    <p className="text-sm text-gray-600">Get notified of new login attempts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.security.loginNotifications}
                      onChange={(e) => updateSetting('security', 'loginNotifications', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Expiry (Days)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={settings.security.passwordExpiry}
                      onChange={(e) => updateSetting('security', 'passwordExpiry', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Login Attempts
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value) || 5)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IP Whitelist (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={settings.security.ipWhitelist}
                    onChange={(e) => updateSetting('security', 'ipWhitelist', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter IP addresses separated by commas (e.g., 192.168.1.1, 10.0.0.1)"
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSecuritySettings}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Security Settings
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Billing Settings */}
          {activeTab === 'billing' && (
            <Card>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Billing & Subscription</h2>
                <p className="text-gray-600">Manage your subscription plan and billing information</p>
              </div>

              <div className="space-y-6">
                {tenant?.status === 'trial' ? (
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-yellow-900">Free Trial</h3>
                        <p className="text-yellow-700">Professional Plan Features</p>
                        <p className="text-sm text-yellow-600 mt-1">
                          Trial expires: {tenant.trialEndDate?.toLocaleDateString()} 
                          ({checkTrialStatus().daysRemaining} days remaining)
                        </p>
                      </div>
                      <Button onClick={() => showNotification('Plan upgrade functionality would open here', 'info')}>
                        Upgrade Now
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-blue-900">{tenant?.plan} Plan</h3>
                        <p className="text-blue-700">KES {tenant?.billing.monthlyAmount.toLocaleString()}/month • Up to {tenant?.usage.maxUsers} users</p>
                        <p className="text-sm text-blue-600 mt-1">
                          Next billing date: {tenant?.billing.nextBillingDate?.toLocaleDateString()}
                        </p>
                    </div>
                    <Button variant="secondary" onClick={() => showNotification('Subscription management would open here', 'info')}>
                      Manage Plan
                    </Button>
                  </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900">Starter</h4>
                    <p className="text-2xl font-bold text-gray-900 mt-2">KES 2,999</p>
                    <p className="text-gray-600">per month</p>
                    <p className="text-sm text-gray-500 mt-2">Up to 3 users</p>
                    <Button variant="secondary" size="sm" className="mt-4" onClick={() => showNotification('Plan downgrade functionality would open here', 'info')}>
                      {tenant?.plan === 'starter' ? 'Current Plan' : 'Downgrade'}
                    </Button>
                  </div>
                  <div className={`text-center p-6 border-2 rounded-lg ${
                    tenant?.plan === 'professional' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}>
                    <h4 className="font-semibold text-blue-900">Professional</h4>
                    <p className="text-2xl font-bold text-blue-900 mt-2">KES 7,999</p>
                    <p className="text-blue-700">per month</p>
                    <p className="text-sm text-blue-600 mt-2">Up to 15 users</p>
                    {tenant?.plan === 'professional' ? (
                      <div className="mt-4 px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
                        Current Plan
                      </div>
                    ) : (
                      <Button size="sm" className="mt-4" onClick={() => upgradePlan('professional')}>
                        {tenant?.plan === 'starter' ? 'Upgrade' : 'Downgrade'}
                      </Button>
                    )}
                  </div>
                  <div className="text-center p-6 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900">Enterprise</h4>
                    <p className="text-2xl font-bold text-gray-900 mt-2">KES 19,999</p>
                    <p className="text-gray-600">per month</p>
                    <p className="text-sm text-gray-500 mt-2">Unlimited users</p>
                    <Button size="sm" className="mt-4" onClick={() => upgradePlan('enterprise')}>
                      {tenant?.plan === 'enterprise' ? 'Current Plan' : 'Upgrade'}
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">Billing History</h3>
                  <div className="space-y-3">
                    {tenant?.billing.invoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">
                            {invoice.issueDate.toLocaleDateString()} - {tenant.plan} Plan
                          </p>
                          <p className="text-sm text-gray-600">
                            {invoice.status === 'paid' ? 'Paid' : 'Pending'} on {invoice.paidDate?.toLocaleDateString() || 'Pending'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {invoice.currency} {invoice.amount.toLocaleString()}
                          </p>
                          <Button variant="secondary" size="sm" onClick={() => showNotification(`Invoice ${invoice.id} downloaded`, 'success')}>
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Integrations */}
          {activeTab === 'integrations' && (
            <Card>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Integrations</h2>
                <p className="text-gray-600">Connect with third-party services and applications</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">QuickBooks</h3>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">Not Connected</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Import data from QuickBooks Online</p>
                  <Button size="sm" onClick={() => showNotification('QuickBooks integration would open here', 'info')}>
                    Connect
                  </Button>
                </div>

                <div className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Stripe</h3>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Connected</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Payment processing and invoicing</p>
                  <Button variant="secondary" size="sm" onClick={() => showNotification('Stripe configuration would open here', 'info')}>
                    Configure
                  </Button>
                </div>

                <div className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Shopify</h3>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">Not Connected</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Sync orders and inventory</p>
                  <Button size="sm" onClick={() => showNotification('Shopify integration would open here', 'info')}>
                    Connect
                  </Button>
                </div>

                <div className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Salesforce</h3>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">Not Connected</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Customer relationship management</p>
                  <Button size="sm" onClick={() => showNotification('Salesforce integration would open here', 'info')}>
                    Connect
                  </Button>
                </div>

                <div className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Zapier</h3>
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Automate workflows with 3000+ apps</p>
                  <Button variant="secondary" size="sm" onClick={() => showNotification('Zapier configuration would open here', 'info')}>
                    Configure
                  </Button>
                </div>

                <div className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Bank Feeds</h3>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Connected</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Automatic bank transaction import</p>
                  <Button variant="secondary" size="sm" onClick={() => showNotification('Bank feeds management would open here', 'info')}>
                    Manage
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}