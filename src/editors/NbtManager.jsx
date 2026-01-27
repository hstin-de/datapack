import React, { useRef } from 'react';
import { Card, Button } from '../ui';
import { Download, Upload, X } from 'lucide-react';

export function NbtManager({ items, onAdd, onRemove }) {
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (const file of files) {
      const name = file.name.replace(/\.nbt$/, '');
      const arrayBuffer = await file.arrayBuffer();
      onAdd({ id: name, data: arrayBuffer });
    }
    event.target.value = '';
  };

  const handleDownload = (item) => {
    const blob = new Blob([item.data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.id.replace(/:/g, '/')}.nbt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="nbt-manager">
      <Card title="Structure NBT Files">
        <div style={{ marginBottom: '12px' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".nbt"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <Button
            variant="primary"
            icon={<Upload size={16} />}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload .nbt files
          </Button>
        </div>

        {(!items || items.length === 0) ? (
          <p style={{ color: 'var(--color-text-muted, #888)', fontStyle: 'italic' }}>
            No structure files. Upload .nbt files to add them.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {items.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 8px',
                  border: '1px solid var(--color-border, #ccc)',
                  borderRadius: '4px',
                  fontSize: '13px'
                }}
              >
                <span style={{ fontFamily: 'monospace' }}>{item.id}</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(item)}>
                    <Download size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onRemove(index)}>
                    <X size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
