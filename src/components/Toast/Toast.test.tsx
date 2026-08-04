import { renderWithProviders } from '@/test/renderWithProviders';
import { fireEvent, screen } from '@testing-library/react-native';
import { MessageComponentProps, hideMessage } from 'react-native-flash-message';
import React from 'react';
import Toast from './Toast';

jest.mock('react-native-flash-message', () => ({
  ...jest.requireActual('react-native-flash-message'),
  hideMessage: jest.fn(),
}));

const mockHideMessage = hideMessage as jest.Mock;

function makeProps(overrides: Partial<MessageComponentProps['message']> = {}) {
  return {
    message: { message: 'Something happened', type: 'info', ...overrides },
  } as MessageComponentProps;
}

describe('Toast', () => {
  it('renders the message text', () => {
    renderWithProviders(<Toast {...makeProps({ message: 'Saved successfully' })} />);
    expect(screen.getByText('Saved successfully')).toBeTruthy();
  });

  it('shows the success icon for a success message', () => {
    renderWithProviders(<Toast {...makeProps({ type: 'success' })} />);
    expect(screen.UNSAFE_getByProps({ name: 'checkbox-circle-fill' })).toBeTruthy();
  });

  it('shows the danger icon for a danger message', () => {
    renderWithProviders(<Toast {...makeProps({ type: 'danger' })} />);
    expect(screen.UNSAFE_getByProps({ name: 'close-circle-fill' })).toBeTruthy();
  });

  it('falls back to the info icon for an unrecognized type', () => {
    renderWithProviders(<Toast {...makeProps({ type: 'unknown' })} />);
    expect(screen.UNSAFE_getByProps({ name: 'information-fill' })).toBeTruthy();
  });

  it('calls hideMessage when the close icon is pressed', () => {
    renderWithProviders(<Toast {...makeProps()} />);

    fireEvent.press(screen.UNSAFE_getByProps({ name: 'close-line' }).parent!);

    expect(mockHideMessage).toHaveBeenCalledTimes(1);
  });
});
