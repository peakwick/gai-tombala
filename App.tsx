import React from 'react';
import { useTombalaGame } from './hooks/useTombalaGame';
import CardGenerator from './components/CardGenerator';
import Header from './components/Header';
import CurrentNumberDisplay from './components/CurrentNumberDisplay';
import Board from './components/Board';
import FirstDrawModal from './components/modals/FirstDrawModal';
import PrizeModal from './components/modals/PrizeModal';
import ResetModal from './components/modals/ResetModal';
import TombalaWinnerModal from './components/modals/TombalaWinnerModal';
import SettingsModal from './components/modals/SettingsModal';
import Confetti from './components/Confetti';

export default function App() {
  const {
    state,
    actions,
  } = useTombalaGame();

  if (state.showCardGenerator) {
    return (
      <CardGenerator
        onBackToGame={() => actions.setShowCardGenerator(false)}
        customLogo={state.customLogo}
        selectedYear={state.selectedYear}
      />
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-red-900 via-red-800 to-green-900 p-4 flex flex-col overflow-hidden font-sans">
      {state.confettiTrigger > 0 && <Confetti key={state.confettiTrigger} />}
      <Header
        customLogo={state.customLogo}
        selectedYear={state.selectedYear}
        drawnNumbersCount={state.drawnNumbers.length}
        onReset={actions.resetGame}
        onShowSettings={() => actions.setShowSettingsModal(true)}
      />

      <main className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
        <CurrentNumberDisplay
          currentNumber={state.currentNumber}
          isDrawing={state.isDrawing}
          isAnimating={state.isAnimating}
          drawnNumbers={state.drawnNumbers}
          isAutoDrawEnabled={state.isAutoDrawEnabled}
          soundEnabled={state.soundEnabled}
          numberDrawSound={state.numberDrawSound}
          onDraw={actions.drawNumber}
          onToggleAutoDraw={actions.toggleAutoDraw}
          onToggleSound={actions.toggleSound}
          onNumberDrawSoundChange={actions.setNumberDrawSound}
          firstCinkoClaimed={state.firstCinkoClaimed}
          secondCinkoClaimed={state.secondCinkoClaimed}
          tombalaClaimed={state.tombalaClaimed}
          onClaimFirstCinko={actions.claimFirstCinko}
          onClaimSecondCinko={actions.claimSecondCinko}
          onClaimTombala={actions.claimTombala}
        />
        <Board
          drawnNumbers={state.drawnNumbers}
          currentNumber={state.currentNumber}
        />
      </main>

      <FirstDrawModal
        isOpen={state.showFirstDrawModal}
        totalCards={state.totalCardsForPrize}
        maxPrizes={state.maxPrizeCount}
        onTotalCardsChange={actions.setTotalCardsForPrize}
        onMaxPrizesChange={actions.setMaxPrizeCount}
        onConfirm={actions.confirmPrizeSettings}
      />

      <PrizeModal
        isOpen={state.showPrizeModal}
        isDrawing={state.isDrawingPrize}
        currentPrizeCard={state.currentPrizeCard}
        drawnPrizeCards={state.drawnPrizeCards}
        drawnPrizeCardsCount={state.drawnPrizeCards.length}
        maxPrizeCount={state.maxPrizeCount}
        onDraw={actions.drawPrizeCard}
        onClose={actions.closePrizeModal}
      />

      <ResetModal
        isOpen={state.showResetModal}
        onConfirm={actions.confirmReset}
        onCancel={() => actions.setShowResetModal(false)}
      />

      <TombalaWinnerModal
        isOpen={state.showTombalaWinnerModal}
        onClose={actions.closeTombalaWinnerModal}
      />

      <SettingsModal
        isOpen={state.showSettingsModal}
        onClose={() => actions.setShowSettingsModal(false)}
        onShowCardGenerator={() => actions.setShowCardGenerator(true)}
        customLogo={state.customLogo}
        selectedYear={state.selectedYear}
        autoDrawSpeed={state.autoDrawSpeed}
        onLogoUpload={actions.handleLogoUpload}
        onRemoveLogo={actions.removeLogo}
        onYearChange={actions.setSelectedYear}
        onAutoDrawSpeedChange={actions.setAutoDrawSpeed}
        prizeDrawSound={state.prizeDrawSound}
        onPrizeDrawSoundChange={actions.setPrizeDrawSound}
        winSound={state.winSound}
        onWinSoundChange={actions.setWinSound}
      />
    </div>
  );
}