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
  'prices': [10000, 20000, 30000, 40000, 50000, 600000, 70000, null],
  'types': [`palace`, `flat`, `house`, `bungalow`],
  'rooms': [1, 2, 3, 4, 5, null],
  'guests': [1, 2, 3, 4, 5, 6, 7, null],
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
  const len = getRandomInt(source.length);
  const result = copyArray(source);
  shuffleArray(result);
  for (let i = source.length; i > len; i--) {
    result.pop();
  }
  return result;
};

const plural = function (forms, number) {
  let index;
  if (number % 10 === 1 && number % 100 !== 11) {
    index = 0; // many
  } else if (number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) {
    index = 1; // few
  } else {
    index = 2; // one
  }
  return forms[index] || ``;
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
  const setContentOrRemove = function (element, text) {
    if (text) {
      element.textContent = text;
      return;
    }
    element.remove();
  };

  const setupPrice = function (card, price) {
    const element = card.querySelector(`p.popup__text--price`);
    if (price) {
      element.innerHTML = `${info.offer.price} &#x20bd;<span>/ночь</span>`;
      return;
    }
    element.remove();
  };

  const setupCapacity = function (card, roomsCount, guestCount) {
    const element = card.querySelector(`p.popup__text--capacity`);
    if (!roomsCount) {
      element.remove();
      return;
    }
    let text = `${info.offer.rooms} ${plural([`комната`, `комнаты`, `комнат`], info.offer.rooms)}`;
    if (guestCount) {
      text += ` для ${info.offer.guests} ${plural([`гость`, `гостей`, `гостей`], info.offer.guests)}`;
    }
    element.textContent = text;
  };

  const setupCheckinCheckout = function (card, checkinTime, checkoutTime) {
    const element = card.querySelector(`p.popup__text--time`);
    element.textContent = `Заезд после ${checkinTime || `-`}, выезд до ${checkoutTime || `-`}`;
  };

  const setupFeatures = function (card, list) {
    const featuresListDomElement = card.querySelector(`ul.popup__features`);
    if (list.length === 0) {
      featuresListDomElement.remove();
      return;
    }
    const featuresListElementTemplate = card.querySelector(`ul.popup__features > li`);
    featuresListElementTemplate.classList.forEach((cl) => {
      featuresListElementTemplate.classList.remove(cl);
    });
    card.querySelectorAll(`ul.popup__features > li`).forEach((element) => {
      element.remove();
    });
    list.forEach((code) => {
      const li = featuresListElementTemplate
        .cloneNode(true);
      li.classList.add(`popup__feature`, `popup__feature--${code}`);

      featuresListDomElement.appendChild(li);
    });
  };

  const setupPhotos = function (card, list) {
    const popupPhotoDomElement = card.querySelector(`div.popup__photos`);
    if (list.length === 0) {
      popupPhotoDomElement.remove();
      return;
    }
    const popupPhotoElementTemplate = card.querySelector(`div.popup__photos > img`);
    popupPhotoElementTemplate.classList.forEach((cl) => {
      popupPhotoElementTemplate.classList.remove(cl);
    });

    card.querySelectorAll(`div.popup__photos > img`).forEach((element) => {
      element.remove();
    });

    list.forEach((url) => {
      const img = popupPhotoElementTemplate
        .cloneNode(true);
      img.classList.add(`popup__photo`);

      img.src = url;
      popupPhotoDomElement.appendChild(img);
    });
  };

  const setupAvatar = function (card, url) {
    let avatarElement = card.querySelector(`img.popup__avatar`);
    if (url) {
      avatarElement.src = url;
      return;
    }
    avatarElement.remove();
  };

  const getOfferTypeName = function (type) {
    let name = `Квартира`;
    switch (type) {
      case `bungalow`:
        name = `Бунгало`;
        break;

      case `house`:
        name = `Дом`;
        break;

      case `palace`:
        name = `Дворец`;
        break;

      case `flat`:
        name = `Квартира`;
        break;

      default:
        name = ``;
        break;
    }
    return name;
  };

  const cardElement = document
    .getElementById(`card`)
    .content
    .querySelector(`article`)
    .cloneNode(true);
  setContentOrRemove(cardElement.querySelector(`h3.popup__title`), info.offer.title);
  setContentOrRemove(cardElement.querySelector(`p.popup__text--address`), info.offer.address);

  setupPrice(cardElement, info.offer.price);

  setContentOrRemove(cardElement.querySelector(`h4.popup__type`), getOfferTypeName(info.offer.type));
  setupCapacity(cardElement, info.offer.rooms, info.offer.guests);
  setupCheckinCheckout(cardElement, info.offer.checkin, info.offer.checkout);

  setupFeatures(cardElement, info.offer.features || []);
  setContentOrRemove(cardElement.querySelector(`p.popup__description`), info.offer.description);

  setupPhotos(cardElement, info.offer.photos);
  setupAvatar(cardElement, info.author.avatar);

  return cardElement;
};

const main = function () {
  const mapPins = document.querySelector(`.map__pins`);
  const map = document.querySelector(`.map`);
  const mapFiltersContainer = map.querySelector(`.map__filters-container`);
  map.classList.remove(`map--faded`);

  const offerInfos = generateOffersArray(MOCK_SET_COUNT);
  offerInfos
    .forEach(function (info) {
      const pinFragment = createPinDocumentFragment(info);
      mapPins.appendChild(pinFragment);
    });

  const firstOfferInfo = offerInfos[0];
  const offerCard = createOfferCardFragment(firstOfferInfo);
  map.insertBefore(offerCard, mapFiltersContainer);
};

main();
