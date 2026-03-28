import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export interface PantryItem {
  id: string;
  item_name: string; // Matched to SQL schema
  category: string;
  expiry_date: string;
  weight_kg: number;
  carbon_impact_factor: number;
  is_cooked: boolean;
  status?: "fresh" | "warning" | "expired"; // Computed on the fly
}

export const usePantry = () => {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const calculateStatus = (expiryDate: string): "fresh" | "warning" | "expired" => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "expired";
    if (diffDays <= 2) return "warning"; // Less than 48 hours
    return "fresh";
  };

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pantry_items") // Ensure this is exactly 'pantry_items' in Supabase
      .select("*")
      .order("expiry_date", { ascending: true });

    if (error) {
      console.error("Error fetching pantry:", error.message);
      setItems([]);
    } else {
      // Map data to include the calculated status
      const formattedData = (data || []).map((item: any) => ({
        ...item,
        status: calculateStatus(item.expiry_date)
      }));
      setItems(formattedData);
    }
    setLoading(false);
  };

  const markAsCooked = async (id: string) => {
    const previousItems = [...items];
    setItems(items.map(item => item.id === id ? { ...item, is_cooked: true } : item));

    const { error } = await supabase
      .from("pantry_items")
      .update({ is_cooked: true })
      .eq("id", id);

    if (error) {
      console.error("Error marking as cooked:", error);
      setItems(previousItems);
    }
  };

  useEffect(() => {
    fetchItems();
    
    const subscription = supabase
      .channel("pantry_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "pantry_items" }, () => {
        fetchItems(); // Simpler: re-fetch to ensure status is recalculated
      })
      .subscribe();

    return () => { supabase.removeChannel(subscription); };
  }, []);

  return { items, loading, markAsCooked, refresh: fetchItems };
};
