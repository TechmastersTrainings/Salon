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
    <div className="max-w-4xl mx-auto space-y-8 font-sans antialiased text-[#F2F0E9]">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-[rgba(242,240,233,0.12)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B9F12F]/10 border border-[#B9F12F]/30 text-[#B9F12F] text-[11px] font-poppins font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={12} className="text-[#B9F12F]" />
            Configuration Desk
          </div>
          <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-[#F2F0E9] tracking-tight">Platform Settings</h1>
          <p className="text-[#F2F0E9]/60 text-xs font-sans mt-0.5">Configure operational parameters, notifications, and security protocols</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 bg-[#B9F12F] hover:bg-[#a6db24] text-[#0B3048] px-5 py-2.5 rounded-xl text-xs font-poppins font-bold uppercase tracking-wider transition-all shrink-0 shadow-lg shadow-[#B9F12F]/10 hover:scale-[1.02]"
        >
          <Save className="h-4 w-4" />
          <span>Save Configuration</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <div className="bg-[#0e3854] rounded-2xl shadow-md border border-[rgba(242,240,233,0.12)] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[rgba(242,240,233,0.08)]">
            <Globe className="h-5 w-5 text-[#B9F12F]" />
            <h2 className="text-sm font-poppins font-bold text-[#F2F0E9] uppercase tracking-wider">General Information</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-[#F2F0E9]/80 mb-1.5">
                Brand Identifier
              </label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => setSettings({...settings, platformName: e.target.value})}
                className="w-full px-4 py-2.5 bg-[#072132] border border-[rgba(242,240,233,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#B9F12F] text-[#F2F0E9]"
              />
            </div>
            <div>
              <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-[#F2F0E9]/80 mb-1.5">
                Concierge Support Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                className="w-full px-4 py-2.5 bg-[#072132] border border-[rgba(242,240,233,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#B9F12F] text-[#F2F0E9]"
              />
            </div>
          </div>
        </div>

        {/* Commission Settings */}
        <div className="bg-[#0e3854] rounded-2xl shadow-md border border-[rgba(242,240,233,0.12)] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[rgba(242,240,233,0.08)]">
            <DollarSign className="h-5 w-5 text-[#B9F12F]" />
            <h2 className="text-sm font-poppins font-bold text-[#F2F0E9] uppercase tracking-wider">Settlement & Protocol Fee</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-[#F2F0E9]/80 mb-1.5">
                Platform Facilitation (%)
              </label>
              <input
                type="number"
                value={settings.commissionRate}
                onChange={(e) => setSettings({...settings, commissionRate: e.target.value})}
                className="w-full px-4 py-2.5 bg-[#072132] border border-[rgba(242,240,233,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#B9F12F] text-[#F2F0E9]"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-[#F2F0E9]/80 mb-1.5">
                Base Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({...settings, currency: e.target.value})}
                className="w-full px-4 py-2.5 bg-[#072132] border border-[rgba(242,240,233,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#B9F12F] text-[#F2F0E9]"
              >
                <option value="INR" className="bg-[#072132]">Indian Rupee (INR ₹)</option>
                <option value="USD" className="bg-[#072132]">US Dollar (USD $)</option>
                <option value="EUR" className="bg-[#072132]">Euro (EUR €)</option>
                <option value="GBP" className="bg-[#072132]">British Pound (GBP £)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-[#0e3854] rounded-2xl shadow-md border border-[rgba(242,240,233,0.12)] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[rgba(242,240,233,0.08)]">
            <Bell className="h-5 w-5 text-[#B9F12F]" />
            <h2 className="text-sm font-poppins font-bold text-[#F2F0E9] uppercase tracking-wider">Notification Dispatches</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 bg-[#072132] border border-[rgba(242,240,233,0.1)] rounded-xl cursor-pointer hover:border-[#B9F12F]/40 transition-colors">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#B9F12F]" />
                <div>
                  <p className="font-poppins font-bold text-xs text-[#F2F0E9]">Email Dispatches</p>
                  <p className="text-xs text-[#F2F0E9]/50 font-sans">Automated booking confirmations and receipt notifications</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.enableEmailNotifications}
                onChange={(e) => setSettings({...settings, enableEmailNotifications: e.target.checked})}
                className="w-4 h-4 accent-[#B9F12F] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-[#072132] border border-[rgba(242,240,233,0.1)] rounded-xl cursor-pointer hover:border-[#B9F12F]/40 transition-colors">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-[#B9F12F]" />
                <div>
                  <p className="font-poppins font-bold text-xs text-[#F2F0E9]">SMS Concierge Alerts</p>
                  <p className="text-xs text-[#F2F0E9]/50 font-sans">Instant SMS dispatch to customer upon stylist assignment</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.enableSMSNotifications}
                onChange={(e) => setSettings({...settings, enableSMSNotifications: e.target.checked})}
                className="w-4 h-4 accent-[#B9F12F] rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-[#0e3854] rounded-2xl shadow-md border border-[rgba(242,240,233,0.12)] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[rgba(242,240,233,0.08)]">
            <Shield className="h-5 w-5 text-[#B9F12F]" />
            <h2 className="text-sm font-poppins font-bold text-[#F2F0E9] uppercase tracking-wider">Governance & KYC Guardrails</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 bg-[#072132] border border-[rgba(242,240,233,0.1)] rounded-xl cursor-pointer hover:border-[#B9F12F]/40 transition-colors">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-[#B9F12F]" />
                <div>
                  <p className="font-poppins font-bold text-xs text-[#F2F0E9]">Mandatory KYC Verification for Studio Owners</p>
                  <p className="text-xs text-[#F2F0E9]/50 font-sans">All salon applications require administrative approval before storefront is public</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.requireOwnerApproval}
                onChange={(e) => setSettings({...settings, requireOwnerApproval: e.target.checked})}
                className="w-4 h-4 accent-[#B9F12F] rounded cursor-pointer"
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;
