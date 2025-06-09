"use client";

import React, { useState, useEffect } from "react";
import SERVER_URL from "@/conf";
import Cookies from "js-cookie";
import axios from "axios";
import { FaUniversity, FaRandom, FaPlus } from "react-icons/fa";
import { Loan, User } from "@/types/Loan";
import LoanSection from "@/components/LoanSection";
import OfferSection from "@/components/OfferSection";
import { useRouter } from 'next/navigation';
import { ethers, JsonRpcProvider } from "ethers";

// Функция для получения баланса и перевода в ETH
async function GetEthBalance(address: string): Promise<string> {
  try {
    const provider = new JsonRpcProvider(
      "https://eth-sepolia.g.alchemy.com/v2/LPbAgqwCmEfxl3G5smUZm-L6l1hEwegp");
    const balanceWei = await provider.getBalance(address);
    console.log("balance", balanceWei.toString());
    return ethers.formatEther(balanceWei);
  } catch {
    return "0";
  }
}

const Profile = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);
  const [myOffers, setMyOffers] = useState<Loan[]>([]);
  const [myLoans, setMyLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoansOffers, setshowLoansOffers] = useState<boolean>(true);
  const [balance, setBalance] = useState<string>("");

  const fetchProfileAndOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = Cookies.get("token");
      if (!token) {
        setError("No JWT token found in cookies");
        setLoading(false);
        return;
      }

      // Данные профиля
      const profileResponse = await axios.get<User>(`${SERVER_URL}/protected/getProfile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Займы, которые взял пользователь
      const myLoansResponse = await axios.get(`${SERVER_URL}/protected/getMyCredits`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Займы, которые создал пользователь 
      const myOffersResponse = await axios.get(`${SERVER_URL}/protected/getMyOffers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(profileResponse.data as User);
      setMyLoans(Array.isArray(myLoansResponse.data) ? myLoansResponse.data : []);
      setMyOffers(Array.isArray(myOffersResponse.data) ? myOffersResponse.data : []);

      if (profileResponse.data?.adress_wallet) {
        const eth = await GetEthBalance(profileResponse.data.adress_wallet);
        setBalance(eth);
      } else {
        setBalance("0");
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndOffers();
  }, []);

  const updateOffer = async () => {
    await fetchProfileAndOffers();
  };

  const openLoans = myLoans.filter((loan) => loan.status === "Accepted"|| loan.status === "Overdue");
  const closedLoans = myLoans.filter((loan) => loan.status === "Repaid" || loan.status === "Closed");

  const createdOffers = myOffers.filter((offer) => offer.status === "Created");
  const openOffers = createdOffers.filter((offer) => offer.status === "Accepted"|| offer.status === " Overdue");
  const closedOffers = myOffers.filter((offer) => offer.status === "Repaid" || offer.status === "Closed");

  const toCreateOffer = async () => {
    router.push('/pages/CreateOffer'); 
  };

  return (
    <div className="min-h-screen bg-paleOlive py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Мой профиль
      </h1>

      {loading && <p className="text-center text-gray-600">Загрузка данных...</p>}
      {error && <p className="text-center text-red-500">Ошибка: {error}</p>}

      {!loading && !error && profile && (
        <div className="relative max-w-4xl mx-auto bg-charcoalGreen rounded-xl shadow-lg p-6">
          <div className="absolute top-2 right-1">
            <button
              onClick={() => setshowLoansOffers((prev) => !prev)}
              className="text-darkGold font-bold py-2 px-4 rounded"
            >
              <FaRandom size={24} />
            </button>
          </div>
          <div className="absolute top-2 left-1">
            <button
              className="text-darkGold font-bold py-2 px-4 rounded"
              onClick={toCreateOffer}
            >
              <FaPlus size={24} />
            </button>
          </div>
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-darkGold rounded-full flex items-center justify-center text-6xl text-gray-950">
              <FaUniversity size={60} />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-lightGray">
              {profile.username}#{profile.id}
            </h2>
            <hr className="w-1/2 mx-auto" />
            <h2 className="text-2xl font-semibold text-darkGold">
               {balance ? `${parseFloat(balance).toFixed(9)} ETH` : "—"}
            </h2>
          </div>
        </div>
      )}

      <hr className="my-8 border-t-2 border-gray-950 max-w-5xl mx-auto" />

      {showLoansOffers ? (
        <LoanSection
          openLoans={openLoans}
          closedLoans={closedLoans}
          onUpdate={updateOffer}
          loading={loading}
          error={error}
        />
      ) : (
        <OfferSection
          createdOffers ={createdOffers}
          openOffers={openOffers}
          closedOffers={closedOffers}
          onUpdate={updateOffer}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
};

export default Profile;