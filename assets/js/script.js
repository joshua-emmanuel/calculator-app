const calculator = document.querySelector('.calculator');
const calculatorDisplay = calculator.querySelector('.calculator__display');
const calculatorKeys = calculator.querySelector('.calculator__keys');

function calculate(firstValue, operator, secondValue) {
  firstValue = parseFloat(firstValue);
  secondValue = parseFloat(secondValue);
  if (operator === 'plus') { return firstValue + secondValue; }
  if (operator === 'minus') { return firstValue - secondValue; }
  if (operator === 'times') { return firstValue * secondValue; }
  if (operator === 'divide') { return firstValue / secondValue; }
}

function handleResetKey(calculator, button) {
  calculatorDisplay.textContent = '0';
  delete calculator.dataset.firstValue;
  delete calculator.dataset.operator;
  delete calculator.dataset.secondValue;
  delete calculator.dataset.modifierValue;
}

function handleDeleteKey() {
  const result = calculatorDisplay.textContent;
  splitResult = result.split('');
  splitResult.pop();
  const newResult = splitResult.join('');
  if (newResult) {
    calculatorDisplay.textContent = newResult;
  } else {
    calculatorDisplay.textContent = '0';
  }
}

function handleNumberKeys(calculator, button) {
  const { previousButtonType } = calculator.dataset;
  const { key } = button.dataset;

  const calculatorDisplayValue = getCalculatorDisplayValue();

  if (calculatorDisplayValue === '0') {
    calculatorDisplay.textContent = key;
  } else {
    calculatorDisplay.textContent = calculatorDisplayValue + key;
  }

  // If an operator has been clicked
  if (previousButtonType === 'operator') {
    calculatorDisplay.textContent = key;
  }

  if (previousButtonType === 'equal') {
    calculatorDisplay.textContent = key;

    delete calculator.dataset.firstValue;
    delete calculator.dataset.operator;
    delete calculator.dataset.secondValue;
    delete calculator.dataset.modifierValue;
  }

  if (previousButtonType === 'delete') {
    delete calculator.dataset.firstValue;
    delete calculator.dataset.operator;
    delete calculator.dataset.secondValue;
    delete calculator.dataset.modifierValue;
  }
}

function handleDecimalKey(calculator) {
  const calculatorDisplayValue = getCalculatorDisplayValue();
  const { previousButtonType } = calculator.dataset;

  if (!calculatorDisplayValue.includes('.')) {
    calculatorDisplay.textContent = calculatorDisplayValue + '.';
  }

  if (previousButtonType === 'equal') {
    calculatorDisplay.textContent = '0.';

    delete calculator.dataset.firstValue;
    delete calculator.dataset.operator;
    delete calculator.dataset.secondValue;
    delete calculator.dataset.modifierValue;
  }

  if (previousButtonType === 'delete') {
    delete calculator.dataset.firstValue;
    delete calculator.dataset.operator;
    delete calculator.dataset.secondValue;
    delete calculator.dataset.modifierValue;
  }

  if (previousButtonType === 'operator') {
    calculatorDisplay.textContent = '0.';
  }
}

function handleOperatorKeys(calculator, button) {
  button.classList.add('is-pressed');

  const { previousButtonType, firstValue, operator } = calculator.dataset;
  const { key } = button.dataset;
  const calculatorDisplayValue = getCalculatorDisplayValue();
  const secondValue = calculatorDisplayValue;

  if (
    previousButtonType !== 'operator' &&
    previousButtonType !== 'delete' &&
    previousButtonType !== 'equal' &&
    firstValue &&
    operator
  ) {
    const result = calculate(firstValue, operator, secondValue);
    calculatorDisplay.textContent = result;
    // If there's a calculation, we change firstValue
    calculator.dataset.firstValue = result;
  } else {
    calculatorDisplay.textContent = parseFloat(calculatorDisplayValue * 1);
    // Otherwise, we set firstValue to calculatorDisplayValue
    calculator.dataset.firstValue = calculatorDisplayValue;
  }

  calculator.dataset.operator = key;
}

function handleEqualKey(calculator) {
  const { firstValue, operator, modifierValue, previousButtonType } = calculator.dataset;
  const calculatorDisplayValue = getCalculatorDisplayValue();

  let secondValue = calculatorDisplayValue;

  if (previousButtonType === 'equal') {
    secondValue = parseFloat(modifierValue) || secondValue;
  }

  if (firstValue && operator) {
    const result = calculate(firstValue, operator, secondValue);
    calculatorDisplay.textContent = result;
    // Assigns new result to first value
    calculator.dataset.firstValue = result;
    // Stores second values as modifier for follow up calculations
    calculator.dataset.modifierValue = secondValue;
  } else {
    // Strips unnecessary decimal point
    calculatorDisplay.textContent = parseFloat(calculatorDisplayValue * 1);
  }
}

calculatorKeys.addEventListener('click', function (event) {
  if (!event.target.closest('button')) { return; }
  const button = event.target;
  const { buttonType } = button.dataset;
  const operatorButtons = [...(calculatorKeys.children)]
    .filter(button => button.dataset.buttonType === 'operator');
  operatorButtons.forEach(operatorButton => {
    operatorButton.classList.remove('is-pressed');
  });

  switch (buttonType) {
    case 'delete':
      handleDeleteKey();
      break;
    case 'reset':
      handleResetKey(calculator, button);
      break;
    case 'number':
      handleNumberKeys(calculator, button);
      break;
    case 'decimal':
      handleDecimalKey(calculator);
      break;
    case 'operator':
      handleOperatorKeys(calculator, button);
      break;
    case 'equal':
      handleEqualKey(calculator);
      break;
  }

  if (calculatorDisplay.scrollWidth > calculatorDisplay.clientWidth) {
    // Reduce the font size to fit
    calculatorDisplay.style.fontSize = (parseFloat(getComputedStyle(calculatorDisplay).fontSize) - 2) + 'px';
  }

  calculator.dataset.previousButtonType = buttonType;
});

function getCalculatorDisplayValue() {
  return calculatorDisplay.textContent;
}

function pressKey(key) {
  calculatorKeys.querySelector(`[data-key="${key}"]`).click();
}

function pressKeys(...keys) {
  keys.forEach(pressKey);
}

function resetCalculator() {
  const resetButton = calculatorKeys.querySelector('[data-key=reset]');
  resetButton.click();
  resetButton.click();
}

function runTest(test) {
  pressKeys(...test.keys);
  console.assert(getCalculatorDisplayValue() === test.result, test.message);
  resetCalculator();
}

// Calculator Tests
const tests = [
  {
    message: 'Number Key',
    keys: ['1'],
    result: '1'
  },

  {
    message: 'Number Number',
    keys: ['1', '2'],
    result: '12'
  },

  {
    message: 'Number Decimal',
    keys: ['5', 'decimal'],
    result: '5.'
  },

  {
    message: 'Number Decimal Number',
    keys: ['5', 'decimal', '4'],
    result: '5.4'
  },

  {
    message: 'Number Equal',
    keys: ['5', 'equal'],
    result: '5'
  },

  {
    message: 'Number Decimal Equal',
    keys: ['2', 'decimal', '4', '5', 'equal'],
    result: '2.45'
  },

  {
    message: 'Decimal First',
    keys: ['decimal'],
    result: '0.'
  },

  {
    message: 'Decimal Decimal',
    keys: ['2', 'decimal', 'decimal'],
    result: '2.',
  },

  {
    message: 'Decimal Number Decimal',
    keys: ['2', 'decimal', '5', 'decimal', '5'],
    result: '2.55'
  },

  {
    message: 'Decimal Equal',
    keys: ['2', 'decimal', 'equal'],
    result: '2',
  },

  {
    message: 'Equal',
    keys: ['equal'],
    result: '0'
  },

  {
    message: 'Equal Number',
    keys: ['equal', '5'],
    result: '5'
  },

  {
    message: 'Number Equal Number',
    keys: ['3', 'equal', '5'],
    result: '5'
  },

  {
    message: 'Equal Decimal',
    keys: ['equal', 'decimal'],
    result: '0.'
  },

  {
    message: 'Number Equal Decimal',
    keys: ['5', 'equal', 'decimal'],
    result: '0.'
  },

  {
    message: 'Calculation + Operator',
    keys: ['2', 'plus', '3', 'equal', 'plus', '1', '0', 'equal'],
    result: '15'
  },

  {
    message: 'Operator Decimal',
    keys: ['plus', 'decimal'],
    result: '0.'
  },

  {
    message: 'Number Operator Decimal',
    keys: ['5', 'plus', 'decimal'],
    result: '0.'
  },

  {
    message: 'Number Operator Equal',
    keys: ['2', 'plus', 'equal'],
    result: '4'
  },

  {
    message: 'Number Operator Equal',
    keys: ['2', 'minus', 'equal'],
    result: '0'
  },

  {
    message: 'Operator Calculation',
    keys: ['5', 'times', '2', 'plus'],
    result: '10'
  },

  {
    message: 'Number Operator Operator',
    keys: ['9', 'minus', 'minus'],
    result: '9'
  },

  {
    message: 'Number Operator Equal Equal',
    keys: ['5', 'minus', 'equal', 'equal'], // 5 - 5 = 0 = -5(0 - 5)
    result: '-5'
  },

  {
    message: 'Number Operator Number Equal Equal',
    keys: ['8', 'minus', '5', 'equal', 'equal'],
    result: '-2'
  },

  {
    message: 'Operator Follow-Up Calculation',
    keys: ['1', 'plus', '3', 'plus', '5', 'plus', '7', 'plus'],
    result: '16'
  },

  {
    message: 'No follow-up Calculation after pressing equal',
    keys: ['6', 'plus', '9', 'equal', '5', 'plus', '5', 'equal'],
    result: '10',
  },

  {
    message: 'No follow-up Calculation after pressing delete',
    keys: ['6', 'plus', '9', 'equal', 'delete', '3', 'minus', '9', 'equal'],
    result: '4',
  }
];

tests.forEach(runTest);