import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      "ID": "",
      "Name": "",
		  "Education_type": "",
		  "Year": 1970
    }
  },
  actions: {
    storeUser(user) {
      this.ID = user.ID;
      this.Name = user.Name;
      this.Education_type = user.Education_type;
      this.Year = user.Year;
    }
  }
})
