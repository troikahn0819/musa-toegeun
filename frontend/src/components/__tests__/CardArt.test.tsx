import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CardArt } from '../CardArt';
import { cards } from '../../data/cards';

describe('CardArt component', () => {
  it('renders an accessible labelled image containing an svg for a known card', () => {
    render(<CardArt cardId={cards[0].id} />);
    const fig = screen.getByRole('img');
    expect(fig).toHaveAttribute('aria-label');
    expect(fig.querySelector('svg')).not.toBeNull();
  });

  it('renders nothing for a card without art', () => {
    const { container } = render(<CardArt cardId="does_not_exist" />);
    expect(container).toBeEmptyDOMElement();
  });
});
