import React from 'react';
import {fireEvent} from '@testing-library/react-native';
import renderer from 'react-test-renderer';
import {StyledTheme} from '@animavita/theme';

import {Mount, ThemeContext} from '../../../tests/helpers';
import Button from '../Button';

const setup = propOverrides => {
  const {children} = propOverrides;
  const defaultProps = {
    onPress: jest.fn().mockName('onPress'),
    ...propOverrides,
  };

  const element = Mount(<Button {...defaultProps}>{children}</Button>);

  return element;
};

describe('Button', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls onPress', () => {
    const cb = jest.fn();
    const {getByText} = setup({text: 'Title', size: 'small', onPress: cb});

    fireEvent.press(getByText('Title'));

    expect(cb).toHaveBeenCalled();
  });

  describe('textColor variations', () => {
    it('renders disabled color', () => {
      const {getByText} = setup({text: 'Title', size: 'small', disabled: true});

      expect(getByText('Title')).toHaveStyle({color: StyledTheme.grey});
    });

    it('renders custom color', () => {
      const {getByText} = setup({text: 'Title', size: 'small', textColor: 'red'});

      expect(getByText('Title')).toHaveStyle({color: 'red'});
    });

    it('renders active/gradient color', () => {
      const {getByText} = setup({text: 'Title', size: 'small', gradient: true});

      expect(getByText('Title')).toHaveStyle({color: StyledTheme.white});
    });
  });

  describe('textSize variations', () => {
    it('renders body font size', () => {
      const {getByText} = setup({text: 'Title', size: 'small', disabled: true});

      expect(getByText('Title')).toHaveStyle({fontSize: parseFloat(StyledTheme.sizeBody)});
    });

    it('renders title-2 font size', () => {
      const {getByText} = setup({text: 'Title', size: 'large', disabled: true});

      expect(getByText('Title')).toHaveStyle({fontSize: parseFloat(StyledTheme.sizeTitle3)});
    });
  });

  describe('when violate the constraints', () => {
    beforeEach(() => {
      global.console = {warn: jest.fn()};
    });

    it('logs disabled and gradient warn', () => {
      setup({text: 'Title', size: 'small', disabled: true, gradient: true});

      expect(console.warn).toHaveBeenCalledWith("You can't use `gradient` prop when your button is disabled.");
    });

    it('logs rounded warn', () => {
      setup({text: 'Title', size: 'small', rounded: true});

      expect(console.warn).toHaveBeenCalledWith(
        'To use `rounded` prop you need the `outline`, `gradient` or `active` prop as well.',
      );
    });

    it('logs outline warn', () => {
      setup({text: 'Title', size: 'small', outline: true, gradient: true});

      expect(console.warn).toHaveBeenCalledWith(
        "You can't use `outline` prop combined with `gradient` or `active` props.",
      );
    });

    it('logs children and title warn', () => {
      // Mount(
      //   <Button text="Title" size="small" onPress={cb}>
      //     <></>
      //   </Button>,
      // );
      setup({text: 'Title', size: 'small', children: <></>});

      expect(console.warn).toHaveBeenCalledWith(
        "You can't use `title` prop combined with `children`. Use only one of both.",
      );
    });
  });

  it('renders correctly', () => {
    const cb = jest.fn();
    const tree = renderer
      .create(ThemeContext(<Button text="Title" size="small" rounded gradient onPress={cb} />))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
