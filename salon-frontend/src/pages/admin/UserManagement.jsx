import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  Loader,
  UserCheck,
  UserX,
  Plus,
  X,
  Save,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    phone: '',
    role: 'customer',
    password: '',
    confirm_password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/accounts/users/');
      const usersData = Array.isArray(response.data) ? response.data : response.data?.results || [];
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await api.patch(`/accounts/users/${userId}/`, {
        is_active: !currentStatus
      });
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleToggleOwnerApproval = async (userId, currentApproval) => {
    try {
      await api.patch(`/accounts/users/${userId}/`, {
        is_owner_approved: !currentApproval
      });
      toast.success(`Owner ${!currentApproval ? 'approved' : 'unapproved'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update owner approval');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/accounts/users/${userId}/`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email || '',
      username: user.username || '',
      phone: user.phone || '',
      role: user.role || 'customer',
      password: '',
      confirm_password: ''
    });
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      username: '',
      phone: '',
      role: 'customer',
      password: '',
      confirm_password: ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!editingUser || (editingUser && formData.password)) {
      if (formData.password !== formData.confirm_password) {
        toast.error('Passwords do not match');
        return;
      }
    }

    try {
      const { confirm_password, ...submitData } = formData;
      if (editingUser && !submitData.password) {
        delete submitData.password;
      }

      if (editingUser) {
        await api.patch(`/accounts/users/${editingUser.id}/`, submitData);
        toast.success('User updated successfully');
      } else {
        await api.post('/accounts/register/', submitData);
        toast.success('User created successfully');
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      const errorMsg = error.response?.data?.error || 
                      error.response?.data?.message || 
                      (editingUser ? 'Failed to update user' : 'Failed to create user');
      toast.error(errorMsg);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const filteredUsers = (users || []).filter(user => {
    const matchesSearch = 
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone || '').includes(searchTerm);
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.is_active) ||
      (statusFilter === 'inactive' && !user.is_active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role) => {
    switch(role) {
      case 'admin': 
        return 'bg-[#1e1e4f] text-[#CCCCFF] border border-[#CCCCFF]/40';
      case 'owner': 
        return 'bg-[#CCCCFF]/15 text-[#CCCCFF] border border-[#CCCCFF]/30';
      case 'staff': 
        return 'bg-blue-500/15 text-blue-300 border border-blue-500/30';
      default: 
        return 'bg-[#1e1e4f] text-white/70 border border-[rgba(163,163,204,0.1)]';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#292966]">
        <div className="w-10 h-10 border-2 border-[rgba(163,163,204,0.15)] border-t-[#CCCCFF] rounded-full animate-spin mb-4" />
        <p className="text-xs font-poppins font-medium uppercase tracking-widest text-white">Loading Platform Directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans antialiased text-white">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-[rgba(163,163,204,0.12)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCCCFF]/10 border border-[#CCCCFF]/30 text-[#CCCCFF] text-[11px] font-poppins font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={12} className="text-[#CCCCFF]" />
            Accounts Directory
          </div>
          <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-white tracking-tight">User Management</h1>
          <p className="text-white/60 text-xs font-sans mt-0.5">Control access credentials, roles, and status for all platform users</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 bg-[#CCCCFF] hover:bg-[#b8b8f5] text-[#292966] px-5 py-2.5 rounded-xl text-xs font-poppins font-bold uppercase tracking-wider transition-all shrink-0 shadow-lg shadow-[#CCCCFF]/10 hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white placeholder:text-white/40"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white"
          >
            <option value="all" className="bg-[#1e1e4f]">All Roles</option>
            <option value="customer" className="bg-[#1e1e4f]">Customers</option>
            <option value="owner" className="bg-[#1e1e4f]">Salon Owners</option>
            <option value="staff" className="bg-[#1e1e4f]">Stylist Staff</option>
            <option value="admin" className="bg-[#1e1e4f]">Administrators</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white"
          >
            <option value="all" className="bg-[#1e1e4f]">All Status</option>
            <option value="active" className="bg-[#1e1e4f]">Active Only</option>
            <option value="inactive" className="bg-[#1e1e4f]">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#363675] rounded-2xl shadow-md border border-[rgba(163,163,204,0.12)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[rgba(163,163,204,0.08)]">
            <thead className="bg-[#1e1e4f]">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Approval</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-right text-[11px] font-poppins font-bold text-white/60 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#363675] divide-y divide-[rgba(163,163,204,0.06)]">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#1e1e4f]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-9 h-9 bg-[#1e1e4f] text-[#CCCCFF] border border-[rgba(163,163,204,0.15)] rounded-xl flex items-center justify-center font-poppins font-bold text-xs shrink-0">
                          {(user.username || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <div className="font-poppins font-bold text-xs text-white">{user.username || user.email}</div>
                          <div className="text-[11px] text-white/40 font-sans">ID #{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-0.5">
                        <div className="flex items-center text-xs text-white/80 font-sans">
                          <Mail className="h-3 w-3 text-white/40 mr-1.5" />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center text-xs text-white/50 font-sans">
                            <Phone className="h-3 w-3 text-white/40 mr-1.5" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-poppins font-bold uppercase tracking-wider ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-poppins font-bold uppercase tracking-wider border ${
                        user.is_active 
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role === 'owner' ? (
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-poppins font-bold uppercase tracking-wider border ${
                          user.is_owner_approved 
                            ? 'bg-[#CCCCFF]/15 text-[#CCCCFF] border-[#CCCCFF]/40' 
                            : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        }`}>
                          {user.is_owner_approved ? 'Approved' : 'Pending'}
                        </span>
                      ) : (
                        <span className="text-white/30 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-white/50 font-sans">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-1.5">
                        {user.role === 'owner' && (
                          <button
                            onClick={() => handleToggleOwnerApproval(user.id, user.is_owner_approved)}
                            className={`p-2 rounded-lg bg-[#1e1e4f] hover:bg-[#1e1e4f]/80 border border-[rgba(163,163,204,0.1)] transition-colors ${
                              user.is_owner_approved ? 'text-amber-400' : 'text-[#CCCCFF]'
                            }`}
                            title={user.is_owner_approved ? 'Revoke Approval' : 'Approve Owner'}
                          >
                            {user.is_owner_approved ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 rounded-lg bg-[#1e1e4f] text-white/80 hover:text-[#CCCCFF] hover:border-[#CCCCFF]/30 border border-[rgba(163,163,204,0.1)] transition-colors"
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                          className={`p-2 rounded-lg bg-[#1e1e4f] border border-[rgba(163,163,204,0.1)] transition-colors ${
                            user.is_active ? 'text-amber-400 hover:text-amber-300' : 'text-[#CCCCFF] hover:text-[#b8b8f5]'
                          }`}
                          title={user.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {user.is_active ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 rounded-lg bg-[#1e1e4f] text-rose-400 hover:text-rose-300 border border-[rgba(163,163,204,0.1)] transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-white/40 font-sans text-xs">
                    No users matching criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#1e1e4f]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#363675] rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-[rgba(163,163,204,0.15)]">
            <div className="p-6 border-b border-[rgba(163,163,204,0.1)] sticky top-0 bg-[#363675] flex justify-between items-center z-10">
              <div>
                <span className="text-[10px] font-poppins font-semibold uppercase tracking-wider text-[#CCCCFF]">Account Identity</span>
                <h2 className="text-lg font-poppins font-bold text-white">
                  {editingUser ? 'Edit User Profile' : 'Register New User'}
                </h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-white/60 hover:text-white rounded-lg transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-white/80 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-white/80 mb-1">Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-white/80 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-white/80 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white"
                >
                  <option value="customer" className="bg-[#1e1e4f]">Customer</option>
                  <option value="owner" className="bg-[#1e1e4f]">Salon Owner</option>
                  <option value="staff" className="bg-[#1e1e4f]">Stylist Staff</option>
                  <option value="admin" className="bg-[#1e1e4f]">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-white/80 mb-1">
                  Password {editingUser && '(Leave blank to retain current)'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!editingUser}
                  className="w-full px-3.5 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-white/80 mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required={!editingUser}
                  className="w-full px-3.5 py-2.5 bg-[#1e1e4f] border border-[rgba(163,163,204,0.15)] rounded-xl text-xs font-medium focus:outline-none focus:border-[#CCCCFF] text-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[rgba(163,163,204,0.1)]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[rgba(163,163,204,0.2)] text-white/70 rounded-xl text-xs font-poppins font-medium hover:bg-[#1e1e4f] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-5 py-2 bg-[#CCCCFF] hover:bg-[#b8b8f5] text-[#292966] rounded-xl text-xs font-poppins font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingUser ? 'Update User' : 'Create User'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
