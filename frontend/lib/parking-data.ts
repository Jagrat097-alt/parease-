import type { ParkingSpot, AvailabilityStatus } from "@/types/parking"

// Parking spot templates to generate around user location
const parkingTemplates = [
  {
    name: "City Center Parking",
    pricePerHour: "₹40",
    totalSpots: 120,
    phone: "+91 80 2222 3333",
    rating: 4.5,
    operatingHours: "24/7",
    reviews: [
      { userName: "Rahul Sharma", rating: 5, comment: "Excellent parking facility with CCTV surveillance.", date: "2 days ago" },
      { userName: "Priya Nair", rating: 4, comment: "Good location but can get crowded during peak hours.", date: "1 week ago" },
    ],
  },
  {
    name: "Metro Station Parking",
    pricePerHour: "₹30",
    totalSpots: 80,
    phone: "+91 80 2555 6666",
    rating: 4.2,
    operatingHours: "5 AM - 11 PM",
    reviews: [
      { userName: "Sneha Reddy", rating: 4, comment: "Perfect for metro commuters. Easy access.", date: "3 days ago" },
      { userName: "Karthik M", rating: 4, comment: "Clean and well-maintained facility.", date: "5 days ago" },
    ],
  },
  {
    name: "Market Square Parking",
    pricePerHour: "₹25",
    totalSpots: 50,
    phone: "+91 80 2888 9999",
    rating: 3.8,
    operatingHours: "8 AM - 10 PM",
    reviews: [
      { userName: "Vikram Singh", rating: 3, comment: "Affordable rates for shopping area.", date: "1 day ago" },
      { userName: "Deepa K", rating: 4, comment: "Budget friendly. Arrive early for best spots!", date: "4 days ago" },
    ],
  },
  {
    name: "Mall Basement Parking",
    pricePerHour: "₹50",
    totalSpots: 200,
    phone: "+91 80 4111 2222",
    rating: 4.7,
    operatingHours: "10 AM - 10 PM",
    reviews: [
      { userName: "Ananya Iyer", rating: 5, comment: "Free parking with mall purchases!", date: "1 day ago" },
      { userName: "Suresh B", rating: 5, comment: "Spacious spots, great for SUVs.", date: "3 days ago" },
    ],
  },
  {
    name: "Smart Park Zone",
    pricePerHour: "₹35",
    totalSpots: 60,
    phone: "+91 80 4333 4444",
    rating: 4.0,
    operatingHours: "6 AM - 11 PM",
    reviews: [
      { userName: "Meera Joshi", rating: 4, comment: "App-based payment is super convenient.", date: "2 days ago" },
      { userName: "Arjun R", rating: 4, comment: "Modern facility with good lighting.", date: "1 week ago" },
    ],
  },
  {
    name: "Premium Valet Parking",
    pricePerHour: "₹80",
    totalSpots: 100,
    phone: "+91 80 4555 6666",
    rating: 4.9,
    operatingHours: "24/7",
    reviews: [
      { userName: "Kavitha S", rating: 5, comment: "Premium experience! Valet service is top-notch.", date: "1 day ago" },
      { userName: "Nitin G", rating: 5, comment: "Worth the extra money. Car returned spotless.", date: "2 days ago" },
    ],
  },
  {
    name: "Community Parking Hub",
    pricePerHour: "₹20",
    totalSpots: 40,
    phone: "+91 80 4777 8888",
    rating: 4.1,
    operatingHours: "6 AM - 10 PM",
    reviews: [
      { userName: "Rohit D", rating: 4, comment: "Great neighborhood parking option.", date: "3 days ago" },
      { userName: "Lakshmi N", rating: 4, comment: "Simple and affordable. No frills.", date: "1 week ago" },
    ],
  },
  {
    name: "Tech Park Parking",
    pricePerHour: "₹45",
    totalSpots: 150,
    phone: "+91 80 4999 1111",
    rating: 4.3,
    operatingHours: "24/7",
    reviews: [
      { userName: "Arun S", rating: 5, comment: "Massive facility. EV charging available.", date: "2 days ago" },
      { userName: "Divya R", rating: 4, comment: "Perfect for office goers.", date: "4 days ago" },
    ],
  },
]

// Generate parking spots around user's location
export function generateNearbyParkingSpots(userLat: number, userLng: number): ParkingSpot[] {
  const spots: ParkingSpot[] = []
  
  // Create spots at varying distances (0.1km to 1.5km radius)
  const offsets = [
    { lat: 0.001, lng: 0.001 },   // ~0.15km NE
    { lat: -0.002, lng: 0.001 },  // ~0.25km SE
    { lat: 0.0025, lng: -0.001 }, // ~0.3km NW
    { lat: -0.001, lng: -0.002 }, // ~0.25km SW
    { lat: 0.004, lng: 0.002 },   // ~0.5km NE
    { lat: -0.003, lng: 0.004 },  // ~0.55km SE
    { lat: 0.005, lng: -0.003 },  // ~0.6km NW
    { lat: -0.006, lng: -0.004 }, // ~0.8km SW
  ]
  
  const availabilities: AvailabilityStatus[] = ["high", "medium", "low", "high", "medium", "high", "low", "high"]
  const spotCounts = [45, 12, 3, 78, 8, 25, 5, 32]
  
  offsets.forEach((offset, index) => {
    const template = parkingTemplates[index % parkingTemplates.length]
    const lat = userLat + offset.lat
    const lng = userLng + offset.lng
    
    // Calculate distance
    const distance = Math.sqrt(Math.pow(offset.lat * 111, 2) + Math.pow(offset.lng * 111 * Math.cos(userLat * Math.PI / 180), 2))
    
    spots.push({
      id: String(index + 1),
      name: template.name,
      address: `${(distance * 1000).toFixed(0)}m from your location`,
      distance: distance < 1 ? `${(distance * 1000).toFixed(0)} m` : `${distance.toFixed(1)} km`,
      pricePerHour: template.pricePerHour,
      spotsAvailable: spotCounts[index],
      totalSpots: template.totalSpots,
      availability: availabilities[index],
      lat,
      lng,
      phone: template.phone,
      rating: template.rating,
      operatingHours: template.operatingHours,
      reviews: template.reviews.map((r, rIndex) => ({
        id: `r${index}-${rIndex}`,
        ...r,
      })),
    })
  })
  
  return spots
}

export const mockParkingSpots: ParkingSpot[] = [
  {
    id: "1",
    name: "MG Road Parking Complex",
    address: "MG Road, Near Metro Station",
    distance: "0.3 km",
    pricePerHour: "₹40",
    spotsAvailable: 45,
    totalSpots: 120,
    availability: "high",
    lat: 12.9758,
    lng: 77.6068,
    phone: "+91 80 2222 3333",
    rating: 4.5,
    operatingHours: "24/7",
    reviews: [
      {
        id: "r1",
        userName: "Rahul Sharma",
        rating: 5,
        comment: "Excellent parking facility with CCTV surveillance. Very safe for overnight parking.",
        date: "2 days ago",
      },
      {
        id: "r2",
        userName: "Priya Nair",
        rating: 4,
        comment: "Good location but can get crowded during peak hours. Staff is helpful.",
        date: "1 week ago",
      },
      {
        id: "r3",
        userName: "Amit Patel",
        rating: 5,
        comment: "Best parking near metro! Easy in and out access.",
        date: "2 weeks ago",
      },
    ],
  },
  {
    id: "2",
    name: "Brigade Road Basement",
    address: "Brigade Road, Opposite Church",
    distance: "0.5 km",
    pricePerHour: "₹50",
    spotsAvailable: 12,
    totalSpots: 80,
    availability: "medium",
    lat: 12.9728,
    lng: 77.6102,
    phone: "+91 80 2555 6666",
    rating: 4.2,
    operatingHours: "6 AM - 11 PM",
    reviews: [
      {
        id: "r4",
        userName: "Sneha Reddy",
        rating: 4,
        comment: "Convenient for shopping on Brigade Road. Decent pricing.",
        date: "3 days ago",
      },
      {
        id: "r5",
        userName: "Karthik M",
        rating: 4,
        comment: "Clean and well-maintained. Gets full quickly on weekends.",
        date: "5 days ago",
      },
    ],
  },
  {
    id: "3",
    name: "Commercial Street Parking",
    address: "Commercial Street, Near Shivaji Nagar",
    distance: "0.8 km",
    pricePerHour: "₹30",
    spotsAvailable: 3,
    totalSpots: 50,
    availability: "low",
    lat: 12.9824,
    lng: 77.6091,
    phone: "+91 80 2888 9999",
    rating: 3.8,
    operatingHours: "8 AM - 10 PM",
    reviews: [
      {
        id: "r6",
        userName: "Vikram Singh",
        rating: 3,
        comment: "Always crowded due to market area. Affordable rates though.",
        date: "1 day ago",
      },
      {
        id: "r7",
        userName: "Deepa K",
        rating: 4,
        comment: "Budget friendly. Just arrive early to get a spot!",
        date: "4 days ago",
      },
      {
        id: "r8",
        userName: "Ravi Kumar",
        rating: 4,
        comment: "Good for quick shopping trips. Not ideal for long stays.",
        date: "1 week ago",
      },
    ],
  },
  {
    id: "4",
    name: "Residency Road Multi-Level",
    address: "Residency Road, Near Kamaraj Road Junction",
    distance: "1.2 km",
    pricePerHour: "₹60",
    spotsAvailable: 78,
    totalSpots: 200,
    availability: "high",
    lat: 12.9698,
    lng: 77.6144,
    phone: "+91 80 4111 2222",
    rating: 4.7,
    operatingHours: "24/7",
    reviews: [
      {
        id: "r9",
        userName: "Ananya Iyer",
        rating: 5,
        comment: "State-of-the-art facility! Love the automated parking system.",
        date: "1 day ago",
      },
      {
        id: "r10",
        userName: "Suresh B",
        rating: 5,
        comment: "Spacious spots, great for SUVs. Worth the extra money.",
        date: "3 days ago",
      },
    ],
  },
  {
    id: "5",
    name: "Cubbon Park Smart Parking",
    address: "Kasturba Road, Near Cubbon Park",
    distance: "1.5 km",
    pricePerHour: "₹35",
    spotsAvailable: 8,
    totalSpots: 40,
    availability: "medium",
    lat: 12.9791,
    lng: 77.5913,
    phone: "+91 80 4333 4444",
    rating: 4.0,
    operatingHours: "6 AM - 9 PM",
    reviews: [
      {
        id: "r11",
        userName: "Meera Joshi",
        rating: 4,
        comment: "Perfect for morning walks in Cubbon Park. Peaceful area.",
        date: "2 days ago",
      },
      {
        id: "r12",
        userName: "Arjun R",
        rating: 4,
        comment: "Smart payment system works great. No hassle with cash.",
        date: "1 week ago",
      },
    ],
  },
  {
    id: "6",
    name: "UB City Valet Parking",
    address: "Vittal Mallya Road, UB City",
    distance: "0.9 km",
    pricePerHour: "₹80",
    spotsAvailable: 25,
    totalSpots: 150,
    availability: "high",
    lat: 12.9719,
    lng: 77.5956,
    phone: "+91 80 4555 6666",
    rating: 4.9,
    operatingHours: "10 AM - 12 AM",
    reviews: [
      {
        id: "r13",
        userName: "Kavitha S",
        rating: 5,
        comment: "Premium experience! Valet service is top-notch.",
        date: "1 day ago",
      },
      {
        id: "r14",
        userName: "Nitin G",
        rating: 5,
        comment: "Expensive but worth it. Car is always spotless when returned.",
        date: "2 days ago",
      },
      {
        id: "r15",
        userName: "Pooja M",
        rating: 5,
        comment: "Best valet parking in Bangalore. Very professional staff.",
        date: "5 days ago",
      },
    ],
  },
  {
    id: "7",
    name: "Garuda Mall Parking",
    address: "Magrath Road, Near Garuda Mall",
    distance: "1.1 km",
    pricePerHour: "₹45",
    spotsAvailable: 5,
    totalSpots: 100,
    availability: "low",
    lat: 12.9702,
    lng: 77.6087,
    phone: "+91 80 4777 8888",
    rating: 4.1,
    operatingHours: "10 AM - 10 PM",
    reviews: [
      {
        id: "r16",
        userName: "Rohit D",
        rating: 4,
        comment: "Great for mall visits. Free parking with purchase above ₹1000.",
        date: "3 days ago",
      },
      {
        id: "r17",
        userName: "Lakshmi N",
        rating: 4,
        comment: "Easy to find spots on weekdays. Weekend is always packed.",
        date: "1 week ago",
      },
    ],
  },
  {
    id: "8",
    name: "Trinity Circle Parking",
    address: "Trinity Circle, Near HAL",
    distance: "1.8 km",
    pricePerHour: "₹25",
    spotsAvailable: 32,
    totalSpots: 60,
    availability: "high",
    lat: 12.9712,
    lng: 77.6198,
    phone: "+91 80 4999 1111",
    rating: 4.3,
    operatingHours: "24/7",
    reviews: [
      {
        id: "r18",
        userName: "Arun S",
        rating: 5,
        comment: "Spacious and well-lit parking area. Security guards are always present.",
        date: "2 days ago",
      },
      {
        id: "r19",
        userName: "Divya R",
        rating: 4,
        comment: "Affordable rates and easy access from the main road.",
        date: "4 days ago",
      },
    ],
  },
  {
    id: "9",
    name: "Indiranagar Metro Parking",
    address: "100 Feet Road, Indiranagar",
    distance: "2.1 km",
    pricePerHour: "₹30",
    spotsAvailable: 6,
    totalSpots: 45,
    availability: "low",
    lat: 12.9784,
    lng: 77.6408,
    phone: "+91 80 5111 2233",
    rating: 4.0,
    operatingHours: "5 AM - 11 PM",
    reviews: [
      {
        id: "r20",
        userName: "Sanjay K",
        rating: 4,
        comment: "Perfect location near metro. Always busy during office hours.",
        date: "1 day ago",
      },
      {
        id: "r21",
        userName: "Rashmi T",
        rating: 4,
        comment: "Good for metro commuters. Wish they had more EV charging points.",
        date: "1 week ago",
      },
    ],
  },
  {
    id: "10",
    name: "Koramangala BDA Complex",
    address: "80 Feet Road, Koramangala",
    distance: "2.5 km",
    pricePerHour: "₹35",
    spotsAvailable: 18,
    totalSpots: 75,
    availability: "medium",
    lat: 12.9352,
    lng: 77.6245,
    phone: "+91 80 5333 4455",
    rating: 4.4,
    operatingHours: "7 AM - 11 PM",
    reviews: [
      {
        id: "r22",
        userName: "Vivek M",
        rating: 5,
        comment: "Great parking for restaurant hopping in Koramangala. Plenty of space.",
        date: "1 day ago",
      },
      {
        id: "r23",
        userName: "Priyanka S",
        rating: 4,
        comment: "Clean facility with washroom access. Staff is courteous.",
        date: "3 days ago",
      },
    ],
  },
  {
    id: "11",
    name: "Jayanagar 4th Block",
    address: "4th Block, Jayanagar Complex",
    distance: "3.2 km",
    pricePerHour: "₹20",
    spotsAvailable: 42,
    totalSpots: 90,
    availability: "high",
    lat: 12.9259,
    lng: 77.5833,
    phone: "+91 80 5555 6677",
    rating: 4.6,
    operatingHours: "6 AM - 10 PM",
    reviews: [
      {
        id: "r24",
        userName: "Mohan R",
        rating: 5,
        comment: "Best parking in Jayanagar. Very affordable and well-maintained.",
        date: "2 days ago",
      },
      {
        id: "r25",
        userName: "Sunita K",
        rating: 5,
        comment: "Love this place! Perfect for shopping in the complex.",
        date: "5 days ago",
      },
    ],
  },
  {
    id: "12",
    name: "Whitefield Tech Park",
    address: "ITPL Main Road, Whitefield",
    distance: "4.5 km",
    pricePerHour: "₹50",
    spotsAvailable: 120,
    totalSpots: 300,
    availability: "high",
    lat: 12.9698,
    lng: 77.7500,
    phone: "+91 80 5777 8899",
    rating: 4.8,
    operatingHours: "24/7",
    reviews: [
      {
        id: "r26",
        userName: "Rajesh IT",
        rating: 5,
        comment: "Massive parking facility. Never had trouble finding a spot even during peak hours.",
        date: "1 day ago",
      },
      {
        id: "r27",
        userName: "Neha G",
        rating: 5,
        comment: "Excellent for office goers. EV charging available. Very modern facility.",
        date: "2 days ago",
      },
      {
        id: "r28",
        userName: "Aditya P",
        rating: 4,
        comment: "Good security and covered parking. App-based payment is convenient.",
        date: "1 week ago",
      },
    ],
  },
]
