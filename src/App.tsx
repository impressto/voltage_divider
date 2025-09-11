import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [inputVoltage, setInputVoltage] = useState<number>(5)
  const [outputVoltage, setOutputVoltage] = useState<number>(3.3)
  const [r1, setR1] = useState<number>(0)
  const [r2, setR2] = useState<number>(0)
  const [standardResistors, setStandardResistors] = useState<boolean>(true)
  const [resistorSuggestions, setResistorSuggestions] = useState<Array<{ r1: number, r2: number, actual: number, error: number }>>([])
  const [calculationMode, setCalculationMode] = useState<'automatic' | 'manual'>('automatic')
  const [manualR1, setManualR1] = useState<number>(10000)
  const [manualR2, setManualR2] = useState<number>(4700)
  const [manualOutputVoltage, setManualOutputVoltage] = useState<number>(0)

  // Common E24 series resistor values in ohms
  const standardResistorValues = [
    10, 11, 12, 13, 15, 16, 18, 20, 22, 24, 27, 30, 33, 36, 39, 43, 47, 51, 56, 62, 68, 75, 82, 91,
    100, 110, 120, 130, 150, 160, 180, 200, 220, 240, 270, 300, 330, 360, 390, 430, 470, 510, 560, 620, 680, 750, 820, 910,
    1000, 1100, 1200, 1300, 1500, 1600, 1800, 2000, 2200, 2400, 2700, 3000, 3300, 3600, 3900, 4300, 4700, 5100, 5600, 6200, 6800, 7500, 8200, 9100,
    10000, 11000, 12000, 13000, 15000, 16000, 18000, 20000, 22000, 24000, 27000, 30000, 33000, 36000, 39000, 43000, 47000, 51000, 56000, 62000, 68000, 75000, 82000, 91000,
    100000
  ]

  // Calculate output voltage based on manual resistor selection
  useEffect(() => {
    if (inputVoltage && manualR1 && manualR2) {
      // Using voltage divider formula: Vout = Vin * (R2 / (R1 + R2))
      const calculatedVoltage = inputVoltage * (manualR2 / (manualR1 + manualR2))
      setManualOutputVoltage(calculatedVoltage)
    }
  }, [inputVoltage, manualR1, manualR2])

  // Calculate ideal resistor values whenever input or output voltage changes
  useEffect(() => {
    if (calculationMode === 'automatic' && inputVoltage && outputVoltage && inputVoltage > outputVoltage) {
      // Using voltage divider formula: Vout = Vin * (R2 / (R1 + R2))
      // R1/R2 = (Vin/Vout - 1)
      const ratio = inputVoltage / outputVoltage - 1
      
      // For simplicity, choose a reasonable value for R2 (e.g., 10k ohms)
      const idealR2 = 10000
      const idealR1 = ratio * idealR2
      
      setR1(Math.round(idealR1))
      setR2(idealR2)
      
      if (standardResistors) {
        findStandardResistors(inputVoltage, outputVoltage)
      } else {
        setResistorSuggestions([])
      }
    }
  }, [inputVoltage, outputVoltage, standardResistors, calculationMode])

  // Find the best combinations of standard resistors
  const findStandardResistors = (vin: number, vout: number) => {
    if (vin <= vout) return
    
    const suggestions: Array<{ r1: number, r2: number, actual: number, error: number }> = []
    
    // Try different combinations of standard resistors
    for (let i = 0; i < standardResistorValues.length; i++) {
      for (let j = 0; j < standardResistorValues.length; j++) {
        const r1Value = standardResistorValues[i]
        const r2Value = standardResistorValues[j]
        
        // Calculate actual output voltage using these resistors
        const actualVout = vin * (r2Value / (r1Value + r2Value))
        
        // Calculate error percentage
        const error = Math.abs((actualVout - vout) / vout * 100)
        
        // Add to suggestions if error is within reasonable range (e.g., <5%)
        if (error < 5) {
          suggestions.push({
            r1: r1Value,
            r2: r2Value,
            actual: actualVout,
            error: error
          })
        }
      }
    }
    
    // Sort by error (lowest first) and take top 5
    suggestions.sort((a, b) => a.error - b.error)
    setResistorSuggestions(suggestions.slice(0, 5))
  }

  // Format resistor values for display
  const formatResistor = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}MΩ`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}kΩ`
    } else {
      return `${value}Ω`
    }
  }

  return (
    <div className="voltage-divider-calculator">
      <h1>Voltage Divider Calculator</h1>
      
      <div className="mode-selector">
        <button 
          className={calculationMode === 'automatic' ? 'active' : ''} 
          onClick={() => setCalculationMode('automatic')}
        >
          Calculate Resistors
        </button>
        <button 
          className={calculationMode === 'manual' ? 'active' : ''} 
          onClick={() => setCalculationMode('manual')}
        >
          Select Resistors
        </button>
      </div>
      
      {calculationMode === 'automatic' ? (
        <div className="input-section">
          <div className="form-group">
            <label htmlFor="input-voltage">Input Voltage (V):</label>
            <input
              id="input-voltage"
              type="number"
              min="0"
              step="0.1"
              value={inputVoltage}
              onChange={(e) => setInputVoltage(parseFloat(e.target.value))}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="output-voltage">Desired Output Voltage (V):</label>
            <input
              id="output-voltage"
              type="number"
              min="0"
              step="0.1"
              value={outputVoltage}
              onChange={(e) => setOutputVoltage(parseFloat(e.target.value))}
            />
          </div>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={standardResistors}
                onChange={(e) => setStandardResistors(e.target.checked)}
              />
              Find standard resistor values (E24 series)
            </label>
          </div>
        </div>
      ) : (
        <div className="input-section">
          <div className="form-group">
            <label htmlFor="input-voltage-manual">Input Voltage (V):</label>
            <input
              id="input-voltage-manual"
              type="number"
              min="0"
              step="0.1"
              value={inputVoltage}
              onChange={(e) => setInputVoltage(parseFloat(e.target.value))}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="r1-select">R1 Value (Ω):</label>
            <select 
              id="r1-select" 
              value={manualR1}
              onChange={(e) => setManualR1(Number(e.target.value))}
            >
              {standardResistorValues.map((value) => (
                <option key={`r1-${value}`} value={value}>{formatResistor(value)}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="r2-select">R2 Value (Ω):</label>
            <select 
              id="r2-select" 
              value={manualR2}
              onChange={(e) => setManualR2(Number(e.target.value))}
            >
              {standardResistorValues.map((value) => (
                <option key={`r2-${value}`} value={value}>{formatResistor(value)}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      
      {calculationMode === 'automatic' && inputVoltage <= outputVoltage ? (
        <div className="error">
          Input voltage must be greater than output voltage for a voltage divider.
        </div>
      ) : calculationMode === 'automatic' ? (
        <div className="results-section">
          <h2>Calculated Values:</h2>
          
          <div className="calculated-results">
            <div className="result-row">
              <span>R1:</span> 
              <span>{formatResistor(r1)}</span>
            </div>
            
            <div className="result-row">
              <span>R2:</span>
              <span>{formatResistor(r2)}</span>
            </div>
            
            <div className="circuit-diagram">
              <div className="circuit">
                <div className="power">+{inputVoltage}V</div>
                <div className="resistor">R1: {formatResistor(r1)}</div>
                <div className="voltage-point">
                  <span>+{outputVoltage.toFixed(2)}V</span>
                </div>
                <div className="resistor">R2: {formatResistor(r2)}</div>
                <div className="ground">GND</div>
              </div>
            </div>
          </div>
          
          {standardResistors && resistorSuggestions.length > 0 && (
            <div className="standard-resistors">
              <h3>Standard Resistor Combinations:</h3>
              <table>
                <thead>
                  <tr>
                    <th>R1</th>
                    <th>R2</th>
                    <th>Output Voltage</th>
                    <th>Error</th>
                  </tr>
                </thead>
                <tbody>
                  {resistorSuggestions.map((suggestion, index) => (
                    <tr key={index}>
                      <td>{formatResistor(suggestion.r1)}</td>
                      <td>{formatResistor(suggestion.r2)}</td>
                      <td>{suggestion.actual.toFixed(3)}V</td>
                      <td>{suggestion.error.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="results-section">
          <h2>Selected Resistors:</h2>
          
          <div className="calculated-results">
            <div className="result-row">
              <span>R1:</span> 
              <span>{formatResistor(manualR1)}</span>
            </div>
            
            <div className="result-row">
              <span>R2:</span>
              <span>{formatResistor(manualR2)}</span>
            </div>
            
            <div className="result-row highlight">
              <span>Output Voltage:</span>
              <span>{manualOutputVoltage.toFixed(3)}V</span>
            </div>
            
            {outputVoltage > 0 && (
              <div className="result-row">
                <span>Error from target:</span>
                <span>{Math.abs((manualOutputVoltage - outputVoltage) / outputVoltage * 100).toFixed(2)}%</span>
              </div>
            )}
            
            <div className="circuit-diagram">
              <div className="circuit">
                <div className="power">+{inputVoltage}V</div>
                <div className="resistor">R1: {formatResistor(manualR1)}</div>
                <div className="voltage-point">
                  <span>+{manualOutputVoltage.toFixed(2)}V</span>
                </div>
                <div className="resistor">R2: {formatResistor(manualR2)}</div>
                <div className="ground">GND</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="formula-section">
        <h3>Voltage Divider Formula:</h3>
        <p>Vout = Vin × (R2 / (R1 + R2))</p>
      </div>
    </div>
  )
}

export default App
