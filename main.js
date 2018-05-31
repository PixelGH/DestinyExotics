var itemStates = {};
var items = {};
var filters = {};

$(document).ready(() => {
    $.getJSON('db.json', (json) => {
        
        const collections = json.collections;

        for (var collection in collections) {
            for (var slot in collections[collection]) {
                for (var item in collections[collection][slot]) {
                    let Item = collections[collection][slot][item]
                    items[Item.id] = Item;
                }
            }
        }
    
        for (var collection in collections) {
            let itemStatesCollection = '';
            for (var slot in collections[collection]) {
                let itemStatesSlot = '';
                for (var item in collections[collection][slot]) {
                    let Item = collections[collection][slot][item]
                    itemStatesSlot += `
                    <div class="item inactive" id="${Item.id}" style="background-image:url('resource/${Item.url}')">
                        <div class="tooltip">
                            <div class="dlc-badge" style="background-image:url('${Item.dlc + '.png' || ''}')"></div>
                            <div class="tooltip-title">${Item.damage ? `<img class="damage-icon" src="${Item.damage.toLowerCase()}.png">` : ''}${Item.name}</div>
                            <div class="small">${Item.detail.source || 'Drop, Engram, Xûr'}</div>
                            <div class="separator"></div>
                            <div class="tooltip-subtitle">"Lorem Ipsum dolor sit amet consetetur adiscipim elitr."</div>
                        </div>
                    </div>`
                    itemStates[collections[collection][slot][item].id] = 'inactive';
                }
                itemStatesCollection += `<div class="main-category" data-heading="${slot}">${itemStatesSlot}</div>`
            }
            $('#main-container').append(`<div class="main-super-category" data-heading="${collection}">${itemStatesCollection}</div>`)
        }

        loadItems();

        for (item in itemStates) {
            if (itemStates[item] === 'active') {
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

        $('.item').mousemove((event) => {
            var x = event.clientX, y = event.clientY
            let tooltip = $(event.target).find('.tooltip')
            tooltip.css({
                'top': `${y - $(event.target).offset().top - 65 + $(document).scrollTop()}px`,
                'left': `${x - $(event.target).offset().left + (tooltip.width() + x + 60 >= $(window).width() ? -tooltip.width() - 40 : 20)}px`
            })
        })

        $('.filter-list-title').click((event) => {
            let button = $(event.target)
            let caret = button.find('span')
            caret.toggleClass('fa-caret-down')
            caret.toggleClass('fa-caret-up')
            button.toggleClass('collapsed')
        })

        $('.filter-list-item').click((event) => {
            let item = $(event.target)
            if (item.hasClass('filter-list-item-active')) {
                delete filters[item.data('filter-key')]
            } else {
                filters[item.data('filter-key')] = item.data('filter-value');
            }
            filterItems();
            item.toggleClass('filter-list-item-active')
        })
    })
})

function saveItems() {
    for (item in itemStates) {
        localStorage.setItem(item, itemStates[item]);
    }
}

function loadItems() {
    for (item in itemStates) {
        itemStates[item] = localStorage.getItem(item) || 'inactive';
    }
}

function saveItem(item, state) {
    localStorage.setItem(item, state);
}

function filterItems() {
    for (item in items) {
        let Item = items[item]
        $(`#${Item.id}`).css({'display': 'block'})
        for (filter in filters) {
            let value = filters[filter]
            if (Item[filter] != value) {
                console.log(Item.id)
                $(`#${Item.id}`).css('display', 'none')
                break
            }
        }
    }
}