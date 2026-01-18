import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Home as HomeIcon } from 'lucide-react';

export default function MortgageCalculator({ property }) {
    const basePrice = property?.price ? parseFloat(property.price.replace(/[$,]/g, '')) : 985000;

    const [downPaymentPercent, setDownPaymentPercent] = useState(20);
    const [interestRate, setInterestRate] = useState(6.5);
    const [loanTerm, setLoanTerm] = useState(30);

    // Calculate derived values
    const downPayment = (basePrice * downPaymentPercent) / 100;
    const loanAmount = basePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    // Monthly mortgage payment (Principal + Interest)
    const monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);

    // Additional costs
    const propertyTax = (basePrice * 0.0108) / 12; // ~1.08% annual
    const homeInsurance = 100; // ~$1,200/year
    const hoa = property?.financials?.hoa ? parseFloat(property.financials.hoa.replace(/[$,/mo]/g, '')) : 0;

    const totalMonthly = monthlyPI + propertyTax + homeInsurance + hoa;

    // Affordability assessment (assuming 28% DTI ratio)
    const requiredIncome = (totalMonthly / 0.28) * 12;

    const formatCurrency = (num) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
    };

    const getAffordabilityLevel = () => {
        if (requiredIncome < 120000) return { label: 'Affordable', color: 'green', emoji: '✅' };
        if (requiredIncome < 180000) return { label: 'Stretch Goal', color: 'yellow', emoji: '⚠️' };
        return { label: 'Premium', color: 'red', emoji: '💎' };
    };

    const affordability = getAffordabilityLevel();

    return (
        <div className="space-y-6">
            {/* Calculator Header */}
            <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Mortgage Calculator</h3>
                <p className="text-sm text-gray-500">Adjust the sliders to see your monthly payment</p>
            </div>

            {/* Monthly Payment Display */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/40 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl p-6 text-center">
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-widest mb-2">Estimated Monthly Payment</p>
                <p className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">{formatCurrency(totalMonthly)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">per month</p>
            </div>

            {/* Sliders */}
            <div className="space-y-5">
                {/* Down Payment */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Down Payment</label>
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{downPaymentPercent}% ({formatCurrency(downPayment)})</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="50"
                        step="5"
                        value={downPaymentPercent}
                        onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                </div>

                {/* Interest Rate */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Interest Rate</label>
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{interestRate.toFixed(2)}%</span>
                    </div>
                    <input
                        type="range"
                        min="2"
                        max="10"
                        step="0.25"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                </div>

                {/* Loan Term */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Loan Term</label>
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{loanTerm} years</span>
                    </div>
                    <div className="flex gap-2">
                        {[15, 20, 30].map((term) => (
                            <button
                                key={term}
                                onClick={() => setLoanTerm(term)}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${loanTerm === term
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                                    }`}
                            >
                                {term}yr
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Payment Breakdown */}
            <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-5 border border-gray-100 dark:border-white/5">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <DollarSign size={16} /> Monthly Breakdown
                </h4>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Principal & Interest</span>
                        <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(monthlyPI)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Property Tax</span>
                        <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(propertyTax)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Home Insurance</span>
                        <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(homeInsurance)}</span>
                    </div>
                    {hoa > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">HOA Fees</span>
                            <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(hoa)}</span>
                        </div>
                    )}
                    <div className="border-t border-gray-200 dark:border-white/10 pt-2 mt-2 flex justify-between">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">Total Monthly</span>
                        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(totalMonthly)}</span>
                    </div>
                </div>
            </div>

            {/* Affordability Indicator */}
            <div className={`rounded-2xl p-5 border-2 ${affordability.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-500/30' :
                    affordability.color === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-500/30' :
                        'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-500/30'
                }`}>
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{affordability.emoji}</span>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">{affordability.label}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Estimated annual income needed: {formatCurrency(requiredIncome)}</p>
                    </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
                    Based on a 28% debt-to-income ratio. Actual approval depends on credit score, debts, and lender requirements.
                </p>
            </div>
        </div>
    );
}
