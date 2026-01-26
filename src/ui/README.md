# UI Framework

Ein umfassendes, wiederverwendbares UI-Komponenten-Framework für den MC Worldgen Builder.

## Installation

Importiere das Framework einmal in deiner App:

```jsx
// In main.jsx oder App.jsx
import './ui';
```

Oder importiere einzelne Komponenten:

```jsx
import { Button, Card, FormField, Modal } from './ui';
```

## Komponenten

### Base Components

| Component | Beschreibung |
|-----------|--------------|
| `Button` | Verschiedene Varianten: primary, secondary, ghost, danger |
| `IconButton` | Button nur mit Icon |
| `Input` | Text-Input mit prefix/suffix Support |
| `TextArea` | Mehrzeilige Eingabe |
| `Select` | Dropdown-Auswahl mit optgroups |
| `Checkbox` | Checkbox mit Label |
| `Badge` | Status-Anzeige |
| `Tag` | Entfernbares Label |
| `Tooltip` | Hover-Tooltip |
| `Icon` | Wrapper für lucide-react Icons |

### Layout Components

| Component | Beschreibung |
|-----------|--------------|
| `Card` | Container mit Header, collapsible |
| `Panel` | Einfacher Container |
| `Stack` / `HStack` / `VStack` | Flexbox Layout |
| `Grid` | CSS Grid Layout |
| `InputGrid` | Label + Input Grid (ersetzt `.input-grid`) |
| `Divider` | Trennlinie mit optionalem Label |
| `Spacer` | Flexibler Abstand |

### Form Components

| Component | Beschreibung |
|-----------|--------------|
| `FormField` | Label + Input + Help/Error (ersetzt `.input-grid`) |
| `FormGroup` | Gruppierte Felder mit Titel (ersetzt `.section-group`) |
| `ColorPicker` | Farbwähler mit Hex-Eingabe |
| `NumberSlider` | Slider mit Zahleneingabe |
| `TagInput` | Multi-Value Input mit Suggestions |

### Data Components

| Component | Beschreibung |
|-----------|--------------|
| `List` | Selektierbare Liste |
| `ListItem` | Einzelnes List-Element |
| `EmptyState` | Placeholder für leere Bereiche |

### Overlay Components

| Component | Beschreibung |
|-----------|--------------|
| `Modal` | Dialog mit Backdrop |
| `ConfirmModal` | Bestätigungsdialog |
| `Dropdown` | Dropdown-Menü |
| `ToastProvider` / `useToast` | Benachrichtigungen |

## Beispiele

### Button

```jsx
<Button variant="primary" onClick={handleSave}>Speichern</Button>
<Button variant="secondary" icon={<Plus size={14} />}>Hinzufügen</Button>
<Button variant="danger" loading>Löschen...</Button>
```

### FormField

```jsx
<FormField label="Name" help="Der Anzeigename" required>
  <Input value={name} onChange={e => setName(e.target.value)} />
</FormField>
```

### Card

```jsx
<Card title="Einstellungen" collapsible>
  <FormField label="Größe">
    <NumberSlider value={size} onChange={setSize} min={1} max={64} />
  </FormField>
</Card>
```

### Toast

```jsx
function App() {
  return (
    <ToastProvider>
      <MyComponent />
    </ToastProvider>
  );
}

function MyComponent() {
  const toast = useToast();
  
  const handleSave = () => {
    // ... save logic
    toast.success('Gespeichert!');
  };
}
```

### Modal

```jsx
<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Bestätigen"
  footer={
    <Button variant="primary" onClick={handleConfirm}>OK</Button>
  }
>
  Möchtest du fortfahren?
</Modal>
```

## Design Tokens

Das Framework nutzt CSS Custom Properties definiert in `theme.css`:

- `--ui-bg-*` - Hintergrundfarben
- `--ui-text-*` - Textfarben
- `--ui-primary` - Primärfarbe (VS Code Blau)
- `--ui-space-*` - Abstände (4px Basis)
- `--ui-radius-*` - Border Radius
- `--ui-shadow-*` - Schatten
- `--ui-z-*` - Z-Index Layer
