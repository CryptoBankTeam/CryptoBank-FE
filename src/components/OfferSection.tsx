import React from "react";
import OfferComponent from "@/components/offer"; // Убедитесь, что Offer импортируется корректно
import { Loan, LoanResponse } from "@/types/Loan"; // Убедитесь, что Offer импортируется корректно

interface OfferSectionProps {
  createdOffers: Loan[];
  openOffers: Loan[];
  closedOffers: Loan[];
  onUpdate: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const OfferSection: React.FC<OfferSectionProps> = ({
  createdOffers,
  openOffers,
  closedOffers,
  onUpdate,
  loading,
  error,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Мои предложения
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Колонка с открытыми предложениями */}
        <div className="space-y-6">
          {!loading && !error && createdOffers.length > 0 ? (
            createdOffers.map((offer) => (
              <OfferComponent
                offer={offer}
                key={offer.id}
                onUpdate={onUpdate}
                source="offersection"
              />
            ))
          ) : (
            !loading && !error && (
              <p className="text-center text-gray-600">Нет опубликованных предложений.</p>
            )
          )}
        </div>

        {/* Колонка с закрытыми предложениями */}
        <div className="space-y-6">
          {!loading && !error && closedOffers.length > 0 ? (
            closedOffers.map((offer) => (
              <OfferComponent
                offer={offer}
                key={offer.id}
                onUpdate={onUpdate}
                source="offersection"
              />
            ))
          ) : (
            !loading && !error && (
              <p className="text-center text-gray-600">Нет закрытых предложений.</p>
            )
          )}
        </div>
      </div>
      {/* Колонка с принятыми предложениями */}
      <hr className="my-8 border-t-2 border-gray-950 max-w-4xl mx-auto" />
      <div className="space-y-6">
          {!loading && !error && openOffers.length > 0 ? (
            openOffers.map((offer) => (
              <OfferComponent
                offer={offer}
                key={offer.id}
                onUpdate={onUpdate}
                source="offersection"
              />
            ))
          ) : (
            !loading && !error && (
              <p className="text-center text-gray-600">Нет принятых предложений.</p>
            )
          )}
        </div>
    </div>
  );
};

export default OfferSection;