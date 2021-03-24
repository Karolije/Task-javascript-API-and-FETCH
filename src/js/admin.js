import './../css/admin.css';

import ExcursionsAPI from './ExcursionsAPI';

const api = new ExcursionsAPI();
console.log('admin');

document.addEventListener('DOMContentLoaded', init);

const panelExcursions = document.querySelector('.panel__excursions');

function init() {
    loadExcursions();
    removeExcursion();
    addExcursion();
    updateExcursions();
}

function loadExcursions() {
    api.load().then(data => {
        insertExcursions(data);
    })
        .catch(err => console.error(err));
}


function insertExcursions(excursionsArr) {
    console.log(excursionsArr);

    const all = document.querySelectorAll('.excursions__item:not(.excursions__item--prototype)');
    all.forEach(item => {
        item.parentElement.removeChild(item);
    })

    excursionsArr.forEach(item => {

        const excursionsItemProto = document.querySelector('.excursions__item--prototype');
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

    panelExcursions.addEventListener('click', e => {
        e.preventDefault();

        const element = e.target;

        if (element.className.includes('--remove')) {
            const liEl = e.target.parentElement.parentElement.parentElement
            const id = liEl.dataset.id;



            api.remove(id)
                .then(data => {
                    liEl.remove(liEl);
                })
                .catch(err => console.error(err));
        }
    })
}

function reload() {
    location.reload();
}

function addExcursion() {
    const addButton = document.querySelector('.order__field-submit');

    addButton.addEventListener('click', e => {
        e.preventDefault();



        const titleVal = e.target.parentElement.parentElement[0].value;
        const descriptionVal = e.target.parentElement.parentElement[1].value;
        const adultPriceVal = e.target.parentElement.parentElement[2].value;
        const childpriceVal = e.target.parentElement.parentElement[3].value;



        const data = {
            'title': titleVal,
            'description': descriptionVal,
            'adultPrice': adultPriceVal,
            'childPrice': childpriceVal,


        };
        

        api.add(data)
            .then(data => {
                loadExcursions(data);
            })
            .catch(err => console.error(err));

    });
}

function updateExcursions() {


    panelExcursions.addEventListener('click', e => {
        e.preventDefault();
        const targetEl = e.target;


        const element = e.target;

        if (element.className.includes('--update')) {
            const liEl = e.target.parentElement.parentElement.parentElement;




            const editList =
                liEl.querySelectorAll('.to-edit');
            console.log(editList)

            const isEditable = [...editList].every(span => span.isContentEditable);
            if (isEditable) {
                const id = liEl.dataset.id;

                const data = {
                    title: editList[0].textContent,
                    description: editList[1].textContent,
                    adultPrice: editList[2].textContent, childPrice: editList[3].textContent
                }
                
                api.update(data, id)
                    .then(resp => console.log(resp))
                    .catch(err => console.error(err))
                    .finally(() => {
                        targetEl.value = 'edytuj';
                        editList.forEach(span => span.contentEditable = false
                        )
                    })
            } else {

                targetEl.value = 'zapisz';
                editList.forEach(
                    span => span.contentEditable = true
                );
            }
        }
    })
}