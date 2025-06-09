"use client";

declare global {
  interface Window {
    ethereum?: any;
  }
}

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import SearchFilter from "./searchFilter";
import Link from "next/link";
import { FaUniversity, FaAddressCard, FaFilter, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { ethers } from "ethers";

const Header: React.FC = () => {
  const router = useRouter();
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const pathname = usePathname();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Получение кошелька из профиля + MetaMask автоопределение
  useEffect(() => {
    interface ProfileResponse {
      adress_wallet?: string;
      [key: string]: any;
    }

    const fetchWallet = async () => {
      const token = Cookies.get("token");
      if (!token) return;

      try {
        // 1. Получаем адрес из профиля
        const res = await axios.get<ProfileResponse>("http://localhost:8080/protected/getProfile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.adress_wallet) {
          setWalletAddress(res.data.adress_wallet);
        }

        // 2. Пробуем взять адрес из MetaMask
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length && !walletAddress) {
            const address = ethers.getAddress(accounts[0]);
            setWalletAddress(address);
          }
        }
      } catch (err) {
        setWalletAddress(null);
      }
    };

    fetchWallet();
  }, []);

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
    console.log("Применены фильтры:", newFilters);
  };

  const toggleFilters = () => {
    setIsFilterVisible((prevState) => !prevState);
  };

  const toProfile = async () => {
    router.push("/pages/profile");
  };

  const logout = () => {
    Cookies.remove("token");
    setWalletAddress(null);
    router.push("/");
  };

  const connectMetaMask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const address = ethers.getAddress(accounts[0]);
        setWalletAddress(address);

        const token = Cookies.get("token");
        if (token) {
          await axios.post(
            "http://localhost:8080/protected/setWallet",
            { adress_wallet: address },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        alert("MetaMask подключён: " + address);
      } catch (error) {
        console.error("Ошибка подключения MetaMask:", error);
      }
    } else {
      alert("MetaMask не установлен. Установите MetaMask и попробуйте снова.");
    }
  };

  return (
    <header className="bg-charcoalBlue text-white py-4 sticky top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 text-darkGold">
        <Link href="/pages/offers" className="flex items-center space-x-3">
          <FaUniversity size={24} />
          <h1 className="text-darkGold text-xl font-semibold">CRYPTO BANK</h1>
        </Link>

        {isFilterVisible && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            <div className="bg-paleOlive p-6 rounded-lg w-80">
              <SearchFilter onFilter={handleFilter} />
              <button
                onClick={toggleFilters}
                className="mt-4 w-full bg-terracota text-lightGray p-2 rounded-md"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-4">
          {pathname === "/pages/offers" && (
            <button className="text-darkGold" onClick={toggleFilters}>
              <FaFilter size={25} />
            </button>
          )}

          {walletAddress ? (
            <>
              <span className="text-darkGold bg-gray-800 px-3 py-2 rounded">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
              <button
                onClick={logout}
                title="Выйти"
                className="text-red-400 hover:text-red-600"
              >
                <FaSignOutAlt size={24} />
              </button>
            </>
          ) : (
            <button
              className="text-darkGold hover:text-LightIceBlue"
              onClick={connectMetaMask}
              title="Подключить MetaMask"
            >
              Подключить MetaMask
            </button>
          )}

          <button className="text-darkGold hover:text-LightIceBlue" onClick={toProfile}>
            <FaAddressCard size={40} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
