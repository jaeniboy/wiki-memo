import { render, screen } from '@testing-library/react'
import {Settings} from '../GameSettings.js';

test("Settings-form renders successfully", () => {
    render(<Settings/>)

    const element = screen.getByText(/Choose your substack .../i);

    expect(element).toBeInTheDocument();

})