import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button.jsx";

describe("Button Component", () => {
  it("should render button with children", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();
  });

  it("should apply default classes", () => {
    render(<Button>Test</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("button", "button--primary", "button--medium");
  });

  it("should apply variant classes correctly", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole("button")).toHaveClass("button--primary");

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass("button--secondary");

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole("button")).toHaveClass("button--danger");

    rerender(<Button variant="warning">Warning</Button>);
    expect(screen.getByRole("button")).toHaveClass("button--warning");
  });

  it("should apply size classes correctly", () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("button--small");

    rerender(<Button size="medium">Medium</Button>);
    expect(screen.getByRole("button")).toHaveClass("button--medium");

    rerender(<Button size="large">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("button--large");
  });

  it("should apply custom className", () => {
    render(<Button className="custom-class">Custom</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("should handle click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should not call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should pass through additional props", () => {
    render(
      <Button data-testid="custom-button" aria-label="Custom button">
        Test
      </Button>
    );

    const button = screen.getByTestId("custom-button");
    expect(button).toHaveAttribute("aria-label", "Custom button");
  });

  it("should handle empty children", () => {
    render(<Button />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("");
  });

  it("should handle complex children", () => {
    render(
      <Button>
        <span>Icon</span>
        <span>Text</span>
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("IconText");
  });
});
