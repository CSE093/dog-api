const buyBtn = document.getElementById('buyBtn');
const seeOtherBtn = document.getElementById('seeOtherBtn');
const dogImage = document.getElementById('dogImage');
const dogMessage = document.getElementById('dogMessage');
const giftSection = document.getElementById('giftSection');
const giftBox = document.getElementById('giftBox');
const giftImage = document.getElementById('giftImage');
const giftMessage = document.getElementById('giftMessage');
const userContainer = document.getElementById('userContainer');
const stars = document.querySelectorAll('.star');

let dogBreed = "";
let dogPrice = 0;


function fetchRandomDog() {
    axios.get('https://dog.ceo/api/breeds/image/random')
        .then(response => {
            const dogUrl = response.data.message;
            dogImage.src = dogUrl;
            dogBreed = extractBreedFromUrl(dogUrl);
            dogPrice = generateRandomPrice();
            dogMessage.innerHTML = `Breed: <strong>${dogBreed}</strong> | Price: <strong>₹${dogPrice}</strong>`;
            giftMessage.innerHTML = "";
            userContainer.innerHTML = "";
            resetRating();
            resetGiftBox();
        })
        .catch(error => console.log(error));
}

function extractBreedFromUrl(url) {
    const parts = url.split('/');
    const breedIndex = parts.findIndex(part => part === 'breeds') + 1;
    return parts[breedIndex].replace('-', ' ').toUpperCase();
}

function generateRandomPrice() {
    return Math.floor(Math.random() * 50000) + 5000;
}


function buyDog() {
    dogMessage.innerHTML = `You bought a <strong>${dogBreed}</strong> for <strong>₹${dogPrice}</strong>! 🎉`;
    openGiftBox();
}


function openGiftBox() {
    giftImage.src = "treasure opened.jpg"; 
    setTimeout(() => {
        fetchRandomGift();
        fetchRandomUser();
    }, 1000); 
}


function fetchRandomGift() {
    axios.get('https://api.adviceslip.com/advice')
        .then(response => {
            giftMessage.innerHTML = `Your gift: <strong>${response.data.slip.advice}</strong>`;
        })
        .catch(error => console.log(error));
}


function fetchRandomUser() {
    axios.get('https://randomuser.me/api/')
        .then(response => {
            const user = response.data.results[0];
            userContainer.innerHTML = `
                <h3>Dog Purchased By:</h3>
                <p><strong>Name:</strong> ${user.name.first} ${user.name.last}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phone}</p>
                <img src="${user.picture.large}" alt="User Picture">
            `;
        })
        .catch(error => console.log(error));
}


function resetGiftBox() {
    giftImage.src = "treasureclosed.jpg";
    giftMessage.innerHTML = "";
}


stars.forEach(star => {
    star.addEventListener('click', () => {
        const ratingValue = star.getAttribute('data-value');
        highlightStars(ratingValue);
        dogMessage.innerHTML += `<br>You rated this dog <strong>${ratingValue} stars!</strong>`;
    });
});

function highlightStars(ratingValue) {
    stars.forEach(star => {
        star.style.color = star.getAttribute('data-value') <= ratingValue ? "gold" : "gray";
    });
}

function resetRating() {
    stars.forEach(star => {
        star.style.color = "gray";
    });
}

buyBtn.onclick = buyDog;
seeOtherBtn.onclick = fetchRandomDog;

fetchRandomDog();
