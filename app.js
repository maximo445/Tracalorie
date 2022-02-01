// Storage Controller

// Item Controller
const ItemCtrl = (function(){
    //Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data Structure / State
    const data = {
        items: [
            {id: 0, name: 'Steak Dinner', calories: 1200},
            {id: 1, name: 'Cookie', calories: 400},
            {id: 2, name: 'Eggs', calories: 300}
        ],
        currentItem: null,
        totalCalories: 0
    }

    return {
        logData: function() {
            return data.items;
        },
        getItems: function() {

            return data.items;

            // if(data.items.length > 0) {
            //     return data.items;
            // } else {
            //     return null;
            // }

        },
        addItem: function(item) {
            
            data.items.push(item);

            console.log('Items pushed to data!');
        }
    }

})();

// UI Controller
const UICtrl = (function(ItemCtrl){
    
    const selectors = {
        itemList: '#item-list',
        addBtn: '.add'
    }

    //Public Methods
    return {
        displayItemInUL: function(items){
            const itemList = document.querySelector('#item-list');
            itemList.innerHTML = '';
            let numberOfItems = itemList.getElementsByTagName('li').length;
            if(items) {
                items.forEach(foodItem => {
                    let newItem = document.createElement('li');
                    newItem.className = 'collection-item';
                    newItem.id = `item-${numberOfItems}`;
                    newItem.innerHTML = `
                    <span class="info">
                        <strong>${foodItem.name}: </strong> <em>${foodItem.calories} Calories</em>
                    </span>
                    <a href="#" class="edit-item">Edit</a>
                `;
                itemList.appendChild(newItem);
                numberOfItems++;
                });
            }
        },
        updateCalories: function() {
            let calories = 0;
            ItemCtrl.getItems().forEach(item => {
                calories += item.calories;
            });
            document.querySelector('.total-calories').textContent = calories;
        },
        getSelectors: function() {
            return selectors;
        },
        getItemsInput: function() {
            const mealInput = document.querySelector('#item-name');
            const caloriesInput = document.querySelector('#item-calories');

            const meal = mealInput.value;
            const calories = caloriesInput.value;

            if (mealInput.value != '' && caloriesInput.value != '') {
                mealInput.value = '';
                caloriesInput.value = '';
    
                return {
                    meal: meal,
                    calories: calories
                }
            } else {
                return {
                    meal: null,
                    calories: null
                }
            }

        }
    }

})(ItemCtrl);

// App Controller
const App = (function(ItemCtrl, UICtrl){
    
    //Public Methods
    return {
        init: function() {

            // get items
            const items = ItemCtrl.getItems();

            // update calories
            UICtrl.updateCalories();
            
            // display items
            UICtrl.displayItemInUL(items);

            console.log(ItemCtrl.logData());
        },
        loadEventListeners: function () {
            // Get UI Selectors
            const UISelectors = UICtrl.getSelectors();
    
            // add event listeners
            document.querySelector(UISelectors.addBtn).addEventListener('click', function(e) {                
                
                // get form input from ui controller
                const itemsInput = UICtrl.getItemsInput();
                const count = document.querySelector(UISelectors.itemList).getElementsByTagName('li').length;
                // add item to data
                if(itemsInput.meal && itemsInput.calories) {
                    ItemCtrl.addItem({id: count, name: itemsInput.meal, calories: parseInt(itemsInput.calories)}); 
                    UICtrl.updateCalories();  
                }

                 // get items
                const items = ItemCtrl.getItems();
                
                console.log(items);

                // display items
                UICtrl.displayItemInUL(items);

                e.stopPropagation();
                e.preventDefault();
                
            });
            
    
        }
    }

})(ItemCtrl, UICtrl);

App.loadEventListeners();
App.init();