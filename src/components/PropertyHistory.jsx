import React from 'react';
import { TrendingUp, Calendar, DollarSign, Home as HomeIcon, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function PropertyHistory({ property }) {
    // Mock property history data
    const propertyHistory = {
        built: 2018,
        firstSale: {
            date: '2018',
            price: 750000
        },
        previousSales: [
            { year: '2018', price: 750000, event: 'Original Sale' },
            { year: '2020', price: 825000, event: 'Resale' },
            { year: '2023', price: 920000, event: 'Last Sale' },
            { year: '2025', price: 985000, event: 'Current Listing', isCurrent: true }
        ],
        appreciation: {
            total: '+31.3%',
            annual: '+4.0%'
        }
    };

    const formatCurrency = (num) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(num);
    };

    const chartData = propertyHistory.previousSales.map(sale => ({
        year: sale.year,
        price: sale.price,
        name: sale.event
    }));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Property History</h3>
                <p className="text-sm text-gray-500">Track this property's value over time</p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar size={16} className="text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Built</span>
                    </div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{propertyHistory.built}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={16} className="text-green-600 dark:text-green-400" />
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Total Growth</span>
                    </div>
                    <p className="text-2xl font-black text-green-600 dark:text-green-400">{propertyHistory.appreciation.total}</p>
                </div>
            </div>

            {/* Price Chart */}
            <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-5 border border-gray-100 dark:border-white/5">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp size={16} /> Price History
                </h4>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="year"
                                stroke="#9CA3AF"
                                style={{ fontSize: '12px', fontWeight: 'bold' }}
                            />
                            <YAxis
                                stroke="#9CA3AF"
                                style={{ fontSize: '12px', fontWeight: 'bold' }}
                                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}
                                formatter={(value) => formatCurrency(value)}
                            />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke="#6366F1"
                                strokeWidth={3}
                                fill="url(#priceGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Sales History Timeline */}
            <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-5 border border-gray-100 dark:border-white/5">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Clock size={16} /> Sales Timeline
                </h4>
                <div className="space-y-4">
                    {propertyHistory.previousSales.map((sale, index) => (
                        <div
                            key={index}
                            className={`flex items-start gap-4 pb-4 ${index !== propertyHistory.previousSales.length - 1
                                ? 'border-b border-gray-200 dark:border-white/10'
                                : ''
                                }`}
                        >
                            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${sale.isCurrent
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                                }`}>
                                {sale.isCurrent ? (
                                    <HomeIcon size={20} />
                                ) : (
                                    <DollarSign size={20} />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h5 className="font-bold text-gray-900 dark:text-white">{sale.event}</h5>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{sale.year}</p>
                                    </div>
                                    <span className={`text-lg font-black ${sale.isCurrent
                                        ? 'text-indigo-600 dark:text-indigo-400'
                                        : 'text-gray-900 dark:text-white'
                                        }`}>
                                        {formatCurrency(sale.price)}
                                    </span>
                                </div>
                                {index > 0 && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <TrendingUp size={12} className="text-green-600 dark:text-green-400" />
                                        <span className="text-xs font-bold text-green-600 dark:text-green-400">
                                            +{formatCurrency(sale.price - propertyHistory.previousSales[index - 1].price)}
                                            ({(((sale.price - propertyHistory.previousSales[index - 1].price) / propertyHistory.previousSales[index - 1].price) * 100).toFixed(1)}%)
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Market Insights */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-5 border border-indigo-200 dark:border-indigo-500/20">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <TrendingUp size={16} /> Historical Performance
                </h4>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Average Annual Appreciation</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{propertyHistory.appreciation.annual}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Value Increase</span>
                        <span className="font-bold text-green-600 dark:text-green-400">
                            {formatCurrency(propertyHistory.previousSales[propertyHistory.previousSales.length - 1].price - propertyHistory.firstSale.price)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Years Since Built</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                            {new Date().getFullYear() - propertyHistory.built} years
                        </span>
                    </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                    📊 Historical data shows consistent appreciation. Past performance does not guarantee future results.
                </p>
            </div>

            {/* Data Source Disclaimer */}
            <div className="bg-gray-100 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    <span className="font-bold text-gray-900 dark:text-white">Data Sources:</span> Property history and pricing data sourced from public records, MLS listings, and county assessor databases. School ratings provided by GreatSchools.org. Information is deemed reliable but not guaranteed. Please verify all details independently.
                </p>
            </div>
        </div>
    );
}
