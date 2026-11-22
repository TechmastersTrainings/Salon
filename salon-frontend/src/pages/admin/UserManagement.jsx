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
        return 'bg-blush text-rose-600 border border-rose-300';
      case 'owner': 
        return 'bg-rose-500/15 text-rose-600 border border-rose-200';
      case 'staff': 
        return 'bg-taupe-500/15 text-taupe-700 border border-taupe-500/30';
      default: 
        return 'bg-blush text-body border border-line';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-ivory">
        <div className="w-10 h-10 border-2 border-line border-t-rose-500 rounded-full animate-spin mb-4" />
        <p className="text-xs font-poppins font-medium uppercase tracking-widest text-ink">Loading Platform Directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans antialiased text-ink">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-line">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-200 text-rose-600 text-[11px] font-poppins font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={12} className="text-rose-600" />
            Accounts Directory
          </div>
          <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-ink tracking-tight">User Management</h1>
          <p className="text-muted text-xs font-sans mt-0.5">Control access credentials, roles, and status for all platform users</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 bg-ink hover:bg-rose-600 text-ivory px-5 py-2.5 rounded-xl text-xs font-poppins font-bold uppercase tracking-wider transition-all shrink-0 shadow-lg shadow-rose-200/40 hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-2xl shadow-md border border-line p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-line rounded-xl text-xs font-medium focus:outline-none focus:border-rose-400 text-ink placeholder:text-neutral-400"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-line rounded-xl text-xs font-medium focus:outline-none focus:border-rose-400 text-ink"
          >
            <option value="all" className="bg-blush">All Roles</option>
            <option value="customer" className="bg-blush">Customers</option>
            <option value="owner" className="bg-blush">Salon Owners</option>
            <option value="staff" className="bg-blush">Stylist Staff</option>
            <option value="admin" className="bg-blush">Administrators</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-line rounded-xl text-xs font-medium focus:outline-none focus:border-rose-400 text-ink"
          >
            <option value="all" className="bg-blush">All Status</option>
            <option value="active" className="bg-blush">Active Only</option>
            <option value="inactive" className="bg-blush">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-surface rounded-2xl shadow-md border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-line">
            <thead className="bg-blush">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-muted uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-muted uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-muted uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-muted uppercase tracking-wider">Approval</th>
                <th className="px-6 py-4 text-left text-[11px] font-poppins font-bold text-muted uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-right text-[11px] font-poppins font-bold text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-line">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-blush/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-9 h-9 bg-blush text-rose-600 border border-line rounded-xl flex items-center justify-center font-poppins font-bold text-xs shrink-0">
                          {(user.username || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <div className="font-poppins font-bold text-xs text-ink">{user.username || user.email}</div>
                          <div className="text-[11px] text-neutral-400 font-sans">ID #{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-0.5">
                        <div className="flex items-center text-xs text-body font-sans">
                          <Mail className="h-3 w-3 text-neutral-400 mr-1.5" />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center text-xs text-muted font-sans">
                            <Phone className="h-3 w-3 text-neutral-400 mr-1.5" />
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
                          ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30' 
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role === 'owner' ? (
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-poppins font-bold uppercase tracking-wider border ${
                          user.is_owner_approved 
                            ? 'bg-rose-500/15 text-rose-600 border-rose-300' 
                            : 'bg-amber-500/15 text-amber-700 border-amber-500/30'
                        }`}>
                          {user.is_owner_approved ? 'Approved' : 'Pending'}
                        </span>
                      ) : (
                        <span className="text-neutral-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-muted font-sans">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-1.5">
                        {user.role === 'owner' && (
                          <button
                            onClick={() => handleToggleOwnerApproval(user.id, user.is_owner_approved)}
                            className={`p-2 rounded-lg bg-blush hover:bg-blush/80 border border-line transition-colors ${
                              user.is_owner_approved ? 'text-amber-700' : 'text-rose-600'
                            }`}
                            title={user.is_owner_approved ? 'Revoke Approval' : 'Approve Owner'}
                          >
                            {user.is_owner_approved ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 rounded-lg bg-blush text-body hover:text-rose-600 hover:border-rose-200 border border-line transition-colors"
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                          className={`p-2 rounded-lg bg-blush border border-line transition-colors ${
                            user.is_active ? 'text-amber-700 hover:text-amber-700' : 'text-rose-600 hover:text-rose-700'
                          }`}
                          title={user.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {user.is_active ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 rounded-lg bg-blush text-rose-400 hover:text-rose-300 border border-line transition-colors"
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
                  <td colSpan="7" className="px-6 py-12 text-center text-neutral-400 font-sans text-xs">
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
        <div className="fixed inset-0 bg-blush/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-line">
            <div className="p-6 border-b border-line sticky top-0 bg-surface flex justify-between items-center z-10">
              <div>
                <span className="text-[10px] font-poppins font-semibold uppercase tracking-wider text-rose-600">Account Identity</span>
                <h2 className="text-lg font-poppins font-bold text-ink">
                  {editingUser ? 'Edit User Profile' : 'Register New User'}
                </h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-muted hover:text-ink rounded-lg transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-body mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-line rounded-xl text-xs font-medium focus:outline-none focus:border-rose-400 text-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-body mb-1">Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-line rounded-xl text-xs font-medium focus:outline-none focus:border-rose-400 text-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-body mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-line rounded-xl text-xs font-medium focus:outline-none focus:border-rose-400 text-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-body mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-line rounded-xl text-xs font-medium focus:outline-none focus:border-rose-400 text-ink"
                >
                  <option value="customer" className="bg-blush">Customer</option>
                  <option value="owner" className="bg-blush">Salon Owner</option>
                  <option value="staff" className="bg-blush">Stylist Staff</option>
                  <option value="admin" className="bg-blush">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-body mb-1">
                  Password {editingUser && '(Leave blank to retain current)'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!editingUser}
                  className="w-full px-3.5 py-2.5 bg-white border border-line rounded-xl text-xs font-medium focus:outline-none focus:border-rose-400 text-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-poppins font-medium uppercase tracking-wider text-body mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required={!editingUser}
                  className="w-full px-3.5 py-2.5 bg-white border border-line rounded-xl text-xs font-medium focus:outline-none focus:border-rose-400 text-ink"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-line text-body rounded-xl text-xs font-poppins font-medium hover:bg-blush transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-5 py-2 bg-ink hover:bg-rose-600 text-ivory rounded-xl text-xs font-poppins font-bold uppercase tracking-wider transition-all shadow-md"
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
