import './../css/admin.css';

import ExcursionsAPI from './ExcursionsAPI';

console.log('admin');
('.child__price');

const apiUrl = 'http://localhost:3000/excursions';

document.addEventListener('DOMContentLoaded', init);

function init() {
    loadExcursions();
    removeExcursion()
}

function loadExcursions() {
    fetch(apiUrl)
        .then(resp => {
            if(resp.ok) { return resp.json(); }
            return Promise.reject(resp);
        })
        .then(data => {
            insertExcursions(data);
        })
        .catch(err => console.error(err));
        }

function insertExcursions(excursionsArr) {
    console.log(excursionsArr)
    excursionsArr.forEach(item => {

        const excursionsItemProto = document.querySelector('.excursions__item--prototype');
        const panelExcursions = document.querySelector('.panel__excursions');
        const excursionsItem = excursionsItemProto.cloneNode(true);
        excursionsItem.classList.remove('excursions__item--prototype');


        const excursionsTitle = excursionsItem.querySelector('.excursions__title');
        const excursionsDescription = excursionsItem.querySelector('.excursions__description');
        const priceAdult = excursionsItem.querySelector('.price__for__an__adult');
        const priceChild = excursionsItem.querySelector('.price__for__a__child');

        excursionsItem.dataset.id = item.id;
        excursionsTitle.textContent = item.title;
        excursionsDescription.textContent = item.description;
        priceAdult.textContent = item.adultPrice;
        priceChild.textContent = item.childPrice;


        panelExcursions.appendChild(excursionsItem);
    });
}


function removeExcursion() {
    
    const deleteExcursion = excursionsItem.querySelector('.excursions__field-input--remove');
    deleteExcursion.addEventListener('click', e => {
        const targetEl = e.target;
        if(targetEl.tagName === 'LI') {
            const id = targetEl.dataset.id;
            const options = { method: 'DELETE' };
            fetch(`${apiUrl}/${id}`, options)
                .then(resp => console.log(resp))
                .catch(err => console.error(err))
                .finally( loadExcursions );
        }
    })
}