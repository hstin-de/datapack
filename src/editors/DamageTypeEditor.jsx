import React from 'react';
import { Card, FormField, FormGroup, Input } from '../ui';
import { ResourceLocationInput } from '../components';

const SCALING_OPTIONS = ['never', 'always', 'when_caused_by_living_non_player'];
const EFFECTS_OPTIONS = ['hurt', 'thorns', 'drowning', 'burning', 'poking', 'freezing'];
const DEATH_MSG_TYPES = ['default', 'fall_variants', 'intentional_game_design'];

export function DamageTypeEditor({ value, onChange, id, onIdChange }) {
  const dt = value || {};
  const handleChange = (patch) => onChange({ ...dt, ...patch });

  return (
    <div className="damage-type-editor">
      <Card title="Identity" collapsible>
        <FormGroup>
          <FormField label="Damage Type ID">
            <ResourceLocationInput
              value={id || ''}
              onChange={onIdChange}
              allowTags={false}
              placeholder="mypack:custom_damage"
            />
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Properties" collapsible>
        <FormGroup>
          <FormField label="Message ID" help="Translation key for death message">
            <Input value={dt.message_id ?? ''} onChange={(e) => handleChange({ message_id: e.target.value })} placeholder="myDamage" />
          </FormField>
          <FormField label="Exhaustion">
            <Input type="number" step="0.1" value={dt.exhaustion ?? 0} onChange={(e) => handleChange({ exhaustion: Number(e.target.value) })} />
          </FormField>
          <FormField label="Scaling">
            <select value={dt.scaling ?? 'when_caused_by_living_non_player'} onChange={(e) => handleChange({ scaling: e.target.value })} style={{ width: '100%', padding: '6px 8px' }}>
              {SCALING_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </FormField>
          <FormField label="Effects">
            <select value={dt.effects ?? 'hurt'} onChange={(e) => handleChange({ effects: e.target.value })} style={{ width: '100%', padding: '6px 8px' }}>
              {EFFECTS_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </FormField>
          <FormField label="Death Message Type">
            <select value={dt.death_message_type ?? 'default'} onChange={(e) => handleChange({ death_message_type: e.target.value })} style={{ width: '100%', padding: '6px 8px' }}>
              {DEATH_MSG_TYPES.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </FormField>
        </FormGroup>
      </Card>
    </div>
  );
}
