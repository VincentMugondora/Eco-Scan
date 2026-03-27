import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export interface PantryItem {
  id: string;
  name: string;
  category: string;
  quantity: string;
  expiry_date: string;
  status: "fresh" | "soon" | "expired";
  image_url: string;
  freshness_percentage: number;
  weight_kg: number;
  is_cooked: boolean;
}

export const usePantry = () => {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("pantry_items")
      .select("*, carbon_impact_factor")
      .order("expiry_date", { ascending: true });

    if (error) console.error("Error fetching pantry:", error);
    else setItems(data || []);
    setLoading(false);
  };

  const markAsCooked = async (id: string) => {
    // Optimistic Update
    const previousItems = [...items];
    setItems(items.map(item => item.id === id ? { ...item, is_cooked: true } : item));

    const { error } = await supabase
      .from("pantry_items")
      .update({ is_cooked: true })
      .eq("id", id);

    if (error) {
      console.error("Error marking as cooked:", error);
      setItems(previousItems); // Rollback
    }
  };

  useEffect(() => {
    fetchItems();

    // Real-time subscription
    const subscription = supabase
      .channel("pantry_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "pantry_items" }, payload => {
        if (payload.eventType === "INSERT") {
          setItems(prev => [...prev, payload.new as PantryItem].sort((a,b) => a.expiry_date.localeCompare(b.expiry_date)));
        } else if (payload.eventType === "UPDATE") {
          setItems(prev => prev.map(item => item.id === payload.new.id ? payload.new as PantryItem : item));
        } else if (payload.eventType === "DELETE") {
          setItems(prev => prev.filter(item => item.id === payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return { items, loading, markAsCooked, refresh: fetchItems };
};
