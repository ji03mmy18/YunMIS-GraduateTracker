import { defineStore } from "pinia";

export const useManagerStore = defineStore('manager', {
  state: () => {
    return {
      "User": "",
      "Nick": "",
		  "Deletable": 1
    }
  },
  actions: {
    storeManager(manager) {
      this.User = manager.user;
      this.Nick = manager.nick;
      this.Deletable = manager.deletable;
    }
  }
})
