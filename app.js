// Storage Controller
const StorageCtrl = (function(){
    return {
        getData: function () {
            if (localStorage.getItem('items') === null) {
                return [];
            } else {
                return JSON.parse(localStorage.getItem('items'));
            }
        },
        addItem: function (item) {
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }

            items.push(item);

            localStorage.setItem('items', JSON.stringify(items));
        },
        updateItem: function (item) {
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }

            items.splice(item.id, 1, item);

            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItem: function (id) {
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }

            items.splice(id, 1);

            let countId = 0;
            items.forEach(item => {
                item.id = countId;
                countId++;
            })

            localStorage.setItem('items', JSON.stringify(items));
        }
    }
})();

// Item Controller
const ItemCtrl = (function(StorageCtrl){
    //Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data Structure / State
    const data = {
        // items: [
        //     {id: 0, name: 'Steak Dinner', calories: 1200},
        //     {id: 1, name: 'Cookie', calories: 400},
        //     {id: 2, name: 'Eggs', calories: 300}
        // ]
        items: StorageCtrl.getData(),
        currentItem: null,
        totalCalories: 0
    }

    return {
        logData: function() {
            return StorageCtrl.getData();
        },
        getItems: function() {

            // return data.items;
            return StorageCtrl.getData();

        },
        setCurrentItem: function(id) {
            StorageCtrl.getData().forEach(item => {
                console.log(item.id, id);
                if (item.id === id) {
                    data.currentItem = item;
                }
            });

            return data.currentItem;
        },
        currentItemToNull: function() {
            data.currentItem = null;   
        },
        addItem: function(item) { 
            StorageCtrl.addItem(item);           
            // data.items.push(item);
            // console.log('Data from storage: ', StorageCtrl.getData());
        },
        updateItem: function(item) {
            StorageCtrl.updateItem(item);
            data.items.splice(item.id,1,item);
        },
        removeItem: function(id) {

            StorageCtrl.deleteItem(id);

            // if (data.items.length === 1) {
            //     data.items = [];
            // } else {
            //     console.log(data.items.splice(id,1));
            //     let countId = 0;
            //     data.items.forEach(item => {
            //         item.id = countId;
            //         countId++;
            //     })
            // }

        }, 
        getCurrentItem: function() {
            return data.currentItem;
        }
    }

})(StorageCtrl);

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
                    calories: calories,
                    mealInput: mealInput,
                    caloriesInput: caloriesInput
                }
            } else {
                return {
                    meal: null,
                    calories: null,
                    mealInput: mealInput,
                    caloriesInput: caloriesInput
                }
            }

        },
        getLiItems: function() {
            return document.querySelector('#item-list').getElementsByTagName('li');
        },
        displayCurrentItem: function() {
            const currentItem = ItemCtrl.getCurrentItem();
            if (currentItem) {
                const inputs = UICtrl.getItemsInput();
                inputs.mealInput.value = currentItem.name;
                inputs.caloriesInput.value = currentItem.calories;
                UICtrl.loadEditState();
            }
        },
        loadAddState: function() {
            document.querySelector('.add').style.display = 'inline';
            document.querySelector('.update').style.display = 'none';
            document.querySelector('.delete').style.display = 'none';
            document.querySelector('.back').style.display = 'none';
        },
        loadEditState: function() {
            document.querySelector('.add').style.display = 'none';
            document.querySelector('.update').style.display = 'inline';
            document.querySelector('.delete').style.display = 'inline';
            document.querySelector('.back').style.display = 'inline';
        }
    }

})(ItemCtrl);

// App Controller
const App = (function(ItemCtrl, UICtrl){
    
    //Public Methods
    return {
        init: function() {

            // load add state
            UICtrl.loadAddState();

            // get items
            const items = ItemCtrl.getItems();

            // update calories
            UICtrl.updateCalories();
            
            // display items
            UICtrl.displayItemInUL(items);
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
                
                // console.log(items);

                // display items
                UICtrl.displayItemInUL(items);

                e.stopPropagation();
                e.preventDefault();
                
            });

            // edit btn event listener (event delegation)
            document.querySelector('#item-list').addEventListener('click', function (event) {
                if (event.target.classList.contains('edit-item')) {
                    const id = event.target.parentElement.id.split('-')[1];
                    console.log('my id: ', id);
                    ItemCtrl.setCurrentItem(parseInt(id));
                    UICtrl.displayCurrentItem();
                }
            });

            // delete item
            document.querySelector('.delete').addEventListener('click', function() {
                
                let item = ItemCtrl.getCurrentItem();
                console.log('current item: ', item);
                let id = item.id;

                ItemCtrl.removeItem(id);

                // clear inputs
                const inputs = UICtrl.getItemsInput();
                inputs.mealInput.value = '';
                inputs.caloriesInput.value = '';

                // set current item to null
                ItemCtrl.currentItemToNull();

                // get items
                const items = ItemCtrl.getItems();

                // update calories
                UICtrl.updateCalories();
                
                // display items
                UICtrl.displayItemInUL(items);

                // change to add state
                UICtrl.loadAddState();

            });
            
            // update item
            document.querySelector('.update').addEventListener('click', function() {
                const inputs = UICtrl.getItemsInput();
                const meal = inputs.meal;
                const calories = inputs.calories;
                const item = ItemCtrl.getCurrentItem();
                const id = item.id;
                ItemCtrl.updateItem({id: id, name: meal, calories: parseInt(calories)});                

                // set current item to null
                ItemCtrl.currentItemToNull();

                // get items
                const items = ItemCtrl.getItems();

                // update calories
                UICtrl.updateCalories();
                
                // display items
                UICtrl.displayItemInUL(items);

                // change to add state
                UICtrl.loadAddState();
            });

            document.querySelector('.back').addEventListener('click', function() {
                const inputs = UICtrl.getItemsInput();
                inputs.mealInput.value = '';
                inputs.caloriesInput.value = '';

                UICtrl.loadAddState();
            });
    
        }
    }

})(ItemCtrl, UICtrl);

App.loadEventListeners();
App.init();