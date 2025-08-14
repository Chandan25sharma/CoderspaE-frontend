'use client';

import { useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Snowflake, Bug, Eye, Shield, Clock, Coins } from 'lucide-react';

interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  cooldown: number;
  duration?: number;
  currentCooldown: number;
  available: boolean;
  owned: number;
}

interface PowerUpBarProps {
  powerUps: PowerUp[];
  coins: number;
  onPowerUpUse: (powerUpId: string) => void;
  onPowerUpPurchase: (powerUpId: string) => void;
  disabled?: boolean;
  className?: string;
}

const PowerUpBar: React.FC<PowerUpBarProps> = ({
  powerUps,
  coins,
  onPowerUpUse,
  onPowerUpPurchase,
  disabled = false,
  className = '',
}) => {
  const [selectedPowerUp, setSelectedPowerUp] = useState<PowerUp | null>(null);
  const [showShop, setShowShop] = useState(false);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'freeze': return <Snowflake size={20} />;
      case 'bug': return <Bug size={20} />;
      case 'reveal': return <Eye size={20} />;
      case 'shield': return <Shield size={20} />;
      case 'time': return <Clock size={20} />;
      default: return <Zap size={20} />;
    }
  };

  const getPowerUpColor = (powerUpId: string) => {
    switch (powerUpId) {
      case 'freeze': return '#00AAFF';
      case 'bug-bomb': return '#FF4444';
      case 'reveal-test': return '#FFD700';
      case 'shield': return '#44FF88';
      case 'time-boost': return '#AA00FF';
      default: return '#FFFFFF';
    }
  };

  const canUsePowerUp = (powerUp: PowerUp) => {
    return !disabled && 
           powerUp.available && 
           powerUp.currentCooldown === 0 && 
           powerUp.owned > 0;
  };

  const canBuyPowerUp = (powerUp: PowerUp) => {
    return coins >= powerUp.cost;
  };

  const formatCooldown = (seconds: number) => {
    if (seconds <= 0) return '';
    return `${seconds}s`;
  };

  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="text-purple-400" size={24} />
          <h3 className="text-lg font-bold text-white">Power-ups</h3>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-yellow-400">
            <Coins size={16} />
            <span className="font-bold">{coins}</span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowShop(!showShop)}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm transition-colors"
          >
            {showShop ? 'Hide Shop' : 'Shop'}
          </motion.button>
        </div>
      </div>

      {/* Power-up Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        {powerUps.map((powerUp) => (
          <motion.div
            key={powerUp.id}
            whileHover={{ scale: canUsePowerUp(powerUp) ? 1.05 : 1 }}
            className="relative"
          >
            <button
              onClick={() => canUsePowerUp(powerUp) ? onPowerUpUse(powerUp.id) : setSelectedPowerUp(powerUp)}
              disabled={!canUsePowerUp(powerUp)}
              className={`relative w-full p-3 rounded-lg border-2 transition-all ${
                canUsePowerUp(powerUp)
                  ? 'border-purple-500 bg-purple-600/20 hover:bg-purple-600/40 text-white cursor-pointer'
                  : 'border-gray-600 bg-gray-800 text-gray-400 cursor-not-allowed'
              }`}
              style={{
                borderColor: canUsePowerUp(powerUp) ? getPowerUpColor(powerUp.id) : undefined,
                boxShadow: canUsePowerUp(powerUp) ? `0 0 10px ${getPowerUpColor(powerUp.id)}40` : undefined,
              }}
            >
              {/* Icon */}
              <div className="flex justify-center mb-2">
                {getIconComponent(powerUp.icon)}
              </div>
              
              {/* Name */}
              <div className="text-xs font-semibold text-center mb-1">
                {powerUp.name}
              </div>
              
              {/* Owned Count */}
              <div className="text-xs text-center text-gray-300">
                {powerUp.owned}x
              </div>

              {/* Cooldown Overlay */}
              {powerUp.currentCooldown > 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
                  <span className="text-xs font-bold text-white">
                    {formatCooldown(powerUp.currentCooldown)}
                  </span>
                </div>
              )}

              {/* Unavailable Overlay */}
              {!powerUp.available && (
                <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center rounded-lg">
                  <span className="text-xs font-bold text-red-400">
                    Locked
                  </span>
                </div>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Shop */}
      <AnimatePresence>
        {showShop && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-700 pt-4"
          >
            <h4 className="text-md font-semibold text-white mb-3">Power-up Shop</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {powerUps.map((powerUp) => (
                <div
                  key={powerUp.id}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-md"
                        style={{ backgroundColor: `${getPowerUpColor(powerUp.id)}20` }}
                      >
                        {getIconComponent(powerUp.icon)}
                      </div>
                      <div>
                        <h5 className="font-semibold text-white text-sm">{powerUp.name}</h5>
                        <p className="text-xs text-gray-400">{powerUp.description}</p>
                        <div className="text-xs text-gray-500 mt-1">
                          Cooldown: {powerUp.cooldown}s
                          {powerUp.duration && ` | Duration: ${powerUp.duration}s`}
                        </div>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: canBuyPowerUp(powerUp) ? 1.05 : 1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => canBuyPowerUp(powerUp) ? onPowerUpPurchase(powerUp.id) : undefined}
                      disabled={!canBuyPowerUp(powerUp)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                        canBuyPowerUp(powerUp)
                          ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <Coins size={12} />
                        {powerUp.cost}
                      </div>
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Power-up Details Modal */}
      <AnimatePresence>
        {selectedPowerUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedPowerUp(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${getPowerUpColor(selectedPowerUp.id)}20` }}
                >
                  {getIconComponent(selectedPowerUp.icon)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedPowerUp.name}</h3>
                  <p className="text-sm text-gray-400">{selectedPowerUp.description}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Cost:</span>
                  <span className="text-yellow-400 flex items-center gap-1">
                    <Coins size={12} />
                    {selectedPowerUp.cost}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Cooldown:</span>
                  <span className="text-white">{selectedPowerUp.cooldown}s</span>
                </div>
                {selectedPowerUp.duration && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">{selectedPowerUp.duration}s</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Owned:</span>
                  <span className="text-white">{selectedPowerUp.owned}x</span>
                </div>
              </div>

              <div className="flex gap-2">
                {canBuyPowerUp(selectedPowerUp) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onPowerUpPurchase(selectedPowerUp.id);
                      setSelectedPowerUp(null);
                    }}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md font-semibold transition-colors"
                  >
                    Buy ({selectedPowerUp.cost} coins)
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedPowerUp(null)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PowerUpBar;
