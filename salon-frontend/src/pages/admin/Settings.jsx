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
    <div className="max-w-4xl mx-auto space-y-8 font-sans antialiased text-white">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-[rgba(163,163,204,0.12)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCCCFF]/10 border border-[#CCCCFF]/30 text-[#CCCCFF] text-[11px] font-poppins font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={12} className="text-[#CCCCFF]" />
            Configuration Desk
          </div>
          <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-white tracking-tight">Platform Settings</h1>
          <p className="text-white/60 text-xs font-sans mt-0.5">Configure operational parameters, notifications, and security protocols</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 bg-[#CCCCFF] hover:bg-[#b8b8f5] text-[#292966] px-5 py-2.5 rounded-xl text-xs font-poppins font-bold uppercase tracking-wider transition-all shrink-0 shadow-lg shadow-[#CCCCFF]/10 hover:scale-[1.02]"
        >
          <Save className="h-4 w-4" />
          <span>Save Configuration</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[rgba(163,163,204,0.08)]">
            <Globe className="h-5 w-5 text-[#CCCCFF]" />
            <h2 className="text-sm font-poppins font-bold text-white uppercase tracking-wider">General Information</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-white/80 mb-1.5">
                Brand Identifier
              </label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => setSettings({...settings, platformName: e.target.value})}
                className="w-full px-4 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-white/80 mb-1.5">
                Concierge Support Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                className="w-full px-4 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white"
              />
            </div>
          </div>
        </div>

        {/* Commission Settings */}
        <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[rgba(163,163,204,0.08)]">
            <DollarSign className="h-5 w-5 text-[#CCCCFF]" />
            <h2 className="text-sm font-poppins font-bold text-white uppercase tracking-wider">Settlement & Protocol Fee</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-white/80 mb-1.5">
                Platform Facilitation (%)
              </label>
              <input
                type="number"
                value={settings.commissionRate}
                onChange={(e) => setSettings({...settings, commissionRate: e.target.value})}
                className="w-full px-4 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-white/80 mb-1.5">
                Base Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({...settings, currency: e.target.value})}
                className="w-full px-4 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white"
              >
                <option value="INR" className="bg-[#1e1e4f]">Indian Rupee (INR ₹)</option>
                <option value="USD" className="bg-[#1e1e4f]">US Dollar (USD $)</option>
                <option value="EUR" className="bg-[#1e1e4f]">Euro (EUR €)</option>
                <option value="GBP" className="bg-[#1e1e4f]">British Pound (GBP £)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[rgba(163,163,204,0.08)]">
            <Bell className="h-5 w-5 text-[#CCCCFF]" />
            <h2 className="text-sm font-poppins font-bold text-white uppercase tracking-wider">Notification Dispatches</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 bg-[#1e1e4f] border border-[rgba(163,163,204,0.1)] rounded-xl cursor-pointer hover:border-[#CCCCFF]/40 transition-colors">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#CCCCFF]" />
                <div>
                  <p className="font-poppins font-bold text-xs text-white">Email Dispatches</p>
                  <p className="text-xs text-white/50 font-sans">Automated booking confirmations and receipt notifications</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.enableEmailNotifications}
                onChange={(e) => setSettings({...settings, enableEmailNotifications: e.target.checked})}
                className="w-4 h-4 accent-[#CCCCFF] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-[#1e1e4f] border border-[rgba(163,163,204,0.1)] rounded-xl cursor-pointer hover:border-[#CCCCFF]/40 transition-colors">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-[#CCCCFF]" />
                <div>
                  <p className="font-poppins font-bold text-xs text-white">SMS Concierge Alerts</p>
                  <p className="text-xs text-white/50 font-sans">Instant SMS dispatch to customer upon stylist assignment</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.enableSMSNotifications}
                onChange={(e) => setSettings({...settings, enableSMSNotifications: e.target.checked})}
                className="w-4 h-4 accent-[#CCCCFF] rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[rgba(163,163,204,0.08)]">
            <Shield className="h-5 w-5 text-[#CCCCFF]" />
            <h2 className="text-sm font-poppins font-bold text-white uppercase tracking-wider">Governance & KYC Guardrails</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 bg-[#1e1e4f] border border-[rgba(163,163,204,0.1)] rounded-xl cursor-pointer hover:border-[#CCCCFF]/40 transition-colors">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-[#CCCCFF]" />
                <div>
                  <p className="font-poppins font-bold text-xs text-white">Mandatory KYC Verification for Studio Owners</p>
                  <p className="text-xs text-white/50 font-sans">All salon applications require administrative approval before storefront is public</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.requireOwnerApproval}
                onChange={(e) => setSettings({...settings, requireOwnerApproval: e.target.checked})}
                className="w-4 h-4 accent-[#CCCCFF] rounded cursor-pointer"
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;
