new Vue({
    el: '#app',
    data: {
        total:0,
        products: [],
        cart: [],
        search: "",
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
            var path = "/search?q=".concat(this.search);
            this.$http.get(path).then(function(response) {
                console.log(response);
            }); //$ sign indiicatiion is a plugin method
        }

    },
    filters:{
        currency: function(price){
            return "$".concat(price.toFixed(2)); //fixing price to 2 decimal place and concatenate $ infront of each price
        }
    }
});
