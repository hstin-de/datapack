import React from 'react';
import { Card, FormField, FormGroup, Input } from '../ui';
import { ResourceLocationInput } from '../components';

function DecorationEditor({ label, value, onChange }) {
  const dec = value || {};
  const handleChange = (patch) => onChange({ ...dec, ...patch });
  const params = Array.isArray(dec.parameters) ? dec.parameters : [];

  return (
    <FormGroup>
      <FormField label={`${label} - Translation Key`}>
        <Input value={dec.translation_key ?? ''} onChange={(e) => handleChange({ translation_key: e.target.value })} placeholder="chat.type.text" />
      </FormField>
      <FormField label={`${label} - Style`} help="JSON text style (optional)">
        <Input value={dec.style ? JSON.stringify(dec.style) : ''} onChange={(e) => {
          if (!e.target.value) { handleChange({ style: undefined }); return; }
          try { handleChange({ style: JSON.parse(e.target.value) }); } catch {}
        }} placeholder='{"italic": true}' />
      </FormField>
      <FormField label={`${label} - Parameters`} help="Comma-separated: sender, target, content">
        <Input
          value={params.join(', ')}
          onChange={(e) => handleChange({ parameters: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
          placeholder="sender, content"
        />
      </FormField>
    </FormGroup>
  );
}

export function ChatTypeEditor({ value, onChange, id, onIdChange }) {
  const ct = value || {};
  const handleChange = (patch) => onChange({ ...ct, ...patch });

  return (
    <div className="chat-type-editor">
      <Card title="Identity" collapsible>
        <FormGroup>
          <FormField label="Chat Type ID">
            <ResourceLocationInput
              value={id || ''}
              onChange={onIdChange}
              allowTags={false}
              placeholder="mypack:custom_chat"
            />
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Chat Decoration" collapsible>
        <DecorationEditor label="Chat" value={ct.chat} onChange={(v) => handleChange({ chat: v })} />
      </Card>

      <Card title="Narration Decoration" collapsible>
        <DecorationEditor label="Narration" value={ct.narration} onChange={(v) => handleChange({ narration: v })} />
      </Card>
    </div>
  );
}
