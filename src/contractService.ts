import { ethers, BrowserProvider, BigNumberish } from "ethers";

const contractAddress = "0xa220E4841962093998386FBFc41881b345245A6b";

const contractABI = [
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "interest", type: "uint256" },
      { internalType: "uint256", name: "collateral", type: "uint256" },
      { internalType: "uint256", name: "duration", type: "uint256" }
    ],
    name: "createLoan",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "loanId", type: "uint256" }],
    name: "acceptLoan",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "loanId", type: "uint256" }],
    name: "repayLoan",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "loanId", type: "uint256" }],
    name: "claimCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256[]", name: "loanIds", type: "uint256[]" }],
    name: "batchCheckOverdue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "loans",
    outputs: [
      { internalType: "address", name: "lender", type: "address" },
      { internalType: "address", name: "borrower", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "interest", type: "uint256" },
      { internalType: "uint256", name: "collateral", type: "uint256" },
      { internalType: "uint256", name: "dueDate", type: "uint256" },
      { internalType: "uint8", name: "status", type: "uint8" }
    ],
    stateMutability: "view",
    type: "function"
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "loanId", type: "uint256" },
      { indexed: true, internalType: "address", name: "lender", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "interest", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "collateral", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "dueDate", type: "uint256" },
      { indexed: false, internalType: "uint8", name: "status", type: "uint8" }
    ],
    name: "LoanCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "loanId", type: "uint256" },
      { indexed: true, internalType: "address", name: "borrower", type: "address" },
      { indexed: false, internalType: "uint8", name: "status", type: "uint8" }
    ],
    name: "LoanAccepted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "loanId", type: "uint256" },
      { indexed: true, internalType: "address", name: "borrower", type: "address" },
      { indexed: false, internalType: "uint8", name: "status", type: "uint8" }
    ],
    name: "LoanRepaid",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "loanId", type: "uint256" },
      { indexed: true, internalType: "address", name: "lender", type: "address" },
      { indexed: false, internalType: "uint8", name: "status", type: "uint8" }
    ],
    name: "CollateralClaimed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "loanId", type: "uint256" },
      { indexed: false, internalType: "uint8", name: "status", type: "uint8" }
    ],
    name: "LoanOverdue",
    type: "event"
  }
];

const getContract = async () => {
  if (typeof window.ethereum === "undefined") {
    throw new Error("MetaMask не установлен");
  }
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
};
// 👇 Методы вызова

export const createLoan = async (
  amount: BigNumberish,
  interest: number,
  collateral: BigNumberish,
  duration: number
) => {
  const contract = await getContract();
  const tx = await contract.createLoan(amount, interest, collateral, duration, { value: amount });
  console.log("Loan created TX:", tx.hash);
  await tx.wait();
};

export const acceptLoan = async (loanId: number, collateral: BigNumberish) => {
  const contract = await getContract();
  const tx = await contract.acceptLoan(loanId, { value: collateral });
  console.log("Loan accepted TX:", tx.hash);
  await tx.wait();
};

export const repayLoan = async (loanId: number, repaymentAmount: BigNumberish) => {
  const contract = await getContract();
  const tx = await contract.repayLoan(loanId, { value: repaymentAmount });
  console.log("Loan repaid TX:", tx.hash);
  await tx.wait();
};

export const claimCollateral = async (loanId: number) => {
  const contract = await getContract();
  const tx = await contract.claimCollateral(loanId);
  console.log("Collateral claimed TX:", tx.hash);
  await tx.wait();
};

export const batchCheckOverdue = async (loanIds: number[]) => {
  const contract = await getContract();
  const tx = await contract.batchCheckOverdue(loanIds);
  console.log("Batch overdue check TX:", tx.hash);
  await tx.wait();
};

// 👇 Получение информации по займу

export const getLoanById = async (loanId: number) => {
  const contract = await getContract();
  const loan = await contract.loans(loanId);

  return {
    lender: loan.lender,
    borrower: loan.borrower,
    amount: ethers.formatEther(loan.amount),
    interest: loan.interest.toString(),
    collateral: ethers.formatEther(loan.collateral),
    dueDate: loan.dueDate.toNumber(),
    status: loan.status
  };
};

// 👇 Утилита для отображения статуса
export const statusToString = (status: number) => {
  const statuses = ["Created", "Accepted", "Repaid", "Overdue", "Closed"];
  return statuses[status] || "Unknown";
};
