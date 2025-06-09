"use client";

import React, { useState } from "react";
import { createLoan } from "@/contractService";
import { ethers } from "ethers";

const CreateOffer: React.FC = () => {
  const [amount, setAmount] = useState<string>("");
  const [percent, setPercent] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [collateral, setCollateral] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!amount || !percent || !collateral || !duration) {
        setError("Все поля должны быть заполнены.");
        return;
      }

      const cleanedAmount = amount.replace(",", ".").trim();
      const cleanedCollateral = collateral.replace(",", ".").trim();
      const cleanedPercent = percent.trim();
      const cleanedDuration = duration.trim();

      const ethAmount = ethers.parseEther(cleanedAmount);
      const ethCollateral = ethers.parseEther(cleanedCollateral);
      const interest = parseFloat(cleanedPercent);
      const loanDuration = parseInt(cleanedDuration) * 60;



      if (interest < 0 || interest > 100) {
        setError("Процент должен быть от 0 до 100.");
        return;
      }

      if (loanDuration <= 0) {
        setError("Срок должен быть больше 0 минут.");
        return;
      }

      if (parseFloat(cleanedAmount) > 0.01 || parseFloat(cleanedCollateral) > 0.01) {
        setError("Слишком большая сумма или залог для тестовой сети. Введите до 0.01 ETH.");
        return;
      }

      await createLoan(ethAmount, interest, ethCollateral, loanDuration);
      setSuccess(true);
      setAmount("");
      setPercent("");
      setDuration("");
      setCollateral("");
    } catch (err) {
      console.error("Ошибка при создании офера:", err);
      setError("Ошибка при создании офера. Проверьте введённые данные.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-paleOlive">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Новое предложение</h1>

      <form onSubmit={handleSubmit} className="bg-mutedSage shadow-md rounded-lg p-6 space-y-4 w-full max-w-md">
        {/* Сумма */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Сумма (ETH)
          </label>
          <input
            type="text"
            id="amount"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-paleOlive text-darkGray mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
            placeholder="0.000001"
            required
          />
        </div>

        {/* Процент */}
        <div>
          <label htmlFor="percent" className="block text-sm font-medium text-gray-700">
            Процент (%)
          </label>
          <input
            type="number"
            id="percent"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            className="bg-paleOlive text-darkGray mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
            min="0"
            max="100"
            required
          />
        </div>

        {/* Срок */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Срок (в минутах)
          </label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="bg-paleOlive text-darkGray mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
            min="1"
            required
          />
        </div>

        {/* Залог */}
        <div>
          <label htmlFor="collateral" className="block text-sm font-medium text-gray-700">
            Залог (ETH)
          </label>
          <input
            type="text"
            id="collateral"
            inputMode="decimal"
            value={collateral}
            onChange={(e) => setCollateral(e.target.value)}
            className="bg-paleOlive text-darkGray mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
            placeholder="0.000001"
            required
          />
        </div>

        {/* Ошибка / Успех */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">Офер успешно создан!</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading ? "bg-gray-400" : "bg-charcoalGreen hover:bg-charcoalBlue"
          }`}
        >
          {loading ? "Создание..." : "Создать офер"}
        </button>
      </form>
    </div>
  );
};

export default CreateOffer;
