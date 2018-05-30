var items = {};

$(document).ready(() => {
    $.getJSON('db.json', (json) => {
        
        const collections = json.collections;
    
        for (var collection in collections) {
            let itemsCollection = '';
            for (var slot in collections[collection]) {
                let itemsSlot = '';
                for (var item in collections[collection][slot]) {
                    itemsSlot += `<div class="item inactive" id="${collections[collection][slot][item].id}" style="background-image:url('resource/${collections[collection][slot][item].url}')"></div>`
                    items[collections[collection][slot][item].id] = 'inactive';
                }
                itemsCollection += `<div class="main-category" title="${slot}">${itemsSlot}</div>`
            }
            $('#main-container').append(`<div class="main-super-category" title=${collection}>${itemsCollection}</div>`)
        }

        loadItems();

        for (item in items) {
            if (items[item] === 'active') {
                $(`#${item}`).addClass('active')
                $(`#${item}`).removeClass('inactive')
            }
        }
    
        $('.item').click((event) => {
            if ($(event.target).hasClass('active')) {
                $(event.target).addClass('inactive');
                $(event.target).removeClass('active');
                saveItem(event.target.id, 'inactive');
            } else {
                $(event.target).addClass('active');
                $(event.target).removeClass('inactive');
                saveItem(event.target.id, 'active');
            }
        })
    })
})

function saveItems() {
    for (item in items) {
        localStorage.setItem(item, items[item]);
    }
}

function loadItems() {
    for (item in items) {
        items[item] = localStorage.getItem(item) || 'inactive';
    }
}

function saveItem(item, state) {
    localStorage.setItem(item, state);
}