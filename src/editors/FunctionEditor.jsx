import React from 'react';
import { Card, FormField, FormGroup } from '../ui';
import { ResourceLocationInput } from '../components';

export function FunctionEditor({ value, onChange, id, onIdChange }) {
  const text = typeof value === 'string' ? value : '';

  return (
    <div className="function-editor">
      <Card title="Identity" collapsible>
        <FormGroup>
          <FormField label="Function ID" help="Namespace + path under data/<namespace>/function/.">
            <ResourceLocationInput
              value={id || ''}
              onChange={onIdChange}
              allowTags={false}
              placeholder="mypack:setup/init"
            />
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Commands" collapsible>
        <textarea
          className="function-editor__textarea"
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="# Enter mcfunction commands here&#10;say Hello World"
          spellCheck={false}
          rows={20}
          style={{
            width: '100%',
            fontFamily: 'monospace',
            fontSize: '13px',
            resize: 'vertical',
            padding: '8px',
            border: '1px solid var(--color-border, #ccc)',
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
