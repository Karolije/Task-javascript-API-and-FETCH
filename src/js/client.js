import './../css/client.css';

import ExcursionsAPI from './ExcursionsAPI';

console.log('client');

const api = new ExcursionsAPI();

const apiUrl = 'http://localhost:3000/excursions';
const orderUrl = 'http://localhost:3000/orders';

document.addEventListener('DOMContentLoaded', init);

const panelExcursions = document.querySelector('.panel__excursions');
const panelSummary = document.querySelector('.panel__summary');

function init() {
    sumCost();
    loadExcursions();
    addExcursionToOrder();
    removeExcursionFromOrder();
    order();
   
}

function sumCost() {
    const summaryTotalPrice = panelSummary.querySelectorAll('.summary__total-price');
    
    let costArray = [];
    summaryTotalPrice.forEach(el => costArray.push(el.textContent))

    let sum = 0;

    for(let i=1; i<costArray.length; i++) {
        sum += parseInt(costArray[i]);
    }
    
    const orderTotalPrice = document.querySelector('.order__total-price-value');
    orderTotalPrice.textContent = `${sum} PLN`;
    
}

function loadExcursions() {
    api.load().then(data => {
        insertExcursions(data);
    })
        .catch(err => console.error(err));
}

function insertExcursions(excursionsArr) {
    console.log(excursionsArr)
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

function addExcursionToOrder() {
    
    
    panelExcursions.addEventListener('click', e => {
        e.preventDefault();

        const element = e.target;
        
        if (element.className.includes('excursions__field-input--submit')) {

            let number = /^[0-9]+$/;
            const excursionsItem = element.parentElement.parentElement.parentElement;
            const numberOfAdults = excursionsItem.querySelector('[name="adults"]');
            const numberOfChildren = excursionsItem.querySelector('[name="children"]');
            if ((!number.test(numberOfAdults.value)) || (!number.test(numberOfChildren.value))) {
                alert('Wprowadź poprawną ilość uczestników')
            } else {

                const summaryItemProto = document.querySelector('.summary__item--prototype');
                const summaryItem = summaryItemProto.cloneNode(true);
                summaryItem.classList.remove('summary__item--prototype');
                const panelSummary = document.querySelector('.panel__summary');

                const excursionsTitle = excursionsItem.querySelector('.excursions__title');
                const priceAdults = excursionsItem.querySelector('.price__for__an__adult');
                const priceChildren = excursionsItem.querySelector('.price__for__a__child')


                const summaryName = summaryItem.querySelector('.summary__name');
                const summaryPrices = summaryItem.querySelector('.summary__prices');
                const summaryTotalPrice = summaryItem.querySelector('.summary__total-price');
                console.log(summaryTotalPrice)


                let totalPrice = parseInt(numberOfAdults.value) * parseInt(priceAdults.textContent) + parseInt(numberOfChildren.value) * parseInt(priceChildren.textContent);

                summaryTotalPrice.textContent = totalPrice;





                summaryName.textContent = excursionsTitle.textContent;
                summaryPrices.textContent = `Dorośli: ${numberOfAdults.value} x ${priceAdults.textContent}PLN, dzieci: ${numberOfChildren.value} x ${priceChildren.textContent}PLN`;



                panelSummary.appendChild(summaryItem);
                sumCost();

            }
            numberOfAdults.value = '';
            numberOfChildren.value = '';
        }
        
    })

}

function removeExcursionFromOrder() {


    panelSummary.addEventListener('click', e => {
        e.preventDefault();

        const element = e.target;

        if (element.className.includes('summary__btn-remove')) {
            panelSummary.removeChild(element.parentElement.parentElement);
            sumCost();
        }
    })
}

const orderSubmit = document.querySelector('.order__field-submit');



function order() {
    orderSubmit.addEventListener('click', e => {
        e.preventDefault();

        const errors = checkData(e);
        if (errors.length > 0) {
            
            panelOrder.appendChild(ulEl);
            ulEl.textContent = '';
            errors.forEach(function (errors) {
    
                const newLi = document.createElement('li');
                newLi.innerText = errors;
                ulEl.appendChild(newLi);
    
    
            });
    
        } else {
    
            const errors = document.querySelector('.errors');
            const orderTotalPrice = document.querySelector('.order__total-price-value');
            if (errors) {
                while (errors.children.length > 0) {
                    errors.removeChild(errors.lastElementChild);
    
                }
    
            }

            const orderData = e.target.parentElement.parentElement.parentElement;
        console.log(e.target.parentElement.parentElement.lastElementChild)

        const firstName = orderData.querySelector('[name="name"]');
        const email = orderData.querySelector('[name="email"]');
        const totalPrice = orderData.querySelector('.order__total-price-value');

        const summaryExList = [];
        const exList = document.querySelectorAll('.summary__item:not(.summary__item--prototype)');
        exList.forEach(li => {
            summaryExList.push({
                title: li.querySelector('.summary__name').innerText,
            })
        })


        const data = {
            name: firstName.value,
            email: email.value,
            totalPrice: totalPrice.textContent,
            summaryName: summaryExList,
            //  selectedTours
            //  numberOfAdults
            //  numberOfChildren
        }

        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        };
        fetch(orderUrl, options)
            .then(resp => {
                console.log(resp);
                alert("Dziękujemy za złożenie zamówienia o wartości " + orderTotalPrice.textContent + ". Wszelkie szczegóły zamówienia zostały wysłane na adres email: " + email.value);
            })
            .catch(err => console.error(err))
         

            
        }
        


    })
}

orderSubmit.addEventListener('click', checkData);

const panelOrder = document.querySelector('.panel__order');
const ulEl = document.createElement('ul');
ulEl.classList.add('errors');
orderSubmit.noValidate = true;

function reload() {
    location.reload();
}

function checkData(e) {
    const errors = [];
    const nameAndSurname = document.querySelector('[name="name"]');
    const email = document.querySelector('[name="email"]');
    
    if (panelSummary.children.length < 2) {
        e.preventDefault();
        errors.push('Wybierz wycieczkę');
    }
    if (nameAndSurname.value.length === 0) {
        e.preventDefault();
        errors.push('Uzupełnij imię i nazwisko');
    } if (email.value.length === 0) {
        e.preventDefault();
        errors.push('Wprowadź email');
    }
    const reg = /^[-\w\.]+@([-\w]+\.)+[a-z]+$/i;
    if ((!reg.test(email.value)) && (email.value.length > 0)) {
        e.preventDefault();
        errors.push('Wprowadź poprawny email');
    }

    return errors;
}