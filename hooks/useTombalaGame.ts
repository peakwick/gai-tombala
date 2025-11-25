
import { useState, useRef, useEffect, useCallback, ChangeEvent } from 'react';
import { useSoundManager, DrawSoundName, WinSoundName } from './useSoundManager';
import { WinType } from '../types';

const GAME_STATE_KEY = 'tombalaGameState';
const SETTINGS_KEY = 'tombalaSettings';

// Helper to safely load from localStorage
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
        return defaultValue;
    }
};

// Default values for state
const defaultGameState = {
    drawnNumbers: [],
    drawnPrizeCards: [],
    prizeSettingsConfirmed: false,
    totalCardsForPrize: 0,
    maxPrizeCount: 5,
    firstCinkoClaimed: false,
    secondCinkoClaimed: false,
    tombalaClaimed: false,
};

const defaultSettings = {
    soundEnabled: true,
    customLogo: null,
    selectedYear: new Date().getFullYear() + 1,
    autoDrawSpeed: 7000,
    numberDrawSound: 'draw_retro',
    prizeDrawSound: 'draw_retro',
    winSound: 'win_musical',
};


// --- Main Hook ---
export const useTombalaGame = () => {
    // Load initial states from storage or use defaults
    const initialGameState = loadFromStorage(GAME_STATE_KEY, defaultGameState);
    const initialSettings = loadFromStorage(SETTINGS_KEY, defaultSettings);

    // --- Game State (Persisted) ---
    const [drawnNumbers, setDrawnNumbers] = useState<number[]>(initialGameState.drawnNumbers);
    const [drawnPrizeCards, setDrawnPrizeCards] = useState<number[]>(initialGameState.drawnPrizeCards);
    const [prizeSettingsConfirmed, setPrizeSettingsConfirmed] = useState<boolean>(initialGameState.prizeSettingsConfirmed);
    const [totalCardsForPrize, setTotalCardsForPrize] = useState<number>(initialGameState.totalCardsForPrize);
    const [maxPrizeCount, setMaxPrizeCount] = useState<number>(initialGameState.maxPrizeCount);
    const [firstCinkoClaimed, setFirstCinkoClaimed] = useState<boolean>(initialGameState.firstCinkoClaimed);
    const [secondCinkoClaimed, setSecondCinkoClaimed] = useState<boolean>(initialGameState.secondCinkoClaimed);
    const [tombalaClaimed, setTombalaClaimed] = useState<boolean>(initialGameState.tombalaClaimed);
    
    // --- Settings State (Persisted) ---
    const [soundEnabled, setSoundEnabled] = useState<boolean>(initialSettings.soundEnabled);
    const [customLogo, setCustomLogo] = useState<string | null>(initialSettings.customLogo);
    const [selectedYear, setSelectedYear] = useState<number>(initialSettings.selectedYear);
    const [autoDrawSpeed, setAutoDrawSpeed] = useState<number>(initialSettings.autoDrawSpeed);
    const [numberDrawSound, setNumberDrawSound] = useState<DrawSoundName>(initialSettings.numberDrawSound as DrawSoundName);
    const [prizeDrawSound, setPrizeDrawSound] = useState<DrawSoundName>(initialSettings.prizeDrawSound as DrawSoundName);
    const [winSound, setWinSound] = useState<WinSoundName>(initialSettings.winSound as WinSoundName);

    // --- Transient (Non-persisted) State ---
    const [currentNumber, setCurrentNumber] = useState<number | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentPrizeCard, setCurrentPrizeCard] = useState<number | null>(null);
    const [isDrawingPrize, setIsDrawingPrize] = useState(false);
    const [prizeFlowActive, setPrizeFlowActive] = useState(false);
    const [isAutoDrawEnabled, setIsAutoDrawEnabled] = useState(false);
    const [showCardGenerator, setShowCardGenerator] = useState(false);
    const [showPrizeModal, setShowPrizeModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [showFirstDrawModal, setShowFirstDrawModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [confettiTrigger, setConfettiTrigger] = useState(0);
    const [activeWinType, setActiveWinType] = useState<WinType | null>(null);

    const { playSound, playSpinSound } = useSoundManager(soundEnabled);
    const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
    const autoDrawIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // --- State Persistence Effects ---
    useEffect(() => {
        const gameState = {
            drawnNumbers,
            drawnPrizeCards,
            prizeSettingsConfirmed,
            totalCardsForPrize,
            maxPrizeCount,
            firstCinkoClaimed,
            secondCinkoClaimed,
            tombalaClaimed,
        };
        window.localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
    }, [
        drawnNumbers,
        drawnPrizeCards,
        prizeSettingsConfirmed,
        totalCardsForPrize,
        maxPrizeCount,
        firstCinkoClaimed,
        secondCinkoClaimed,
        tombalaClaimed,
    ]);

    useEffect(() => {
        const settings = {
            soundEnabled,
            customLogo,
            selectedYear,
            autoDrawSpeed,
            numberDrawSound,
            prizeDrawSound,
            winSound,
        };
        window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }, [
        soundEnabled,
        customLogo,
        selectedYear,
        autoDrawSpeed,
        numberDrawSound,
        prizeDrawSound,
        winSound,
    ]);


    const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCustomLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const removeLogo = () => setCustomLogo(null);
    
    const toggleSound = () => setSoundEnabled(prev => !prev);
    
    const resetGame = () => setShowResetModal(true);

    const confirmReset = () => {
        window.localStorage.removeItem(GAME_STATE_KEY);

        // Reset game state to defaults
        setDrawnNumbers(defaultGameState.drawnNumbers);
        setDrawnPrizeCards(defaultGameState.drawnPrizeCards);
        setPrizeSettingsConfirmed(defaultGameState.prizeSettingsConfirmed);
        setTotalCardsForPrize(defaultGameState.totalCardsForPrize);
        setMaxPrizeCount(defaultGameState.maxPrizeCount);
        setFirstCinkoClaimed(defaultGameState.firstCinkoClaimed);
        setSecondCinkoClaimed(defaultGameState.secondCinkoClaimed);
        setTombalaClaimed(defaultGameState.tombalaClaimed);
        
        // Reset transient UI/flow state
        setCurrentNumber(null);
        setIsDrawing(false);
        setIsAnimating(false);
        setCurrentPrizeCard(null);
        setIsDrawingPrize(false);
        setShowResetModal(false);
        setPrizeFlowActive(false);
        setIsAutoDrawEnabled(false);
        setActiveWinType(null);
    };

    const performDraw = useCallback(() => {
        setIsDrawing(true);
        setIsAnimating(true);

        const animationSteps = 40;
        const animationIntervalMs = 50;
        const animationDurationSec = (animationSteps * animationIntervalMs) / 1000;

        playSpinSound(numberDrawSound, animationDurationSec);
        
        let counter = 0;
        const animationInterval = setInterval(() => {
            const remainingNumbers = allNumbers.filter((n) => !drawnNumbers.includes(n));
            const randomNum = remainingNumbers[Math.floor(Math.random() * remainingNumbers.length)];
            setCurrentNumber(randomNum);
            counter++;

            if (counter >= animationSteps) {
                clearInterval(animationInterval);

                const finalNumber = remainingNumbers[Math.floor(Math.random() * remainingNumbers.length)];
                setCurrentNumber(finalNumber);
                
                setDrawnNumbers(prev => [...prev, finalNumber]);
                
                playSound(numberDrawSound);

                setTimeout(() => {
                    setIsDrawing(false);
                    setIsAnimating(false);
                }, 1000);
            }
        }, animationIntervalMs);
    }, [allNumbers, drawnNumbers, playSound, playSpinSound, numberDrawSound]);

    const closePrizeModal = () => {
        setShowPrizeModal(false);
        setCurrentPrizeCard(null);
    };

    const drawNumber = useCallback(() => {
        if (isDrawing || drawnNumbers.length >= 90) return;

        if (prizeFlowActive) {
            setPrizeFlowActive(false);
            performDraw();
            return;
        }

        if (drawnNumbers.length === 0 && !prizeSettingsConfirmed) {
            setShowFirstDrawModal(true);
            return;
        }
        
        // --- SURPRISE PRIZE ALGORITHM ---
        const prizesRemaining = maxPrizeCount - drawnPrizeCards.length;
        const currentDrawnCount = drawnNumbers.length;
        const TARGET_END_COUNT = 60; // Finish prizes before this number count
        const START_CHECK_COUNT = 5; // Don't give prizes in the very beginning

        if (
            totalCardsForPrize > 0 && 
            prizesRemaining > 0 && 
            currentDrawnCount > START_CHECK_COUNT && 
            currentDrawnCount < TARGET_END_COUNT
        ) {
            const numbersRemainingUntilTarget = TARGET_END_COUNT - currentDrawnCount;
            
            // Probability P = Remaining Prizes / Remaining Slots
            // This ensures that if prizesRemaining == numbersRemainingUntilTarget, probability is 1.
            const prizeProbability = prizesRemaining / numbersRemainingUntilTarget;
            
            if (Math.random() < prizeProbability) {
                setPrizeFlowActive(true);
                setShowPrizeModal(true);
                return;
            }
        }
        
        performDraw();
    }, [isDrawing, drawnNumbers, prizeFlowActive, prizeSettingsConfirmed, maxPrizeCount, totalCardsForPrize, performDraw, drawnPrizeCards.length]);
    
    const drawNumberRef = useRef(drawNumber);
    useEffect(() => {
        drawNumberRef.current = drawNumber;
    }, [drawNumber]);
    
    useEffect(() => {
        if (autoDrawIntervalRef.current) {
            clearInterval(autoDrawIntervalRef.current);
        }

        const canAutoDraw = isAutoDrawEnabled && !isDrawing && drawnNumbers.length < 90 && !showPrizeModal && !showFirstDrawModal && !showResetModal && !showSettingsModal && !activeWinType;

        if (canAutoDraw) {
            autoDrawIntervalRef.current = setInterval(() => {
                drawNumberRef.current();
            }, autoDrawSpeed);
        }

        return () => {
            if (autoDrawIntervalRef.current) {
                clearInterval(autoDrawIntervalRef.current);
            }
        };
    }, [isAutoDrawEnabled, isDrawing, drawnNumbers.length, showPrizeModal, showFirstDrawModal, showResetModal, showSettingsModal, activeWinType, autoDrawSpeed]);


    const confirmPrizeSettings = (enablePrizes: boolean) => {
        setPrizeSettingsConfirmed(true);
        setShowFirstDrawModal(false);
        if (!enablePrizes) {
            setTotalCardsForPrize(0);
            setMaxPrizeCount(0);
        }
        setTimeout(() => {
            if (drawnNumbers.length === 0) {
                performDraw();
            }
        }, 100);
    };

    const drawPrizeCard = () => {
        setIsDrawingPrize(true);
        
        playSpinSound(prizeDrawSound, 1.5);

        let counter = 0;
        const animationInterval = setInterval(() => {
            const availableCards = Array.from({ length: totalCardsForPrize }, (_, i) => i + 1).filter(n => !drawnPrizeCards.includes(n));
            if (availableCards.length === 0) {
                clearInterval(animationInterval);
                setIsDrawingPrize(false);
                // Optionally handle no cards left
                return;
            }
            const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
            setCurrentPrizeCard(randomCard);
            counter++;

            if (counter >= 30) {
                clearInterval(animationInterval);
                const finalCard = availableCards[Math.floor(Math.random() * availableCards.length)];
                setCurrentPrizeCard(finalCard);
                setDrawnPrizeCards(prev => [...prev, finalCard]);
                playSound(prizeDrawSound);
                setTimeout(() => setIsDrawingPrize(false), 1000);
            }
        }, 50);
    };

    const resetCurrentPrize = () => {
        setCurrentPrizeCard(null);
    };

    const openManualPrizeModal = () => {
        setShowPrizeModal(true);
    };

    const toggleAutoDraw = () => setIsAutoDrawEnabled(prev => !prev);
    
    const claimFirstCinko = () => {
        if (!firstCinkoClaimed) {
            setActiveWinType('1. ÇİNKO');
        }
    };

    const claimSecondCinko = () => {
        if (!secondCinkoClaimed) {
            setActiveWinType('2. ÇİNKO');
        }
    };

    const claimTombala = () => {
        if (!tombalaClaimed) {
             setActiveWinType('TOMBALA');
        }
    };

    const closeWinModal = () => {
        setActiveWinType(null);
    }
    
    const completeWinProcess = () => {
        if (activeWinType === '1. ÇİNKO') {
            setFirstCinkoClaimed(true);
            setConfettiTrigger(c => c + 1);
        } else if (activeWinType === '2. ÇİNKO') {
            setSecondCinkoClaimed(true);
            setConfettiTrigger(c => c + 1);
        } else if (activeWinType === 'TOMBALA') {
            setTombalaClaimed(true);
            setConfettiTrigger(c => c + 1);
        }
        setActiveWinType(null);
    }


    return {
        state: {
            drawnNumbers,
            currentNumber,
            isDrawing,
            isAnimating,
            soundEnabled,
            showCardGenerator,
            totalCardsForPrize,
            maxPrizeCount,
            drawnPrizeCards,
            currentPrizeCard,
            showPrizeModal,
            isDrawingPrize,
            showResetModal,
            showFirstDrawModal,
            prizeSettingsConfirmed,
            customLogo,
            selectedYear,
            isAutoDrawEnabled,
            autoDrawSpeed,
            firstCinkoClaimed,
            secondCinkoClaimed,
            tombalaClaimed,
            confettiTrigger,
            numberDrawSound,
            prizeDrawSound,
            winSound,
            showSettingsModal,
            activeWinType,
        },
        actions: {
            drawNumber,
            resetGame,
            confirmReset,
            toggleSound,
            setShowCardGenerator,
            handleLogoUpload,
            removeLogo,
            setSelectedYear,
            confirmPrizeSettings,
            setTotalCardsForPrize,
            setMaxPrizeCount,
            drawPrizeCard,
            resetCurrentPrize,
            openManualPrizeModal,
            setShowPrizeModal,
            setCurrentPrizeCard,
            setShowResetModal,
            closePrizeModal,
            toggleAutoDraw,
            setAutoDrawSpeed,
            claimFirstCinko,
            claimSecondCinko,
            claimTombala,
            closeWinModal,
            completeWinProcess,
            setNumberDrawSound: (sound) => setNumberDrawSound(sound as DrawSoundName),
            setPrizeDrawSound: (sound) => setPrizeDrawSound(sound as DrawSoundName),
            setWinSound: (sound) => setWinSound(sound as WinSoundName),
            setShowSettingsModal,
            playSound,
            playSpinSound
        },
    };
};
