import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders diagram for the example expression', () => {
  render(<App />);

  // Click the "Example" button
  fireEvent.click(screen.getByText(/Example/i));

  // Check if the input field is updated
  const input = screen.getByLabelText(/Enter Lambda Expression/i);
  expect(input.value).toBe('((λx.(λw.xw))(λa.(λf.f)))');

  // Click the "Generate Diagram" button
  fireEvent.click(screen.getByText(/Generate Diagram/i));

  // Check if the SVG is rendered
  const svgElement = screen.getByTestId('lambda-diagram');
  expect(svgElement).toBeInTheDocument();

  // Check for lambda abstractions in the diagram
  expect(screen.getByText('λx')).toBeInTheDocument();
  expect(screen.getByText('λw')).toBeInTheDocument();
  expect(screen.getByText('λa')).toBeInTheDocument();
  expect(screen.getByText('λf')).toBeInTheDocument();
});
