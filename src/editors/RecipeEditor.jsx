import React from 'react';
import { GenericRegistryEditor } from './GenericRegistryEditor.jsx';

export function RecipeEditor({ value, onChange, id, onIdChange }) {
  return (
    <GenericRegistryEditor
      value={value}
      onChange={onChange}
      id={id}
      onIdChange={onIdChange}
      typeName="Recipe"
    />
  );
}
