import React from 'react';

/**
 * Grid Component
 * 
 * CSS Grid layout with configurable columns and gap.
 * 
 * @example
 * <Grid cols={2} gap={4}>
 *   <Card>1</Card>
 *   <Card>2</Card>
 *   <Card>3</Card>
 *   <Card>4</Card>
 * </Grid>
 * 
 * <Grid template="200px 1fr" gap={2}>
 *   <Sidebar />
 *   <Content />
 * </Grid>
 */
export function Grid({
    children,
    cols = 1,
    template,
    gap = 2,
    rowGap,
    colGap,
    align,
    justify,
    className = '',
    style = {},
    ...props
}) {
    const gapValue = typeof gap === 'number' ? `var(--ui-space-${gap})` : gap;
    const rowGapValue = rowGap != null
        ? (typeof rowGap === 'number' ? `var(--ui-space-${rowGap})` : rowGap)
        : undefined;
    const colGapValue = colGap != null
        ? (typeof colGap === 'number' ? `var(--ui-space-${colGap})` : colGap)
        : undefined;

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: template || `repeat(${cols}, 1fr)`,
        gap: rowGapValue || colGapValue ? undefined : gapValue,
        rowGap: rowGapValue,
        columnGap: colGapValue,
        alignItems: align,
        justifyItems: justify,
        ...style,
    };

    return (
        <div className={`ui-grid ${className}`} style={gridStyle} {...props}>
            {children}
        </div>
    );
}

/**
 * InputGrid Component
 * 
 * Predefined grid for label + input pairs (150px | 1fr)
 * Replaces the `.input-grid` pattern used in the app.
 * 
 * @example
 * <InputGrid>
 *   <label>Name</label>
 *   <Input value={name} onChange={setName} />
 * </InputGrid>
 */
export function InputGrid({
    children,
    className = '',
    ...props
}) {
    return (
        <div className={`ui-input-grid ${className}`} {...props}>
            {children}
        </div>
    );
}
