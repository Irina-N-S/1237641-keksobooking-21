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

const pinButton = document.getElementById(`pin`).content.querySelector(`button`);
const mapPins = document.querySelector(`.map__pins`);
const map = document.querySelector(`.map`);

const generatePinDocumentFragment = function (info) {
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

const main = function () {
  map.classList.remove(`map--faded`);

  generateOffersArray(MOCK_SET_COUNT).forEach(function (info) {
    const fragment = generatePinDocumentFragment(info);
    mapPins.appendChild(fragment);
  });
};

main();
