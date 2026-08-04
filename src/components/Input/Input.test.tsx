import { renderWithProviders } from '@/test/renderWithProviders';
import { lightTheme } from '@/styles/themes';
import { fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import Input from './Input';

/** Style array of the bordered field wrapper, for state-styling assertions. */
const fieldStyle = () => screen.getByTestId('field-field').props.style;

describe('Input', () => {
  it('renders the label and placeholder', () => {
    renderWithProviders(<Input label="Ad Soyad" placeholder="Adınızı girin" />);
    expect(screen.getByText('Ad Soyad')).toBeTruthy();
    expect(screen.getByPlaceholderText('Adınızı girin')).toBeTruthy();
  });

  it('calls onChangeText as the user types', () => {
    const onChangeText = jest.fn();
    renderWithProviders(<Input placeholder="you@example.com" onChangeText={onChangeText} />);

    fireEvent.changeText(screen.getByPlaceholderText('you@example.com'), 'hello');

    expect(onChangeText).toHaveBeenCalledWith('hello');
  });

  it('renders helperText when given', () => {
    renderWithProviders(<Input placeholder="x" helperText="Must be at least 6 characters" />);
    expect(screen.getByText('Must be at least 6 characters')).toBeTruthy();
  });

  it('renders the character count when showCharacterCount and maxLength are set', () => {
    renderWithProviders(<Input placeholder="x" value="hello" maxLength={20} showCharacterCount />);
    expect(screen.getByText('5/20')).toBeTruthy();
  });

  it('starts secure and toggles visibility when the eye icon is pressed', () => {
    renderWithProviders(<Input placeholder="password" isSecure />);

    expect(screen.getByPlaceholderText('password').props.secureTextEntry).toBe(true);

    fireEvent.press(screen.getByLabelText('Şifreyi göster'));

    expect(screen.getByPlaceholderText('password').props.secureTextEntry).toBe(false);
  });

  it('shows the error message instead of helperText and tints the border', () => {
    renderWithProviders(
      <Input
        testID="field"
        label="Telefon numarası"
        placeholder="5xx xxx xx xx"
        helperText="Başında 0 olmadan girin"
        error="Bu alan zorunlu"
      />,
    );

    expect(screen.getByText('Bu alan zorunlu')).toBeTruthy();
    expect(screen.queryByText('Başında 0 olmadan girin')).toBeNull();
    expect(fieldStyle()).toContainEqual(expect.objectContaining({ borderColor: lightTheme.danger }));
  });

  it('switches to the focus border on focus and back on blur', () => {
    renderWithProviders(<Input testID="field" placeholder="E-posta" />);
    const input = screen.getByPlaceholderText('E-posta');
    const focusRing = expect.objectContaining({
      borderWidth: 2,
      borderColor: lightTheme.input.focusedBorder,
    });

    expect(fieldStyle()).not.toContainEqual(focusRing);

    fireEvent(input, 'focus');
    expect(fieldStyle()).toContainEqual(focusRing);

    fireEvent(input, 'blur');
    expect(fieldStyle()).not.toContainEqual(focusRing);
  });

  it('is not editable and does not take the focus ring when disabled', () => {
    renderWithProviders(
      <Input testID="field" label="Daire" placeholder="Daire" value="A Blok · Daire 14" disabled />,
    );
    const input = screen.getByPlaceholderText('Daire');

    expect(input.props.editable).toBe(false);

    fireEvent(input, 'focus');

    expect(fieldStyle()).toContainEqual(expect.objectContaining({ opacity: 0.5 }));
    expect(fieldStyle()).not.toContainEqual(expect.objectContaining({ borderWidth: 2 }));
  });

  it('renders the prefix segment', () => {
    renderWithProviders(<Input prefix="+90" placeholder="5xx xxx xx xx" keyboardType="phone-pad" />);

    expect(screen.getByText('+90')).toBeTruthy();
    expect(screen.getByPlaceholderText('5xx xxx xx xx').props.keyboardType).toBe('phone-pad');
  });

  it('gives the search variant a pill shape and a leading search icon', () => {
    renderWithProviders(<Input testID="field" variant="search" placeholder="Dairede ara" />);

    expect(screen.UNSAFE_getByProps({ name: 'search-line' })).toBeTruthy();
    expect(fieldStyle()).toContainEqual(expect.objectContaining({ borderRadius: 999 }));
  });

  it('sizes a multiline field to the requested number of lines', () => {
    renderWithProviders(
      <Input label="Yöneticiye mesaj" placeholder="Mesajınızı yazın" multiline numberOfLines={3} />,
    );
    const input = screen.getByPlaceholderText('Mesajınızı yazın');

    expect(input.props.multiline).toBe(true);
    expect(input.props.style).toContainEqual({ minHeight: 69 });
  });
});
