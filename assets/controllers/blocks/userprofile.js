// MOBX STORAGE

import { makeAutoObservable } from 'mobx';
import axios from 'axios';

class UserState {
    user = null;
    showModal = false;
    loading = false;
    forgot = false;
    message = '';

    vehicleType = {
        Car: ['Engine Capacity', 'Doors', 'Category', 'Color'],
        Motorcycle: ['Engine Capacity','Color'],
        Truck: ['Engine Capacity', 'Beds', 'Color'],
        Trailer: ['Load Capacity', 'Axles'],
    };

    constructor() {
        makeAutoObservable(this);
    }

    setForgot(value) {
        this.forgot = value;
        this.message = '';
    }
    

    async checkLogin() {
        this.loading = true; // Set loading to true when fetching
        try {
            const response = await axios.get('/check-user');
            if (response.data.loggedIn) {
                this.loading = false;
                this.setUser(response.data);
            } else {
                this.clearUser();
            }
        } catch (error) {
            this.clearUser();
        } finally {
            this.loading = false; // Reset loading after fetching
        }
    }

    async logout() {
        try {
            await axios.post('/logout', {}, { withCredentials: true });
            this.clearUser();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    setUser(userData) {
        this.user = userData;
    }

    clearUser() {
        this.user = null;
    }

    toggleModal(value) {
        this.showModal = value; 
        if(value == true){
            this.setForgot(false);
            this.message = '';
        }
    }
}
export const userState = new UserState();