export interface User {
  id: number;
  username: string;
  password: string;
  rating: number;
  adress_wallet: string;
  clean_loans: number;           
  overdue_loans: number;         
  offers_accepted: number;
}

export interface Loan {
  id: number;
  lender_id: string;
  borrower_id: string;
  amount: number;
  interest: number;
  collateral: number;
  due_date: number;
  status: string;
  lender?: User;
  borrower?: User;
  duration?: number;
}

export interface LoanResponse {
  Loan: Loan;
  Status: string;
}