# ColdFusion

[![npm version](https://img.shields.io/npm/v/@rbxts/ColdFusion?style=flat-square)](https://www.npmjs.com/package/@rbxts/ColdFusion)
[![Roblox-TS](https://img.shields.io/badge/Roblox--TS-compatible-blueviolet?style=flat-square)](https://roblox-ts.com/)
[![Fusion](https://img.shields.io/badge/Fusion-0.3-ff69b4?style=flat-square)](https://elttob.uk/Fusion/)

TypeScript type definitions for Roblox Fusion UI (v0.3) for Roblox-TS projects.

## Installation

```bash
npm install @rbxts/ColdFusion
```

## Basic Usage

### State Management

```typescript
import { Fusion } from "@rbxts/ColdFusion";

// Create state
const counter = Fusion.Value(0);

// Create computed state
const doubled = Fusion.Computed(() => counter.getValue() * 2);

// Create an observer
const observer = Fusion.Observer(counter);
onChange(() => {
    print(`Counter changed to: ${counter.getValue()}`);
});

// Update state
counter.setValue(5);
```

### UI Construction

```typescript
import { Fusion } from "@rbxts/ColdFusion";

const button = Fusion.New("TextButton")({
    Size: UDim2.fromOffset(200, 50),
    Position: UDim2.fromScale(0.5, 0.5),
    AnchorPoint: new Vector2(0.5, 0.5),
    Text: "Click Me!",
    [Fusion.OnEvent("Activated")]: () => {
        print("Button clicked!");
    }
});

// Add to the UI
button.Parent = game.GetService("Players").LocalPlayer.WaitForChild("PlayerGui");
```

## Advanced Usage Examples

### Using Hydrate with Existing Instances

```typescript
import { Fusion } from "@rbxts/ColdFusion";

// Get an existing instance (e.g., from the StarterGui)
const existingFrame = game.GetService("StarterGui").FindFirstChild("MainFrame");

if (existingFrame && existingFrame.IsA("Frame")) {
    // Hydrate the existing frame with new properties and children
    const hydratedFrame = Fusion.Hydrate(existingFrame)({
        // Update properties
        Size: new UDim2(0.8, 0, 0.6, 0),
        Position: new UDim2(0.1, 0, 0.2, 0),
        BackgroundColor3: Color3.fromRGB(45, 45, 45),
        
        // Add children
        [Fusion.Children]: [
            Fusion.New("TextLabel")({
                Size: new UDim2(1, 0, 0.1, 0),
                Text: "Welcome Back!",
                TextScaled: true,
                BackgroundTransparency: 1,
                TextColor3: Color3.fromRGB(255, 255, 255)
            })
        ]
    });
}
```

### State Management with Computed and Observer

```typescript
import { Fusion } from "@rbxts/ColdFusion";

// Create state objects
const playerHealth = Fusion.Value(100);
const maxHealth = Fusion.Value(100);
const isLowHealth = Fusion.Computed(() => playerHealth.getValue() < 30);

// Create a health bar UI
const healthBar = Fusion.New("Frame")({
    Size: new UDim2(0.8, 0, 0.05, 0),
    Position: new UDim2(0.1, 0, 0.9, 0),
    BackgroundColor3: Color3.fromRGB(40, 40, 40),
    [Fusion.Children]: [
        Fusion.New("Frame")({
            Name: "HealthFill",
            Size: Fusion.Computed(() => {
                const healthPercent = playerHealth.getValue() / maxHealth.getValue();
                return new UDim2(math.clamp(healthPercent, 0, 1), 0, 1, 0);
            }),
            BackgroundColor3: Fusion.Computed(() => {
                const healthPercent = playerHealth.getValue() / maxHealth.getValue();
                return healthPercent > 0.5 
                    ? Color3.fromRGB(46, 204, 113) // Green
                    : healthPercent > 0.2 
                        ? Color3.fromRGB(230, 126, 34) // Orange
                        : Color3.fromRGB(231, 76, 60); // Red
            }),
            BorderSizePixel: 0
        }),
        Fusion.New("TextLabel")({
            Size: new UDim2(1, 0, 1, 0),
            Text: Fusion.Computed(() => 
                `${math.floor(playerHealth.getValue())}/${maxHealth.getValue()}`
            ),
            TextColor3: Color3.fromRGB(255, 255, 255),
            BackgroundTransparency: 1,
            TextScaled: true
        })
    ]
});

// Add to UI
healthBar.Parent = game.GetService("Players").LocalPlayer.WaitForChild("PlayerGui");

// Watch for low health
Fusion.Observer(isLowHealth).onChange(() => {
    if (isLowHealth.getValue()) {
        // Play warning sound or show alert
        print("Warning: Low health!");
    }
});
```

### Animation with Tween and Spring

```typescript
import { Fusion } from "@rbxts/ColdFusion";

// Create a button with hover animation
const button = Fusion.New("TextButton")({
    Size: new UDim2(0, 200, 0, 50),
    Position: new UDim2(0.5, -100, 0.5, 0),
    AnchorPoint: new Vector2(0.5, 0.5),
    Text: "Hover Me!",
    TextScaled: true,
    BackgroundColor3: Color3.fromRGB(52, 152, 219),
    
    // Hover animation
    [Fusion.OnEvent("MouseEnter")]: () => {
        Fusion.Tween(button, {
            Time: 0.3,
            EasingStyle: Enum.EasingStyle.Quad,
            EasingDirection: Enum.EasingDirection.Out,
            Target: {
                Size: new UDim2(0, 220, 0, 55),
                BackgroundColor3: Color3.fromRGB(41, 128, 185)
            }
        });
    },
    
    [Fusion.OnEvent("MouseLeave")]: () => {
        Fusion.Tween(button, {
            Time: 0.3,
            EasingStyle: Enum.EasingStyle.Quad,
            EasingDirection: Enum.EasingDirection.Out,
            Target: {
                Size: new UDim2(0, 200, 0, 50),
                BackgroundColor3: Color3.fromRGB(52, 152, 219)
            }
        });
    },
    
    // Click effect using Spring
    [Fusion.OnEvent("Activated")]: () => {
        const spring = Fusion.Spring(button, {
            Frequency: 10,
            DampingRatio: 0.7,
            Target: {
                Size: new UDim2(0, 180, 0, 45)
            }
        });
        
        // Reset after animation
        task.delay(0.2, () => {
            spring.destroy();
            button.Size = new UDim2(0, 200, 0, 50);
        });
    }
});

button.Parent = game.GetService("Players").LocalPlayer.WaitForChild("PlayerGui");
```

## API Reference

### Core

- `Fusion.Value<T>(initialValue: T): Value<T>` - Creates a new state value
- `Fusion.Computed<T>(processor: () => T): Computed<T>` - Creates a computed state
- `Fusion.Observer<T>(state: StateObject<T>): Observer<T>` - Creates an observer for state changes
- `Fusion.New(className: string): (props: PropertyTable) => Instance` - Creates a new instance
- `Fusion.Hydrate(instance: Instance): (props: PropertyTable) => Instance` - Hydrates an existing instance

#### Hydrate Use Case

`Hydrate` is particularly useful when you need to:

1. **Modify existing UI elements** without recreating them
2. **Apply Fusion features** to instances created outside of Fusion
3. **Progressively enhance** existing UI with reactive properties

**Example: Hydrating a pre-made UI from StarterGui**

```typescript
// In a LocalScript
import { Fusion } from "@rbxts/ColdFusion";

// Wait for the UI to load
const player = game.GetService("Players").LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui");
const mainMenu = playerGui.WaitForChild("MainMenu") as ScreenGui;

// Get existing UI elements
const playButton = mainMenu.WaitForChild("PlayButton") as TextButton;
const settingsButton = mainMenu.WaitForChild("SettingsButton") as TextButton;

// Hydrate the buttons with Fusion features
Fusion.Hydrate(playButton)({
    // Add hover effects
    [Fusion.OnEvent("MouseEnter")]: () => {
        playButton.TextColor3 = Color3.fromRGB(255, 255, 255);
        playButton.BackgroundTransparency = 0.8;
    },
    [Fusion.OnEvent("MouseLeave")]: () => {
        playButton.TextColor3 = Color3.fromRGB(200, 200, 200);
        playButton.BackgroundTransparency = 0.9;
    },
    // Add click handler with animation
    [Fusion.OnEvent("Activated")]: () => {
        print("Play button clicked!");
        // Add click animation here
    }
});

// Hydrate settings button with a toggle state
const isSettingsOpen = Fusion.Value(false);

Fusion.Hydrate(settingsButton)({
    [Fusion.OnEvent("Activated")]: () => {
        isSettingsOpen.setValue(!isSettingsOpen.getValue());
        const settingsFrame = mainMenu.FindFirstChild("SettingsFrame") as Frame;
        if (settingsFrame) {
            settingsFrame.Visible = isSettingsOpen.getValue();
        }
    },
    // Dynamic text based on state
    Text: Fusion.Computed(() => 
        isSettingsOpen.getValue() ? "Close Settings" : "Open Settings"
    )
});
```

### State Management

- `Value<T>` - Mutable state container
- `Computed<T>` - Derived state
- `For` - State-based loops
- `Observer` - React to state changes
- `Tween` - Animated state transitions
- `Spring` - Spring-physics based animations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.