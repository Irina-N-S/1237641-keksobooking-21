'use strict';

const MAP_BLOCK_WIDTH = 1200;
const MAP_BLOCK_HEIGHT = 501;
const MAP_BLOCK_HEIGHT_SHIFT = 130;

const PIN_SHIFT_X = -50 / 2;
const PIN_SHIFT_Y = -70;

const MOCK_SET_COUNT = 8;
const AVATAR_SET_COUNT = 8;

const dataset = {
  'titles': [`1-я квартира`, `2-я квартира`, `3-я квартира`],
  'prices': [10000, 20000, 30000, 40000, 50000, 600000, 70000],
  'types': [`palace`, `flat`, `house`, `bungalow`],
  'rooms': [1, 2, 3, 4, 5],
  'guests': [1, 2, 3, 4, 5, 6, 7],
  'times': [`12:00`, `13:00`, `14:00`],
  'features': [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`],
  'descriptions': [`Просторная`, `Уютная`, `Комфортная`, `Близко к центру`],
  'photos': [
    `http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
    `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
    `http://o0.github.io/assets/images/tokyo/hotel3.jpg`
  ]
};

const getRandomInt = function (max) {
  return Math.floor(Math.random() * Math.floor(max));
};

const shuffleArray = function (array) {
  array.sort(function () {
    return Math.random() - 0.5;
  });
};

const getRandomArrayElement = function (array) {
  const arrayLength = array.length;
  const randomIndex = getRandomInt(arrayLength);
  return array[randomIndex];
};

const copyArray = function (array) {
  return array.slice();
};

const getRandomArrayElements = function (source) {
  const len = getRandomInt(source.length) + 1;
  const result = copyArray(source);
  shuffleArray(result);
  for (let i = source.length; i > len; i--) {
    result.pop();
  }
  return result;
};

const generateOffersArray = function (size) {
  const avatarGenerator = {
    stackOfAvatars: [],
    size() {
      return this.stackOfAvatars.length;
    },
    generate(count) {
      const DOZEN = 10;
      for (let i = 1; i <= count; i++) {
        let index = i;
        if (i < DOZEN) {
          index = `0${i}`;
        }
        this.stackOfAvatars.push(`img/avatars/user${index}.png`);
      }
      shuffleArray(this.stackOfAvatars);
    },
    pop() {
      return this.stackOfAvatars.pop();
    }
  };

  const generatePinInfo = function () {

    const getRandomAvatar = function () {
      if (avatarGenerator.size() === 0) {
        avatarGenerator.generate(AVATAR_SET_COUNT);
      }
      return avatarGenerator.pop();
    };

    const locationX = getRandomInt(MAP_BLOCK_WIDTH);
    const locationY = getRandomInt(MAP_BLOCK_HEIGHT) + MAP_BLOCK_HEIGHT_SHIFT;

    return {
      'author': {
        'avatar': getRandomAvatar(),
      },
      'offer': {
        'title': getRandomArrayElement(dataset.titles),
        'address': `${locationX}, ${locationY}`,
        'price': getRandomArrayElement(dataset.prices),
        'type': getRandomArrayElement(dataset.types),
        'rooms': getRandomArrayElement(dataset.rooms),
        'guests': getRandomArrayElement(dataset.guests),
        'checkin': getRandomArrayElement(dataset.times),
        'checkout': getRandomArrayElement(dataset.times),
        'features': getRandomArrayElements(dataset.features),
        'description': getRandomArrayElement(dataset.descriptions),
        'photos': getRandomArrayElements(dataset.photos)
      },
      'location': {
        'x': locationX,
        'y': locationY
      }
    };
  };

  const res = [];
  for (let i = 0; i < size; i++) {
    res.push(generatePinInfo());
  }
  return res;
};

const createPinDocumentFragment = function (info) {
  const pinButton = document.getElementById(`pin`).content.querySelector(`button`);
  const fragment = document.createDocumentFragment();
  const pin = pinButton.cloneNode(true);

  const img = pin.querySelector(`img`);
  img.src = info.author.avatar;
  img.alt = info.offer.title;

  const x = info.location.x + PIN_SHIFT_X;
  const y = info.location.y + PIN_SHIFT_Y;

  pin.setAttribute(`style`, `left: ${x}px; top: ${y}px;`);
  fragment.appendChild(pin);
  return fragment;
};

const createOfferCardFragment = function (info) {
  const cardElement = document
    .getElementById(`card`)
    .content
    .querySelector(`article`)
    .cloneNode(true);

  cardElement.querySelector(`h3.popup__title`).textContent = info.offer.title;
  cardElement.querySelector(`p.popup__text--address`).textContent = info.offer.address;
  cardElement.querySelector(`p.popup__text--price`).innerHTML = `${info.offer.price} &#x20bd;<span>/ночь</span>`;
  cardElement.querySelector(`p.popup__text--address`).textContent = info.offer.address;

  let ruOfferType = `Квартира`;
  switch (info.offer.type) {
    case `bungalow`:
      ruOfferType = `Бунгало`;
      break;

    case `house`:
      ruOfferType = `Дом`;
      break;

    case `palace`:
      ruOfferType = `Дворец`;
      break;

    case `flat`:
    default:
      break;
  }
  cardElement.querySelector(`h4.popup__type`).textContent = ruOfferType;
  cardElement.querySelector(`p.popup__text--capacity`).innerHTML = `${info.offer.rooms} комнаты для ${info.offer.guests} гостей`;
  cardElement.querySelector(`p.popup__text--time`).innerHTML = `Заезд после ${info.offer.checkin}, выезд до ${info.offer.checkout}`;

  const featuresListDomElement = cardElement.querySelector(`ul.popup__features`);
  const featuresListElementTemplate = cardElement.querySelector(`ul.popup__features > li`);
  featuresListElementTemplate.classList.forEach((cl) => {
    featuresListElementTemplate.classList.remove(cl);
  });

  cardElement.querySelectorAll(`ul.popup__features > li`).forEach((element) => {
    element.remove();
  });

  info.offer.features.forEach((code) => {
    const li = featuresListElementTemplate
      .cloneNode(true);
    li.classList.add(`popup__feature`, `popup__feature--${code}`);

    featuresListDomElement.appendChild(li);
  });

  cardElement.querySelector(`p.popup__description`).textContent = info.offer.description;

  const popapPhotoDomElement = cardElement.querySelector(`div.popup__photos`);
  const popapPhotoElementTemplate = cardElement.querySelector(`div.popup__photos > img`);
  popapPhotoElementTemplate.classList.forEach((cl) => {
    popapPhotoElementTemplate.classList.remove(cl);
  });

  cardElement.querySelectorAll(`div.popup__photos > img`).forEach((element) => {
    element.remove();
  });

  info.offer.photos.forEach((url) => {
    const img = popapPhotoElementTemplate
      .cloneNode(true);
    img.classList.add(`popup__photo`);

    img.src = url;
    popapPhotoDomElement.appendChild(img);
  });

  cardElement.querySelector(`img.popup__avatar`).src = info.author.avatar;
  return cardElement;
};

const main = function () {
  const mapPins = document.querySelector(`.map__pins`);
  const map = document.querySelector(`.map`);
  map.classList.remove(`map--faded`);

  generateOffersArray(MOCK_SET_COUNT).forEach(function (info) {
    const pinFragment = createPinDocumentFragment(info);
    const offerCard = createOfferCardFragment(info);
    mapPins.appendChild(pinFragment);
    mapPins.appendChild(offerCard);
  });
};

main();
