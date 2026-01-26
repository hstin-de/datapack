import React from 'react';
import { Card, FormField, FormGroup, Input, Button } from '../ui';
import { ResourceLocationInput } from '../components';

export function NoiseEditor({ value, onChange, id, onIdChange }) {
  const noise = value || { firstOctave: 0, amplitudes: [] };

  const handleChange = (patch) => onChange({ ...noise, ...patch });

  const updateAmplitude = (index, val) => {
    const next = noise.amplitudes.map((amp, i) => (i === index ? val : amp));
    handleChange({ amplitudes: next });
  };

  return (
    <div className="noise-editor">
      <Card title="Identity" collapsible>
        <FormGroup>
          <FormField label="Noise ID">
            <ResourceLocationInput
              value={id || ''}
              onChange={onIdChange}
              registry="noise"
              allowTags={false}
              placeholder="minecraft:temperature"
            />
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Parameters" collapsible>
        <FormGroup>
          <FormField label="First Octave">
            <Input
              type="number"
              value={noise.firstOctave ?? 0}
              onChange={(e) => handleChange({ firstOctave: Number(e.target.value) || 0 })}
            />
          </FormField>
        </FormGroup>

        <div className="editor-section-header">
          <span>Amplitudes</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleChange({ amplitudes: [...(noise.amplitudes || []), 1] })}
          >
            Add Amplitude
          </Button>
        </div>

        {(noise.amplitudes || []).map((amp, index) => (
          <div key={index} className="noise-editor__row">
            <Input
              type="number"
              value={amp}
              onChange={(e) => updateAmplitude(index, Number(e.target.value) || 0)}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleChange({ amplitudes: noise.amplitudes.filter((_, i) => i !== index) })}
            >
              Remove
            </Button>
          </div>
        ))}
      </Card>
    </div>
  );
}
