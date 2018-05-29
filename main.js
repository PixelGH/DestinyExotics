$.getJSON('db.json', (json) => {
    
    const collections = json.collections;

    for (var collection in collections) {
        let itemsCollection = '';
        for (var slot in collections[collection]) {
            let itemsSlot = '';
            for (var item in collections[collection][slot]) {
                itemsSlot += `<div class="item inactive" id="${collections[collection][slot][item].id}" style="background-image:url('resource/${collections[collection][slot][item].url}')"></div>`
            }
            itemsCollection += `<div class="main-category" title="${slot}">${itemsSlot}</div>`
        }
        $('#main-container').append(`<div class="main-super-category" title=${collection}>${itemsCollection}</div>`)
    }
})


$(document).ready(() => {
    $('.item').click((event) => {
        $(event.target).addClass('active');
        $(event.target).removeClass('inactive');
    })
})