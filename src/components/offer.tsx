import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { acceptLoan, claimCollateral, repayLoan, batchCheckOverdue } from "@/contractService";
import { Loan } from "@/types/Loan";
import { FaEthereum, FaPercentage, FaUser, FaClock} from "react-icons/fa";

interface OfferProps {
  offer: Loan;
  onUpdate: () => Promise<void>;
  source: "loansection" | "offersection" | "offers";
}

const OfferComponent: React.FC<OfferProps> = ({ offer, onUpdate, source }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatToEth = (wei: string | number | bigint): string => {
    return parseFloat(ethers.formatEther(wei)).toFixed(9);
  };

  const handleButtonClick = async () => {
  try {
    setLoading(true);
    setError(null);

    // Для займов (loansection)
    if (source === "loansection" && (offer.status === "Accepted" || offer.status === "Overdue")) {
      const amount = BigInt(offer.amount);
      const interestRate = Number(offer.interest);
      const interest = (amount * BigInt(interestRate)) / BigInt(100);
      const totalRepayment = amount + interest;
      await repayLoan(offer.id, BigInt(totalRepayment));
      await onUpdate();
    } 
    // Для своих предложений (offersection)
    else if (source === "offersection") {
      if (offer.status === "Overdue") {
        await claimCollateral(offer.id);
      } else if (offer.status === "Created") {
        // Здесь добавить функцию для отмены предложения
        //await cancelOffer(offer.id);
      }
      await onUpdate();
    }
    // Для списка всех предложений (offers)
    else if (source === "offers" && offer.status === "Created") {
      await acceptLoan(offer.id, BigInt(offer.collateral));
      await onUpdate();
    }

  } catch (err) {
    console.error("Ошибка:", err);
    setError(
      source === "loansection"
        ? "Не удалось закрыть сделку."
        : source === "offersection"
        ? offer.status === "Overdue"
          ? "Не удалось забрать залог."
          : "Не удалось отменить предложение."
        : "Не удалось принять предложение."
    );
  } finally {
    setLoading(false);
  }
};

return (
  <div className="bg-deepMossGreen shadow-md hover:shadow-lg rounded-lg p-4 w-full max-w-3xl mx-auto border border-gray-300 transition-shadow duration-300">
    {/* Заголовок */}
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-bold text-darkGold">Предложение</h3>
      <span className="text-sm font-medium flex items-center space-x-2">
        {(() => {
          const status = offer.status;
          const now = Math.floor(Date.now() / 1000);
          const duration = offer.duration || 0;
          const dueDate = Number(offer.due_date);

          // Для просроченных
          if (status === "Overdue") {
            return <span className="text-base font-semibold text-red-500">ПРОСРОЧЕН</span>;
          }

          // Для закрытых
          if (status === "Closed" || status === "Repaid") {
            return <span className="text-base font-semibold text-darkGold">ЗАКРЫТ</span>;
          }

          // Для созданных
          if (status === "Created") {
            const minutes = Math.floor(duration / 60);
            return (
              <>
                <FaClock className="text-darkGold" />
                <span>
                  <span className="text-darkGold">Срок:</span>{" "}
                  <span className="text-base font-semibold text-lightGray">
                    {`${minutes > 0 ? minutes : 0} минут`}
                  </span>
                </span>
              </>
            );
          }

          // Для принятых
          if (status === "Accepted") {
            const secondsLeft = dueDate - now;
            if (secondsLeft <= 0) {
              return <span className="text-base font-semibold text-red-500">ПРОСРОЧЕН</span>;
            }
            const minutes = Math.floor(secondsLeft / 60);
            return (
              <>
                <FaClock className="text-darkGold" />
                <span>
                  <span className="text-darkGold">Срок:</span>{" "}
                  <span className="text-base font-semibold text-lightGray">
                    {`${minutes} минут`}
                  </span>
                </span>
              </>
            );
          }

          return null;
        })()}
      </span>
    </div>

      <hr className="border-t border-gray-300 my-2" />
      {/* Основная информация */}
      <div className="grid grid-cols-2 gap-y-6 gap-x-6 mb-4">
        {/* Сумма */}
        <div className="flex items-start space-x-2">
          <FaEthereum className="text-darkGold mt-1" />
          <div>
            <p className="text-sm text-darkGold">Сумма</p>
            <p className="text-base font-semibold text-lightGray">{formatToEth(offer.amount)} ETH</p>
          </div>
        </div>

        {/* Залог */}
        <div className="flex items-start space-x-2">
          <FaEthereum className="text-darkGold mt-1" />
          <div>
            <p className="text-sm text-darkGold">Залог</p>
            <p className="text-base font-semibold text-lightGray">{formatToEth(offer.collateral)} ETH</p>
          </div>
        </div>

        {/* Процент */}
        <div className="flex items-start space-x-2">
          <FaPercentage className="text-darkGold mt-1" />
          <div>
            <p className="text-sm text-darkGold">Процент</p>
            <p className="text-base font-semibold text-lightGray">{offer.interest}%</p>
          </div>
        </div>

        {/* Кредитор или Заёмщик с рейтингом */}
<div className="flex items-start space-x-2">
  <FaUser className="text-darkGold mt-1" />
  <div>
    <p className="text-sm text-darkGold">
      {source === "loansection" ? "Кредитор" : source === "offersection" ? "Заёмщик" : "Кредитор"}
    </p>
    <p className="text-base font-semibold text-lightGray">
      {source === "loansection"
        ? offer.lender?.username || offer.lender?.id
        : source === "offersection"
        ? offer.borrower?.username || offer.borrower?.id || "—"
        : offer.lender?.username || offer.lender?.id}
    </p>

    {/* 👇 Отображение рейтинга */}
    <p className="text-sm text-gray-400">
      Рейтинг:{" "}
      {source === "loansection"
        ? offer.lender?.rating?.toFixed(2) ?? "0.00"
        : source === "offersection"
        ? offer.borrower?.rating?.toFixed(2) ?? "0.00"
        : offer.lender?.rating?.toFixed(2) ?? "0.00"}
    </p>
  </div>
</div>

      </div>

      <hr className="border-t border-gray-300 my-2" />

      {/* Кнопка */}
<div className="flex justify-between items-center">
  {error && <p className="text-sm text-red-500">{error}</p>}
  {/* Логика для offersection */}
  {source === "offersection" && (
    <>
      {offer.status === "Overdue" && (
        <button
          onClick={handleButtonClick}
          disabled={loading}
          className={`px-3 py-1 rounded-md text-white font-semibold ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-charcoalGreen hover:bg-charcoalBlue"
          } transition duration-300`}
        >
          {loading ? "Обработка..." : "Забрать залог"}
        </button>
      )}
      {offer.status === "Created" && (
        <button
          onClick={handleButtonClick}
          disabled={loading}
          className={`px-3 py-1 rounded-md text-white font-semibold ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-charcoalGreen hover:bg-charcoalBlue"
          } transition duration-300`}
        >
          {loading ? "Обработка..." : "Отменить"}
        </button>
      )}
    </>
  )}

  {/* Логика для loansection */}
  {source === "loansection" && (offer.status === "Overdue" || offer.status === "Accepted") && (
    <button
      onClick={handleButtonClick}
      disabled={loading}
      className={`px-3 py-1 rounded-md text-white font-semibold ${
        loading ? "bg-gray-400 cursor-not-allowed" : "bg-charcoalGreen hover:bg-charcoalBlue"
      } transition duration-300`}
    >
      {loading ? "Обработка..." : "Закрыть"}
    </button>
  )}
  {/* Логика для offers */}
  {source === "offers" && offer.status === "Created" && (
    <button
      onClick={handleButtonClick}
      disabled={loading}
      className={`px-3 py-1 rounded-md text-white font-semibold ${
        loading ? "bg-gray-400 cursor-not-allowed" : "bg-charcoalGreen hover:bg-charcoalBlue"
      } transition duration-300`}
    >
      {loading ? "Обработка..." : "Принять"}
    </button>
  )}
</div>
    </div>
  );
};

export default OfferComponent;