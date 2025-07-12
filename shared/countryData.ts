export interface Country {
  name: string;
  code: string;
  regions: string[];
}

export const COUNTRIES: Country[] = [
  {
    name: "United States",
    code: "US",
    regions: [
      "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
      "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
      "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
      "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
      "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
      "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
      "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
      "Wisconsin", "Wyoming", "District of Columbia"
    ]
  },
  {
    name: "Canada",
    code: "CA",
    regions: [
      "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
      "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island",
      "Quebec", "Saskatchewan", "Yukon"
    ]
  },
  {
    name: "United Kingdom",
    code: "GB",
    regions: [
      "England", "Scotland", "Wales", "Northern Ireland"
    ]
  },
  {
    name: "Australia",
    code: "AU",
    regions: [
      "New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia",
      "Tasmania", "Northern Territory", "Australian Capital Territory"
    ]
  },
  {
    name: "Germany",
    code: "DE",
    regions: [
      "Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg",
      "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia",
      "Rhineland-Palatinate", "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"
    ]
  },
  {
    name: "France",
    code: "FR",
    regions: [
      "Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Brittany", "Centre-Val de Loire",
      "Corsica", "Grand Est", "Hauts-de-France", "Île-de-France", "Normandy", "Nouvelle-Aquitaine",
      "Occitanie", "Pays de la Loire", "Provence-Alpes-Côte d'Azur"
    ]
  },
  {
    name: "Japan",
    code: "JP",
    regions: [
      "Hokkaido", "Tohoku", "Kanto", "Chubu", "Kansai", "Chugoku", "Shikoku", "Kyushu"
    ]
  },
  {
    name: "Nigeria",
    code: "NG",
    regions: [
      "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
      "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa",
      "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger",
      "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
    ]
  },
  {
    name: "India",
    code: "IN",
    regions: [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
      "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
      "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
      "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
      "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh"
    ]
  },
  {
    name: "Brazil",
    code: "BR",
    regions: [
      "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo",
      "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará",
      "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro", "Rio Grande do Norte",
      "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
    ]
  },
  {
    name: "China",
    code: "CN",
    regions: [
      "Beijing", "Shanghai", "Tianjin", "Chongqing", "Hebei", "Shanxi", "Liaoning", "Jilin",
      "Heilongjiang", "Jiangsu", "Zhejiang", "Anhui", "Fujian", "Jiangxi", "Shandong", "Henan",
      "Hubei", "Hunan", "Guangdong", "Hainan", "Sichuan", "Guizhou", "Yunnan", "Shaanxi",
      "Gansu", "Qinghai", "Taiwan", "Inner Mongolia", "Guangxi", "Tibet", "Ningxia", "Xinjiang"
    ]
  },
  // Adding more countries to reach 100+
  { name: "Afghanistan", code: "AF", regions: ["Kabul", "Kandahar", "Herat", "Mazar-i-Sharif"] },
  { name: "Albania", code: "AL", regions: ["Tirana", "Durrës", "Vlorë", "Shkodër"] },
  { name: "Algeria", code: "DZ", regions: ["Algiers", "Oran", "Constantine", "Annaba"] },
  { name: "Argentina", code: "AR", regions: ["Buenos Aires", "Córdoba", "Santa Fe", "Mendoza"] },
  { name: "Armenia", code: "AM", regions: ["Yerevan", "Gyumri", "Vanadzor", "Vagharshapat"] },
  { name: "Austria", code: "AT", regions: ["Vienna", "Salzburg", "Innsbruck", "Graz"] },
  { name: "Azerbaijan", code: "AZ", regions: ["Baku", "Ganja", "Sumgayit", "Mingachevir"] },
  { name: "Bahrain", code: "BH", regions: ["Manama", "Muharraq", "Riffa", "Hamad Town"] },
  { name: "Bangladesh", code: "BD", regions: ["Dhaka", "Chittagong", "Sylhet", "Khulna"] },
  { name: "Belgium", code: "BE", regions: ["Brussels", "Antwerp", "Ghent", "Charleroi"] },
  { name: "Bolivia", code: "BO", regions: ["La Paz", "Santa Cruz", "Cochabamba", "Sucre"] },
  { name: "Bulgaria", code: "BG", regions: ["Sofia", "Plovdiv", "Varna", "Burgas"] },
  { name: "Cambodia", code: "KH", regions: ["Phnom Penh", "Siem Reap", "Battambang", "Sihanoukville"] },
  { name: "Chile", code: "CL", regions: ["Santiago", "Valparaíso", "Concepción", "La Serena"] },
  { name: "Colombia", code: "CO", regions: ["Bogotá", "Medellín", "Cali", "Barranquilla"] },
  { name: "Croatia", code: "HR", regions: ["Zagreb", "Split", "Rijeka", "Osijek"] },
  { name: "Czech Republic", code: "CZ", regions: ["Prague", "Brno", "Ostrava", "Plzen"] },
  { name: "Denmark", code: "DK", regions: ["Copenhagen", "Aarhus", "Odense", "Aalborg"] },
  { name: "Ecuador", code: "EC", regions: ["Quito", "Guayaquil", "Cuenca", "Santo Domingo"] },
  { name: "Egypt", code: "EG", regions: ["Cairo", "Alexandria", "Giza", "Luxor"] },
  { name: "Estonia", code: "EE", regions: ["Tallinn", "Tartu", "Narva", "Pärnu"] },
  { name: "Ethiopia", code: "ET", regions: ["Addis Ababa", "Dire Dawa", "Mekelle", "Gondar"] },
  { name: "Finland", code: "FI", regions: ["Helsinki", "Espoo", "Tampere", "Vantaa"] },
  { name: "Ghana", code: "GH", regions: ["Accra", "Kumasi", "Tamale", "Sekondi-Takoradi"] },
  { name: "Greece", code: "GR", regions: ["Athens", "Thessaloniki", "Patras", "Heraklion"] },
  { name: "Hungary", code: "HU", regions: ["Budapest", "Debrecen", "Szeged", "Miskolc"] },
  { name: "Iceland", code: "IS", regions: ["Reykjavik", "Kópavogur", "Hafnarfjörður", "Akureyri"] },
  { name: "Indonesia", code: "ID", regions: ["Jakarta", "Surabaya", "Bandung", "Medan"] },
  { name: "Iran", code: "IR", regions: ["Tehran", "Mashhad", "Isfahan", "Karaj"] },
  { name: "Iraq", code: "IQ", regions: ["Baghdad", "Basra", "Mosul", "Erbil"] },
  { name: "Ireland", code: "IE", regions: ["Dublin", "Cork", "Limerick", "Galway"] },
  { name: "Israel", code: "IL", regions: ["Jerusalem", "Tel Aviv", "Haifa", "Rishon LeZion"] },
  { name: "Italy", code: "IT", regions: ["Rome", "Milan", "Naples", "Turin"] },
  { name: "Jordan", code: "JO", regions: ["Amman", "Zarqa", "Irbid", "Russeifa"] },
  { name: "Kazakhstan", code: "KZ", regions: ["Almaty", "Nur-Sultan", "Shymkent", "Aktobe"] },
  { name: "Kenya", code: "KE", regions: ["Nairobi", "Mombasa", "Kisumu", "Nakuru"] },
  { name: "Kuwait", code: "KW", regions: ["Kuwait City", "Al Ahmadi", "Hawalli", "Al Farwaniyah"] },
  { name: "Latvia", code: "LV", regions: ["Riga", "Daugavpils", "Liepāja", "Jelgava"] },
  { name: "Lebanon", code: "LB", regions: ["Beirut", "Tripoli", "Sidon", "Tyre"] },
  { name: "Lithuania", code: "LT", regions: ["Vilnius", "Kaunas", "Klaipėda", "Šiauliai"] },
  { name: "Luxembourg", code: "LU", regions: ["Luxembourg City", "Esch-sur-Alzette", "Differdange", "Dudelange"] },
  { name: "Malaysia", code: "MY", regions: ["Kuala Lumpur", "George Town", "Ipoh", "Shah Alam"] },
  { name: "Mexico", code: "MX", regions: ["Mexico City", "Guadalajara", "Monterrey", "Puebla"] },
  { name: "Morocco", code: "MA", regions: ["Casablanca", "Rabat", "Fes", "Marrakech"] },
  { name: "Nepal", code: "NP", regions: ["Kathmandu", "Pokhara", "Lalitpur", "Bharatpur"] },
  { name: "Netherlands", code: "NL", regions: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht"] },
  { name: "New Zealand", code: "NZ", regions: ["Auckland", "Wellington", "Christchurch", "Hamilton"] },
  { name: "Nigeria", code: "NG", regions: ["Lagos", "Kano", "Ibadan", "Abuja"] },
  { name: "Norway", code: "NO", regions: ["Oslo", "Bergen", "Stavanger", "Trondheim"] },
  { name: "Pakistan", code: "PK", regions: ["Karachi", "Lahore", "Faisalabad", "Rawalpindi"] },
  { name: "Peru", code: "PE", regions: ["Lima", "Arequipa", "Trujillo", "Chiclayo"] },
  { name: "Philippines", code: "PH", regions: ["Manila", "Quezon City", "Caloocan", "Davao"] },
  { name: "Poland", code: "PL", regions: ["Warsaw", "Kraków", "Łódź", "Wrocław"] },
  { name: "Portugal", code: "PT", regions: ["Lisbon", "Porto", "Vila Nova de Gaia", "Amadora"] },
  { name: "Qatar", code: "QA", regions: ["Doha", "Al Rayyan", "Umm Salal", "Al Wakrah"] },
  { name: "Romania", code: "RO", regions: ["Bucharest", "Cluj-Napoca", "Timișoara", "Iași"] },
  { name: "Russia", code: "RU", regions: ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg"] },
  { name: "Saudi Arabia", code: "SA", regions: ["Riyadh", "Jeddah", "Mecca", "Medina"] },
  { name: "Singapore", code: "SG", regions: ["Central Region", "East Region", "North Region", "West Region"] },
  { name: "Slovakia", code: "SK", regions: ["Bratislava", "Košice", "Prešov", "Žilina"] },
  { name: "Slovenia", code: "SI", regions: ["Ljubljana", "Maribor", "Celje", "Kranj"] },
  { name: "South Africa", code: "ZA", regions: ["Johannesburg", "Cape Town", "Durban", "Pretoria"] },
  { name: "South Korea", code: "KR", regions: ["Seoul", "Busan", "Incheon", "Daegu"] },
  { name: "Spain", code: "ES", regions: ["Madrid", "Barcelona", "Valencia", "Seville"] },
  { name: "Sri Lanka", code: "LK", regions: ["Colombo", "Dehiwala-Mount Lavinia", "Moratuwa", "Sri Jayawardenepura Kotte"] },
  { name: "Sweden", code: "SE", regions: ["Stockholm", "Gothenburg", "Malmö", "Uppsala"] },
  { name: "Switzerland", code: "CH", regions: ["Zurich", "Geneva", "Basel", "Bern"] },
  { name: "Thailand", code: "TH", regions: ["Bangkok", "Nonthaburi", "Pak Kret", "Hat Yai"] },
  { name: "Turkey", code: "TR", regions: ["Istanbul", "Ankara", "Izmir", "Bursa"] },
  { name: "Ukraine", code: "UA", regions: ["Kyiv", "Kharkiv", "Odesa", "Dnipro"] },
  { name: "United Arab Emirates", code: "AE", regions: ["Dubai", "Abu Dhabi", "Sharjah", "Al Ain"] },
  { name: "Uruguay", code: "UY", regions: ["Montevideo", "Salto", "Paysandú", "Las Piedras"] },
  { name: "Venezuela", code: "VE", regions: ["Caracas", "Maracaibo", "Valencia", "Barquisimeto"] },
  { name: "Vietnam", code: "VN", regions: ["Ho Chi Minh City", "Hanoi", "Haiphong", "Da Nang"] },
  { name: "Zimbabwe", code: "ZW", regions: ["Harare", "Bulawayo", "Chitungwiza", "Mutare"] },
  { name: "Other", code: "XX", regions: ["Not Listed", "Prefer Not to Say"] }
];

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find(country => country.code === code);
}

export function getRegionsForCountry(countryCode: string): string[] {
  const country = getCountryByCode(countryCode);
  return country ? country.regions : [];
}