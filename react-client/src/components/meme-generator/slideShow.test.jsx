import React from 'react';
import SlideShow from './slideShow';
import{ render, fireEvent} from'@testing-library/react';

it('renderswithoutcrashing', async() => {
    const { getByText } = render(<SlideShow/>);
    const buttonText = document.querySelector('.draw-button');
    expect(buttonText.innerHTML).toBe('DRAW');
});

it('change button text works', () => {
    const{ getByText } = render(<SlideShow/>);
    fireEvent.click(getByText('DRAW'));
    const buttonText = document.querySelector('.draw-button');
    expect(buttonText).toBeDefined();
    expect(buttonText.innerHTML).toBe('choose template');
});