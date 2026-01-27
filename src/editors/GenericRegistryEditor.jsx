import React, { useState } from 'react';
import { Card, FormField, FormGroup } from '../ui';
import { ResourceLocationInput } from '../components';

export function GenericRegistryEditor({ value, onChange, id, onIdChange, typeName }) {
  const [jsonText, setJsonText] = useState(() => JSON.stringify(value ?? {}, null, 2));
  const [parseError, setParseError] = useState(null);

  const handleTextChange = (text) => {
    setJsonText(text);
    try {
      const parsed = JSON.parse(text);
      setParseError(null);
      onChange(parsed);
    } catch (e) {
      setParseError(e.message);
    }
  };

  // Sync external changes
  const externalJson = JSON.stringify(value ?? {}, null, 2);
  if (!parseError && jsonText !== externalJson) {
    // Only sync if our text is valid JSON that differs from external
    try {
      const current = JSON.parse(jsonText);
      if (JSON.stringify(current, null, 2) !== externalJson) {
        setJsonText(externalJson);
      }
    } catch {
      // Keep current text if it has parse errors
    }
  }

  return (
    <div className="generic-registry-editor">
      <Card title="Identity" collapsible>
        <FormGroup>
          <FormField label={`${typeName || 'Entry'} ID`}>
            <ResourceLocationInput
              value={id || ''}
              onChange={onIdChange}
              allowTags={false}
              placeholder="mypack:my_entry"
            />
          </FormField>
        </FormGroup>
      </Card>

      <Card title="JSON Data" collapsible>
        {parseError && (
          <div style={{
            padding: '6px 10px',
            marginBottom: '8px',
            backgroundColor: 'var(--color-bg-error, #fee)',
            color: 'var(--color-error, #c00)',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            {parseError}
          </div>
        )}
        <textarea
          value={jsonText}
          onChange={(e) => handleTextChange(e.target.value)}
          spellCheck={false}
          rows={20}
          style={{
            width: '100%',
            fontFamily: 'monospace',
            fontSize: '13px',
            resize: 'vertical',
            padding: '8px',
            border: `1px solid ${parseError ? 'var(--color-error, #c00)' : 'var(--color-border, #ccc)'}`,
            borderRadius: '4px',
            backgroundColor: 'var(--color-bg-input, #fff)',
            color: 'var(--color-text, #000)',
            tabSize: 2
          }}
        />
      </Card>
    </div>
  );
}
