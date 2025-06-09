"use client";

import React, { useState, useEffect } from "react";
import OfferComponent from "@/components/offer";
import SERVER_URL from "@/conf";
import Cookies from "js-cookie";
import axios from "axios";
import { Loan } from "@/types/Loan";

const Offers = () => {
  const [offers, setOffers] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = Cookies.get("token");
      if (!token) {
        setError("Нет JWT токена в cookies");
        setOffers([]);
        setLoading(false);
        return;
      }

      const response = await axios.get(`${SERVER_URL}/protected/getAllOffers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOffers(Array.isArray(response.data) ? response.data : []);
      console.log("offers", response.data);
    } catch (err) {
      setError("Не удалось загрузить займы");
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const updateOffer = async () => {
    await fetchOffers();
  };

  return (
    <div className="min-h-screen bg-paleOlive py-8">
      {loading && <p className="text-center text-gray-600">Загрузка предложений...</p>}
      {error && <p className="text-center text-red-500">Ошибка: {error}</p>}
      {!loading && !error && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 px-4">
          {offers.map((offer) => (
            <OfferComponent
              offer={offer}
              key={offer.id}
              onUpdate={updateOffer}
              source="offers"
            />
          ))}
        </div>
      )}
      {!loading && !error && offers.length === 0 && (
        <p className="text-center text-gray-600">Нет доступных предложений.</p>
      )}
    </div>
  );
};

export default Offers;