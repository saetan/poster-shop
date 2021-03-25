var loadNum = 4;
var watcher;

new Vue({
    el: '#app',
    data: {
        total:0,
        products: [],
        cart: [],
        search: "cat",
        lastSearch: "",
        loading: false,
        results: [],
    },
    methods: {
        addToCart: function(product){ //every time this method is being called
            this.total += product.price; //First add product's price to total price
            var found = false; // found is false
            for(var i = 0; i < this.cart.length; i++){ //looping all the products in the cart
                if(this.cart[i].id === product.id) { //if item in the cart is similar with the product id added into the cart
                    this.cart[i].qty++; //we increase the qty of this item as it is already in the card
                    found = true; //we set this to true
                }
            }

            if(!found){ //with this method loop iteration, if true, this will not trigger
                this.cart.push({ //when trigger, means this product not in this cart yet, so we will push this item as first time
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    qty: 1
                });
            }
        },

        inc: function(item){ //increase quanty in cart
            item.qty++; //increase item value in cart
            this.total += item.price;
        },
        
        dec: function(item){
            item.qty--;
            this.total -= item.price;
            if(item.qty <= 0){ // when qty is 0 or less than 0 we will have to remove this item off the cart
                var i = this.cart.indexOf(item); // find the position of this item in the array
                this.cart.splice(i,1); //cut one item off at position i
            }
        },

        onSubmit: function(){
            this.products =[]; //make an empty page when press search to give user know that it's loading
            this.loading = true;
            var path = "/search?q=".concat(this.search);
            this.$http.get(path).then(function(response) { //$ sign indiicatiion is a plugin method
                this.results = response.body;
                this.lastSearch = this.search;
                this.appendResults();
                this.loading = false;
            }); 
        },
        appendResults: function(){
            if(this.products.length < this.results.length) {
                var toAppend = this.results.slice(this.products.length, loadNum + this.products.length); //putting response as products, we slice it to show 4 items at one, scroll loading
                this.products = this.products.concat(toAppend);
            }
        }
    },
    filters:{
        currency: function(price){
            return "$".concat(price.toFixed(2)); //fixing price to 2 decimal place and concatenate $ infront of each price
        }
    },
    created: function() {
        this.onSubmit();
    },

    updated: function() {
        var sensor = document.querySelector("#product-list-bottom");
        watcher = scrollMonitor.create(sensor);
        watcher.enterViewport(this.appendResults); 
    },

    beforeUpdate: function(){
        if(watcher){
            watcher.destroy();
            watcher = null;
        }
    }
});