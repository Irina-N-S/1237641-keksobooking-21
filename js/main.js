'use strict';

var MAP_BLOCK_WIDTH = 1200;
var MAP_BLOCK_HEIGHT = 501;
var MAP_BLOCK_HEIGHT_SHIFT = 130;

var PIN_SHIFT_X = -50 / 2;
var PIN_SHIFT_Y = -70;

var MOCK_SET_COUNT = 8;
var AVATAR_SET_COUNT = 8;

var offerFactory = function (size) {

  var getRandomInt = function (max) {
    return Math.floor(Math.random() * Math.floor(max));
  };

  var shuffleArray = function (array) {
    array.sort(function () {
      return Math.random() - 0.5;
    });
  };

  var getRandomArrayElement = function (array) {
    var arrayLength = array.length;
    var randomIndex = getRandomInt(arrayLength);
    return array[randomIndex];
  };

  var copyArray = function (array) {
    return array.slice();
  };

  var getRandomArrayElements = function (source) {
    var len = getRandomInt(source.length) + 1;
    var result = copyArray(source);
    shuffleArray(result);
    for (var i = source.length; i > len; i--) {
      result.pop();
    }
    return result;
  };

  var avatarGenerator = {
    stackOfAvatars: [],
    size: function () {
      return this.stackOfAvatars.length;
    },
    generate: function (count) {
      var DOZEN = 10;
      for (var i = 1; i <= count; i++) {
        var index = i;
        if (i < DOZEN) {
          index = '0' + i;
        }
        this.stackOfAvatars.push('img/avatars/user' + index + '.png');
      }
      shuffleArray(this.stackOfAvatars);
    },
    pop: function () {
      return this.stackOfAvatars.pop();
    }
  };

  var generatePinInfo = function () {

    var getRandomAvatar = function () {
      if (avatarGenerator.size() === 0) {
        avatarGenerator.generate(AVATAR_SET_COUNT);
      }
      return avatarGenerator.pop();
    };

    var locationX = getRandomInt(MAP_BLOCK_WIDTH);
    var locationY = getRandomInt(MAP_BLOCK_HEIGHT) + MAP_BLOCK_HEIGHT_SHIFT;

    return {
      'author': {
        'avatar': getRandomAvatar(),
      },
      'offer': {
        'title': getRandomArrayElement(['1-я квартира', '2-я квартира', '3-я квартира']),
        'address': locationX + ', ' + locationY,
        'price': getRandomArrayElement([10000, 20000, 30000, 40000, 50000, 600000, 70000]),
        'type': getRandomArrayElement(['palace', 'flat', 'house', 'bungalo']),
        'rooms': getRandomArrayElement([1, 2, 3, 4, 5]),
        'guests': getRandomArrayElement([1, 2, 3, 4, 5, 6, 7]),
        'checkin': getRandomArrayElement(['12:00', '13:00', '14:00']),
        'checkout': getRandomArrayElement(['12:00', '13:00', '14:00']),
        'features': getRandomArrayElements(['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']),
        'description': getRandomArrayElement(['Просторная', 'Уютная', 'Комфортная', 'Близко к центру']),
        'photos': getRandomArrayElements(['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']),
      },
      'location': {
        'x': locationX,
        'y': locationY
      }
    };
  };

  var res = [];
  for (var i = 0; i < size; i++) {
    res.push(generatePinInfo());
  }
  return res;
};

var pinButton = document.getElementById('pin').content.querySelector('button');
var mapPins = document.querySelector('.map__pins');
var map = document.querySelector('.map');

var generatePinFragment = function (info) {
  var fragment = document.createDocumentFragment();
  var pin = pinButton.cloneNode(true);

  var img = pin.querySelector('img');
  img.src = info.author.avatar;
  img.alt = info.offer.title;

  var x = info.location.x + PIN_SHIFT_X;
  var y = info.location.y + PIN_SHIFT_Y;

  pin.setAttribute('style', 'left: ' + x + 'px; top: ' + y + 'px;');

  fragment.appendChild(pin);
  return fragment;
};

map.classList.remove('map--faded');

offerFactory(MOCK_SET_COUNT).forEach(function (info) {
  var fragment = generatePinFragment(info);
  mapPins.appendChild(fragment);
});
