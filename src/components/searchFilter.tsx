"use client";
import React, { useState } from 'react';

interface SearchFilterProps {
  onFilter: (filters: any) => void; // Функция для применения фильтров
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onFilter }) => {
  const [cryptoAmount, setCryptoAmount] = useState<string>('');
  const [percent, setPercent] = useState<number | string>('');
  const [loanTerm, setLoanTerm] = useState<string>('');
  const [searchId, setSearchId] = useState<string>(''); // Поле для поиска по ID

  // Обработчик для применения фильтров
  const handleFilter = () => {
    onFilter({ cryptoAmount, percent, loanTerm, searchId });
  };

  return (
    <div className="sticky top-20 p-4 bg-mutedSage shadow-md rounded-lg h-fit">
      <h2 className="text-l font-bold text-gray-800 mb-4">Поиск предложений по ID</h2>

      <div className="mb-4 bg-">
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="bg-paleOlive mt-1 block w-full p-2 border border-gray-300 rounded-md"
          placeholder="Введите ID"
        />
      </div>

      <h2 className="text-l font-bold text-gray-800 mb-4">Фильтры</h2>

      <div className="mb-4">
        <input
          type="text"
          value={cryptoAmount}
          onChange={(e) => setCryptoAmount(e.target.value)}
          className="bg-paleOlive mt-1 block w-full p-2 border border-gray-300 rounded-md"
          placeholder="Количество криптовалюты"
        />
      </div>

      <div className="mb-4">
        <input
          type="number"
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
          className="bg-paleOlive mt-1 block w-full p-2 border border-gray-300 rounded-md"
          placeholder="Процент"
        />
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={loanTerm}
          onChange={(e) => setLoanTerm(e.target.value)}
          className="bg-paleOlive mt-1 block w-full p-2 border border-gray-300 rounded-md"
          placeholder="Срок выдачи"
        />
      </div>

      <button
        onClick={handleFilter}
        className="w-full bg-charcoalGreen text-lightGray py-2 rounded-md hover:bg-charcoalBlue transition duration-300"
      >
        Применить
      </button>
    </div>
  );
};

export default SearchFilter;
