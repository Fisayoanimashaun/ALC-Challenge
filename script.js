const supportedCards = {
        visa, mastercard
      };

      const countries = [
        {
          code: "US",
          currency: "USD",
          country: 'United States'
        },
        {
          code: "NG",
          currency: "NGN",
          country: 'Nigeria'
        },
        {
          code: 'KE',
          currency: 'KES',
          country: 'Kenya'
        },
        {
          code: 'UG',
          currency: 'UGX',
          country: 'Uganda'
        },
        {
          code: 'RW',
          currency: 'RWF',
          country: 'Rwanda'
        },
        {
          code: 'TZ',
          currency: 'TZS',
          country: 'Tanzania'
        },
        {
          code: 'ZA',
          currency: 'ZAR',
          country: 'South Africa'
        },
        {
          code: 'CM',
          currency: 'XAF',
          country: 'Cameroon'
        },
        {
          code: 'GH',
          currency: 'GHS',
          country: 'Ghana'
        }
      ];
      const appState = {}

      const formatAsMoney = (amount, buyerCountry)=> {
        let curr = countries.find((count)=>{
          return count.country == buyerCountry;
        });
        if(!curr){
          curr ="USD";
        }else{
          curr = curr.currency;
        }
        return amount.toLocaleString('en-US', {
          style: 'currency',
          currency: curr

        });

      };

      const flagIfInvalid = (field, isValid)=>{
        if(isValid){
          field.removeAttribute('is-invalid');
        }else{
          field.setAttribute('is-invalid');
        }
      }

      const expiryDateFormatIsValid = (target)=>{
        if(target.value.split('/').length === 2){
          return true;
        }else{
          return false;
        }
      }


      const detectCardType = ({target})=> {
      //target is the first of the input field
        const firstNumber = target.value.charAt(0);
        const dataCreditDiv = document.querySelector('div[data-credit-card]');
        let stringValue = ""
        const dataTypeImg = document.querySelector('img[data-card-type]')

        if(firstNumber == 4){
          dataCreditDiv.classList.add('is-visa')
          stringValue = 'is-visa'
          dataTypeImg.src = supportedCards.visa
          return stringValue;

        }else if(firstNumber == 5){
          stringValue = "is-mastercard"
          dataTypeImg.src = supportedCards.mastercard
          dataCreditDiv.classList.add('is-mastercard');
          return stringValue;
        }else{
          dataCreditDiv.classList.remove('is-visa');
          dataCreditDiv.classList.remove('is-mastercard');
          dataTypeImg.src = 'http://placehold.it/120x60.png?text=Card.';
          return stringValue;
        }
      };


      const validateCardExpiryDate = ({target})=>{
        const slash = expiryDateFormatIsValid(target);
        //target is the card's expiry date field
        const dateInput = target.value.split('/')
        const year = '20' + dateInput[0]
        const t = new Date();
        t.setFullYear(year, month - 1);
        const expired = (t < new Date())? true: false;
        if(!expired && slash){
          flagIfInvalid(target, true);
          return true;
        }else{
          flagIfInvalid(target, false)
          return false;
        }
      }

      const validateCardHolderName = ({target})=>{
        let cardHolderName = target.split(' ');
        if(cardHolderName.length === 2){
          let name = cardHolderName[0];
          let surname = cardHolderName[1];
          if(name.length>= 3 && surname.length>= 3){
            flagIfInvalid(target, true)
            return true;
          }else{
            flagIfInvalid(target, false)
            return false;
          }
        }else{
          flagIfInvalid(target, false)
          return false;
        }
      }
      const validateWithLuhn = (digits)=>{
        if(digits.length != 16) return false;
        let sum = 0;
        for(let i = digits.length-1; i >= 0; i--){
          if(i % 2 == 0) {
            digits[i] *= 2;

          	if(digits[i] > 9){
            	digits[i] -= 9
          }
         }
          sum += digits[i];
        }
        return sum % 10 === 0

      };

      const validateCardNumber = ()=>{
        const digitDiv = document.querySelector('[data-cc-digits]');
        const digitInput = document.querySelectorAll('div[data-cc-digits] input')
        let digits = [];
        digitInput.forEach(input => digits.push(input.value));
        digits = digits.join('').split('');
        digits.forEach((o, i, a) => {
          a[i] = Number(o);
        });
        const valid = validateWithLuhn(digits);
        if(valid){
          digitDiv.remove('class');
        }else{
          digitDiv.setAttribute('class', 'is-invalid');
        }
      };


      const uiCanInteract = ()=> {

       const ccDigit = document.querySelector('div[data-cc-digits]').firstElementChild;
        ccDigit.addEventListener('blur', detectCardType);

       const ccInfo = document.querySelectorAll('div[data-cc-info] input');
       //first input element
       ccInfo[0].addEventListener('blur', validateCardHolderName);
        //second input element
        ccInfo[1].addEventListener('blur', validateCardExpiryDate);

        button = document.querySelector('button[data-pay-btn]')
        button.addEventListener('click', validateCardNumber);
        ccDigit.focus();
      }

      const displayCartTotal = ({results}) => {
        const [data] = results
        const {buyerCountry, itemsInCart} = data
        appState.items = itemsInCart
        appState.country = buyerCountry

        appState.bill = itemsInCart.reduce((sum, num)=> {
          accumulator = sum.price*sum.qty
          currentValue = num.price*num.qty
          return(accumulator + currentValue);
        });

        appState.billFormated = formatAsMoney(appState.bill, appState.country)
        document.querySelector('span[data-bill]').textContent = appState.billFormated;

        uiCanInteract();
      }

      const fetchBill = ()=>{
        const api = "https://randomapi.com/api/006b08a801d82d0c9824dcfdfdfa3b3c"
        fetch(api)
        .then(response => response.json())
        .then(data => {
          displayCartTotal(data);
        })
        .catch((err)=> {
          console.log(err);
        });
      }
      const startApp = () => {
        fetchBill();
      };

      startApp();
