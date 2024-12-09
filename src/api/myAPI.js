import axios from 'axios';

//Overpass
export const getPlacesData = async (type, sw, ne) => {
  const cacheKey = `${type}-${sw.lat},${sw.lng}-${ne.lat},${ne.lng}`;
  const cachedData = localStorage.getItem(cacheKey);

  // Якщо є кешовані дані, обробляємо їх
  if (cachedData) {
    console.log('Returning cached data');
    const cachedElements = JSON.parse(cachedData);
    return processPlacesData(cachedElements); // Обробляємо кешовані дані
  }

  try {
    const query = type === 'hospital' 
      ? `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](${sw.lat},${sw.lng},${ne.lat},${ne.lng});
          node["amenity"="clinic"](${sw.lat},${sw.lng},${ne.lat},${ne.lng});
        );
        out body;
      `
      : `
        [out:json][timeout:25];
        (
          node["amenity"="${type}"](${sw.lat},${sw.lng},${ne.lat},${ne.lng});
        );
        out body;
      `;

    const { data } = await axios.post('https://overpass-api.de/api/interpreter', query, {
      headers: { 'Content-Type': 'text/plain' },
    });

    // Кешуємо отримані дані
    localStorage.setItem(cacheKey, JSON.stringify(data.elements));

    // Обробляємо отримані дані
    return processPlacesData(data.elements);
  } catch (error) {
    console.log('Error fetching data from Overpass API:', error.message);
    return error.message;
  }
};

// Логіка обробки даних для кешу та API
const processPlacesData = (elements) => {
  const defaultImages = {
    hospital: 'https://prometheus.org.ua/wp-content/uploads/2024/10/%D0%A6%D0%B8%D0%BA%D0%BB-%D0%BE%D0%BD%D0%BB%D0%B0%D0%B9%D0%BD-%D0%BA%D1%83%D1%80%D1%81%D1%96%D0%B2-%D0%9D%D0%B0%D0%B4%D0%B0%D0%BD%D0%BD%D1%8F-%D0%B5%D0%BA%D1%81%D1%82%D1%80%D0%B5%D0%BD%D0%BE%D1%97-%D0%BC%D0%B5%D0%B4%D0%B8%D1%87%D0%BD%D0%BE%D1%97-%D0%B4%D0%BE%D0%BF%D0%BE%D0%BC%D0%BE%D0%B3%D0%B8-%D0%BD%D0%B0-%D0%B4%D0%BE%D0%B3%D0%BE%D1%81%D0%BF%D1%96%D1%82%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%BC%D1%83-%D0%B5%D1%82%D0%B0%D0%BF%D1%96.jpg',
    clinic: 'https://prometheus.org.ua/wp-content/uploads/2024/10/%D0%A6%D0%B8%D0%BA%D0%BB-%D0%BE%D0%BD%D0%BB%D0%B0%D0%B9%D0%BD-%D0%BA%D1%83%D1%80%D1%81%D1%96%D0%B2-%D0%9D%D0%B0%D0%B4%D0%B0%D0%BD%D0%BD%D1%8F-%D0%B5%D0%BA%D1%81%D1%82%D1%80%D0%B5%D0%BD%D0%BE%D1%97-%D0%BC%D0%B5%D0%B4%D0%B8%D1%87%D0%BD%D0%BE%D1%97-%D0%B4%D0%BE%D0%BF%D0%BE%D0%BC%D0%BE%D0%B3%D0%B8-%D0%BD%D0%B0-%D0%B4%D0%BE%D0%B3%D0%BE%D1%81%D0%BF%D1%96%D1%82%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%BC%D1%83-%D0%B5%D1%82%D0%B0%D0%BF%D1%96.jpg',
    pharmacy: 'https://text.ua/images/blog/pharmacy.jpg',
    shelter: 'https://www.ratusha.if.ua/wp-content/uploads/2024/11/AqVcRI5xuyLLibc5cdG1AkKWUHUL8Uk6BOWfKX4U.jpg',
    default: 'https://via.placeholder.com/350',
  };

  const randomPhoneNumbers = [
    '096-456-7890',
    '098-765-4321',
    '050-123-4567',
    '063-888-9999',
    '098-567-8901',
    '096-123-4567',
    '066-555-5555',
    '098-333-2222',
    '099-888-7777',
    '099-333-4444',
  ];

  return elements.map((item) => {
    const defaultName = 
      item.tags.amenity === 'hospital' ? 'Лікарня' :
      item.tags.amenity === 'clinic' ? 'Лікарня' :
      item.tags.amenity === 'pharmacy' ? 'Аптека' :
      item.tags.amenity === 'shelter' ? 'Укриття' :
      'Unknown Name';

    const placeImage = item.photo
      ? item.photo.images.large.url
      : defaultImages[item.tags.amenity] || defaultImages.default;

    const phoneNumber = item.tags['phone'] || item.tags['phone:UA'] || item.tags['contact:phone']
      ? item.tags['phone'] || item.tags['phone:UA'] || item.tags['contact:phone']
      : randomPhoneNumbers[Math.floor(Math.random() * randomPhoneNumbers.length)];

    return {
      id: item.id,
      latitude: item.lat,
      longitude: item.lon,
      amenity: item.tags.amenity,
      photo: placeImage,
      name: item.tags.name || defaultName,
      phone: phoneNumber,
      website: item.tags['website'] || item.tags['contact:website'] || 'No website available',
    };
  });
};


//Geoocoding
export const getAddressFromCoordinates = async (lat, lng) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  try {
    const { data } = await axios.get(url);
    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return 'Адреса не знайдена';
  } catch (error) {
    console.error('Error fetching address from Google API:', error.message);
    return error.message;
  }
};

// Отримуємо область з адреси
export const extractRegionFromAddress = (address) => {
  const parts = address.split(',');
  let region = parts.find((part) => part.trim().endsWith('область'));
  if (region === undefined || address.includes('м. Київ')) {
    return 'м. Київ';
  }
  return region ? region.trim() : null;
};

// Перевіряємо тривогу в області
export const checkAlertForRegion = async (region) => {
  if (!region) {
    return false;
  }

  // Індекс області
  const regionIndexes = {
    "Хмельницька область": 3,
    "Вінницька область": 4,
    "Рівненська область": 5,
    "Волинська область": 8,
    "Дніпропетровська область": 9,
    "Житомирська область": 10,
    "Закарпатська область": 11,
    "Запорізька область": 12,
    "Івано-Франківська область": 13,
    "Київська область": 14,
    "Кіровоградська область": 15,
    "Луганська область": 16,
    "Миколаївська область": 17,
    "Одеська область": 18,
    "Полтавська область": 19,
    "Сумська область": 20,
    "Тернопільська область": 21,
    "Харківська область": 22,
    "Херсонська область": 23,
    "Черкаська область": 24,
    "Чернігівська область": 25,
    "Чернівецька область": 26,
    "Львівська область": 27,
    "Донецька область": 28,
    "Автономна Республіка Крим": 29,
    "м. Севастополь": 30,
    "м. Київ": 31
  };
  
  const regionIndex = regionIndexes[region];
  if (regionIndex === undefined) {
    return false;
  }

  const token = process.env.REACT_APP_ALERT_IN_UA_API_KEY;
  const url = `v1/iot/active_air_raid_alerts/${regionIndex}.json`;
  try {
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (data === 'A' || data === 'P') {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error fetching active alerts:', error.message);
    return error.message;
  }
};


// Об'єднана функція, отримує статус тривоги за координатами
export const getAlertStatus = async (lat, lng) => {
  try {
    const address = await getAddressFromCoordinates(lat, lng);
    const region = extractRegionFromAddress(address);
    const alertStatus = await checkAlertForRegion(region);
    return alertStatus;
  } catch (error) {
    console.error('Error checking alert status:', error.message);
    return false;
  }
};

