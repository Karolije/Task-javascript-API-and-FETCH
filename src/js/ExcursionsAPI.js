class ExcursionsAPI {
    constructor() {
        this.apiUrl = 'http://localhost:3000/excursions';
       
    }

    load() {
        return fetch(this.apiUrl)
        .then(resp => {
            if(resp.ok) { return resp.json(); }
            return Promise.reject(resp);
        })
    }

    remove(id) {
        return fetch(`${this.apiUrl}/${id}`, {
            method: 'DELETE',
    })
        .then(resp => {
            if(resp.ok) { return resp.json(); }
            return Promise.reject(resp);
        })
    }

}

export default ExcursionsAPI;