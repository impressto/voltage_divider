# Voltage Divider Calculator

A React application built with Vite and TypeScript that helps calculate resistor values for voltage dividers.

<img width="548" height="800" alt="voltage_divider" src="https://github.com/user-attachments/assets/22a4a992-7af4-4d03-811c-111997fd11a1" />

## Features

- Input the desired input and output voltages
- Calculate the required resistor values (R1 and R2)
- Find standard E24 series resistor combinations
- Manually select resistors from available inventory to see resulting output voltage
- Visual circuit diagram representation
- Error percentage calculation for each resistor combination

## Voltage Divider

A voltage divider is a simple circuit that reduces a larger voltage to a smaller one using two resistors in series. The formula used is:

```
Vout = Vin × (R2 / (R1 + R2))
```

Where:
- Vout = Output voltage
- Vin = Input voltage
- R1 = Resistor 1 (connected to Vin)
- R2 = Resistor 2 (connected to ground)

## Development

This project was created using:
- React 18
- TypeScript
- Vite

### Installation

```bash
# Navigate to project directory
cd voltage-divider-calc

# Install dependencies
yarn

# Start development server
yarn dev
```

### Build

```bash
# Create production build
yarn build

# Preview production build
yarn preview
```
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
