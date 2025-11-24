import React, { useState } from 'react';
import { TombalaCard } from '../types';
import Card from './Card';
import { PrinterIcon } from './icons';

type CardGeneratorProps = {
    onBackToGame: () => void;
    customLogo: string | null;
    selectedYear: number;
};

const generateSingleTombalaCard = (id: number): TombalaCard => {
    const card: (number | null)[][] = Array(3).fill(null).map(() => Array(9).fill(null));
    const columnRanges = [[1, 9], [10, 19], [20, 29], [30, 39], [40, 49], [50, 59], [60, 69], [70, 79], [80, 90]];

    const numbersOnCard: Set<number> = new Set();

    for (let row = 0; row < 3; row++) {
        const positions = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => 0.5 - Math.random()).slice(0, 5);
        positions.sort((a,b)=> a-b);
        
        for (const col of positions) {
            const [min, max] = columnRanges[col];
            let num;
            do {
                num = Math.floor(Math.random() * (max - min + 1)) + min;
            } while (numbersOnCard.has(num));
            
            card[row][col] = num;
            numbersOnCard.add(num);
        }
    }

    for (let col = 0; col < 9; col++) {
      const colNumbers: number[] = [];
      for(let row = 0; row < 3; row++) {
        if (card[row][col] !== null) {
          colNumbers.push(card[row][col] as number);
        }
      }
      colNumbers.sort((a, b) => a - b);
      let numIndex = 0;
       for(let row = 0; row < 3; row++) {
        if (card[row][col] !== null) {
          card[row][col] = colNumbers[numIndex++];
        }
      }
    }

    return { id, numbers: card };
};

const CardGenerator: React.FC<CardGeneratorProps> = ({ onBackToGame, customLogo, selectedYear }) => {
    const [cardCount, setCardCount] = useState(1);
    const [generatedCards, setGeneratedCards] = useState<TombalaCard[]>([]);

    const generateCards = () => {
        const cards: TombalaCard[] = [];
        for (let i = 1; i <= cardCount; i++) {
            cards.push(generateSingleTombalaCard(i));
        }
        setGeneratedCards(cards);
    };

    const handlePrint = () => {
        const printableArea = document.querySelector('.printable-area');
        if (!printableArea) {
            console.error('Yazdırılabilir alan bulunamadı.');
            return;
        }

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Tombala Kartları</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <style>
                            body { 
                                font-family: sans-serif;
                            }
                            .printable-area {
                                max-width: 600px !important;
                                margin: 0 auto !important;
                            }
                            @media print {
                                @page {
                                    margin: 1.5cm;
                                }
                                body {
                                    -webkit-print-color-adjust: exact;
                                    color-adjust: exact;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        ${printableArea.outerHTML}
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        } else {
            alert("Yazdırma penceresi açılamadı. Lütfen tarayıcınızda açılır pencerelere izin verdiğinizden emin olun.");
        }
    };

    return (
        <div className="min-h-screen w-screen bg-gray-100 p-4 sm:p-8 print:bg-white">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6 no-print bg-gradient-to-br from-red-900 via-red-800 to-green-900 p-4 rounded-xl shadow-lg">
                    <h1 className="text-xl sm:text-2xl font-bold text-white">Tombala Kart Oluşturucu</h1>
                    <button
                        onClick={onBackToGame}
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all font-semibold"
                    >
                        Oyuna Dön
                    </button>
                </div>

                {generatedCards.length === 0 ? (
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 no-print shadow-md">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <label className="text-gray-800 font-semibold">Kart Adedi:</label>
                            <input
                                type="number"
                                min="1"
                                max="200"
                                value={cardCount}
                                onChange={(e) => setCardCount(Math.max(1, Math.min(200, parseInt(e.target.value) || 1)))}
                                className="px-4 py-2 rounded-lg bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-auto"
                            />
                            <button
                                onClick={generateCards}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-bold transition-all w-full sm:w-auto"
                            >
                                Kartları Oluştur
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6 no-print bg-gradient-to-br from-red-900 via-red-800 to-green-900 p-4 rounded-xl shadow-lg">
                            <div className="text-white text-lg font-semibold">{generatedCards.length} Kart Oluşturuldu</div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePrint}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
                                >
                                    <PrinterIcon size={20} />
                                    Yazdır
                                </button>
                                <button
                                    onClick={() => setGeneratedCards([])}
                                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
                                >
                                    Yeni Oluştur
                                </button>
                            </div>
                        </div>

                        <div className="w-full max-w-2xl mx-auto space-y-0 printable-area">
                            {generatedCards.map((card, cardIndex) => (
                                <React.Fragment key={card.id}>
                                    {cardIndex > 0 && (
                                        <div
                                            className="relative h-8 print:h-6"
                                            style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
                                        >
                                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                                <div className="w-full border-t-2 border-dashed border-gray-400 print:border-gray-600"></div>
                                            </div>
                                        </div>
                                    )}
                                    <Card card={card} customLogo={customLogo} selectedYear={selectedYear} />
                                </React.Fragment>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CardGenerator;