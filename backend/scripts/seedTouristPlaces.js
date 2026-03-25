const mongoose = require("mongoose");
const connectDB = require("../config/db");
const TouristPlace = require("../models/TouristPlace");
const { getIndiaLocations } = require("../services/indiaLocations");
const { getTouristPlaceLocation } = require("../services/touristPlaceLocations");

const stateSpecificTemplates = {
  Karnataka: {
    "Bengaluru Urban": [
      { placeName: "Cubbon Park", category: "Park", description: "A green lung of the city with heritage paths and gardens.", bestSeason: "October - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.5 },
      { placeName: "Lalbagh Botanical Garden", category: "Garden", description: "A historic botanical garden known for glasshouses and seasonal flower shows.", bestSeason: "January - March", averageVisitTime: "2-3 Hours", entryFee: 20, timings: "6:00 AM - 7:00 PM", rating: 4.6 },
      { placeName: "Vidhana Soudha", category: "Architecture", description: "An iconic neo-Dravidian legislative building and landmark of Bengaluru.", bestSeason: "Any Time", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.3 },
    ],
    Mysuru: [
      { placeName: "Mysore Palace", category: "Palace", description: "A grand royal palace rich in architecture and history.", bestSeason: "October - March", averageVisitTime: "3-4 Hours", entryFee: 70, timings: "10:00 AM - 5:30 PM", rating: 4.7 },
      { placeName: "Chamundi Hills", category: "Hill", description: "A scenic hill with panoramic views and the Chamundeshwari Temple.", bestSeason: "September - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.5 },
      { placeName: "Brindavan Gardens", category: "Garden", description: "Famous for illuminated fountains and landscaped terraces.", bestSeason: "October - February", averageVisitTime: "2-3 Hours", entryFee: 20, timings: "6:00 AM - 9:00 PM", rating: 4.4 },
    ],
    Kodagu: [
      { placeName: "Abbey Falls", category: "Waterfall", description: "A spectacular waterfall surrounded by coffee plantations and forest.", bestSeason: "June - September", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "9:00 AM - 5:00 PM", rating: 4.4 },
      { placeName: "Madikeri Fort", category: "Fort", description: "A historic fort that offers views and heritage displays.", bestSeason: "October - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "9:00 AM - 5:00 PM", rating: 4.2 },
      { placeName: "Iruppu Falls", category: "Waterfall", description: "A beautiful waterfall in the Brahmagiri range known for its misty ambiance.", bestSeason: "June - October", averageVisitTime: "2 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.3 },
      { placeName: "Raja's Seat", category: "Viewpoint", description: "A scenic viewpoint in Madikeri known for its sunsets and valley views.", bestSeason: "October - February", averageVisitTime: "1-2 Hours", entryFee: 20, timings: "5:30 AM - 8:00 PM", rating: 4.5 },
      { placeName: "Talacauvery", category: "Pilgrimage", description: "The birthplace of the river Kaveri and a famous spiritual site in the Western Ghats.", bestSeason: "October - March", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "6:00 AM - 7:00 PM", rating: 4.6 },
      { placeName: "Pushpagiri Wildlife Sanctuary", category: "Wildlife", description: "A lush sanctuary with trekking trails, birdlife, and rich biodiversity.", bestSeason: "October - March", averageVisitTime: "3-4 Hours", entryFee: 0, timings: "6:00 AM - 6:00 PM", rating: 4.3 },
      { placeName: "Mandalpatti Viewpoint", category: "Viewpoint", description: "A high-altitude viewpoint offering sweeping views of the Coorg hills and valleys.", bestSeason: "October - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "6:00 AM - 6:00 PM", rating: 4.4 },
      { placeName: "Irupu Falls", category: "Waterfall", description: "A majestic waterfall in a forested gorge near the Brahmagiri range.", bestSeason: "June - October", averageVisitTime: "2 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.3 },
    ],
    "Dakshina Kannada": [
      { placeName: "St. Mary's Islands", category: "Beach", description: "A unique island cluster with striking hexagonal basalt rock formations.", bestSeason: "October - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "9:00 AM - 5:00 PM", rating: 4.6 },
      { placeName: "Kudroli Gokarnath Temple", category: "Temple", description: "A prominent temple complex known for its annual festivities.", bestSeason: "Any Time", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "6:00 AM - 8:00 PM", rating: 4.4 },
    ],
    Udupi: [
      { placeName: "Malpe Beach", category: "Beach", description: "A popular coastal destination with ferry rides and sunset views.", bestSeason: "October - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.5 },
      { placeName: "Krishna Temple", category: "Temple", description: "A historic temple town with deep spiritual significance.", bestSeason: "Any Time", averageVisitTime: "2 Hours", entryFee: 0, timings: "5:00 AM - 9:00 PM", rating: 4.6 },
    ],
    "Bagalkote": [
      { placeName: "Badami Caves", category: "Cave", description: "Rock-cut cave temples with carved sculptures and dramatic sandstone cliffs.", bestSeason: "November - February", averageVisitTime: "2-3 Hours", entryFee: 50, timings: "9:00 AM - 5:30 PM", rating: 4.6 },
      { placeName: "Badami Fort", category: "Fort", description: "An ancient fort with historical significance and striking views of the town.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "9:00 AM - 5:30 PM", rating: 4.2 },
      { placeName: "Agastya Lake", category: "Lake", description: "A calm lake near Badami known for its reflective scenery and local ambience.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.3 },
      { placeName: "Pattadakal", category: "Heritage", description: "A UNESCO heritage site with a cluster of beautifully carved temples and monuments.", bestSeason: "November - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.7 },
      { placeName: "Aihole", category: "Heritage", description: "An ancient temple town known for its early Hindu and Jain architecture.", bestSeason: "November - February", averageVisitTime: "3-4 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.5 },
    ],
    "Vijayapura (Bijapur)": [
      { placeName: "Gol Gumbaz", category: "Monument", description: "A massive mausoleum of Adil Shah known for its extraordinary whispering gallery.", bestSeason: "October - March", averageVisitTime: "2 Hours", entryFee: 20, timings: "10:00 AM - 5:30 PM", rating: 4.7 },
      { placeName: "Ibrahim Rouza", category: "Monument", description: "A serene mosque and tomb complex reflecting Indo-Islamic architecture.", bestSeason: "October - March", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "9:00 AM - 6:00 PM", rating: 4.4 },
      { placeName: "Jami Masjid", category: "Mosque", description: "A historic mosque known for its elegant architecture and heritage importance.", bestSeason: "October - March", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "9:00 AM - 6:00 PM", rating: 4.4 },
      { placeName: "Bijapur Fort", category: "Fort", description: "A historic fort complex with massive walls and heritage monuments.", bestSeason: "October - March", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.3 },
      { placeName: "Almatti Dam", category: "Dam", description: "A large dam and reservoir offering scenic views and a major landmark in the district.", bestSeason: "October - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.4 },
      { placeName: "Gagan Mahal", category: "Palace", description: "A historic palace with impressive architecture and cultural significance.", bestSeason: "October - March", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "9:00 AM - 6:00 PM", rating: 4.3 },
      { placeName: "Asar Mahal", category: "Heritage", description: "A heritage building known for its lovely architecture and historic charm.", bestSeason: "October - March", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "9:00 AM - 6:00 PM", rating: 4.2 },
      { placeName: "Upli Buruj", category: "Monument", description: "A historic tower and landmark reflecting the city’s rich past.", bestSeason: "October - March", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "9:00 AM - 6:00 PM", rating: 4.2 },
      { placeName: "Bara Kamaan", category: "Monument", description: "A historic gateway and architectural landmark with strong heritage value.", bestSeason: "October - March", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "9:00 AM - 6:00 PM", rating: 4.1 },
      { placeName: "Shivagiri", category: "Pilgrimage", description: "A sacred hilltop site known for its temple and scenic surroundings.", bestSeason: "October - March", averageVisitTime: "2 Hours", entryFee: 0, timings: "Open all day", rating: 4.3 },
    ],
    "Vijayanagara": [
      { placeName: "Hampi", category: "Heritage", description: "A UNESCO World Heritage Site with ruins, temples, bazaars, and dramatic boulder landscapes.", bestSeason: "November - February", averageVisitTime: "Full Day", entryFee: 0, timings: "Open all day", rating: 4.8 },
      { placeName: "Jolladabasti", category: "Heritage", description: "A heritage village near Hampi with ruins, local culture, and rustic charm.", bestSeason: "November - February", averageVisitTime: "2 Hours", entryFee: 0, timings: "Open all day", rating: 4.2 },
      { placeName: "Kudlu", category: "Nature", description: "A peaceful scenic area close to the Tungabhadra river with natural landscapes.", bestSeason: "October - February", averageVisitTime: "2 Hours", entryFee: 0, timings: "Open all day", rating: 4.1 },
      { placeName: "Vijaya Vittala Temple", category: "Temple", description: "A famed Hampi temple complex known for the Stone Chariot, musical pillars, and ornate architecture.", bestSeason: "November - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.8 },
      { placeName: "Shree Vijaya Vitthala Temple", category: "Temple", description: "A revered temple name associated with the iconic Vittala shrine and its grand stone chariot legacy.", bestSeason: "November - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.8 },
      { placeName: "Stone Chariot", category: "Monument", description: "The iconic carved stone chariot of Hampi, one of the most recognizable monuments in the region.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.8 },
      { placeName: "Musical Pillars", category: "Architecture", description: "The famous stone pillars of the Vittala Temple complex that produce musical notes when struck.", bestSeason: "November - February", averageVisitTime: "1 Hour", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.7 },
      { placeName: "Virupaksha Temple", category: "Temple", description: "The ancient temple in Hampi known for its towering gopuram and spiritual significance.", bestSeason: "November - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "6:00 AM - 8:00 PM", rating: 4.7 },
      { placeName: "Lakshmi Narasimha (Ugra Narasimha)", category: "Monument", description: "A massive monolithic statue of Lord Narasimha, also known as Ugra Narasimha, that stands as one of Hampi's most striking heritage landmarks.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.7 },
      { placeName: "Hazara Rama Temple", category: "Temple", description: "A beautifully carved temple known for its detailed bas-reliefs and royal-era artistry.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.6 },
      { placeName: "Badavilinga Temple", category: "Temple", description: "A historic shrine associated with the royal and religious heritage of Vijayanagara.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.5 },
      { placeName: "Achyutaraya Temple", category: "Temple", description: "A grand temple built during the Vijayanagara period with impressive architecture and devotional significance.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.5 },
      { placeName: "Lotus Mahal", category: "Palace", description: "A graceful pavilion in the royal complex known for its elegant architecture.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.5 },
      { placeName: "Mahanavami Dibba", category: "Monument", description: "A grand ceremonial platform associated with the royal celebrations of the Vijayanagara Empire.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.6 },
      { placeName: "Hemakuta Hill", category: "Hill", description: "A hilltop area with early temple ruins and sweeping views over Hampi.", bestSeason: "November - February", averageVisitTime: "2 Hours", entryFee: 0, timings: "Open all day", rating: 4.4 },
      { placeName: "Matanga Hill", category: "Viewpoint", description: "A famous hilltop for sunrise, sunset, and panoramic views of Hampi Bazaar and the boulder landscape.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.7 },
      { placeName: "Hampi Bazaar", category: "Heritage", description: "A historic market street lined with ruins, shops, and scenic views of the river and hills.", bestSeason: "November - February", averageVisitTime: "2 Hours", entryFee: 0, timings: "Open all day", rating: 4.5 },
      { placeName: "Daroji Sloth Bear Sanctuary", category: "Wildlife", description: "A protected sanctuary known for sloth bears and scrub forest biodiversity.", bestSeason: "November - February", averageVisitTime: "3-4 Hours", entryFee: 0, timings: "Open all day", rating: 4.4 },
      { placeName: "Kalleshwara Temple (Bagali)", category: "Temple", description: "An ancient temple in Bagali celebrated for its architectural charm and historic significance.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.3 },
      { placeName: "Kalleshwara Temple (Hire Hadagali)", category: "Temple", description: "A heritage temple site near Hire Hadagali with strong religious and architectural importance.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.3 },
      { placeName: "Tungabhadra Dam", category: "Dam", description: "A scenic dam and reservoir offering riverside views and evening ambiance.", bestSeason: "October - March", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.4 },
      { placeName: "TB Dam", category: "Dam", description: "A local name for the Tungabhadra Dam area, popular for riverside views and photography.", bestSeason: "October - March", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.3 },
      { placeName: "Anegundi", category: "Heritage", description: "A historic village across the river with ancient ruins, temples, and tranquil scenery.", bestSeason: "November - February", averageVisitTime: "3-4 Hours", entryFee: 0, timings: "Open all day", rating: 4.5 },
      { placeName: "Anjanadri Hill", category: "Hill", description: "A sacred hilltop linked to Hanuman and offering panoramic views over the Hampi landscape.", bestSeason: "November - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.5 },
      { placeName: "Kishkindha", category: "Heritage", description: "A historic landscape associated with the Ramayana and the monkey kingdom.", bestSeason: "November - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.4 },
      { placeName: "Pampa Sarovar", category: "Lake", description: "A sacred lake near Hampi associated with the Ramayana and local spirituality.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.3 },
      { placeName: "Gunda Forest", category: "Wildlife", description: "A forested area near Hampi offering quiet trails and natural scenery.", bestSeason: "October - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.2 },
      { placeName: "Jollada Rashi Gudda", category: "Trekking", description: "A scenic rocky ridge and trekking spot near Hampi known for panoramic views and adventurous trails.", bestSeason: "October - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.3 },
      { placeName: "Sandur", category: "Hill Station", description: "A historic town in the Vijayanagara district known for its mining heritage, hills, and scenic landscapes.", bestSeason: "October - February", averageVisitTime: "3-4 Hours", entryFee: 0, timings: "Open all day", rating: 4.3 },
      { placeName: "Sandur Hills", category: "Hill", description: "Rolling hills and trekking routes around Sandur that offer dramatic views and outdoor adventure.", bestSeason: "October - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.2 },
      { placeName: "Hagaribommanahalli Town", category: "Town", description: "A historic town in the district known for its temples, heritage sites, and rural culture.", bestSeason: "October - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.2 },
      { placeName: "Elephant Stables", category: "Heritage", description: "Large historic stables in the royal complex where the emperor's elephants were housed.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.5 },
      { placeName: "Queen's Bath", category: "Monument", description: "A royal bathing pavilion with ornate architecture and water features.", bestSeason: "November - February", averageVisitTime: "1 Hour", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.4 },
      { placeName: "Royal Enclosure", category: "Heritage", description: "The grand palace precinct that once housed the royal family and courts of the Vijayanagara kings.", bestSeason: "November - February", averageVisitTime: "2 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.6 },
      { placeName: "Krishna Temple", category: "Temple", description: "A historic temple dedicated to Lord Krishna located amid the ruins of Hampi.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.4 },
      { placeName: "Pattabhirama Temple", category: "Temple", description: "An ancient temple dedicated to Lord Rama that showcases classic Vijayanagara stone carvings.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.3 },
      { placeName: "Kodanda Rama Temple", category: "Temple", description: "A temple dedicated to Lord Rama, featuring historic architecture and spiritual atmosphere.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.3 },
      { placeName: "Sasivekalu Ganesha", category: "Temple", description: "A large Ganesha statue carved from a single boulder, located near the Hampi ruins.", bestSeason: "November - February", averageVisitTime: "1 Hour", entryFee: 0, timings: "Open all day", rating: 4.4 },
      { placeName: "Kadalekalu Ganesha", category: "Temple", description: "A unique Ganesha figure carved from a single rock, celebrated for its sculptural detail.", bestSeason: "November - February", averageVisitTime: "1 Hour", entryFee: 0, timings: "Open all day", rating: 4.4 },
      { placeName: "Underground Shiva Temple", category: "Temple", description: "A subterranean temple dedicated to Lord Shiva, featuring intriguing rock-cut architecture.", bestSeason: "November - February", averageVisitTime: "1 Hour", entryFee: 0, timings: "Open all day", rating: 4.3 },
      { placeName: "King's Balance", category: "Monument", description: "An ancient weighing scale used for royal ceremonies and public rituals in Hampi.", bestSeason: "November - February", averageVisitTime: "30 Minutes", entryFee: 0, timings: "Open all day", rating: 4.3 },
      { placeName: "Zenana Enclosure", category: "Heritage", description: "The queen's quarters and palace complex in Hampi's royal area.", bestSeason: "November - February", averageVisitTime: "1 Hour", entryFee: 0, timings: "Open all day", rating: 4.3 },
      { placeName: "Stepped Tank (Pushkarani)", category: "Water Heritage", description: "A sacred stepped tank used for ritual bathing and water storage in the Hampi complex.", bestSeason: "November - February", averageVisitTime: "30 Minutes", entryFee: 0, timings: "Open all day", rating: 4.3 },
      { placeName: "Noblemen's Quarters", category: "Heritage", description: "Residential ruins of the noble class in Hampi's royal precinct.", bestSeason: "November - February", averageVisitTime: "1 Hour", entryFee: 0, timings: "Open all day", rating: 4.3 },
      { placeName: "Riverside Ruins", category: "Heritage", description: "Ruins along the Tungabhadra riverbanks with scenic views and historic remains.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.4 },
      { placeName: "Chakratirtha", category: "Religious Site", description: "A sacred water spring and small shrine near Hampi with local legend significance.", bestSeason: "November - February", averageVisitTime: "30 Minutes", entryFee: 0, timings: "Open all day", rating: 4.2 },
      { placeName: "Purandara Mandapa", category: "Monument", description: "A historic pavilion used for music and gatherings in the royal precinct.", bestSeason: "November - February", averageVisitTime: "30 Minutes", entryFee: 0, timings: "Open all day", rating: 4.3 },
      { placeName: "Archaeological Museum, Kamalapura", category: "Museum", description: "A museum housing artifacts and sculptures from the Hampi region.", bestSeason: "Any Time", averageVisitTime: "1-2 Hours", entryFee: 30, timings: "9:00 AM - 5:00 PM", rating: 4.3 },
      { placeName: "Sanapur Lake", category: "Lake", description: "A scenic lake popular for coracle rides and nature visits near Hampi.", bestSeason: "October - February", averageVisitTime: "2 Hours", entryFee: 0, timings: "Open all day", rating: 4.5 },
      { placeName: "Virupapur Gadde (Hippie Island)", category: "Heritage", description: "A river island known for laid-back cafes, yoga camps and sunset views.", bestSeason: "October - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.5 },
      { placeName: "Ankasamudra Bird Sanctuary", category: "Wildlife", description: "A bird sanctuary with wetlands and migratory waterfowl near the Hampi region.", bestSeason: "October - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.3 },
      { placeName: "Ancient Village Temples", category: "Heritage", description: "Traditional village temples scattered across the district showcasing local history.", bestSeason: "November - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.1 },
      { placeName: "Village Lakes & Tanks", category: "Nature", description: "Rural lakes and tanks that support village life and add scenic beauty to the region.", bestSeason: "October - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.1 },
      { placeName: "Mallikarjuna Temple, Kuruvatti", category: "Temple", description: "An ancient temple in Kuruvatti noted for its historic architecture and spiritual value.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.3 },
      { placeName: "Mylaralingeshwara Temple, Mylara", category: "Temple", description: "A revered temple in Mylara dedicated to Lord Shiva and known locally for its rituals.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.2 },
      { placeName: "Kuruvatti Heritage Village", category: "Village", description: "A heritage village known for its historic temples, stone structures, and rural landscape.", bestSeason: "November - February", averageVisitTime: "2 Hours", entryFee: 0, timings: "Open all day", rating: 4.2 },
      { placeName: "Tungabhadra River Bank", category: "Nature", description: "The scenic river bank of the Tungabhadra with historic ruins and leisure spots.", bestSeason: "October - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.4 },
      { placeName: "Sogi", category: "Village", description: "A rural village known for temples, granite landscapes, and traditional village charm.", bestSeason: "October - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.1 },
      { placeName: "Kalleshwara Temple, Sogi", category: "Temple", description: "A historic temple in Sogi celebrated for its architecture and regional religious importance.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.2 },
      { placeName: "Marulasiddheshwara Temple, Ujjini", category: "Temple", description: "A prominent temple in Ujjini noted for its sculptural detail and spiritual history.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.2 },
      { placeName: "Ujjini Math", category: "Pilgrimage", description: "A pilgrimage center at Ujjini known for its religious significance and temple traditions.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.2 },
      { placeName: "Kotturu Basaveshwara Temple", category: "Temple", description: "A historic temple in Kotturu dedicated to Basaveshwara and noted for local pilgrim visits.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.2 },
      { placeName: "Kotturu Town", category: "Town", description: "A town in the district with traditional village life, temples, and local markets.", bestSeason: "October - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.1 },
      { placeName: "Kudligi Fort", category: "Fort", description: "A historic fort in Kudligi taluk offering panoramic views and heritage ruins.", bestSeason: "October - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.1 },
      { placeName: "Ancient Temples of Kudligi", category: "Temple", description: "Ancient temples spread across Kudligi taluk showcasing regional heritage.", bestSeason: "October - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.1 },
      { placeName: "Chikkajogihalli", category: "Village", description: "A traditional village known for its cultural heritage and tranquil surroundings.", bestSeason: "October - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.1 },
      { placeName: "Shidigallu", category: "Village", description: "A small village with scenic surroundings and rural charm in the Kudligi area.", bestSeason: "October - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.1 },
      { placeName: "Kudligi Village Lakes", category: "Nature", description: "Lakes around Kudligi taluk that reflect the area's natural heritage.", bestSeason: "October - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.1 },
      { placeName: "Uchchangidurga Fort", category: "Fort", description: "A historic hill fort in Harapanahalli taluk known for its ruins and panoramic views.", bestSeason: "October - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.3 },
      { placeName: "Chigateri", category: "Heritage", description: "A historic town with temples and old shrines in Harapanahalli taluk.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.1 },
      { placeName: "Harihara Temples", category: "Temple", description: "Temples dedicated to Lord Harihara scattered in the Harapanahalli area.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.1 },
      { placeName: "Historic Village Sites", category: "Heritage", description: "Rural settlements with centuries-old temples and village monuments in the district.", bestSeason: "November - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.0 },
      { placeName: "Scenic Rural Landscapes", category: "Nature", description: "Rolling countryside vistas across the district's taluks.", bestSeason: "October - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.1 },
      { placeName: "Kumaraswamy Temple", category: "Temple", description: "A temple dedicated to Lord Kumaraswamy in the Harapanahalli area.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.1 },
      { placeName: "Parvati Temple", category: "Temple", description: "A temple dedicated to Goddess Parvati in a historic Harapanahalli setting.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.0 },
      { placeName: "Narihalla Reservoir", category: "Lake", description: "A reservoir that supports irrigation and birdlife near Harapanahalli.", bestSeason: "October - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.1 },
      { placeName: "Sandur Valley", category: "Valley", description: "A scenic valley area around Sandur known for its hills and mining heritage.", bestSeason: "October - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.2 },
      { placeName: "Swamimalai Hills", category: "Hill", description: "A hill range near Sandur offering trekking and scenic viewpoints.", bestSeason: "October - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.2 },
      { placeName: "Ramanamalai Hills", category: "Hill", description: "A scenic hill range with hiking trails and vistas in the Sandur region.", bestSeason: "October - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.1 },
      { placeName: "Devagiri Fort", category: "Fort", description: "A historic fort site in the Sandur area with ruins and landscape views.", bestSeason: "October - February", averageVisitTime: "2 Hours", entryFee: 0, timings: "Open all day", rating: 4.0 },
      { placeName: "Sandur Palace", category: "Heritage", description: "The palace of Sandur's former rulers with heritage architecture.", bestSeason: "October - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.1 },
      { placeName: "Taranagar Viewpoint", category: "Viewpoint", description: "A vantage point in Sandur offering wide views of the valley and hills.", bestSeason: "October - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.1 },
      { placeName: "Sandur Forest Area", category: "Wildlife", description: "Forest tracts around Sandur with wildlife and nature trails.", bestSeason: "October - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.1 },
      { placeName: "Sunrise Point", category: "Viewpoint", description: "A popular spot for sunrise over the boulder-strewn landscape near Hampi.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.5 },
      { placeName: "Sunset Point", category: "Viewpoint", description: "A scenic place for sunset views over the Hampi valley and riverbank.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.5 },
    ],
    "Belagavi": [
      { placeName: "Kitti" , category: "Nature", description: "A scenic natural spot with winding paths and lush greenery.", bestSeason: "October - February", averageVisitTime: "2 Hours", entryFee: 0, timings: "Open all day", rating: 4.2 },
    ],
    "Hassan": [
      { placeName: "Belur", category: "Temple", description: "A renowned temple town famous for the Chennakeshava Temple and Hoysala architecture.", bestSeason: "October - March", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.7 },
      { placeName: "Halebidu", category: "Temple", description: "An architectural marvel with intricately carved Hoysala temples and heritage monuments.", bestSeason: "October - March", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.7 },
      { placeName: "Shravanabelagola", category: "Pilgrimage", description: "A sacred Jain pilgrimage hill with the gigantic Bahubali statue and panoramic views.", bestSeason: "October - March", averageVisitTime: "3-4 Hours", entryFee: 0, timings: "Open all day", rating: 4.8 },
    ],
    "Shimoga": [
      { placeName: "Jog Falls", category: "Waterfall", description: "One of the tallest waterfalls in India, surrounded by forested hills and mist.", bestSeason: "June - October", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.7 },
      { placeName: "Sharavathi Valley", category: "Nature", description: "A scenic valley known for rivers, forests, and adventure activities.", bestSeason: "October - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.3 },
    ],
    "Dakshina Kannada": [
      { placeName: "St. Mary's Islands", category: "Beach", description: "A unique island cluster with striking hexagonal basalt rock formations.", bestSeason: "October - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "9:00 AM - 5:00 PM", rating: 4.6 },
      { placeName: "Kudroli Gokarnath Temple", category: "Temple", description: "A prominent temple complex known for its annual festivities.", bestSeason: "Any Time", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "6:00 AM - 8:00 PM", rating: 4.4 },
    ],
    Udupi: [
      { placeName: "Malpe Beach", category: "Beach", description: "A popular coastal destination with ferry rides and sunset views.", bestSeason: "October - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.5 },
      { placeName: "Krishna Temple", category: "Temple", description: "A historic temple town with deep spiritual significance.", bestSeason: "Any Time", averageVisitTime: "2 Hours", entryFee: 0, timings: "5:00 AM - 9:00 PM", rating: 4.6 },
    ],
  },
  Kerala: {
    Thiruvananthapuram: [
      { placeName: "Padmanabhaswamy Temple", category: "Temple", description: "A majestic temple known for its architectural splendor and heritage.", bestSeason: "October - February", averageVisitTime: "2 Hours", entryFee: 0, timings: "3:30 AM - 11:00 PM", rating: 4.7 },
      { placeName: "Kovalam Beach", category: "Beach", description: "A crescent-shaped beach with surfing spots and sunset views.", bestSeason: "September - March", averageVisitTime: "3-4 Hours", entryFee: 0, timings: "Open all day", rating: 4.5 },
    ],
    Kochi: [
      { placeName: "Fort Kochi", category: "Heritage", description: "A colonial-era waterfront with cafes, art spaces, and architecture.", bestSeason: "November - February", averageVisitTime: "3-4 Hours", entryFee: 0, timings: "Open all day", rating: 4.6 },
      { placeName: "Chinese Fishing Nets", category: "Heritage", description: "Iconic shoreline structures that reflect Kochi's trade history.", bestSeason: "Any Time", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.4 },
    ],
    Wayanad: [
      { placeName: "Edakkal Caves", category: "Cave", description: "Ancient rock carvings and scenic views over the hill country.", bestSeason: "October - May", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "9:00 AM - 4:00 PM", rating: 4.5 },
      { placeName: "Soochipara Falls", category: "Waterfall", description: "A three-tier waterfall set in a lush forest landscape.", bestSeason: "June - October", averageVisitTime: "2 Hours", entryFee: 0, timings: "9:00 AM - 5:00 PM", rating: 4.4 },
    ],
  },
  Odisha: {
    Puri: [
      { placeName: "Jagannath Temple", category: "Temple", description: "A famous temple town and one of the most sacred pilgrimage sites in Odisha.", bestSeason: "October - March", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "5:00 AM - 11:00 PM", rating: 4.8 },
      { placeName: "Puri Beach", category: "Beach", description: "A lively beach known for sunrise views and coastal charm.", bestSeason: "October - March", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.5 },
      { placeName: "Chilika Lake", category: "Lake", description: "A vast brackish lagoon known for birdlife and boat rides.", bestSeason: "November - February", averageVisitTime: "3-4 Hours", entryFee: 0, timings: "Open all day", rating: 4.6 },
    ],
    Khordha: [
      { placeName: "Konark Sun Temple", category: "Temple", description: "A UNESCO-listed temple famous for its chariot-shaped architecture and stone artistry.", bestSeason: "October - March", averageVisitTime: "2-3 Hours", entryFee: 40, timings: "6:00 AM - 8:00 PM", rating: 4.8 },
      { placeName: "Ramachandi Beach", category: "Beach", description: "A peaceful beach near Konark with scenic coastlines and temple views.", bestSeason: "October - March", averageVisitTime: "2 Hours", entryFee: 0, timings: "Open all day", rating: 4.4 },
    ],
    Ganjam: [
      { placeName: "Gopalpur Beach", category: "Beach", description: "A serene beach destination with gentle waves and a relaxed coastline.", bestSeason: "October - March", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.4 },
      { placeName: "Taptapani Hot Spring", category: "Nature", description: "A natural hot spring known for its therapeutic waters and scenic setting.", bestSeason: "October - February", averageVisitTime: "2 Hours", entryFee: 0, timings: "Open all day", rating: 4.3 },
    ],
  },
  "Andhra Pradesh": {
    Chittoor: [
      { placeName: "Tirumala Temple", category: "Temple", description: "A deeply sacred pilgrimage destination known for the Tirupati Balaji temple.", bestSeason: "October - March", averageVisitTime: "3-4 Hours", entryFee: 0, timings: "Open all day", rating: 4.9 },
      { placeName: "Sri Venkateswara National Park", category: "Wildlife", description: "A scenic forest reserve with greenery, wildlife, and hill landscapes.", bestSeason: "November - February", averageVisitTime: "3-4 Hours", entryFee: 0, timings: "6:00 AM - 6:00 PM", rating: 4.2 },
    ],
    Visakhapatnam: [
      { placeName: "Araku Valley", category: "Hill Station", description: "A misty hill station known for coffee plantations, valleys, and train rides.", bestSeason: "October - March", averageVisitTime: "Full Day", entryFee: 0, timings: "Open all day", rating: 4.6 },
      { placeName: "Kailasagiri", category: "Viewpoint", description: "A scenic hilltop park offering panoramic views of the Bay of Bengal.", bestSeason: "October - March", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.5 },
      { placeName: "Ramakrishna Beach", category: "Beach", description: "A popular seafront promenade with sunset views and local stalls.", bestSeason: "November - February", averageVisitTime: "2 Hours", entryFee: 0, timings: "Open all day", rating: 4.4 },
    ],
    Kadapa: [
      { placeName: "Horsley Hills", category: "Hill Station", description: "A cool hill retreat with pine forests, viewpoints, and fresh air.", bestSeason: "October - March", averageVisitTime: "3-4 Hours", entryFee: 0, timings: "Open all day", rating: 4.5 },
      { placeName: "Kailasa Kona", category: "Nature", description: "A riverine and scenic nature spot known for rocky landscapes and calm surroundings.", bestSeason: "November - February", averageVisitTime: "2 Hours", entryFee: 0, timings: "Open all day", rating: 4.1 },
    ],
    Anantapur: [
      { placeName: "Penukonda Fort", category: "Fort", description: "A historic fort and heritage site reflecting the region’s past.", bestSeason: "November - February", averageVisitTime: "2 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.2 },
      { placeName: "Nallamala Forest", category: "Wildlife", description: "A biodiverse forest region with trekking routes and scenic beauty.", bestSeason: "October - March", averageVisitTime: "3-4 Hours", entryFee: 0, timings: "Open all day", rating: 4.2 },
    ],
  },
  Telangana: {
    Hyderabad: [
      { placeName: "Charminar", category: "Heritage", description: "An iconic monument and symbol of Hyderabad's historic core.", bestSeason: "October - March", averageVisitTime: "2 Hours", entryFee: 0, timings: "9:00 AM - 5:00 PM", rating: 4.7 },
      { placeName: "Golconda Fort", category: "Fort", description: "A grand fortress known for acoustics, history, and panoramic views.", bestSeason: "October - March", averageVisitTime: "2-3 Hours", entryFee: 50, timings: "9:00 AM - 5:30 PM", rating: 4.7 },
      { placeName: "Hussain Sagar", category: "Lake", description: "A large lake with waterfront views and the statue of Buddha.", bestSeason: "Any Time", averageVisitTime: "2 Hours", entryFee: 0, timings: "Open all day", rating: 4.3 },
      { placeName: "Qutb Shahi Tombs", category: "Heritage", description: "A group of royal tombs that showcase the region’s rich history.", bestSeason: "October - March", averageVisitTime: "2 Hours", entryFee: 20, timings: "9:00 AM - 5:30 PM", rating: 4.6 },
    ],
    Warangal: [
      { placeName: "Warangal Fort", category: "Fort", description: "A historic fort complex with impressive stone architecture.", bestSeason: "November - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "9:00 AM - 5:30 PM", rating: 4.5 },
      { placeName: "Thousand Pillar Temple", category: "Temple", description: "A remarkable stone temple known for its carved pillars and heritage value.", bestSeason: "October - March", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "6:00 AM - 8:00 PM", rating: 4.6 },
      { placeName: "Laknavaram Lake", category: "Lake", description: "A scenic lake with boating and picnic spots.", bestSeason: "October - February", averageVisitTime: "3-4 Hours", entryFee: 0, timings: "Open all day", rating: 4.4 },
    ],
    Adilabad: [
      { placeName: "Kuntala Waterfall", category: "Waterfall", description: "A scenic waterfall surrounded by forest and rocky terrain.", bestSeason: "June - October", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.4 },
      { placeName: "Pochera Falls", category: "Waterfall", description: "A beautiful waterfall known for its dramatic forests and natural setting.", bestSeason: "June - October", averageVisitTime: "2 Hours", entryFee: 0, timings: "Open all day", rating: 4.3 },
    ],
  },
  "West Bengal": {
    Darjeeling: [
      { placeName: "Tiger Hill", category: "Viewpoint", description: "A famous sunrise viewpoint with Himalayan views and a dramatic skyline.", bestSeason: "October - March", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.7 },
      { placeName: "Batasia Loop", category: "Viewpoint", description: "A scenic railway loop with gardens and mountain panoramas.", bestSeason: "October - March", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.5 },
      { placeName: "Darjeeling Himalayan Railway", category: "Heritage", description: "A famous toy train route through tea gardens and mountain scenery.", bestSeason: "October - March", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.6 },
    ],
    "North 24 Parganas": [
      { placeName: "Sundarbans", category: "Wildlife", description: "The world-famous mangrove forest and UNESCO site known for Royal Bengal Tigers.", bestSeason: "November - February", averageVisitTime: "Full Day", entryFee: 0, timings: "Open all day", rating: 4.8 },
      { placeName: "Bonnie Camp", category: "Nature", description: "A tranquil riverside and forest area in the Sundarbans for eco-tourism.", bestSeason: "November - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.3 },
    ],
    Bankura: [
      { placeName: "Bishnupur", category: "Heritage", description: "A historic town famous for terracotta temples and traditional craft culture.", bestSeason: "October - March", averageVisitTime: "3-4 Hours", entryFee: 0, timings: "Open all day", rating: 4.6 },
      { placeName: "Susunia Hill", category: "Hill", description: "A scenic hill with rock formations and trekking opportunities.", bestSeason: "October - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.3 },
    ],
    Kolkata: [
      { placeName: "Victoria Memorial", category: "Heritage", description: "A grand marble building and museum reflecting colonial-era Kolkata.", bestSeason: "October - March", averageVisitTime: "2-3 Hours", entryFee: 20, timings: "10:00 AM - 5:00 PM", rating: 4.6 },
      { placeName: "Howrah Bridge", category: "Landmark", description: "An iconic bridge that is one of the city's most recognizable landmarks.", bestSeason: "Any Time", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.4 },
    ],
  },
  "Tamil Nadu": {
    Chennai: [
      { placeName: "Marina Beach", category: "Beach", description: "One of the longest urban beaches in the world and a beloved local landmark.", bestSeason: "November - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.4 },
      { placeName: "Kapaleeshwarar Temple", category: "Temple", description: "A historic Dravidian temple known for its sacred architecture.", bestSeason: "Any Time", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "6:00 AM - 8:00 PM", rating: 4.6 },
    ],
    Madurai: [
      { placeName: "Meenakshi Amman Temple", category: "Temple", description: "A grand temple complex famous for its colorful gopurams and rituals.", bestSeason: "October - March", averageVisitTime: "3-4 Hours", entryFee: 0, timings: "5:00 AM - 12:30 AM", rating: 4.8 },
      { placeName: "Thirupparankundram", category: "Hill", description: "A historic hill temple with legends and panoramic views.", bestSeason: "October - February", averageVisitTime: "2 Hours", entryFee: 0, timings: "6:00 AM - 8:00 PM", rating: 4.5 },
    ],
    Coimbatore: [
      { placeName: "Siruvani Falls", category: "Waterfall", description: "A scenic waterfall known for its clear, sweet water.", bestSeason: "June - October", averageVisitTime: "2 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.3 },
      { placeName: "Marudamalai Temple", category: "Temple", description: "A hilltop shrine in the Western Ghats with spiritual importance.", bestSeason: "September - February", averageVisitTime: "2 Hours", entryFee: 0, timings: "6:00 AM - 8:00 PM", rating: 4.4 },
    ],
    Nilgiris: [
      { placeName: "Ooty Lake", category: "Lake", description: "A calm lake and boating destination in the hill district.", bestSeason: "March - June", averageVisitTime: "2 Hours", entryFee: 30, timings: "9:00 AM - 6:00 PM", rating: 4.5 },
      { placeName: "Dodabetta Peak", category: "Hill", description: "The highest peak in the Nilgiris offering wide panoramic views.", bestSeason: "October - May", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "7:00 AM - 6:00 PM", rating: 4.6 },
    ],
  },
  Maharashtra: {
    Mumbai: [
      { placeName: "Gateway of India", category: "Landmark", description: "An iconic monument overlooking the Arabian Sea.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.6 },
      { placeName: "Marine Drive", category: "Seafront", description: "A famous promenade with sunset views and city ambiance.", bestSeason: "Any Time", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.5 },
    ],
    Pune: [
      { placeName: "Shaniwar Wada", category: "Fort", description: "A historic palace fort that reflects Pune's Maratha heritage.", bestSeason: "October - February", averageVisitTime: "2 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.4 },
      { placeName: "Sinhagad Fort", category: "Fort", description: "A hill fort offering historical significance and sweeping views.", bestSeason: "October - February", averageVisitTime: "3-4 Hours", entryFee: 0, timings: "Open all day", rating: 4.6 },
    ],
    Nagpur: [
      { placeName: "Diamond Garden", category: "Park", description: "A peaceful public garden known for greenery and evening strolls.", bestSeason: "October - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "6:00 AM - 10:00 PM", rating: 4.2 },
      { placeName: "Seminary Hills", category: "Hill", description: "A scenic hill area with viewpoints and quiet walks.", bestSeason: "Any Time", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.3 },
    ],
  },
  Rajasthan: {
    Jaipur: [
      { placeName: "Amber Fort", category: "Fort", description: "A majestic hill fort renowned for architecture and history.", bestSeason: "October - March", averageVisitTime: "3-4 Hours", entryFee: 200, timings: "8:00 AM - 5:30 PM", rating: 4.7 },
      { placeName: "Hawa Mahal", category: "Palace", description: "The iconic palace of winds known for its facade and heritage.", bestSeason: "October - March", averageVisitTime: "1-2 Hours", entryFee: 50, timings: "9:00 AM - 5:00 PM", rating: 4.6 },
    ],
    Udaipur: [
      { placeName: "City Palace", category: "Palace", description: "A grand palace complex with courtyards, galleries, and lake views.", bestSeason: "October - March", averageVisitTime: "3-4 Hours", entryFee: 300, timings: "9:30 AM - 7:00 PM", rating: 4.8 },
      { placeName: "Lake Pichola", category: "Lake", description: "A romantic lake destination surrounded by palaces and ghats.", bestSeason: "October - March", averageVisitTime: "2 Hours", entryFee: 0, timings: "Open all day", rating: 4.7 },
    ],
    Jodhpur: [
      { placeName: "Mehrangarh Fort", category: "Fort", description: "A massive fort commanding sweeping views of the Blue City.", bestSeason: "October - March", averageVisitTime: "3-4 Hours", entryFee: 100, timings: "9:00 AM - 5:00 PM", rating: 4.7 },
      { placeName: "Jaswant Thada", category: "Memorial", description: "A marble cenotaph known for its serene architecture.", bestSeason: "October - March", averageVisitTime: "1-2 Hours", entryFee: 30, timings: "9:00 AM - 5:00 PM", rating: 4.4 },
    ],
  },
  "Uttar Pradesh": {
    Agra: [
      { placeName: "Taj Mahal", category: "Monument", description: "The world-famous marble mausoleum and one of India's most celebrated landmarks.", bestSeason: "October - March", averageVisitTime: "2-3 Hours", entryFee: 50, timings: "6:00 AM - 7:00 PM", rating: 4.9 },
      { placeName: "Agra Fort", category: "Fort", description: "A Mughal-era fort with palaces, halls, and courtyards.", bestSeason: "October - March", averageVisitTime: "2-3 Hours", entryFee: 40, timings: "6:00 AM - 6:00 PM", rating: 4.6 },
    ],
    Varanasi: [
      { placeName: "Kashi Vishwanath Temple", category: "Temple", description: "A sacred temple on the banks of the Ganga with deep spiritual significance.", bestSeason: "October - March", averageVisitTime: "2 Hours", entryFee: 0, timings: "4:00 AM - 11:00 PM", rating: 4.8 },
      { placeName: "Dashashwamedh Ghat", category: "Ghat", description: "A famous ghat known for evening aarti and riverfront atmosphere.", bestSeason: "October - March", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.7 },
    ],
    Lucknow: [
      { placeName: "Bara Imambara", category: "Monument", description: "A historic monument famous for its architecture and labyrinth.", bestSeason: "October - March", averageVisitTime: "2 Hours", entryFee: 30, timings: "10:00 AM - 5:00 PM", rating: 4.4 },
      { placeName: "Ambedkar Park", category: "Park", description: "A modern memorial park with grand sculptures and landscaped grounds.", bestSeason: "Any Time", averageVisitTime: "2 Hours", entryFee: 0, timings: "Open all day", rating: 4.3 },
    ],
  },
  "Goa": {
    "North Goa": [
      { placeName: "Baga Beach", category: "Beach", description: "A lively beach destination known for water sports and nightlife.", bestSeason: "November - February", averageVisitTime: "3-4 Hours", entryFee: 0, timings: "Open all day", rating: 4.5 },
      { placeName: "Fort Aguada", category: "Fort", description: "A historic Portuguese fort overlooking the Arabian Sea.", bestSeason: "November - February", averageVisitTime: "2 Hours", entryFee: 0, timings: "9:30 AM - 6:00 PM", rating: 4.6 },
    ],
    "South Goa": [
      { placeName: "Basilica of Bom Jesus", category: "Heritage", description: "A UNESCO-listed church reflecting colonial-era history.", bestSeason: "November - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "9:00 AM - 6:30 PM", rating: 4.7 },
      { placeName: "Palolem Beach", category: "Beach", description: "A serene beach known for calm waters and relaxed scenery.", bestSeason: "November - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.5 },
    ],
  },
  "Uttarakhand": {
    Nainital: [
      { placeName: "Naini Lake", category: "Lake", description: "A beautiful lake at the heart of the hill station.", bestSeason: "March - June", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.5 },
      { placeName: "Snow View Point", category: "Viewpoint", description: "A popular vantage point with mountain views and cable car access.", bestSeason: "October - February", averageVisitTime: "1-2 Hours", entryFee: 50, timings: "10:00 AM - 6:00 PM", rating: 4.4 },
    ],
    Haridwar: [
      { placeName: "Har Ki Pauri", category: "Ghat", description: "A sacred riverfront ghat known for evening aarti and spiritual ambience.", bestSeason: "October - March", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.7 },
      { placeName: "Chandi Devi Temple", category: "Temple", description: "A hilltop shrine with sweeping views of the Ganga plains.", bestSeason: "Any Time", averageVisitTime: "2 Hours", entryFee: 0, timings: "6:00 AM - 8:00 PM", rating: 4.5 },
    ],
  },
  "Himachal Pradesh": {
    Shimla: [
      { placeName: "The Ridge", category: "Viewpoint", description: "A scenic promenade with colonial-era charm and mountain views.", bestSeason: "March - June", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.4 },
      { placeName: "Kalka-Shimla Railway", category: "Heritage", description: "A historic narrow-gauge railway route through pine forests.", bestSeason: "March - June", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.6 },
    ],
    Manali: [
      { placeName: "Solang Valley", category: "Valley", description: "A popular adventure destination with snow and mountain activities.", bestSeason: "October - February", averageVisitTime: "3-4 Hours", entryFee: 0, timings: "Open all day", rating: 4.5 },
      { placeName: "Hadimba Temple", category: "Temple", description: "A distinctive wooden temple set in a cedar forest.", bestSeason: "March - June", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "8:00 AM - 6:00 PM", rating: 4.4 },
    ],
  },
  "Jammu and Kashmir": {
    Srinagar: [
      { placeName: "Dal Lake", category: "Lake", description: "A famous lake known for shikaras, houseboats, and mountain views.", bestSeason: "March - October", averageVisitTime: "3-4 Hours", entryFee: 0, timings: "Open all day", rating: 4.7 },
      { placeName: "Shalimar Bagh", category: "Garden", description: "A Mughal-era garden with fountains and pathways.", bestSeason: "March - October", averageVisitTime: "2 Hours", entryFee: 20, timings: "10:00 AM - 6:00 PM", rating: 4.5 },
    ],
    Gulmarg: [
      { placeName: "Gulmarg Gondola", category: "Adventure", description: "A scenic cable car ride with dramatic mountain views.", bestSeason: "December - March", averageVisitTime: "2-3 Hours", entryFee: 1500, timings: "10:00 AM - 5:00 PM", rating: 4.7 },
      { placeName: "Apharwat Peak", category: "Peak", description: "A high-altitude destination known for snow and panoramic scenery.", bestSeason: "December - March", averageVisitTime: "2 Hours", entryFee: 0, timings: "Open all day", rating: 4.5 },
    ],
  },
};

function buildPlaceSeedData(locations) {
  const places = [];

  locations.forEach(({ stateId, stateName, districts }) => {
    districts.forEach(({ districtName, districtId }, districtIndex) => {
      const templates = stateSpecificTemplates[stateName]?.[districtName] || [];
      const varietyTemplates = [
        { placeName: `${districtName} Heritage Walk`, category: "Heritage", description: `A heritage-rich destination in ${districtName}, ${stateName}.`, bestSeason: "October - March", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.3 },
        { placeName: `${districtName} Spiritual Temple`, category: "Temple", description: `A revered temple or sacred site that reflects the spiritual culture of ${districtName}.`, bestSeason: "Any Time", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.4 },
        { placeName: `${districtName} Trekking Trail`, category: "Trekking", description: `A scenic trekking route through forests, hills, or ridgelines near ${districtName}.`, bestSeason: "October - February", averageVisitTime: "3-4 Hours", entryFee: 0, timings: "Open all day", rating: 4.2 },
        { placeName: `${districtName} Mountain Viewpoint`, category: "Viewpoint", description: `A panoramic hill or mountain viewpoint offering memorable vistas over ${districtName}.`, bestSeason: "September - February", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.3 },
        { placeName: `${districtName} Lakeside Retreat`, category: "Lake", description: `A calm lakeside destination for boating, photography, and relaxing strolls in ${districtName}.`, bestSeason: "October - March", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.2 },
        { placeName: `${districtName} Riverfront Walk`, category: "River", description: `A riverside attraction featuring calm banks, local life, and scenic views in ${districtName}.`, bestSeason: "Any Time", averageVisitTime: "1-2 Hours", entryFee: 0, timings: "Open all day", rating: 4.1 },
        { placeName: `${districtName} Local Beach`, category: "Beach", description: `A popular coastal or riverside beach destination near ${districtName}.`, bestSeason: "November - February", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.2 },
        { placeName: `${districtName} Wildlife Spot`, category: "Wildlife", description: `A protected or nature-rich destination for wildlife viewing around ${districtName}.`, bestSeason: "October - March", averageVisitTime: "2-3 Hours", entryFee: 0, timings: "Open all day", rating: 4.1 },
      ];

      const resolvedTemplates = [...templates, ...varietyTemplates]
        .filter((template, index, array) => array.findIndex((item) => item.placeName === template.placeName) === index);

      resolvedTemplates.forEach((template, templateIndex) => {
        const suffix = String(templateIndex + 1).padStart(2, "0");
        const location = getTouristPlaceLocation({
          placeName: template.placeName,
          districtName,
          stateName,
        });
        places.push({
          placeId: `${districtId}-${suffix}`,
          districtId,
          placeName: template.placeName,
          category: template.category,
          description: template.description,
          bestSeason: template.bestSeason,
          averageVisitTime: template.averageVisitTime,
          entryFee: template.entryFee ?? 0,
          timings: template.timings,
          rating: template.rating ?? 4.0,
          images: [],
          ...location,
        });
      });
    });
  });

  return places;
}

async function seedTouristPlaces() {
  await connectDB();

  const locations = await getIndiaLocations();
  const places = buildPlaceSeedData(locations);

  for (const place of places) {
    await TouristPlace.updateOne(
      { placeId: place.placeId },
      { $set: place },
      { upsert: true }
    );
  }


  await mongoose.disconnect();
}

if (require.main === module) {
  seedTouristPlaces().catch(() => process.exit(1));
}

module.exports = {
  buildPlaceSeedData,
  seedTouristPlaces,
};
