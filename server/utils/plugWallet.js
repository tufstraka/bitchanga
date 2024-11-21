class PlugWalletManager {
  constructor() {
    this.connected = false;
    this.address = null;
  }

  async connect() {
    if (typeof window.ic?.plug === 'undefined') {
      throw new Error('Plug wallet is not installed');
    }

    const whitelist = [process.env.CANISTER_ID];
    const host = process.env.DFX_NETWORK;

    try {
      const connected = await window.ic.plug.requestConnect({
        whitelist,
        host
      });
      
      if (connected) {
        this.connected = true;
        this.address = await window.ic.plug.principalId();
        return true;
      }
    } catch (error) {
      console.error('Plug wallet connection error:', error);
      return false;
    }
  }

  async disconnect() {
    if (this.connected) {
      await window.ic.plug.disconnect();
      this.connected = false;
      this.address = null;
    }
  }

  isConnected() {
    return this.connected;
  }

  getAddress() {
    return this.address;
  }
}

module.exports = new PlugWalletManager();