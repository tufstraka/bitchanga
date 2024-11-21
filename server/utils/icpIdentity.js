const { AuthClient } = require('@dfinity/auth-client');
const { HttpAgent } = require('@dfinity/agent');

class ICPIdentityManager {
  constructor() {
    this.authClient = null;
    this.identity = null;
  }

  async initialize() {
    this.authClient = await AuthClient.create();
    if (await this.authClient.isAuthenticated()) {
      this.identity = await this.authClient.getIdentity();
    }
  }

  async login() {
    return new Promise((resolve) => {
      this.authClient.login({
        identityProvider: process.env.II_URL,
        onSuccess: async () => {
          this.identity = await this.authClient.getIdentity();
          resolve(true);
        },
        onError: () => resolve(false)
      });
    });
  }

  async logout() {
    await this.authClient.logout();
    this.identity = null;
  }

  getIdentity() {
    return this.identity;
  }
}

module.exports = new ICPIdentityManager();