function scrollWin() {
    window.scrollTo(0,200000);
  }

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}
function ready() {
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseBtnClicked)
}

function purchaseClicked() {
    var cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}
const produtos = []
const preco = []
function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    produtos.push(title)
    preco.push(price)
    console.log(price)
    addItemToCart(title, price)
    updateCartTotal()
}
// adiciona o item selecionado no carrinh 
function addItemToCart(title, price) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('voce ja adicionou este item ao carrinho')
            return
        }
    }
    var cartRowContents = `
        <div class="cart-item cart-column">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}
// atualiza o valor total do carrinho 
function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('R$', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = 'R$' + total
    return total
}
// modal section
var modalBtn = document.querySelector('.modal-btn')
var modalBg = document.querySelector('.modal-bg')
var modalClose = document.querySelector('.modal-close');
function purchaseBtnClicked(){
    modalBg.classList.add('bg-active')
}
// fechar o modal 
modalClose.addEventListener('click',function(){
    modalBg.classList.remove('bg-active')
});

const preencherFormulario = (endereco) =>{
    document.getElementById('endereco').value = endereco.logradouro
}

const pesquisarCep = async() =>{
    const cep = document.getElementById('zipCode').value;
    const url = `https://viacep.com.br/ws/${cep}/json/`
    const dados = await fetch(url)
    const endereco = await dados.json()
    if (endereco.hasOwnProperty('erro')){
        document.getElementById('endereco').value = 'CEP não encontrado'  
    }
    else{
        preencherFormulario(endereco)

    }
}
document.getElementById('zipCode').addEventListener('focusout',pesquisarCep)


//mandar pelo wpp:

function sendinfo(){
    var nome = document.getElementById("name").value
    var telefone = document.getElementById("telefone").value
    var selectedValue = document.getElementById("listLugar").value
    var selectedValue2 = document.getElementById("listPagamento").value
    var textArea = document.getElementById("textArea").value
    var zipCode = document.getElementById("zipCode").value
    var endereco = document.getElementById("endereco").value
    var numero = document.getElementById("numero").value
    var complemento = document.getElementById("complemento").value
    var t = updateCartTotal()
    var soma = parseInt(t) + parseInt(frete)
    var url = 
        "https://wa.me/5511972829249?text="
        + "*Nome: *" + nome + "%0a"
        + "*Telefone: *" + telefone + "%0a"
        + "*Entrega: *" + selectedValue + "%0a"
        + "*Forma De Pagamento: *" + selectedValue2 + "%0a"
        + "*Observações: *" + textArea + "%0a"
        + "*CEP: *" + zipCode + "%0a"
        + "*Endereço*: " + endereco + "%0a"
        + "*Numero: *" + numero + "%0a"
        + "*Complemento: *" + complemento + "%0a"
        + "*Produtos: *" + produtos + "%0a"
        + "*Preço dos produtos: *" + preco + "%0a"
        + "*Frete a pagar: *" + "R$" + frete + "%0a"
        + "*total a pagar:" + "R$" + soma +"*"+ "%0a"
        
    window.open(url,"_blank").focus();
    alert("Obrigado por comprar na monster burguer, seu pedido estará pronto em breve")
}

function distanceMatrix(){
    var geocoder = new google.maps.Geocoder();
    var endereco = document.getElementById("endereco").value
    let address = endereco;
     geocoder.geocode({ address: address }, (results, status) => {
            // Display response in the console
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            console.log(latitude,longitude)
            var origin1 = new google.maps.LatLng(-23.452274214976352, -46.56748671352249);
            var destinationA = new google.maps.LatLng(latitude,longitude);
        
            var service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix({
                origins: [origin1],
                destinations: [destinationA],
                travelMode: 'DRIVING',
            }, callback)
})
}
//fim do distance matrix
//inicio da callback function que me da os valores de distance 
    function callback(response, status) {
        if (status == 'OK') {
          var origins = response.originAddresses;
          var destinations = response.destinationAddresses;
      
          for (var i = 0; i < origins.length; i++) {
            var results = response.rows[i].elements;
            for (var j = 0; j < results.length; j++) {
              var element = results[j];
              var distance = element.distance.text;
              var duration = element.duration.text;
              var from = origins[i];
              var to = destinations[j];
              
            }
          }
        }
    calculaFrete(distance)
    console.log(distance,duration,to,from)    
}
const frete = []
function calculaFrete(distance){
    console.log(distance)
    if (distance <= "2 km"){
        alert('Frete: R$ 4,00')
        frete.push(4)
    }
    else if(distance > "2 km" && distance <= "3 km"){
        alert('Frete: R$ 5,50')
        frete.push(5,50)
    }
    else if(distance > "3 km" && distance <= "4 km"){
        alert('Frete: R$ 7,00')
        frete.push(7)
    }
    else if(distance > "4 km" && distance <= "5 km"){
        alert('Frete: R$ 8,50')
        frete.push(8,50)
    }
    else if(distance > "5 km" && distance <= "6 km"){
        alert('Frete: R$ 10,00')
        frete.push(10)
    }
    else if(distance > "6 km" && distance <= "7 km"){
        alert('Frete: R$ 11,50')
        frete.push(11,50)
    }
    else if(distance > "7 km" && distance <= "8 km"){
        alert('Frete: R$ 13,00')
        frete.push(13)
    }
    else if(distance > "8 km" && distance <= "9 km"){
        alert('Frete: R$ 14,50')
        frete.push(14,50)
    }
    else{
        alert('erro')
    }
}
document.getElementsByClassName('btn-end')[0].addEventListener('click',sendinfo)
document.getElementsByClassName('btn-frete')[0].addEventListener('click',distanceMatrix)


