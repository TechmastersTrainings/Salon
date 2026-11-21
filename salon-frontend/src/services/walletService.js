import api from './api';

export const walletService = {
  // Get wallet details
  getWallet: async () => {
    const response = await api.get('/payments/wallet/');
    return response.data;
  },

  // Get wallet status
  getStatus: async () => {
    const response = await api.get('/payments/wallet/status/');
    return response.data;
  },

  // Create recharge order
  createRecharge: async (amount) => {
    const response = await api.post('/payments/wallet/recharge/', { amount });
    return response.data;
  },

  // Verify recharge
  verifyRecharge: async (transactionId, amount) => {
    const response = await api.post('/payments/wallet/verify/', {
      transaction_id: transactionId,
      amount,
    });
    return response.data;
  },

  // Get transaction history
  getTransactions: async () => {
    const response = await api.get('/payments/wallet/transactions/');
    return response.data;
  },
};