export const PANTRY_ITEMS = [
  {
    id: 1,
    name: "Fresh Spinach",
    category: "Vegetables",
    expiryDate: "2026-03-26",
    status: "soon",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=200&auto=format&fit=crop",
    quantity: "250g",
    updatedAt: "Updated 2h ago",
    freshness: 10,
    urgency: "Red"
  },
  {
    id: 2,
    name: "Greek Yogurt",
    category: "Dairy",
    expiryDate: "2026-03-27",
    status: "soon",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=200&auto=format&fit=crop",
    quantity: "500ml",
    updatedAt: "Updated 2h ago",
    freshness: 40,
    urgency: "Yellow"
  },
  {
    id: 3,
    name: "Bell Peppers",
    category: "Vegetables",
    expiryDate: "2026-03-29",
    status: "fresh",
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?q=80&w=200&auto=format&fit=crop",
    quantity: "3 units",
    updatedAt: "Updated 2h ago",
    freshness: 40,
    urgency: "Yellow"
  },
  {
    id: 4,
    name: "Oat Milk",
    category: "Pantry",
    expiryDate: "2026-03-25",
    status: "soon",
    image: "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?q=80&w=200&auto=format&fit=crop",
    quantity: "1L",
    updatedAt: "Updated 2h ago",
    freshness: 10,
    urgency: "Red"
  },
  {
    id: 5,
    name: "Organic Eggs",
    category: "Dairy",
    expiryDate: "2026-04-05",
    status: "fresh",
    image: "https://images.unsplash.com/photo-1598965675045-45c5e72e33f6?q=80&w=200&auto=format&fit=crop",
    quantity: "12 pack",
    updatedAt: "Updated 2h ago",
    freshness: 80,
    urgency: "Green"
  },
  {
    id: 6,
    name: "Chicken Breast",
    category: "Proteins",
    expiryDate: "2026-03-26",
    status: "soon",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d11b51?q=80&w=200&auto=format&fit=crop",
    quantity: "400g",
    updatedAt: "Updated 2h ago",
    freshness: 10,
    urgency: "Red"
  }
];

export const RECIPES = [
  {
    id: 1,
    title: "Leftover Veggie Soup",
    match: 85,
    time: "25 min",
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&auto=format&fit=crop",
    wasteSaved: "0.8kg",
    inPantry: ["Covo", "Soft Tomatoes", "Carrots"],
    needed: ["Onion", "Vegetable Broth"]
  },
  {
    id: 2,
    title: "Covo & Peanut Stew",
    match: 92,
    time: "30 min",
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=400&auto=format&fit=crop",
    wasteSaved: "0.5kg",
    inPantry: ["Covo", "Peanut Butter"],
    needed: ["Spices"]
  }
];

export const IMPACT_STATS = {
  weeklyCO2: 12.4,
  goalCO2: 15,
  waterSaved: 18480,
  mealsSaved: 2,
  level: 4,
  sustainabilityScore: 84
};
