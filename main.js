var itemStates = {};
var items = {};
var filters = [];
var containers = []
var superContainers = []
var meta = {}

$(document).ready(() => {
    $.getJSON('db.json', (json) => {

        const collections = json.collections;
        meta = json.meta;

        for (var collection in collections) {
            superContainers.push(collection.split(' ').join('-'))
            for (var slot in collections[collection]) {
                containers.push(collection.split(' ').join('-') + '-' + slot.split(' ').join('-'))
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
                    <div class="item inactive tooltipped" id="${Item.id}" style="background-image:url('resource/${Item.url}')">
                        <div class="tooltip">
                        <div class="dlc-badge" style="background-image:url('${Item.dlc + '.png' || ''}')"></div>
                        <div class="tooltip-title">${Item.damage ? `<img class="damage-icon" src="${Item.damage.toLowerCase()}.png">` : ''}${Item.name}</div>
                        <div class="small">${Item.detail.source || meta.defaults[Item.item].source}</div>
                        <div class="separator"></div>
                            <div class="tooltip-subtitle">${Item.detail.desc}</div>
                        </div>
                    </div>`
                    itemStates[collections[collection][slot][item].id] = 'inactive';
                }
                itemStatesCollection += `<div class="main-category" id="${collection.split(' ').join('-') + '-' + slot.split(' ').join('-')}" data-heading="${slot}">${itemStatesSlot}</div>`
            }
            $('#main-container').append(`<div class="main-super-category" id="${collection.split(' ').join('-')}" data-heading="${collection}">${itemStatesCollection}</div>`)
        }

        loadItems();

        for (item in itemStates) {
            if (itemStates[item] === 'active') {
                $(`#${item}`).addClass('active')
                $(`#${item}`).removeClass('inactive')
            }
        }

        $('.item').click((event) => {
            let target = $(event.target);
            if (target.hasClass('active')) {
                if (target.hasClass('masterwork') || !items[event.target.id].detail.masterworkable) {
                    target.addClass('inactive');
                    target.removeClass('active');
                    target.removeClass('masterwork');
                    saveItem(event.target.id, 'inactive');
                } else {
                    target.addClass('masterwork');
                }
            } else {
                target.addClass('active');
                target.removeClass('inactive');
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
            let key = item.data('filter-key'), value = item.data('filter-value')
            if (item.hasClass('filter-list-item-active')) {
                filters.splice(filters.findIndex(compareObject({ key: key, value: value })), 1)
            } else {
                filters.push({ key: key, value: value })
            }
            filterItems();
            item.toggleClass('filter-list-item-active')
        })
    })
})

function compareObject(object) {
    return (otherObject) => {
        return JSON.stringify(object) === JSON.stringify(otherObject)
    }
}

function loadItems() {
    itemStates = JSON.parse(localStorage.getItem('destiny-collector-item-states')) || (() => {
        let object = {}
        for (key of Object.keys(items)) {
            object[key] = 'inactive'
        }
        return object
    })()
}

function saveItem(item, state) {
    itemStates[item] = state;
    localStorage.setItem('destiny-collector-item-states', JSON.stringify(itemStates));
}

function filterItems() {
    for (item in items) {
        let Item = items[item]
        $(`#${Item.id}`).css({ 'display': 'block' })
        for (filter of filters) {
            if (Item[filter.key] != filter.value) {
                $(`#${Item.id}`).css('display', 'none')
                break
            }
        }
    }
    $('.main-category').show();
    $('.main-super-category').show();
    formatContainers();

}

function formatContainers() {
    $('.main-category').each((index, object) => {
        if (Object.keys($(`#${object.id}>*:visible`)).length - 2 == 0) {
            $(`#${object.id}`).hide();
        }
    })

    $('.main-super-category').each((index, object) => {
        if (Object.keys($(`#${object.id}>*:visible`)).length - 2 == 0) {
            $(`#${object.id}`).hide();
        }
    })
}