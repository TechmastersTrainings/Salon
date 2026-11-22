import { useState } from 'react';
import { Save, Bell, Shield, DollarSign, Mail, Globe, Sparkles, Sliders } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    platformName: 'MakeMyHair',
    supportEmail: 'concierge@makemyhair.com',
    commissionRate: '1.0',
    currency: 'INR',
    enableEmailNotifications: true,
    enableSMSNotifications: true,
    requireOwnerApproval: true,
    maintenanceMode: false
  });

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Platform configuration saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans antialiased text-ink">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-line">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-200 text-rose-600 text-[11px] font-poppins font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={12} className="text-rose-600" />
            Configuration Desk
          </div>
          <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-ink tracking-tight">Platform Settings</h1>
          <p className="text-muted text-xs font-sans mt-0.5">Configure operational parameters, notifications, and security protocols</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 bg-ink hover:bg-rose-600 text-ivory px-5 py-2.5 rounded-xl text-xs font-poppins font-bold uppercase tracking-wider transition-all shrink-0 shadow-lg shadow-rose-200/40 hover:scale-[1.02]"
        >
          <Save className="h-4 w-4" />
          <span>Save Configuration</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <div className="bg-surface rounded-2xl shadow-md border border-line p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-line">
            <Globe className="h-5 w-5 text-rose-600" />
            <h2 className="text-sm font-poppins font-bold text-ink uppercase tracking-wider">General Information</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-body mb-1.5">
                Brand Identifier
              </label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => setSettings({...settings, platformName: e.target.value})}
                className="w-full px-4 py-2.5 bg-white border border-line rounded-xl text-xs font-medium focus:outline-none focus:border-rose-400 text-ink"
              />
            </div>
            <div>
              <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-body mb-1.5">
                Concierge Support Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                className="w-full px-4 py-2.5 bg-white border border-line rounded-xl text-xs font-medium focus:outline-none focus:border-rose-400 text-ink"
              />
            </div>
          </div>
        </div>

        {/* Commission Settings */}
        <div className="bg-surface rounded-2xl shadow-md border border-line p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-line">
            <DollarSign className="h-5 w-5 text-rose-600" />
            <h2 className="text-sm font-poppins font-bold text-ink uppercase tracking-wider">Settlement & Protocol Fee</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-body mb-1.5">
                Platform Facilitation (%)
              </label>
              <input
                type="number"
                value={settings.commissionRate}
                onChange={(e) => setSettings({...settings, commissionRate: e.target.value})}
                className="w-full px-4 py-2.5 bg-white border border-line rounded-xl text-xs font-medium focus:outline-none focus:border-rose-400 text-ink"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-body mb-1.5">
                Base Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({...settings, currency: e.target.value})}
                className="w-full px-4 py-2.5 bg-white border border-line rounded-xl text-xs font-medium focus:outline-none focus:border-rose-400 text-ink"
              >
                <option value="INR" className="bg-blush">Indian Rupee (INR ₹)</option>
                <option value="USD" className="bg-blush">US Dollar (USD $)</option>
                <option value="EUR" className="bg-blush">Euro (EUR €)</option>
                <option value="GBP" className="bg-blush">British Pound (GBP £)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-surface rounded-2xl shadow-md border border-line p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-line">
            <Bell className="h-5 w-5 text-rose-600" />
            <h2 className="text-sm font-poppins font-bold text-ink uppercase tracking-wider">Notification Dispatches</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 bg-blush border border-line rounded-xl cursor-pointer hover:border-rose-300 transition-colors">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-rose-600" />
                <div>
                  <p className="font-poppins font-bold text-xs text-ink">Email Dispatches</p>
                  <p className="text-xs text-muted font-sans">Automated booking confirmations and receipt notifications</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.enableEmailNotifications}
                onChange={(e) => setSettings({...settings, enableEmailNotifications: e.target.checked})}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-blush border border-line rounded-xl cursor-pointer hover:border-rose-300 transition-colors">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-rose-600" />
                <div>
                  <p className="font-poppins font-bold text-xs text-ink">SMS Concierge Alerts</p>
                  <p className="text-xs text-muted font-sans">Instant SMS dispatch to customer upon stylist assignment</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.enableSMSNotifications}
                onChange={(e) => setSettings({...settings, enableSMSNotifications: e.target.checked})}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-surface rounded-2xl shadow-md border border-line p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-line">
            <Shield className="h-5 w-5 text-rose-600" />
            <h2 className="text-sm font-poppins font-bold text-ink uppercase tracking-wider">Governance & KYC Guardrails</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 bg-blush border border-line rounded-xl cursor-pointer hover:border-rose-300 transition-colors">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-rose-600" />
                <div>
                  <p className="font-poppins font-bold text-xs text-ink">Mandatory KYC Verification for Studio Owners</p>
                  <p className="text-xs text-muted font-sans">All salon applications require administrative approval before storefront is public</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.requireOwnerApproval}
                onChange={(e) => setSettings({...settings, requireOwnerApproval: e.target.checked})}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;
