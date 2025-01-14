import React from 'react';
import { render } from '@testing-library/react';
import { domToReact, domToReacts, toRootElement } from './dom-to-react';

describe('domToReact', () => {
  it('should find simple React component', () => {
    const { getByText } = render(<DivComponent />);
    const target = getByText('hello');

    const component = domToReact(target);
    expect(component).toEqual(DivComponent);
  });

  it('should find React component with fragment', () => {
    const { getByText } = render(<FragmentComponent />);
    const target = getByText('hello');

    const component = domToReact(target);
    expect(component).toEqual(FragmentComponent);
  });

  it('should find react component with array', () => {
    const { getByText } = render(<ArrayComponent />);
    const target = getByText('hello');

    const component = domToReact(target);
    expect(component).toEqual(ArrayComponent);
  });

  it('should find react component with nesting', () => {
    const { getByText } = render(<NestedComponent />);
    const target = getByText('hello');

    const component = domToReact(target);
    expect(component).toEqual(NestedComponent);
  });

  // doesn't work for text-only components
  test.skip('should find React component with fragment', () => {
    const { getByText } = render(
      <Container>
        <BasicFragmentComponent />
      </Container>
    );
    const target = getByText('hello');

    const component = domToReact(target);
    expect(component).toEqual(BasicFragmentComponent);
  });

  test('should return the outer component, when a component is a decoration of two components', () => {
    const { getByText } = render(<DecoratedDiv />);

    const target = getByText('hello');
    const component = domToReact(target);
    expect(component).toEqual(DecoratedDiv);
  });

  test('should return the outer component, when a component is wrapper of another component', () => {
    const { getByText } = render(<WrappedDiv />);

    const target = getByText('hello');
    const component = domToReact(target);
    expect(component).toEqual(WrappedDiv);
  });
});

describe('domToReacts', () => {
  it('should find simple React component', () => {
    const { getByText } = render(<DivComponent />);
    const target = getByText('hello');

    const components = domToReacts(target);
    expect(components).toEqual([DivComponent]);
  });

  it('should find React component with fragment', () => {
    const { getByText } = render(<FragmentComponent />);
    const target = getByText('hello');

    const components = domToReacts(target);
    expect(components).toEqual([FragmentComponent]);
  });

  it('should find react component with array', () => {
    const { getByText } = render(<ArrayComponent />);
    const target = getByText('hello');

    const components = domToReacts(target);
    expect(components).toEqual([ArrayComponent]);
  });

  it('should find react component with nesting', () => {
    const { getByText } = render(<NestedComponent />);
    const target = getByText('hello');

    const components = domToReacts(target);
    expect(components).toEqual([NestedComponent]);
  });

  // doesn't work for text-only components
  test.skip('should find React component with fragment', () => {
    const { getByText } = render(
      <Container>
        <BasicFragmentComponent />
      </Container>
    );
    const target = getByText('hello');

    const components = domToReacts(target);
    expect(components).toEqual([BasicFragmentComponent]);
  });

  test('should both components, when two react components correspond to a single element', () => {
    const { getByText } = render(<DecoratedDiv />);

    const target = getByText('hello');
    const components = domToReacts(target);
    expect(components).toEqual([DivComponent, DecoratedDiv]);
  });

  test('should return all 3 components, when a component is wrapper of another component', () => {
    const { getByText } = render(<WrappedDiv />);

    const target = getByText('hello');
    const component = domToReacts(target);
    expect(component).toEqual([DivComponent, WrapperComponent, WrappedDiv]);
  });
});

describe('toRootElement', () => {
  it('should find root element of a simple component', () => {
    const { getByText } = render(<DivComponent data-test="1" />);
    const target = getByText('hello');

    const element = toRootElement(target);
    expect(element).toBeInstanceOf(HTMLElement);
    // @ts-ignore - TODO - fix conflict with Chai, jest, testing-framework and testing-library/jest-dom
    expect(element).toHaveAttribute('data-test', '1');
  });

  it('should find root element when in a fragment', () => {
    const { getByText } = render(<FragmentComponent data-test="2" />);
    const target = getByText('hello');

    const element = toRootElement(target);
    expect(element).toBeInstanceOf(HTMLElement);
    // @ts-ignore - TODO - fix conflict with Chai, jest, testing-framework and testing-library/jest-dom
    expect(element).toHaveAttribute('data-test', '2');
    expect(element?.textContent).toEqual('hello');
  });

  it('should find root element when in array', () => {
    const { getByText } = render(<ArrayComponent data-test="3" />);
    const target = getByText('hello');

    const element = toRootElement(target);
    expect(element).toBeInstanceOf(HTMLElement);
    // @ts-ignore - TODO - fix conflict with Chai, jest, testing-framework and testing-library/jest-dom
    expect(element).toHaveAttribute('data-test', '3');
  });

  it('should find fiberNode with when nested', () => {
    const { getByText } = render(<NestedComponent data-test="4" />);
    const target = getByText('hello');

    const element = toRootElement(target);
    expect(element).toBeInstanceOf(HTMLElement);
    // @ts-ignore - TODO - fix conflict with Chai, jest, testing-framework and testing-library/jest-dom
    expect(element).toHaveAttribute('data-test', '4');
  });
});

function DivComponent(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>hello</div>;
}

function Container(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />;
}

function BasicFragmentComponent() {
  return <>hello</>;
}

function WrapperComponent({ children }: { children?: any }) {
  return children;
}

function DecoratedDiv(props: React.HTMLAttributes<HTMLDivElement>) {
  return <DivComponent {...props} />;
}

function WrappedDiv(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WrapperComponent>
      <DivComponent {...props} />
    </WrapperComponent>
  );
}

function FragmentComponent(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <>
      <div {...props}>hello</div>
      <div {...props}>world</div>
    </>
  );
}

function NestedComponent(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      container
      <div>
        <div>pre-sibling</div>
        contained
        <div>hello</div>
        <div>sibling</div>
      </div>
    </div>
  );
}

function ArrayComponent(props: React.HTMLAttributes<HTMLDivElement>) {
  const arr = ['hello', 'world'];

  return (
    <div {...props}>
      {arr.map((x) => (
        <div key={x}>{x}</div>
      ))}
    </div>
  );
}
