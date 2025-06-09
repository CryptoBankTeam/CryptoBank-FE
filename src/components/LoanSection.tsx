import React from "react";
import OfferComponent from "@/components/offer"; 
import { Loan, LoanResponse } from "@/types/Loan";

interface LoanSectionProps {
  openLoans: Loan[];
  closedLoans: Loan[];
  onUpdate: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const LoanSection: React.FC<LoanSectionProps> = ({
  openLoans,
  closedLoans,
  onUpdate,
  loading,
  error,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Мои сделки
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {!loading && !error && openLoans.length > 0 && (
            
              openLoans.map((loan) => (
                <OfferComponent
                  offer={loan}
                  key={loan.id}
                  onUpdate={onUpdate}
                  source="loansection"
                />
              ))
          )}
          {!loading && !error && openLoans.length === 0 && (
            <p className="text-center text-gray-600">Нет принятых сделок.</p>
          )}
        </div>

        <div className="space-y-6">
          {/* Отображение закрытых сделок */}
          {!loading && !error && closedLoans.length > 0 && (
              closedLoans.map((loan) => (
                <OfferComponent
                  offer={loan}
                  key={loan.id}
                  onUpdate={onUpdate} 
                  source="loansection"
                />
              ))

          )}
          {!loading && !error && closedLoans.length === 0 && (
            <p className="text-center text-gray-600">Нет закрытых сделок.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanSection;
