import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Checkbox, FormField, FormGroup, Input, Select, TextArea } from '../ui';
import { validatePackMcmeta } from '../utils/validation.js';

const DESCRIPTION_MODES = [
  { value: 'text', label: 'Plain Text' },
  { value: 'components', label: 'Text Components' }
];

const CLICK_ACTIONS = [
  '',
  'open_url',
  'run_command',
  'suggest_command',
  'change_page',
  'copy_to_clipboard'
];

const HOVER_ACTIONS = ['', 'show_text'];

const normalizeDescriptionMode = (description) => {
  if (Array.isArray(description)) return 'components';
  if (description && typeof description === 'object') return 'components';
  return 'text';
};

const toComponentArray = (description) => {
  if (Array.isArray(description)) return description;
  if (description && typeof description === 'object') return [description];
  if (typeof description === 'string') return [{ text: description }];
  return [{ text: '' }];
};

const toPlainText = (description) => {
  if (typeof description === 'string') return description;
  const components = toComponentArray(description);
  return components.map((comp) => comp?.text || '').join('');
};

const updateComponent = (components, index, patch) =>
  components.map((component, i) => (i === index ? { ...component, ...patch } : component));

const parseOptionalNumber = (value) => {
  if (value === '' || value == null) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const updateOptionalNumber = (target, key, value) => {
  const parsed = parseOptionalNumber(value);
  const next = { ...target };
  if (parsed == null) {
    delete next[key];
  } else {
    next[key] = parsed;
  }
  return next;
};

const NumberListEditor = ({ values = [], onChange, addLabel = 'Add' }) => {
  const [draft, setDraft] = useState('');

  const addValue = () => {
    const parsed = parseOptionalNumber(draft);
    if (parsed == null) return;
    if (values.includes(parsed)) {
      setDraft('');
      return;
    }
    onChange([...values, parsed]);
    setDraft('');
  };

  const updateValue = (index, next) => {
    const parsed = parseOptionalNumber(next);
    const updated = values.map((value, i) => (i === index ? (parsed ?? value) : value));
    onChange(updated);
  };

  return (
    <div className="number-list-editor">
      {values.map((value, index) => (
        <div key={`${value}-${index}`} className="number-list-editor__row">
          <Input
            type="number"
            value={value}
            onChange={(event) => updateValue(index, event.target.value)}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(values.filter((_, i) => i !== index))}
          >
            Remove
          </Button>
        </div>
      ))}
      <div className="number-list-editor__row">
        <Input
          type="number"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add format..."
        />
        <Button variant="secondary" size="sm" onClick={addValue}>
          {addLabel}
        </Button>
      </div>
    </div>
  );
};

const ComponentEditor = ({ value, onChange }) => {
  const clickAction = value?.clickEvent?.action || '';
  const hoverAction = value?.hoverEvent?.action || '';

  const handleClickAction = (action) => {
    if (!action) {
      const next = { ...value };
      delete next.clickEvent;
      onChange(next);
      return;
    }
    onChange({
      ...value,
      clickEvent: { action, value: value?.clickEvent?.value || '' }
    });
  };

  const handleHoverAction = (action) => {
    if (!action) {
      const next = { ...value };
      delete next.hoverEvent;
      onChange(next);
      return;
    }
    onChange({
      ...value,
      hoverEvent: { action, value: value?.hoverEvent?.value || '' }
    });
  };

  return (
    <div className="pack-mcmeta-component">
      <FormField label="Text">
        <Input value={value?.text || ''} onChange={(e) => onChange({ ...value, text: e.target.value })} />
      </FormField>
      <FormField label="Color">
        <Input value={value?.color || ''} onChange={(e) => onChange({ ...value, color: e.target.value })} />
      </FormField>
      <FormField label="Font">
        <Input value={value?.font || ''} onChange={(e) => onChange({ ...value, font: e.target.value })} />
      </FormField>
      <FormField label="Insertion">
        <Input
          value={value?.insertion || ''}
          onChange={(e) => onChange({ ...value, insertion: e.target.value })}
        />
      </FormField>
      <FormField label="Styles">
        <div className="pack-mcmeta-component__styles">
          <Checkbox
            checked={Boolean(value?.bold)}
            onChange={(e) => onChange({ ...value, bold: e.target.checked })}
            label="Bold"
          />
          <Checkbox
            checked={Boolean(value?.italic)}
            onChange={(e) => onChange({ ...value, italic: e.target.checked })}
            label="Italic"
          />
          <Checkbox
            checked={Boolean(value?.underlined)}
            onChange={(e) => onChange({ ...value, underlined: e.target.checked })}
            label="Underlined"
          />
          <Checkbox
            checked={Boolean(value?.strikethrough)}
            onChange={(e) => onChange({ ...value, strikethrough: e.target.checked })}
            label="Strikethrough"
          />
          <Checkbox
            checked={Boolean(value?.obfuscated)}
            onChange={(e) => onChange({ ...value, obfuscated: e.target.checked })}
            label="Obfuscated"
          />
        </div>
      </FormField>
      <FormField label="Click Event">
        <Select value={clickAction} onChange={(e) => handleClickAction(e.target.value)}>
          {CLICK_ACTIONS.map((action) => (
            <option key={action} value={action}>
              {action || 'None'}
            </option>
          ))}
        </Select>
      </FormField>
      {clickAction && (
        <FormField label="Click Value">
          <Input
            value={value?.clickEvent?.value || ''}
            onChange={(e) => onChange({ ...value, clickEvent: { action: clickAction, value: e.target.value } })}
          />
        </FormField>
      )}
      <FormField label="Hover Event">
        <Select value={hoverAction} onChange={(e) => handleHoverAction(e.target.value)}>
          {HOVER_ACTIONS.map((action) => (
            <option key={action} value={action}>
              {action || 'None'}
            </option>
          ))}
        </Select>
      </FormField>
      {hoverAction && (
        <FormField label="Hover Value (text)">
          <Input
            value={value?.hoverEvent?.value || ''}
            onChange={(e) => onChange({ ...value, hoverEvent: { action: hoverAction, value: e.target.value } })}
          />
        </FormField>
      )}
    </div>
  );
};

export function PackMcmetaEditor({ value, onChange }) {
  const packMcmeta = value || {};
  const pack = packMcmeta.pack || {};
  const overlays = packMcmeta.overlays || {};
  const overlayEntries = Array.isArray(overlays.entries) ? overlays.entries : [];
  const validation = useMemo(() => validatePackMcmeta(packMcmeta), [packMcmeta]);
  const validationErrors = validation.errors || [];

  const [descriptionMode, setDescriptionMode] = useState(normalizeDescriptionMode(pack.description));

  useEffect(() => {
    setDescriptionMode(normalizeDescriptionMode(pack.description));
  }, [pack.description]);

  const supportedFormatsMode = useMemo(() => {
    if (Array.isArray(pack.supported_formats)) return 'list';
    if (pack.supported_formats && typeof pack.supported_formats === 'object') return 'range';
    return 'none';
  }, [pack.supported_formats]);

  const handlePackChange = (patch) => {
    onChange({ ...packMcmeta, pack: { ...pack, ...patch } });
  };

  const handleDescriptionModeChange = (mode) => {
    setDescriptionMode(mode);
    if (mode === 'text') {
      handlePackChange({ description: toPlainText(pack.description) });
    } else {
      handlePackChange({ description: toComponentArray(pack.description) });
    }
  };

  const handleSupportedFormatsMode = (mode) => {
    if (mode === 'none') {
      const nextPack = { ...pack };
      delete nextPack.supported_formats;
      onChange({ ...packMcmeta, pack: nextPack });
      return;
    }
    if (mode === 'list') {
      handlePackChange({ supported_formats: Array.isArray(pack.supported_formats) ? pack.supported_formats : [] });
      return;
    }
    handlePackChange({ supported_formats: { min_format: 0, max_format: 0 } });
  };

  const updateOverlayEntry = (index, patch) => {
    const nextEntries = overlayEntries.map((entry, i) => (i === index ? { ...entry, ...patch } : entry));
    onChange({ ...packMcmeta, overlays: { ...overlays, entries: nextEntries } });
  };

  const removeOverlayEntry = (index) => {
    const nextEntries = overlayEntries.filter((_, i) => i !== index);
    const nextOverlays = { ...overlays, entries: nextEntries };
    if (nextEntries.length === 0) delete nextOverlays.entries;
    onChange({ ...packMcmeta, overlays: nextOverlays });
  };

  const addOverlayEntry = () => {
    const nextEntries = [...overlayEntries, { directory: '', formats: [] }];
    onChange({ ...packMcmeta, overlays: { ...overlays, entries: nextEntries } });
  };

  return (
    <div className="pack-mcmeta-editor">
      <details className="validation-card" open={!validation.valid}>
        <summary className="validation-card__summary">
          <div className="validation-card__left">
            <span className="validation-card__title">Validation</span>
            <span className="validation-card__context">pack.mcmeta</span>
          </div>
          <span className="validation-card__action">
            {validation.valid ? 'Valid' : `${validationErrors.length} Issues`}
          </span>
        </summary>
        <div className="validation-card__body">
          {validation.valid ? (
            <p className="validation-card__empty">No validation errors detected.</p>
          ) : (
            <ul className="validation-card__list">
              {validationErrors.map((err, index) => (
                <li key={`${err.path}-${index}`} className="validation-card__item">
                  <span className="validation-card__path">{err.path || '/'}</span>
                  <span className="validation-card__message">{err.message}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </details>
      <Card title="pack.mcmeta" className="app__meta-card">
        <FormGroup>
          <FormField label="Pack ID">
            <Input value={pack.id || ''} onChange={(e) => handlePackChange({ id: e.target.value })} />
          </FormField>
          <FormField label="Pack Format">
            <Input
              type="number"
              value={pack.pack_format ?? 0}
              onChange={(e) => handlePackChange({ pack_format: Number(e.target.value) || 0 })}
            />
          </FormField>
          <FormField label="Min Format">
            <Input
              type="number"
              value={pack.min_format ?? ''}
              onChange={(e) => handlePackChange(updateOptionalNumber(pack, 'min_format', e.target.value))}
            />
          </FormField>
          <FormField label="Max Format">
            <Input
              type="number"
              value={pack.max_format ?? ''}
              onChange={(e) => handlePackChange(updateOptionalNumber(pack, 'max_format', e.target.value))}
            />
          </FormField>
          <FormField label="Supported Formats">
            <Select value={supportedFormatsMode} onChange={(e) => handleSupportedFormatsMode(e.target.value)}>
              <option value="none">None</option>
              <option value="list">List</option>
              <option value="range">Range</option>
            </Select>
          </FormField>
          {supportedFormatsMode === 'list' && (
            <FormField label="Supported Formats List">
              <NumberListEditor
                values={Array.isArray(pack.supported_formats) ? pack.supported_formats : []}
                onChange={(next) => handlePackChange({ supported_formats: next })}
              />
            </FormField>
          )}
          {supportedFormatsMode === 'range' && (
            <>
              <FormField label="Supported Min Format">
                <Input
                  type="number"
                  value={pack.supported_formats?.min_format ?? 0}
                  onChange={(e) =>
                    handlePackChange({
                      supported_formats: updateOptionalNumber(
                        pack.supported_formats || {},
                        'min_format',
                        e.target.value
                      )
                    })
                  }
                />
              </FormField>
              <FormField label="Supported Max Format">
                <Input
                  type="number"
                  value={pack.supported_formats?.max_format ?? 0}
                  onChange={(e) =>
                    handlePackChange({
                      supported_formats: updateOptionalNumber(
                        pack.supported_formats || {},
                        'max_format',
                        e.target.value
                      )
                    })
                  }
                />
              </FormField>
            </>
          )}
          <FormField
            label="Description Mode"
            help={descriptionMode === 'text' ? '' : 'Plain text conversion removes component styling.'}
          >
            <Select value={descriptionMode} onChange={(e) => handleDescriptionModeChange(e.target.value)}>
              {DESCRIPTION_MODES.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </Select>
          </FormField>
          {descriptionMode === 'text' && (
            <FormField label="Description">
              <TextArea
                rows={3}
                value={typeof pack.description === 'string' ? pack.description : toPlainText(pack.description)}
                onChange={(e) => handlePackChange({ description: e.target.value })}
              />
            </FormField>
          )}
          {descriptionMode === 'components' && (
            <FormField label="Description Components">
              <div className="pack-mcmeta-components">
                {toComponentArray(pack.description).map((component, index) => (
                  <Card key={index} title={`Component ${index + 1}`} collapsible>
                    <ComponentEditor
                      value={component}
                      onChange={(patch) =>
                        handlePackChange({ description: updateComponent(toComponentArray(pack.description), index, patch) })
                      }
                    />
                    <Button variant="ghost" size="sm" onClick={() => {
                      const next = toComponentArray(pack.description).filter((_, i) => i !== index);
                      handlePackChange({ description: next.length > 0 ? next : [{ text: '' }] });
                    }}>
                      Remove component
                    </Button>
                  </Card>
                ))}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    handlePackChange({ description: [...toComponentArray(pack.description), { text: '' }] })
                  }
                >
                  Add component
                </Button>
              </div>
            </FormField>
          )}
        </FormGroup>
      </Card>

      <Card title="Overlays" collapsible>
        <FormGroup>
          {overlayEntries.length === 0 && (
            <div className="pack-mcmeta-empty">No overlays defined.</div>
          )}
          {overlayEntries.map((entry, index) => (
            <Card key={`${entry.directory || 'overlay'}-${index}`} title={`Overlay ${index + 1}`} collapsible>
              <FormGroup>
                <FormField label="Directory">
                  <Input
                    value={entry.directory || ''}
                    onChange={(e) => updateOverlayEntry(index, { directory: e.target.value })}
                  />
                </FormField>
                <FormField label="Formats">
                  <NumberListEditor
                    values={Array.isArray(entry.formats) ? entry.formats : []}
                    onChange={(next) => updateOverlayEntry(index, { formats: next })}
                  />
                </FormField>
                <FormField label="Min Format">
                  <Input
                    type="number"
                    value={entry.min_format ?? ''}
                    onChange={(e) =>
                      updateOverlayEntry(index, updateOptionalNumber(entry, 'min_format', e.target.value))
                    }
                  />
                </FormField>
                <FormField label="Max Format">
                  <Input
                    type="number"
                    value={entry.max_format ?? ''}
                    onChange={(e) =>
                      updateOverlayEntry(index, updateOptionalNumber(entry, 'max_format', e.target.value))
                    }
                  />
                </FormField>
                <Button variant="ghost" size="sm" onClick={() => removeOverlayEntry(index)}>
                  Remove overlay
                </Button>
              </FormGroup>
            </Card>
          ))}
          <Button variant="secondary" size="sm" onClick={addOverlayEntry}>
            Add overlay
          </Button>
        </FormGroup>
      </Card>
    </div>
  );
}
