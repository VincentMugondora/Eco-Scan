export const PANTRY_ITEMS = [
  {
    id: 1,
    name: "Mealie-meal (Sadza Flour)",
    category: "GRAINS",
    quantity: "5kg",
    status: "fresh",
    expiryDate: "2026-07-20",
    image: "https://images.unsplash.com/photo-1596647466548-dbbdbe15822e?q=80&w=200&auto=format&fit=crop",
    updatedAt: "Updated 2h ago",
    freshness: 90,
    weight: "5kg",
    daysLeft: "120 days left",
  },
  {
    id: 2,
    name: "Dried Mopane Worms",
    category: "PROTEIN",
    quantity: "500g",
    status: "fresh",
    expiryDate: "2026-06-20",
    image: "https://images.unsplash.com/photo-1621034969230-0eb2c366ffde?q=80&w=200&auto=format&fit=crop",
    updatedAt: "Updated 2h ago",
    freshness: 100,
    weight: "500g",
    daysLeft: "90 days left",
  },
  {
    id: 3,
    name: "Oat Milk",
    category: "DAIRY",
    quantity: "1L",
    status: "expired",
    expiryDate: "2026-03-25",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=200&auto=format&fit=crop",
    updatedAt: "Updated 2h ago",
    freshness: 10,
    weight: "1L",
    daysLeft: "1 days left",
  }
];

export const ACTION_REQUIRED_ITEMS = [
  {
    id: 101,
    name: "Fresh Spinach",
    quantity: "250g",
    timeLeft: "18h left",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&q=80"
  },
  {
    id: 102,
    name: "Kapenta (Dried)",
    quantity: "100g",
    timeLeft: "36h left",
    image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?w=200&q=80"
  }
];

export const RECIPES = [
  {
    id: 1,
    title: "Sadza & Leafy Greens",
    match: 100,
    time: "20 min",
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80",
    wasteSaved: "0.8kg",
    inPantry: ["Mealie-meal", "Spinach"],
    needed: []
  }
];

export const IMPACT_STATS = {
  weeklyCO2: 12.4,
  goalCO2: 15,
  waterSaved: 1240,
  mealsSaved: 18,
  level: 4,
  sustainabilityScore: 84
};
